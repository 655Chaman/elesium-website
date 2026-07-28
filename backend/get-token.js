require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const readline = require('readline');

// Ensure credentials exist
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const redirectUri = 'http://localhost';

if (!clientId || !clientSecret) {
    console.error('❌ Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env file.');
    process.exit(1);
}

const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

// Generate the url that will be used for authorization
const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Required to get a refresh token
    scope: ['https://www.googleapis.com/auth/spreadsheets'],
    prompt: 'consent' // Forces Google to show the consent screen so a refresh token is always returned
});

console.log('🔗 Please visit the following URL in your browser to authorize the app:');
console.log('\n' + authorizeUrl + '\n');
console.log('After approving, Google will redirect you to a page that starts with http://localhost/?code=...');
console.log('Copy the entire "code=..." value from the URL (everything after "code=" and before any "&").');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('\n🔑 Enter the authorization code: ', async (code) => {
    try {
        console.log('\nGenerating tokens...');
        const { tokens } = await oauth2Client.getToken(code);
        
        console.log('\n✅ Success! Here are your tokens:\n');
        console.log('----------------------------------------------------');
        console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);
        console.log('----------------------------------------------------\n');
        console.log('Add the GOOGLE_REFRESH_TOKEN above to your .env file.');
        
        if (!tokens.refresh_token) {
            console.log('\n⚠️  WARNING: No refresh token was returned. Make sure you accepted the consent screen.');
        }
    } catch (error) {
        console.error('❌ Error getting tokens:', error.message);
    } finally {
        rl.close();
    }
});
