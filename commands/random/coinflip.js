const commando = require('discord.js-commando');

class CoinFlip extends commando.Command {

    constructor(client) {

        super(client, {
            name: 'number',
            group: 'random',
            memberName: 'number',
            description: 'Displays a random number from 1-100',
            guildOnly: 'true'
        });
    }
    async run(message, args) {
        var number = Math.floor(Math.random() * 99) + 1;
        message.reply(number)
    }
}

module.exports = CoinFlip; 