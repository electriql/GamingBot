
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));

exports.info = "Shows how many diamonds you currently have."
exports.run = async (message, args, client, ops) => {

}
