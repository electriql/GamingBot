const commando = require('discord.js-commando');
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
class Diamonds extends commando.Command {

    constructor(client) {

        super(client, {
            name: 'diamonds',
            group: 'currency',
            memberName: 'diamonds',
            description: 'Shows how many diamonds you have.',
            guildOnly: 'true'
        });
    }
    async run(message, args) {
        /*if (message.guild.id != "415729604217798656") {
            message.reply("That feature is not ready yet!");
        }
        else {
            let sender = message.author;
            var diamonds = userData[sender.id];
            console.log(diamonds);
            message.channel.send("**" + message.author.username + ",** You have 💎x ${diamonds}!");
        }*/
        
    }
}

module.exports = Diamonds; 