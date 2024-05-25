exports.info = "Allows you to make a public announcement for every server I am in!";
exports.run = async (message, args, client, ops) => {
    message.channel.send("What should the message be? If you want to cancel this, type **'cancel'**");
    const filter = m => m.author.equals(message.author);
    const collector = message.channel.createMessageCollector({ filter: filter });
    collector.once('collect', function(m) {
        if (m.content.toUpperCase() == "CANCEL")
            return message.channel.send("Successfully canceled!");
        for (const [id, guild] of client.guilds.cache) {
            guild.systemChannel.send(m.content);
        }
        return message.channel.send("Successfully sent!");
    })
}