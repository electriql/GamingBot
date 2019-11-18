exports.category = "music";
exports.info = "Removes a specified spot in the queue."
exports.run = async(message, args, client, ops) => {
    let fetched = ops.active.get(message.guild.id);

    if (!fetched) return message.channel.send("❌ There is currently no music playing in the server!");

    if (!fetched.queue[1]) return message.channel.send("❌ There are no clips waiting in the queue! Type `g!skip` to remove currently playing clip!");

    if (isNaN(args[0])) return message.channel.send("❌ The argument needs to be an integer!");

    let number = parseInt(args[0]);

    if (!fetched.queue[number]) return message.channel.send("❌ This spot in the queue is not occupied! If you want to see the queue, type `g!queue`!");

    if (number == 0) return message.channel.send("❌ That spot is currently playing! Type `g!skip` if you want to remove it!");

    let i = fetched.queue.indexOf(fetched.queue[number]);

    message.channel.send("**Successfully Removed** `" + fetched.queue[number].songTitle + "`** from the queue!**");

    var removed = fetched.queue.splice(i, 1);

    ops.active.set(message.guild.id, fetched);

    
    
}