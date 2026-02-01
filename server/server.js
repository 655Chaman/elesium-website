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
                    status: {
                        name: 'CHEKC 1', // Default status from your board
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

        // --- Trigger Drip Sequence (Simulation) ---
        // In a real app, this would call SendGrid, Mailgun, or another API.
        triggerDripSequence(email, name);

        res.json({ success: true, message: 'Application received', id: response.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Initialize Resend
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function triggerDripSequence(email, name) {
    console.log(`[DRIP-SEQUENCE] Initiating for: ${email}`);

    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn('[DRIP-SEQUENCE] No RESEND_API_KEY found. Skipping email send.');
            return;
        }

        const { data, error } = await resend.emails.send({
            from: 'Elesium <onboarding@resend.dev>', // Update this with your verified domain later
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
        });

        if (error) {
            console.error('[DRIP-SEQUENCE] Error sending email:', error);
        } else {
            console.log(`[DRIP-SEQUENCE] Processed successfully. Email ID: ${data.id}`);
        }
    } catch (err) {
        console.error('[DRIP-SEQUENCE] Unexpected error:', err);
    }
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
