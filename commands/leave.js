
const fs = require('fs');
let serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'));
exports.info = "Leaves the channel I am currently in."
    exports.run = async (message, args, client, ops) => {
        let fetched = ops.active.get(message.guild.id);
        if (!message.guild.me.voiceChannel) return message.channel.send("❌ I am currently not in a voice channel!");
        message.guild.me.voiceChannel.leave();

                message.channel.send("**Successfully Disconnected!**");

        if (fetched) fetched.queue = [];
        ops.active.set(message.guild.id, fetched);
                    
    }
