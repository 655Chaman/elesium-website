require('dotenv').config();
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

async function fixSheet() {
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
        const sheet = doc.sheetsByIndex[0];

        await sheet.loadCells('A8:K12');
        
        const headers = [
            'Timestamp', 'Name', 'Email', 'Company', 'Role', 'Website', 'Revenue', 'Target Partner', 'Readiness', 'Use Case', 'Lead Source'
        ];
        
        // Check if row 8 has the data from July 11th
        const a8 = sheet.getCell(7, 0).value;
        if (a8 && typeof a8 === 'string' && a8.startsWith('2026-')) {
            // Move it to row 9
            for (let c = 0; c < 11; c++) {
                sheet.getCell(8, c).value = sheet.getCell(7, c).value;
                sheet.getCell(8, c).textFormat = { bold: false, foregroundColor: { red: 0, green: 0, blue: 0 } }; // Reset styling
            }
        }
        
        // Write headers to row 8
        for (let i = 0; i < headers.length; i++) {
            const cell = sheet.getCell(7, i);
            cell.value = headers[i];
            cell.textFormat = { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } };
        }
        
        await sheet.saveUpdatedCells();
        console.log('Fixed headers in row 8 and moved data to row 9');
    } catch (e) {
        console.error('Error:', e.message);
    }
}

fixSheet();
