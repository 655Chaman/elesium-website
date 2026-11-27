require('dotenv').config();
const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const app = express();
app.use(cors());
app.use(express.json({ limit: '64kb' }));

const OUTBOUND_TIMEOUT_MS = 8000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeString(value, maxLen = 500) {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLen);
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function fetchWithTimeout(url, options = {}, timeoutMs = OUTBOUND_TIMEOUT_MS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}

let cachedSpreadsheetDoc = null;
let spreadsheetDocInitPromise = null;

function hasGoogleSheetsConfig() {
    return Boolean(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
        process.env.GOOGLE_PRIVATE_KEY &&
        process.env.GOOGLE_SHEET_ID
    );
}

async function getGoogleSpreadsheetDoc() {
    if (!hasGoogleSheetsConfig()) return null;
    if (cachedSpreadsheetDoc) return cachedSpreadsheetDoc;
    if (spreadsheetDocInitPromise) return spreadsheetDocInitPromise;

    spreadsheetDocInitPromise = (async () => {
        try {
            // Robustly parse the private key in case Render handles quotes or newlines differently
            let rawKey = process.env.GOOGLE_PRIVATE_KEY;
            rawKey = rawKey.replace(/^"|"$/g, '');
            const formattedKey = rawKey.replace(/\\n/g, '\n');

            const serviceAccountAuth = new JWT({
                email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                key: formattedKey,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
            const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
            await doc.loadInfo();
            cachedSpreadsheetDoc = doc;
            return doc;
        } catch (err) {
            cachedSpreadsheetDoc = null;
            throw err;
        } finally {
            spreadsheetDocInitPromise = null;
        }
    })();

    return spreadsheetDocInitPromise;
}

function invalidateGoogleSpreadsheetCache() {
    cachedSpreadsheetDoc = null;
}

// Root route for cron-job pinging
app.get('/', (req, res) => {
    res.send('Elesium Server is awake!');
});

// Lightweight beacon telemetry endpoints
app.post('/api/telemetry/dwell', (req, res) => {
    res.status(204).end();
});

app.post('/api/telemetry/navboost', (req, res) => {
    res.status(204).end();
});

// Initialize Notion Client
const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

app.post('/api/submit', async (req, res) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ success: false, error: 'Invalid request payload' });
    }

    const email = sanitizeString(req.body.email, 254).toLowerCase();
    if (!email || !EMAIL_REGEX.test(email)) {
        return res.status(400).json({ success: false, error: 'A valid email address is required' });
    }

    const name = sanitizeString(req.body.name, 200);
    const company = sanitizeString(req.body.company, 200);
    const usecase = sanitizeString(req.body.usecase, 2000);
    const website = sanitizeString(req.body.website, 500);
    const role = sanitizeString(req.body.role, 200);
    const revenue = sanitizeString(req.body.revenue, 200);
    const certifications = sanitizeString(req.body.certifications, 500);
    const readiness = sanitizeString(req.body.readiness, 200);
    const targetPartner = sanitizeString(req.body.targetPartner, 200);
    const leadSource = sanitizeString(req.body.leadSource, 200);
    const attributionSource = sanitizeString(req.body.attributionSource, 300);
    const confirmationCode = sanitizeString(req.body.confirmationCode, 100);
    const requestType = sanitizeString(req.body.requestType, 200);
    const dossierCode = sanitizeString(req.body.dossierCode, 100);
    const submittedAt = sanitizeString(req.body.submittedAt, 100);
    const priorityScore = typeof req.body.priorityScore === 'number' && Number.isFinite(req.body.priorityScore)
        ? req.body.priorityScore
        : undefined;
    const simulatedMetrics = Array.isArray(req.body.simulatedMetrics)
        ? req.body.simulatedMetrics.slice(0, 12).map((m) => ({
            label: sanitizeString(m?.label, 100),
            value: sanitizeString(String(m?.value ?? ''), 100),
        }))
        : undefined;

    const crmPayload = {
        name,
        email,
        company,
        usecase,
        website,
        role,
        revenue,
        certifications,
        readiness,
        targetPartner,
        leadSource,
        attributionSource,
        ...(confirmationCode ? { confirmationCode } : {}),
        ...(requestType ? { requestType } : {}),
        ...(dossierCode ? { dossierCode } : {}),
        ...(submittedAt ? { submittedAt } : {}),
        ...(priorityScore !== undefined ? { priorityScore } : {}),
        ...(simulatedMetrics ? { simulatedMetrics } : {}),
    };

    try {
        console.log('[SUBMIT] Attempting to route lead to CRM.');

        // 1. Try forwarding to the new CRM Automation Pipeline (Port 3002)
        try {
            const crmResponse = await fetchWithTimeout('http://localhost:3002/api/website-leads/intake', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(crmPayload)
            });

            if (crmResponse.ok) {
                const crmData = await crmResponse.json();
                console.log('[SUBMIT] Successfully routed to CRM pipeline.');
                return res.json({ success: true, message: 'Application received', id: crmData.id });
            }
            console.warn(`[SUBMIT] CRM responded with status ${crmResponse.status}, falling back to Notion and Google Sheets.`);
        } catch (crmError) {
            console.warn('[SUBMIT] CRM unreachable, falling back to Notion and Google Sheets.', crmError.message);
        }

        let sheetSuccess = false;
        // 2. Google Sheets Integration
        try {
            const doc = await getGoogleSpreadsheetDoc();
            if (doc) {
                const sheet = doc.sheetsByIndex[0]; // Assumes first tab

                // The headers in the user's template are on Row 8
                await sheet.loadHeaderRow(8);

                await sheet.addRow({
                    'Timestamp': new Date().toISOString(),
                    'Name': name,
                    'Email': email,
                    'Company': company,
                    'Role': role,
                    'Website': website,
                    'Revenue': revenue,
                    'Target Partner': targetPartner,
                    'Readiness': readiness,
                    'Use Case': usecase,
                    'Lead Source': leadSource
                }, { insert: true });
                console.log('[SUBMIT] Added lead to Google Sheet.');

                // If this submission is from the ele-in waitlist, also record in dedicated waitlist tab
                if (leadSource === 'ele-in Waitlist' && doc.sheetsByTitle['ele-in waitlist']) {
                    try {
                        const waitlistSheet = doc.sheetsByTitle['ele-in waitlist'];
                        await waitlistSheet.loadHeaderRow().catch(() => {});
                        await waitlistSheet.addRow({
                            'Timestamp': new Date().toISOString(),
                            'Email': email
                        });
                        console.log('[SUBMIT] Also recorded lead in dedicated ele-in waitlist sheet.');
                    } catch (wErr) {
                        console.warn('[SUBMIT] Could not record to ele-in waitlist tab:', wErr.message);
                    }
                }

                sheetSuccess = true;
            } else {
                console.warn('[SUBMIT] Google Sheets credentials missing in .env, skipping Google Sheets integration.');
            }
        } catch (sheetError) {
            invalidateGoogleSpreadsheetCache();
            console.error('[SUBMIT] Error saving to Google Sheet:', sheetError.message);
        }

        let notionSuccess = false;
        // 3. Fallback: Save directly to Notion if CRM is down
        try {
            if (!DATABASE_ID || !process.env.NOTION_API_KEY) {
                throw new Error('Notion configuration is incomplete');
            }

            await notion.pages.create({
                parent: { database_id: DATABASE_ID },
                properties: {
                    Name: { title: [{ text: { content: name || 'Anonymous' } }] },
                    Email: { email: email },
                    Status: { select: { name: 'Pending' } },
                },
                children: [
                    { object: 'block', type: 'heading_3', heading_3: { rich_text: [{ text: { content: 'Lead Details' } }] } },
                    { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: 'Company: ' }, annotations: { bold: true } }, { text: { content: company || 'N/A' } }] } },
                    { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: 'Website: ' }, annotations: { bold: true } }, { text: { content: website || 'N/A' } }] } },
                    { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: 'Role: ' }, annotations: { bold: true } }, { text: { content: role || 'N/A' } }] } },
                    { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: 'Use Case: ' }, annotations: { bold: true } }, { text: { content: usecase || 'N/A' } }] } },
                    { object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: 'Source / Attribution: ' }, annotations: { bold: true } }, { text: { content: attributionSource || leadSource || 'N/A' } }] } },
                ],
            });
            console.log('[SUBMIT] Fallback: Entry added to Notion.');
            notionSuccess = true;
        } catch (notionError) {
            console.error('[SUBMIT] Error saving to Notion:', notionError.message);
        }

        if (!sheetSuccess && !notionSuccess) {
            console.error('[SUBMIT] All downstream lead intake targets (CRM, Google Sheets, Notion) failed.');
            return res.status(503).json({
                success: false,
                error: 'Lead intake downstream services unavailable'
            });
        }

        // Trigger basic fallback drip sequence
        await triggerDripSequence(email, name);

        res.json({ success: true, message: 'Application received', notionSuccess, sheetSuccess });
    } catch (error) {
        console.error('Error processing submission:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error processing submission' });
    }
});

/**
 * Fallback Email Drip (only used if CRM is down)
 */
async function triggerDripSequence(email, name) {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY || RESEND_API_KEY === 're_123456789') {
        console.warn('[DRIP-SEQUENCE] Valid RESEND_API_KEY not found. Skipping email.');
        return;
    }

    const safeName = escapeHtml(name || 'Future Partner');

    try {
        const response = await fetchWithTimeout('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: 'Elesium <hello@elesium.online>',
                to: [email],
                subject: 'Welcome to Elesium - You are on the list',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1>Welcome into the fold, ${safeName}.</h1>
                        <p>We've received your application for early access.</p>
                        <p>Our team is currently reviewing your profile to ensure we're the right fit for your industry needs.</p>
                        <p>Expect to hear from us within 48 hours.</p>
                        <br/>
                        <p>Regards,</p>
                        <p><strong>The Elesium Team</strong></p>
                    </div>
                `,
            }),
        });
        if (!response.ok) {
            const errBody = await response.text().catch(() => '');
            console.error(`[DRIP-SEQUENCE] Resend API error (${response.status}): ${errBody.slice(0, 300)}`);
            return;
        }
        const data = await response.json();
        console.log(`[DRIP-SEQUENCE] Fallback email sent. ID: ${data.id}`);
    } catch (err) {
        console.error('[DRIP-SEQUENCE] Unexpected network error:', err.message);
    }
}

app.post('/api/waitlist', async (req, res) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ success: false, error: 'Invalid request payload' });
    }

    const email = sanitizeString(req.body.email, 254).toLowerCase();
    if (!email || !EMAIL_REGEX.test(email)) {
        return res.status(400).json({ success: false, error: 'A valid email address is required' });
    }

    try {
        const doc = await getGoogleSpreadsheetDoc();
        if (!doc) {
            console.error('[WAITLIST] Google Sheets credentials missing in .env');
            return res.status(503).json({ success: false, error: 'Waitlist storage unavailable' });
        }

        // Try to find the waitlist sheet by title
        let sheet = doc.sheetsByTitle['ele-in waitlist'];

        // If it doesn't exist, create it with headers
        if (!sheet) {
            console.log('[WAITLIST] Creating new sheet "ele-in waitlist"');
            sheet = await doc.addSheet({ title: 'ele-in waitlist', headerValues: ['Timestamp', 'Email'] });
        } else {
            // Ensure headers are loaded if it already exists but we just found it
            try {
                await sheet.loadHeaderRow();
                // If headers are missing, set them
                if (sheet.headerValues.length === 0) {
                    await sheet.setHeaderRow(['Timestamp', 'Email']);
                }
            } catch {
                await sheet.setHeaderRow(['Timestamp', 'Email']);
            }
        }

        await sheet.addRow({
            'Timestamp': new Date().toISOString(),
            'Email': email
        });
        console.log('[WAITLIST] Added subscriber to ele-in waitlist bucket.');

        res.json({ success: true, message: 'Successfully joined waitlist', sheetSuccess: true });
    } catch (error) {
        invalidateGoogleSpreadsheetCache();
        console.error('Error processing waitlist:', error.message);
        res.status(503).json({ success: false, error: 'Waitlist storage unavailable' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
