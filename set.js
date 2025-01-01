const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0I3T3pHR2Q3bzlFc2VLUDBydEY3TlQvcWpLVjhKR2tpU1NhdEtTL2RsVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMXF2Ym03OGdxblRtSE9jcVo5ajZ3R1MreXl5TGliYVZadDV3U1Z3M21HST0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJnRUREN2NIZzZFY01Vbm9vMCtoRVV1b1RVWlRJVS9qNGhvSHVUWHlkTDBRPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI2WnBUS283R0VhSWdsanpNR1Y2YTVvQktQZk11VkR5Mm9nWThWS0ZscmhjPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNLT3l3bndNU2FZK3lvbUE0bmVNMFM4RHBEa3gxTDRJNXpIblE2UElNWDQ9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ii9BdEk1VmFRTEtVbTBCRlUwMHdGT0tPaEhPbmVHckcvRElpU1FuZmZIaHc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiU1BtQ01KUnZwdmFjQjFmWGZ6c3htM3lmdkM3eDRhNHViUU0vYkVzZmhtVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYTJ6a1BSYTN0WGh1ZDB3WS9HQWU2TzBUMEovQXczVENaSGkzMmVaVndTQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndFR2dOT2hNYjVsMU9YUmJBSE1VVmJpM0g1Z1RoV0ppVGFteHBpNEhOdFhiem5lSWNnR24zWGhkbGprVVBybm9QVHM3ampvV0Exd0VOUEZtZUV3YkRRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjI4LCJhZHZTZWNyZXRLZXkiOiJLeE1sUS9nRjRBOS9iVm5BbStEQkErVUUyNVltUHdmQ3Jmcm9DYVI2Y3BBPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJET3RJNmlYd1Q1YXBTSmF1czB0N05RIiwicGhvbmVJZCI6IjI2YWVhNzMxLWVkYTYtNDRmMy05NDUwLTMwMDc0OTE1ZjcwMCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJXYU9QdlBRVnBHOXNwditqdk1Ra3FRaHlWNTg9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaGI1WWVzQytsUllZYlBxaXd5bjM3KzRBRmtNPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IlQyRkJTS1dOIiwibWUiOnsiaWQiOiIyMzQ4MTQ3MDExNjYxOjE1QHMud2hhdHNhcHAubmV0IiwibmFtZSI6Ik1scyJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT3Yyd0tzSEVKN3QxTHNHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiYk1yRnVvU3Z0ZnBIK0lJaytzQlVja3dZTWZPdlpJMXMvYUJwQ0l3bmloVT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiTlgyT3NlRWJ0T1dmRTg3S0lkL3NLMHJhRjlNVitlTmhjbVhsK3NTcWFobDhKMldSeEhSdEJueTVacVAyVE85Z1lqOHRKUUlSci9lbHJKT2JUeXdoRFE9PSIsImRldmljZVNpZ25hdHVyZSI6ImFGak9tTjVmMUNLczhwNzJOZU5HMEI2V1Q1dVFkdkQ3NWd6T1lOcmJCRjhOYWdJNERGcTUrN2JyaUU3OXJZaUxnUm5CdklWYlRsbXlEb3pvZFlRYUFRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjM0ODE0NzAxMTY2MToxNUBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJXekt4YnFFcjdYNlIvaUNKUHJBVkhKTUdESHpyMlNOYlAyZ2FRaU1KNG9WIn19XSwicGxhdGZvcm0iOiJzbWJhIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzM1NzM0OTU1LCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQVBxRSJ9',
    PREFIXE: process.env.PREFIX || "+",
    GITHUB : process.env.GITHUB|| 'https://github.com/Keithkeizzah/ALPHA-MD1',
    OWNER_NAME : process.env.OWNER_NAME || "Keith",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "2348147011661",  
    ANTILINK : process.env.ANTILINK || "yes",
    ANTI_VV : process.env.ANTI_VV || "no",               
    AUTO_REPLY : process.env.AUTO_REPLY || "yes",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "non",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    AUTO_REACT: process.env.AUTO_REACTION || "non",  
    AUTO_LIKE_STATUS: process.env.AUTO_LIKE_STATUS || 'yes',              
    CHATBOT: process.env.CHAT_BOT || "off",              
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "yes",
    AUTO_BLOCK: process.env.BLOCK_ALL || 'yes',              
    GURL: process.env.GURL  || "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
    WEBSITE :process.env.GURL || "https://whatsapp.com/channel/0029Vaan9TF9Bb62l8wpoD47",
    CAPTION : process.env.CAPTION || "Draken-MD",
    BOT : process.env.BOT_NAME || 'Draken_MD',
    URL : process.env.BOT_MENU_LINKS || '',
    MODE: process.env.PUBLIC_MODE || "yes",              
    TIMEZONE: process.env.TIMEZONE || "Africa/Nairobi", 
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME || null,
    HEROKU_API_KEY : process.env.HEROKU_API_KEY || null,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    GEMINI_API_KEY : process.env.GEMINI_API_KEY || 'AIzaSyCcZqDMBa8FcAdBxqE1o6YYvzlygmpBx14',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    ANTICALL: process.env.ANTICALL || 'yes',              
    CHAT_BOT : process.env.CHAT_BOT || 'no',  
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
