
exports.info = "Joins the channel you are currently in."

   exports.run = async (message, args, client, ops) => {
        if (message.member.voiceChannel) {
                    message.member.voiceChannel.join()
                       .then(connection => {
                            message.channel.send("**Successfully Joined!**");
                    });
            
        }
        else {
            message.channel.send("❌ You must be in a voice channel for me to join!");
        }
    }

