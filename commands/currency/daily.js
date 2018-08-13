const commando = require('discord.js-commando');
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
class Daily extends commando.Command {

    constructor(client) {

        super(client, {
            name: 'daily',
            group: 'currency',
            memberName: 'daily',
            description: 'Gives you 100 diamonds once each day.',
            guildOnly: 'true'
        });
    }
    async run(message, args) {
        
    }
}

module.exports = Daily; 