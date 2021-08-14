const voice = require('@discordjs/voice');
exports.category = "music";
exports.info = "Pauses the current track that is playing."
exports.run = async (message, args, client, ops) => {
    let fetched = ops.active.get(message.guild.id);

    if (!fetched) return message.channel.send("❌ There is currently no music playing in the server!");

    if (!message.member.voice.channel) return message.channel.send("❌ You are currently not in a voice channel!");

    let connection = voice.getVoiceConnection(message.guild.id);
    if (!connection) return message.channel.send("❌ I am currently not in a voice channel!");

    if (message.member.voice.channel != message.guild.me.voice.channel) return message.channel.send("❌ You need to be in the same voice channel as me!");

    if (fetched.dispatcher.state.status == 'paused') return message.channel.send("❌ This track is already paused!");

    fetched.dispatcher.pause();
    
    message.channel.send("**Succesfully paused** `" + fetched.queue[0].songTitle + "`**!**")
}