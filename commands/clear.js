exports.category = "music";
exports.info = "Clears all the clips in the queue when playing music."

exports.run = async(message, args, client, ops) => {
    let fetched = ops.active.get(message.guild.id);

    if (!fetched) return message.channel.send("❌ There is currently no music playing in the server!");

    message.channel.send("**Successfully cleared the queue!**");

    fetched.queue.length = 0;

    fetched.dispatcher.stop();

    ops.active.set(message.guild.id, fetched);

    ops.active.delete(message.guild.id);
}