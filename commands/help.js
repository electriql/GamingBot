
const fs = require('fs');
let serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'));
exports.info = "Brings up the list of available commands."
   exports.run = async (message, args, client, ops) => {
    
    
    
    if (args[0]) {
        let cmd = args[0];
        try {
            // console.log(__dirname + "/" + cmd + ".js");
            if (fs.existsSync(__dirname + "/" + cmd + ".js")) {
                let commandFile = require(__dirname + "/" + cmd + ".js");
                
                message.channel.send("**g!" + cmd + "** - " + commandFile.info)
            }
        }   
        catch (e) {
            console.log(e.stack);
        }

    }
    else {
        
        message.channel.send("Check your DMs!");

        const help =  {
            "embed": {
                "title": "__**Bot Features**__",
                "description": "**This bot has an automatic join and leave message, curse filter, music, and more! Here are the commands that I can execute! Type g!help <command> to see what the command does!**",
                "color": 4886754,
                "footer": {
                    "icon_url": ops.owner.displayAvatarURL,// https://media.discordapp.net/attachments/415729242341507076/439987020853411844/ElectricDiamondCrop.png?width=676&height=676
                    "text": "Bot Created by " + ops.owner.tag //@ᗴlectricↁiamond#1684
                },
                "author": {
                    "name": "Bot Information",
                    "url": "",
                    "icon_url": "https://media.discordapp.net/attachments/415729242341507076/439978267156545546/BotLogo.png?width=676&height=676"
                },
                "fields": [
                    {
                        "name": "__**User**__",
                        "value": "`help`, `uniqueid`"
                    },
                    
                    {
                        "name": "__**Fun**__",
                        "value": "`8ball`, `fact`, `pun`, `say`"
                    },
                    {
                        "name": "__**Currency**__",
                        "value": "`diamonds`, `daily`, `slots`, `wheel`"
                    },
                    {
                        "name": "__**Music**__",
                        "value": "`clear`, `join`, `leave`, `loop`, `pause`, `play`, `queue`, `remove`, `resume`, `search`, `skip`"
                    },
                    {
                        "name": "__**Moderator (must have the Manage Server permission)**__",
                        "value": "`toggleprofanity`"
                    },
                    {
                        "name": "**More features to come!**",
                        "value": "Send me your suggestions so new features come out sooner!"
                    }
                ]
            }
        }
            message.author.send(help);
    }
    
}
    

