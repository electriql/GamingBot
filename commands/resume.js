exports.info = "Resumes a paused clip."
exports.run = async (message, args, client, ops) => {
    let fetched = ops.active.get(message.guild.id);

    if (!fetched) message.channel.send("❌ There is currently no music playing in the server!");

    if (!message.member.voiceChannel) return message.channel.send("❌ You are currently not in a voice channel!");

    if (!message.guild.me.voiceChannel) return message.channel.send("❌ I am currently not in a voice channel!");

    if (message.member.voiceChannel != message.guild.me.voiceChannel) return message.channel.send("❌ You need to be in the same voice channel as me!");

    if (!fetched.dispatcher.paused) return message.channel.send("❌ This track is already playing!");

    fetched.dispatcher.resume();
    
    message.channel.send("**Succesfully resumed** `" + fetched.queue[0].songTitle + "`**!**");
}