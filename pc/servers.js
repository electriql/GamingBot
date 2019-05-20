exports.run = async (message, args, client, ops) => {
    let guilds = client.guilds.array();

    for (i = 0; i < guilds.length; i++) {
        message.channel.send((i + 1) + ". " + guilds[i].name + ", " + guilds[i].memberCount + " members, ID: " + guilds[i].id);
    }
}