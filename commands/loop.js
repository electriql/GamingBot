exports.info = "Loops the currently playing track."
exports.run = async (message, args, client, ops) => {
    let fetched = ops.active.get(message.guild.id);

    if (!fetched) return message.channel.send("❌ There is currently no music playing in the server!");

    let loop = fetched.queue[0].looped * -1;

    fetched.queue[0].looped = loop;

    if (loop == 1) return message.channel.send("`" + fetched.queue[0].songTitle + "` **will now be looped!**");

    if (loop == -1) return message.channel.send("`" + fetched.queue[0].songTitle + "` **will not be looped!**");
}