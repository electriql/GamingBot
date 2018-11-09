
const fs = require('fs');
let serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'));
exports.info = "Leaves the channel I am currently in."
    exports.run = async (message, args, client, ops) => {
        let fetched = ops.active.get(message.guild.id);
        if (message.guild.voiceConnection) {
            
            
            message.guild.voiceConnection.disconnect();
            message.channel.send("**Successfully Disconnected!**");
            if (!fetched) {

            } else {
                fetched.queue = [];
                
                ops.active.set(message.guild.id, fetched);
            }
        }
        else {
            message.channel.send("❌ I am currently not in a voice channel!");
        }
    }