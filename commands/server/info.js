const commando = require('discord.js-commando');

class Info extends commando.Command {
    constructor(client) {

        super(client, {
            name: 'info',
            group: 'server',
            memberName: 'info',
            description: 'Gives you some info of the server.',
            guildOnly: 'true'
        });
    }
    async run(message, args) {
        message.reply("I have sent you a DM with some information.")
        const data = {
            "embed": {
              "title": "**Read our rules!**",
              "description": "Make sure to go *[here](https://docs.google.com/document/d/1bPV3zuHWpyLUck_n7J6z1jt2IY-wBPUS6O-46x-hMGc/edit?usp=sharing)* or go to #rules to see our rules. Do this before doing anything else! If you want to apply for donator, type g/donator to visit the form!",
              "color": 6655,
              "image": {}
            }
          };
          message.author.sendMessage(data);
          message.author.send("_**Ranks**_");
          message.author.send("Ranks are a huge part of our server and you should understand how they work. The color next to the rank info is the color that people with the rank will have.");
         const owner = {
            "embed": {
                "title": " _**Leader**_ ",
                "description": "The most powerful rank in the server. Messing with them is the worst idea in the world.",
                "color": 65295,
                "image": {}
                }
            }
        const admin = {
            "embed": {
                "title": " _**Commander**_ ",
                "description": "The second most powerful rank in the server. Respect and listen to them just like with Leaders.",
                "color": 16714752,
                "image": {}
                }
            };
        const premium = {
            "embed": {
                "title": " _**Premium**_ ",
                "description": "A prestige rank on our server. More abilities than members.",
                "color": 4886754,
                "image": {}
                }
        };
        const disciplined = {
            "embed": {
                "title": " _**Disciplined**_ ",
                "description": "People with this rank has been breaking some rules. You better make sure you are not this rank.",
                "color": 2884612,
                "image": {}
                }
        };
        const test = {
            "embed": {
                "title": " _**Member**_ ",
                "description": "Pretty straightforward. This is the rank that most people have and is the default rank.",
                "color": 7309969,
                "image": {}
                }
        };
        
        member.user.sendMessage(disciplined);
        member.user.sendMessage(test);
        member.user.sendMessage(premium);
        member.user.sendMessage(admin);
        member.user.sendMessage(owner);
    }
}

module.exports = Info; 
