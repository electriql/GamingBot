
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
    
    exports.info = "Gives your daily 100 diamonds. Obtainable once every 24 hours."
    exports.run = async (message, args, client, ops) => {
        
    }