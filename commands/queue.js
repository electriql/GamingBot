const YTDL = require('ytdl-core');
exports.category = "music";
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
                    'value': "Requested by: " + data.queue[i].requester.toString(),
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
                            "icon_url": ops.owner.displayAvatarURL({
                                size: 2048,
                                format: "png"
                            }),
                            "text": "Bot Created by " + ops.owner.tag 
                        },
                        "author": {
                            "name": "Queue",
                            "url": "",
                            "icon_url": client.user.displayAvatarURL({
                                size: 2048,
                                format: "png"
                            }),
                        },
                        "fields": fields
                    
                    }
                }
                message.channel.send(embed);
            }
        }
    }
}
