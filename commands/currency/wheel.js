const commando = require('discord.js-commando');
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
class Wheel extends commando.Command {

    constructor(client) {

        super(client, {
            name: 'wheel',
            group: 'currency',
            memberName: 'wheel',
            description: 'Spins a wheel of diamonds.',
            guildOnly: 'true'
        });
    }
    async run(message, args) {
        
    }
}

module.exports = Wheel; 