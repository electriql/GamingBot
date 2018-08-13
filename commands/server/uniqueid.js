const commando = require('discord.js-commando');

class UniqueID extends commando.Command {

    constructor(client) {

        super(client, {
            name: 'uniqueid',
            group: 'server',
            memberName: 'uniqueid',
            description: 'Gives you your unique discord ID.',
            guildOnly: 'true'
        });
    }
    async run(message, args) {
        message.channel.send('**' + message.author.username + '** Your unique id is '+ message.author.id);
    }
}

module.exports = UniqueID; 