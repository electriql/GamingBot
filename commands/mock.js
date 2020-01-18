exports.category = "fun";
exports.info = "Mocks the given statement in 2 ways!"
exports.run = async (message, args, client, ops) => {
    if (!args[0]) return message.channel.send("❌ Enter a message first.");

    var embed = {
        "embed": {
            "title": "**1: sUbScRiBe To PeWdIePiE**",
            "description": "**2: SuBsCrIbE tO pEwDiEpIe**",
            "url" : "",
            "color": 4886754,
            "footer": {
                "icon_url": ops.owner.displayAvatarURL,
                "text": "Bot Created by " + ops.owner.tag
            },
            "author": {
                "name": "Choose a Style...",
                "url": "",
                "icon_url": "https://media.discordapp.net/attachments/415729242341507076/439978267156545546/BotLogo.png?width=676&height=676"
            },
            "fields" : [
              {
                "name": "Type the number next to the style that you want!",
                "value": "OR type 'cancel' to cancel!"
              }
            ]
        }
    }

    const filter = m => m.author.equals(message.author);
    message.channel.send(embed)
    .then(msg => {
        const collector = message.channel.createMessageCollector(filter);

        collector.once('collect', function(m) {
            msg.delete();
                if (!isNaN(m.content) && (m.content == 1 || m.content == 2)) {
                    let output = ""
                    for (i = 0; i < args.length; i++) {
                        let letters = args[i].split('');
                        for (j = 1; j <= letters.length; j++) {
                            if (m.content == 1) {
                                if (j % 2 == 0) {
                                    output = output + letters[j-1].toUpperCase();
                                }
                                else {
                                    output = output + letters[j-1].toLowerCase();
                                }

                            }
                            else {
                                if (j % 2 == 0) {
                                    output = output + letters[j-1].toLowerCase();
                                }
                                else {
                                    output = output + letters[j-1].toUpperCase();                              
                                }
                            }
                        }
                        output = output + " ";
                    }
                    message.channel.send(output + "\n\n - " + message.author.tag);
                }  
                else if (m.content.toUpperCase() == "CANCEL") {
                    message.channel.send("**Cancelled!**");
                    return;
                }
                else {
                    return message.channel.send("❌ The message is invalid!");
                }
            
        });
    });
}
