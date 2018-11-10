
exports.info = "Joins the channel you are currently in."

   exports.run = async (message, args, client, ops) => {
        if (!message.member.voiceChannel) return message.channel.send("❌ You must be in a voice channel for me to join!");
                    let connection = await message.member.voiceChannel.join();
                    if (connection) return message.channel.send("**Successfully Joined!**");
                    
            
    }

