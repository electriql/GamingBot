
const fs = require('fs');
let serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'));
exports.category = "music";
exports.info = "Leaves the channel I am currently in."
    exports.run = async (message, args, client, ops) => {
        let fetched = ops.active.get(message.guild.id);
        if (message.guild.voice.channel) {
            
            
            
            if (!fetched) {

            } else {
                for (i = 0; i < fetched.queue.length; i++) {
                    fetched.queue[i].looped = 0;
                }
                fetched.queue = [];
                ops.active.delete(message.guild.id);
            }
            message.guild.voice.channel.leave();
            message.channel.send("**Successfully Disconnected!**");
        }
        else {
            message.channel.send("❌ I am currently not in a voice channel!");
        }
    }