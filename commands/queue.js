const YTDL = require('ytdl-core');
exports.info = "Returns the current queue of tracks."
exports.run = async (message, args, client, ops) => {
    let data = ops.active.get(message.guild.id);
    let fields = [];
    if (!data) {
        message.channel.send("**There are currently no songs in the queue!**")
    }
    else {
        if (data.queue) {
            
            for (i = 1; i < data.queue.length; i++) {
                fields.push({
                    'name': i + ". " + data.queue[i].songTitle + " **[" + data.queue[0].duration + "]** ",
                    'value': "Requested by: " + data.queue[i].requester,
                })
            }
            let l = ""
            if (data.queue[0].looped) {
                if (data.queue[0].looped == 1) {
                    l = " (looped)"
                }
                var embed = {
                    "embed": {
                        "title": "Currently playing: " + data.queue[0].songTitle + " **[" + data.queue[0].duration + "]** " + l,
                        "description": "__Up Next__",
                        "url" : data.queue[0].url,
                        "color": 4886754,
                        "footer": {
                            "icon_url": ops.owner.displayAvatarURL,
                            "text": "Bot Created by " + ops.owner.tag //@ᗴlectricↁiamond#1684
                        },
                        "author": {
                            "name": "Queue",
                            "url": "",
                            "icon_url": "https://media.discordapp.net/attachments/415729242341507076/439978267156545546/BotLogo.png?width=676&height=676"
                        },
                        "fields": fields
                    
                    }
                }
                message.channel.send(embed);
            }
        }
    }
}
