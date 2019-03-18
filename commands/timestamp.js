exports.info = "Says when your account was made!"
exports.run = async (message, args, client, ops) => {
        let date = message.author.createdAt;
        message.channel.send("Your account was created on **" + date + "**");
}