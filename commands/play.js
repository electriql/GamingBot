const search = require("yt-search");
const YTDL = require('ytdl-core');
const fs = require('fs');
let serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'));
exports.info = "Plays a specified clip if in a voice channel."
function secondsToHms(d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}
    exports.run = async (message, args, client, ops) => {
        
        
                if (YTDL.validateURL(args[0])) {
                    
                    let data = ops.active.get(message.guild.id) || {};
                    
                    if (!data.connection) data.connection = await message.member.voiceChannel.join();
                    if (!data.queue) {
                        
                         data.queue = [];
                    }
                    
                    data.guildID = message.guild.id;
                    let info = await YTDL.getInfo(args[0]);
                    let length = secondsToHms(info.length_seconds); 

                    data.queue.push({
                        songTitle: info.title,
                        url: args[0].toString(),
                        announceChannel: message.channel.id,
                        requester: message.author,
                        duration: length,
                        looped: -1,
                    });
                    if (!data.dispatcher) {
                        play(client, ops, data, message);
                    } 
                    else {
                        
                        var embed1 = {
                            "embed": {
                                "title": "__**" + info.title + "**__",
                                "description": "Requested By:" + message.author + ", Duration: `" + length + "`",
                                "url" : args[0],
                                "color": 4886754,
                                "footer": {
                                    "icon_url": ops.owner.displayAvatarURL,
                                    "text": "Bot Created by " + ops.owner.tag //@ᗴlectricↁiamond#1684
                                },
                                "author": {
                                    "name": "Adding to queue...",
                                    "url": "",
                                    "icon_url": "https://media.discordapp.net/attachments/415729242341507076/439978267156545546/BotLogo.png?width=676&height=676"
                                },
                                "fields": [
                                {
                                    "name": "__Position in Queue__",
                                    "value": data.queue.length - 1
                                }
                                ]
                              
                            }
                        }
                        message.channel.send(embed1);
                        ops.active.set(message.guild.id, data);
                    }
                
                }
                else {
                search(args.join(' '), function(err, res) {
                    if (err) return message.channel.send("❌ An error occurred. Please contact <@240982621247635456>.");
                    
                    if (!YTDL.validateURL(res.videos[0].url)) res.videos.splice(0, 1);
            
                    let video = res.videos[0];
                    
                    let url = ["https://www.youtube.com" + video.url];

                    let commandFile = require('./play.js');

                    commandFile.run(message, url, client, ops);
                });
                }        
    }
async function play(client, ops, data, message) {
    var l = data.queue.length - 1;
    var loop = "";
    if (data.queue[0].looped == 1) loop = " (looped)";
    var embed = {
        "embed": {
            "title": data.queue[0].songTitle + loop,
            "description": "Queue length: " + l  + ", Requested by: " + data.queue[0].requester + ", Duration: `" + data.queue[0].duration + "`",
            "url" : data.queue[0].url,
            "color": 4886754,
            "footer": {
                "icon_url": ops.owner.displayAvatarURL,
                "text": "Bot Created by " + ops.owner.tag //@ᗴlectricↁiamond#1684
            },
            "author": {
                "name": "Now Playing...",
                "url": "",
                "icon_url": "https://media.discordapp.net/attachments/415729242341507076/439978267156545546/BotLogo.png?width=676&height=676"
            }
        }
    }
    message.channel.send(embed);
    data.dispatcher = await data.connection.playStream(YTDL(data.queue[0].url, {filter: "audioonly"}));
    data.dispatcher.guildID = data.guildID;
    ops.active.set(data.dispatcher.guildID, data);
    data.dispatcher.once('end', function() {
        finish(client, ops, this, message, data);
    });
}
async function finish(client, ops, dispatcher, message, data) {

        if (data.queue[0].looped) {
            if (data.queue[0].looped == -1) data.queue.shift();
        }
        

        if (data.queue.length > 0) {
            ops.active.set(dispatcher.guildID, data);

            play(client, ops, data, message);
        }
        else {
            ops.active.delete(dispatcher.guildID);
        }

}

 