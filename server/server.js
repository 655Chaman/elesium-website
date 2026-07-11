require('dotenv').config();
const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const app = express();
app.use(cors());
app.use(express.json());

// Root route for cron-job pinging
app.get('/', (req, res) => {
    res.send('Elesium Server is awake!');
});

// Initialize Notion Client
const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

app.post('/api/submit', async (req, res) => {
    const { name, email, company, usecase, website, role, revenue, certifications, readiness, targetPartner, leadSource } = req.body;

    try {
        console.log(`[SUBMIT] Attempting to route lead to CRM: ${email}`);
        
        // 1. Try forwarding to the new CRM Automation Pipeline (Port 3002)
        try {
            const crmResponse = await fetch('http://localhost:3002/api/website-leads/intake', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req.body)
            });
            
            if (crmResponse.ok) {
                const crmData = await crmResponse.json();
                console.log('[SUBMIT] Successfully routed to CRM pipeline.');
                return res.json({ success: true, message: 'Application received', id: crmData.id });
            }
            console.warn('[SUBMIT] CRM responded with non-ok status, falling back to Notion.');
        } catch (crmError) {
            console.warn('[SUBMIT] CRM unreachable, falling back to Notion and Google Sheets.', crmError.message);
        }

        let sheetSuccess = false;
        let sheetErrorMessage = null;
        // 2. Google Sheets Integration
        try {
            if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID) {
                // Robustly parse the private key in case Render handles quotes or newlines differently
                let rawKey = process.env.GOOGLE_PRIVATE_KEY;
                rawKey = rawKey.replace(/^"|"$/g, ''); // Remove leading/trailing quotes
                const formattedKey = rawKey.replace(/\\n/g, '\n');

                const serviceAccountAuth = new JWT({
                    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    key: formattedKey,
                    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
                });
                const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
                await doc.loadInfo();
                const sheet = doc.sheetsByIndex[0]; // Assumes first tab

                // The headers in the user's template are on Row 8
                await sheet.loadHeaderRow(8);

                await sheet.addRow({
                    'Timestamp': new Date().toISOString(),
                    'Name': name || '',
                    'Email': email || '',
                    'Company': company || '',
                    'Role': role || '',
                    'Website': website || '',
                    'Revenue': revenue || '',
                    'Target Partner': targetPartner || '',
                    'Readiness': readiness || '',
                    'Use Case': usecase || '',
                    'Lead Source': leadSource || ''
                }, { insert: true });
                console.log('[SUBMIT] Added lead to Google Sheet.');
                sheetSuccess = true;
            } else {
                console.warn('[SUBMIT] Google Sheets credentials missing in .env, skipping Google Sheets integration.');
            }
        } catch (sheetError) {
            console.error('[SUBMIT] Error saving to Google Sheet:', sheetError.message);
            sheetErrorMessage = sheetError.message;
        }

        let notionSuccess = false;
        // 3. Fallback: Save directly to Notion if CRM is down
        try {
            if (!DATABASE_ID) throw new Error('Database ID is not defined in .env');

            const response = await notion.pages.create({
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
                ],
            });
            console.log('[SUBMIT] Fallback: Entry added to Notion.');
            notionSuccess = true;
        } catch (notionError) {
            console.error('[SUBMIT] Error saving to Notion:', notionError.message);
        }

        // Trigger basic fallback drip sequence
        await triggerDripSequence(email, name);

        res.json({ success: true, message: 'Application received', notionSuccess, sheetSuccess, sheetErrorMessage });
    } catch (error) {
        console.error('Error processing submission:', error.message);
        res.status(500).json({ error: error.message });
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

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: 'Elesium <hello@elesium.online>',
                to: [email],
                subject: 'Welcome to Elesium - You are on the list',
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1>Welcome into the fold, ${name || 'Future Partner'}.</h1>
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
        const data = await response.json();
        if (response.ok) console.log(`[DRIP-SEQUENCE] Fallback email sent. ID: ${data.id}`);
    } catch (err) {
        console.error('[DRIP-SEQUENCE] Unexpected network error:', err.message);
    }
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
