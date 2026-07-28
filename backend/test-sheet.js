require('dotenv').config({ path: './.env' });
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

async function testSheet() {
    try {
        console.log('Email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
        console.log('Key length:', process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.length : 0);
        
        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        
        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);
        await doc.loadInfo();
        console.log('Successfully loaded sheet info:', doc.title);
        
        const sheet = doc.sheetsByIndex[0];
        await sheet.addRow({
            'Timestamp': new Date().toISOString(),
            'Name': 'Test Name',
            'Email': 'test@test.com'
        });
        console.log('Successfully added row!');
    } catch (e) {
        console.error('Error:', e.message);
    }
}
testSheet();
