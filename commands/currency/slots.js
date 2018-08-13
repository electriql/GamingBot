const commando = require('discord.js-commando');
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
class Slots extends commando.Command {

    constructor(client) {

        super(client, {
            name: 'slots',
            group: 'currency',
            memberName: 'slots',
            description: 'Spins a slot machine.',
            guildOnly: 'true'
        });
    }
    async run(message, args) {
        
    }
}

module.exports = Slots; 