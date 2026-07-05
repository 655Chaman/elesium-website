require('dotenv').config({ path: './.env' });
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

async function readSheet() {
    try {
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
        console.log('Title:', doc.title);
        
        const sheet = doc.sheetsByIndex[0];
        await sheet.loadHeaderRow(8);
        console.log('Headers:', sheet.headerValues);
        const rows = await sheet.getRows();
        console.log(`Found ${rows.length} rows.`);
    } catch (e) {
        console.error('Error:', e.message);
    }
}
readSheet();
