
const fs = require('fs');
let serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'));
exports.category = "misc";
exports.info = "Brings up the list of available commands."
   exports.run = async (message, args, client, ops) => {
    if (args[0]) {
        let cmd = args[0];
        try {
            // console.log(__dirname + "/" + cmd + ".js");
            if (fs.existsSync(__dirname + "/" + cmd + ".js")) {
                let commandFile = require(__dirname + "/" + cmd + ".js");
                
                return message.channel.send("**g!" + cmd + "** - " + commandFile.info);
            }
        }   
        catch (e) {
            console.log(e.stack);
        }

    }
        message.channel.send("Check your DMs!");
        let misc = "";
        let fun = "";
        let currency = "";
        let music = "";
        let moderator = "";
        fs.readdir(__dirname, function (err, files) {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            } 
            files.forEach(function (file) {
                var fileName = file.slice(0, file.length - 3);
                let commandFile = require(__dirname + '/' + file);
                if (commandFile.category == "misc") misc = misc + "`" + fileName + "`,";
                if (commandFile.category == "fun") fun = fun + "`" + fileName + "`,";
                if (commandFile.category == "currency") currency = currency + "`" + fileName + "`,";
                if (commandFile.category == "music") music = music + "`" + fileName + "`,";
                if (commandFile.category == "moderator") moderator = moderator + "`" + fileName + "`,";
                
            });
            const help =  {
                "embed": {
                    "title": "__**Bot Features**__",
                    "description": "**This bot has an automatic join and leave message, curse filter, music, and more! Here are the commands that I can execute! Type g!help <command> to see what the command does!**",
                    "color": 4886754,
                    "footer": {
                        "icon_url": ops.owner.displayAvatarURL({
                            size: 2048,
                            format: "png"
                        }),
                        "text": "Bot Created by " + ops.owner.tag 
                    },
                    "author": {
                        "name": "Bot Information",
                        "url": "",
                        "icon_url": client.user.displayAvatarURL({
                            size: 2048,
                            format: "png"
                        }),
                    },
                    "fields": [
                        {
                            "name": "__**Miscellaneous**__",
                            "value": misc
                        },
                        
                        {
                            "name": "__**Fun**__",
                            "value": fun
                        },
                        {
                            "name": "__**Currency**__",
                            "value": currency
                        },
                        {
                            "name": "__**Music**__",
                            "value": music
                        },
                        {
                            "name": "__**Moderator (must have the Manage Server permission)**__",
                            "value": moderator
                        },
                        {
                            "name": "**More features to come!**",
                            "value": "Send me your suggestions so new features come out sooner!"
                        }
                    ]
                }
            }
                message.author.send(help);
        });
        
    }
    

    

