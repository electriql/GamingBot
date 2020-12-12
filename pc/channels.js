exports.info = "Shows all the text and voice channels in a server given its id."
exports.run = async (message, args, client, ops) => {
    if (!args[0]) return message.channel.send("Put a server id as an argument.");

    var guilds = client.guilds.cache;
    
    if (guilds.get(args[0]) == null) return message.channel.send("This server is not valid.");
    if (guilds.get(args[0]).channels.length < 1) return message.channel.send("This server doesn't have any channels.");

    var channels = guilds.get(args[0]).channels.cache.array();
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
    for (i = 0; i < channels.length; i++) {
        if (channels[i].type == "text") {
            textLength++;
            text.value = text.value + "**" + (textLength) + ". " + channels[i].name + "**, " + "ID: **" + channels[i].id + "**\n"
        }
        else if(channels[i].type == "voice") {
            voiceLength++;
            voice.value = voice.value + "**" + (voiceLength) + ". " + channels[i].name + "**, " + "ID: **" + channels[i].id + "**\n"
        }
        else if(channels[i].type == "category") {
            categories.value = categories.value + "**" + channels[i].name + "**\n"
        }
        //message.channel.send((i + 1) + ". " + channels[i].name + ", Type: "  + channels[i].type + ", ID: " + channels[i].id);
    }
    var embed = {

        "embed": {
          "title" : "**" + channels.length + "** channels",
          "color": 4886754,
          "author": {
            "name": "List of Channels in " + guilds.get(args[0]).name,
            "url": "",
            "icon_url": "https://media.discordapp.net/attachments/415729242341507076/439978267156545546/BotLogo.png?width=676&height=676"
          },
          "fields": [
              categories,
              text,
              voice
          ]
        }
      }
      message.channel.send(embed);
        
}
