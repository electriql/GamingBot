exports.run = async (message, args, client, ops) => {
    if (!args[0]) return message.channel.send("Put a server id as an argument.");

    var guilds = client.guilds;
    
    if (guilds.get(args[0]) == null) return message.channel.send("This server is not valid.");
    if (guilds.get(args[0]).channels.length < 1) return message.channel.send("This server doesn't have any channels.");

    var channels = guilds.get(args[0]).channels.array();
    for (i = 0; i < channels.length; i++) {
        message.channel.send((i + 1) + ". " + channels[i].name + ", Type: "  + channels[i].type + ", ID: " + channels[i].id);
    }
        
}