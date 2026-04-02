require('dotenv').config();
const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Notion Client
const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

app.post('/api/submit', async (req, res) => {
    const { name, email, company, usecase, website } = req.body;

    try {
        if (!DATABASE_ID) {
            throw new Error('Database ID is not defined in .env');
        }

        // --- Create Notion Page ---
        // Note: Using 'select' instead of 'status' as a more compatible default.
        // Also fixed typo 'CHEKC 1' to 'Pending' or a more standard status name.
        const response = await notion.pages.create({
            parent: { database_id: DATABASE_ID },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: name || 'Anonymous',
                            },
                        },
                    ],
                },
                Email: {
                    email: email,
                },
                Status: {
                    select: {
                        name: 'Pending', // More robust status name
                    },
                },
            },
            children: [
                {
                    object: 'block',
                    type: 'heading_3',
                    heading_3: {
                        rich_text: [{ text: { content: 'Lead Details' } }],
                    },
                },
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [
                            { text: { content: 'Company: ' }, annotations: { bold: true } },
                            { text: { content: company || 'N/A' } },
                        ],
                    },
                },
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [
                            { text: { content: 'Website: ' }, annotations: { bold: true } },
                            { text: { content: website || 'N/A' } },
                        ],
                    },
                },
                {
                    object: 'block',
                    type: 'paragraph',
                    paragraph: {
                        rich_text: [
                            { text: { content: 'Use Case: ' }, annotations: { bold: true } },
                            { text: { content: usecase || 'N/A' } },
                        ],
                    },
                },
            ],
        });

        console.log('Success! Entry added.');

        // --- Trigger Drip Sequence (Using native fetch to avoid dependency issues) ---
        await triggerDripSequence(email, name);

        res.json({ success: true, message: 'Application received', id: response.id });
    } catch (error) {
        console.error('Error processing submission:', error.message);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Sends a welcome email using the Resend API directly via fetch.
 * This removes the dependency on the 'resend' npm package.
 */
async function triggerDripSequence(email, name) {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    
    if (!RESEND_API_KEY || RESEND_API_KEY === 're_123456789') {
        console.warn('[DRIP-SEQUENCE] Valid RESEND_API_KEY not found. Skipping email.');
        return;
    }

    console.log(`[DRIP-SEQUENCE] Initiating for: ${email}`);

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Elesium <onboarding@resend.dev>',
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

        if (!response.ok) {
            console.error('[DRIP-SEQUENCE] API Error:', data);
        } else {
            console.log(`[DRIP-SEQUENCE] Email sent successfully. ID: ${data.id}`);
        }
    } catch (err) {
        console.error('[DRIP-SEQUENCE] Unexpected network error:', err.message);
    }
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
