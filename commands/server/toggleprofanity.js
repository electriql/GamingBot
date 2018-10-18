const commando = require('discord.js-commando');

class ToggleProfanity extends commando.Command {

    constructor(client) {

        super(client, {
            name: 'toggleprofanity',
            group: 'server',
            memberName: 'toggleprofanity',
            description: 'Moderator command that toggles profanity.',
            guildOnly: 'true'
        });
    }
    async run(message, args) {
        
    }
}

module.exports = ToggleProfanity;
