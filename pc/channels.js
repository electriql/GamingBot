const { MessageButton, MessageActionRow } = require("discord.js");

const discord = import("discord.js");
const pageMax = 10;
exports.info = "Shows all the text and voice channels in a server given its id."
exports.run = async (message, args, client, ops) => {
    
    if (!args[0]) return message.channel.send("Put a server id as an argument.");

    var guilds = client.guilds.cache;
    
    if (guilds.get(args[0]) == null) return message.channel.send("This server is not valid.");
    if (guilds.get(args[0]).channels.length < 1) return message.channel.send("This server doesn't have any channels.");

    var channels = guilds.get(args[0]).channels.cache;
    const generateEmbed = async index => {
        let currentChannels = Array.from(channels.values()).slice(index, index + pageMax);
        var string = "";
        for (i = 0; i < currentChannels.length; i++) {
            channel = currentChannels[i];
            string += "**" + (i + index + 1) + ". " + channel.name + "**, " + "ID: **" + channel.id + "** (" + channel.type + ")\n"
        }
        var embed = {
    
            "embed": {
              "title" : "Channels #" + (index + 1) + "-" + (index + currentChannels.length),
              "color": 4886754,
              "author": {
                "name": "List of Channels in " + guilds.get(args[0]).name,
                "url": "",
                "icon_url": client.user.displayAvatarURL({
                    size: 2048,
                    format: "png"
                })
              },
              "fields": {
                  "name" : "Page 1/69",
                  "value" : string
              }
            }
        }
        return embed;
    }

    const forward = new MessageButton({
        style: 'PRIMARY',
        emoji: '▶',
        customId: 'forward'
    })
    const back = new MessageButton({
        style: 'PRIMARY',
        emoji: '◀',
        customId: 'back'
    })

    const msg = await message.channel.send({
        embeds: [(await generateEmbed(0)).embed],
        components: channels.size <= pageMax ? [] : [new MessageActionRow({components : [forward]})]
    });

    if (channels.size > pageMax) {
        
        const collector = msg.createMessageComponentCollector()
        
        let currentIndex = 0;
        collector.on('collect', async interaction => {
            interaction.customId === 'back' ? (currentIndex -= pageMax) : (currentIndex += pageMax)
            let buttons = [];
            let components = [];
            if (currentIndex - pageMax >= 0) buttons.push(back);
            if (currentIndex + pageMax < channels.size) buttons.push(forward);
            if (buttons[0]) components = [
                new MessageActionRow({
                    components: buttons
                })
            ]
            await interaction.update({
                embeds: [(await generateEmbed(currentIndex)).embed],
                components: components
            })
        })
    }
}
