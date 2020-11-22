exports.category = "music";
exports.info = "I join the channel you are currently in."

   exports.run = async (message, args, client, ops) => {
        if (message.member.voice.channel) {
                    message.member.voice.channel.join()
                       .then(connection => {
                            message.channel.send("**Successfully Joined!**");
                    });
            
        }
        else {
            message.channel.send("❌ You must be in a voice channel for me to join!");
        }
    }
