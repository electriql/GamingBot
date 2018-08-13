const commando = require('discord.js-commando');

class Fact extends commando.Command {

    constructor(client) {

        super(client, {
            name: 'fact',
            group: 'random',
            memberName: 'fact',
            description: 'Tells you a random fact about gaming. 🤓',
            guildOnly: 'true'
        });
    }
    async run(message, args) {
        var number = Math.floor(Math.random() * 10) + 1;
        if (number == 1) {
            message.reply("59% of Americans play video games.");
        }
        else if (number == 2) {
            message.reply("Consumers spent $21.53 billion on video games, hardware, and accessories in 2013.");
        }
        else if (number == 3) {
            message.reply("Purchases of of digital content, including games, add-on content, mobile apps, subscriptions, and social networking games, accounted for 53% of game sales in 2013.");
        }
        else if (number == 4) {
            message.reply("The average gamer is 31 years old and has been playing for 14 years.") ;
        }
        else if (number == 5) {
            message.reply("The most frequent game purchaser is 35 years old.");
        }
        else if (number == 6) {
            message.reply("48% of all game players are women. In fact, women over the age of 18 represent a significantly greater portion of the game playing population (36%) than boys 18 years or younger (17%)");
        }
        else if (number == 7) {
            message.reply("51% of all American households own a dedicated game console, and those that do not own an average of two.");
        }
        else if (number == 8) {
            message.reply("44% of gamers play games on their smartphones, and 33% play on their wireless device.");
        }
        else if (number == 9) {
            message.reply("88% of games rated on the Entertainment Software Rating Board (ESRB) in 2013 recieved a rating of 'E' for everyone, 'E10+' for Everyone 10+, or 'T' for Teen.");
        }
        else if (number == 10) {
            message.reply("Parents are present when games are purchased or rented 91% of the time.");
        }
    }
}

module.exports = Fact; 