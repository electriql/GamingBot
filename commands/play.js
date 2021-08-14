const voice = require('@discordjs/voice');
const search = require("yt-search");
const YTDL = require('ytdl-core');
const fs = require('fs');
let serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'));
exports.category = "music";
exports.info = "Plays a specified clip if in a voice channel."
function secondsToHms(d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}
    exports.run = async (message, args, client, ops) => {
        
                if (!message.member.voice.channel) return message.channel.send("❌ You must be in a voice channel!");
                
                if (YTDL.validateURL(args[0])) {
                    try {
                    YTDL.validateURL(args[0]);
                    }
                    catch (e) {
                        console.log(e);
                        return message.channel.send("❌ An error occurred.");
                    }
                    let data = ops.active.get(message.guild.id) || {};
                    
                    if (!data.connection) data.connection = voice.joinVoiceChannel({
                        channelId: message.member.voice.channel.id,
                        guildId: message.guild.id,
                        adapterCreator: message.guild.voiceAdapterCreator,
                        selfDeaf: false,
                    })
                    if (!data.queue) {
                        
                         data.queue = [];
                    }
                    
                    data.guildID = message.guild.id;
                    let info = await YTDL.getInfo(args[0]);
                    let length = secondsToHms(info.videoDetails.lengthSeconds); 

                    data.queue.push({
                        songTitle: info.videoDetails.title,
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
                                "title": "__**" + info.videoDetails.title + "**__",
                                "description": "Requested By:" + message.author.toString() + ", Duration: `" + length + "`",
                                "url" : args[0],
                                "color": 4886754,
                                "footer": {
                                    "icon_url": ops.owner.displayAvatarURL({
                                        size: 2048,
                                        format: "png"
                                    }),
                                    "text": "Bot Created by " + ops.owner.tag
                                },
                                "author": {
                                    "name": "Adding to queue...",
                                    "url": "",
                                    "icon_url": client.user.displayAvatarURL({
                                        size: 2048,
                                        format: "png"
                                    }),
                                },
                                "fields": [
                                {
                                    "name": "__Position in Queue__",
                                    "value": (data.queue.length - 1).toString()
                                }
                                ]
                              
                            }
                        }
                        message.channel.send({embeds: [embed1.embed]});
                        ops.active.set(message.guild.id, data);
                    }
                
                }
                else {
                search(args.join(' '), async function(err, res) {
                    if (err) return message.channel.send("❌ An error occurred.");
                    try {
                        
                        if (YTDL.validateURL(res.videos[0].url)) res.videos.splice(0, 1);
                    }
                    catch (e) {
                        console.log(e);
                        return message.channel.send("❌ An error occurred.");
                    }
                    let video = res.videos[0];
                    
                    let url = [video.url];
                    let commandFile = require('./play.js');

                    commandFile.run(message, url, client, ops);
                });   
    }
}
async function play(client, ops, data, message) {
    var l = data.queue.length - 1;
    var loop = "";
    if (data.queue[0].looped == 1) loop = " (looped)";
    if (data.queue) {
        var embed = {
            "embed": {
                "title": data.queue[0].songTitle + loop,
                "description": "Queue length: " + l  + ", Requested by: " + data.queue[0].requester.toString() + ", Duration: `" + data.queue[0].duration + "`",
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
                    "name": "Now Playing...",
                    "url": "",
                    "icon_url": client.user.displayAvatarURL({
                        size: 2048,
                        format: "png"
                    })
                }
            }
        }
    }
    message.channel.send({embeds: [embed.embed]});
    const player = voice.createAudioPlayer()
    data.dispatcher = player;
    const resource = voice.createAudioResource(YTDL(data.queue[0].url, {filter: "audioonly", quality: "highestaudio"}), {
        inlineVolume: true
    });
    resource.volume.setVolumeDecibels(-15);
    data.dispatcher.play(resource);
    voice.getVoiceConnection(message.guild.id).subscribe(player);
    data.dispatcher.guildID = data.guildID;
    ops.active.set(data.dispatcher.guildID, data);
    data.dispatcher.on(voice.AudioPlayerStatus.Idle, async function() {
        finish(client, ops, this, message, data);
    });
    
}
async function finish(client, ops, dispatcher, message, data) {

        if (data.queue[0]) {
            if (data.queue[0].looped) {
                if (data.queue[0].looped == -1) data.queue.shift();
            }
        }

        if (data.queue.length > 0) {
            ops.active.set(dispatcher.guildID, data);

            play(client, ops, data, message);
        }
        else {
            ops.active.delete(dispatcher.guildID);
        }

}

 
