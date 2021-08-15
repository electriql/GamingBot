exports.info = "Shows all the text and voice channels in a server given its id."
exports.run = async (message, args, client, ops) => {
    if (!args[0]) return message.channel.send("Put a server id as an argument.");

    var guilds = client.guilds.cache;
    
    if (guilds.get(args[0]) == null) return message.channel.send("This server is not valid.");
    if (guilds.get(args[0]).channels.length < 1) return message.channel.send("This server doesn't have any channels.");

    var channels = guilds.get(args[0]).channels.cache;
    console.log(channels)
    let text = {
        "name" : "**Text Channels**",
        "value" : ""
    };
    let voice = {
        "name" : "**Voice Channels**",
        "value" : ""
    };
    let categories = {
        "name" : "**Categories**",
        "value" : ""
    };
    var textLength = 0;
    var voiceLength = 0;
    var categoryLength = 0;
    channels.map(channel => {
        if (channel.type == "GUILD_TEXT") {
            textLength++;
            text.value = text.value + "**" + (textLength) + ". " + channel.name + "**, " + "ID: **" + channel.id + "**\n"
        }
        else if(channel.type == "GUILD_VOICE") {
            voiceLength++;
            voice.value = voice.value + "**" + (voiceLength) + ". " + channel.name + "**, " + "ID: **" + channel.id + "**\n"
        }
        else if(channel.type == "GUILD_CATEGORY") {
            categoryLength++;
            categories.value = categories.value + "**" + channel.name + "**\n"
        }
        //message.channel.send((i + 1) + ". " + channels[i].name + ", Type: "  + channels[i].type + ", ID: " + channels[i].id);
    })
    let fields = [];
    if (categoryLength > 0) fields.push(categories);
    if (textLength > 0) fields.push(text);
    if (voiceLength > 0) fields.push(voice);

    var embed = {

        "embed": {
          "title" : "**" + (categoryLength + textLength + voiceLength) + "** channels",
          "color": 4886754,
          "author": {
            "name": "List of Channels in " + guilds.get(args[0]).name,
            "url": "",
            "icon_url": client.user.displayAvatarURL({
                size: 2048,
                format: "png"
            })
          },
          "fields": fields
        }
      }
      message.channel.send({embeds: [embed.embed]});
        
}
