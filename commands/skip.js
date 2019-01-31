
const YTDL = require('ytdl-core');
const fs = require('fs');
let serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'));



    
exports.info = "Skips the track that is currently playing."
exports.run = async (message, args, client, ops) => {
    let fetched = ops.active.get(message.guild.id);
    if (fetched) {
       if (message.member.voiceChannel) {
            if (message.guild.voiceConnection) {
                if (message.member.voiceChannel == message.guild.me.voiceChannel) {
                    
                    
                    if (!isNaN(args[0])) {
                        let number = parseInt(args[0]);
                        if (!fetched.queue[number]) return message.channel.send("❌ There is no clip in this spot!");
                        let target = fetched.queue[number];
                        for (i = 1; i < number; i++) {

                            fetched.queue[0].looped = -1;
                            fetched.queue[0] = {};
                            fetched.queue.shift();
                        }
                        message.channel.send("**Skipped to **`" + target.songTitle + "`**!**");
                    }
                    else {
                        message.channel.send("**Skipped!**");
                    }
                    fetched.queue[0].looped = -1;
                    return fetched.dispatcher.end();
                }
                else {
                    message.channel.send("❌ Sorry, but you must be in the same voice channel as me to skip.");
                }
            }
            else {
                message.channel.send("❌ I am not in a voice channel!");
            }
        }
        else {
            message.channel.send("❌You must be in a voice channel to skip!")
        }
    }
    else {
        message.channel.send("❌ There are no clips to skip!")
    }
}

