const { ChannelType } = require("discord.js");

exports.info = "Shows message history of a channel in a server. (excludes embeds)";
exports.run = async (message, args, client, ops) => {
    if (!args[0]) return message.channel.send("Usage: p!messages <serverid> <channelid> [length]");
    
    var guilds = client.guilds.cache;
    //console.log(guilds.fetch(args[0]).channels);
    if (guilds.get(args[0]) == null) return message.channel.send("This server is not valid.");
    if (guilds.get(args[0]).channels.length < 1) return message.channel.send("This server doesn't have any channels.");
    if (!args[1]) return message.channel.send("Usage: p!messages <serverid> <channelid>");

    var channels = guilds.get(args[0]).channels.cache;
    if (channels.get(args[1]) == null) return message.channel.send("This channel is not valid.");
    if (channels.get(args[1]).type != ChannelType.GuildText) return message.channel.send("This is not a text channel.");
    
    var channel = channels.get(args[1]);
    if (!channel.viewable) return message.channel.send("I cannot see message history!");
    
    var length = 10;
    if (args[2]) 
        if (!isNaN(args[2]) && args[2] > 0)
            length = args[2];
    channel.messages.fetch({limit : length}).then(map => {
        let messages = [];
        var msgs = 0;
        for (const [key, msg] of map) {
            if (msgs == 25)
                break;
            if (msg.content) {
                var trimmed = msg.content.length > 1024 ? msg.content.substring(0, 1021) + "..." : msg.content;
                msgs++;
                messages.push({
                    "name" : msgs + ". " + msg.author.tag + " " + msg.createdAt.toString(),
                    "value" : trimmed + "\n",
                });
            }
        }
        var embed = {

            "embed": {
              "color": ops.color,
              "author": {
                "name": "Showing " + msgs + " messages in " + channel.name,
                "url": "",
                "icon_url": client.user.displayAvatarURL({
                    size: 2048,
                    format: "png"
                }),
              },
              "fields": messages
            }
          }
          message.channel.send({embeds: [embed.embed]});
    })
    
}