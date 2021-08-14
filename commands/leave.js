const voice = require('@discordjs/voice');
const fs = require('fs');
let serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'));
exports.category = "music";
exports.info = "Leaves the channel I am currently in."
    exports.run = async (message, args, client, ops) => {
        let fetched = ops.active.get(message.guild.id);
        let connection = voice.getVoiceConnection(message.guild.id);
        if (connection) {
            if (fetched) {
                for (i = 0; i < fetched.queue.length; i++) {
                    fetched.queue[i].looped = 0;
                }
                fetched.queue = [];
                if (fetched.dispatcher)
                    fetched.dispatcher.stop();
                ops.active.delete(message.guild.id);
            }   
            connection.destroy()
            message.channel.send("**Successfully Disconnected!**");
        }
        else {
            message.channel.send("❌ I am currently not in a voice channel!");
        }
    }