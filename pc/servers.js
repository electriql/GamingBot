exports.info = "Shows all the servers that I am in.";
exports.run = async (message, args, client, ops) => {
    let guilds = client.guilds.cache.array();
    let serverList = [];
    for (i = 0; i < guilds.length; i++) {
        serverList.push({
            "name": "**" + (i + 1) + ". " + guilds[i].name + "**",
            "value" : "**" + guilds[i].memberCount + "** members, ID: **" + guilds[i].id + "**"
        });
        //message.channel.send((i + 1) + ". " + guilds[i].name + ", " + guilds[i].memberCount + " members, ID: " + guilds[i].id);
    }
    var embed = {

        "embed": {
          "color": 4886754,
          "author": {
            "name": "List of Servers",
            "url": "",
            "icon_url": "https://media.discordapp.net/attachments/415729242341507076/439978267156545546/BotLogo.png?width=676&height=676"
          },
          "fields": serverList
        }
      }
      message.channel.send(embed);
}