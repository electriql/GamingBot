const voice = require('@discordjs/voice');
exports.category = "music";
exports.info = "I join the channel you are currently in."

   exports.run = async (message, args, client, ops) => {
        if (message.member.voice.channel) {
            const connection = voice.joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
                selfDeaf: false,
            })
            message.channel.send("**Successfully Joined!**");
            let data = ops.active.get(message.guild.id) || {};
            if (data.dispatcher)
                connection.subscribe(data.dispatcher);
        }
        else {
            message.channel.send("❌ You must be in a voice channel for me to join!");
        }
    }
