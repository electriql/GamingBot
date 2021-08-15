exports.info = "Shows all the servers that I am in.";
exports.run = async (message, args, client, ops) => {
    let serverList = [];
    let i = 1;
    client.guilds.cache.map(guild => {
      serverList.push({
        "name": "**" + (i) + ". " + guild.name + "**",
        "value" : "**" + guild.memberCount + "** members, ID: **" + guild.id + "**"
      });
      i++;
      //message.channel.send((i + 1) + ". " + guilds[i].name + ", " + guilds[i].memberCount + " members, ID: " + guilds[i].id);
    })
    var embed = {

        "embed": {
          "color": 4886754,
          "author": {
            "name": "List of Servers",
            "url": "",
            "icon_url": client.user.displayAvatarURL({
              size: 2048,
              format: "png"
          })
          },
          "fields": serverList
        }
      }
      message.channel.send({embeds: [embed.embed]});
}