const {ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType} = require("discord.js");

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
            string += "**" + (i + index + 1) + ". " + channel.name + "**" + "ID: **" + channel.id + "** (" + ChannelType[channel.type] + ")\n"
        }
        var embed = {
    
            "embed": {
              "title" : "Channels #" + (index + 1) + "-" + (index + currentChannels.length),
              "color": ops.color,
              "author": {
                "name": "List of Channels in " + guilds.get(args[0]).name,
                "url": "",
                "icon_url": client.user.displayAvatarURL({
                    size: 2048,
                    format: "png"
                })
              },
              "fields": [
                {
                  "name" : "Page " + Math.floor((index / pageMax) + 1) + "/" + Math.ceil(channels.size / pageMax),
                  "value" : string
                }
              ]
            }
        }
        return embed;
    }

    const forward = new ButtonBuilder()
        .setCustomId("forward")
        .setEmoji('→')
        .setStyle(ButtonStyle.Primary);
    const back = new ButtonBuilder()
        .setCustomId("back")
        .setEmoji('←')
        .setStyle(ButtonStyle.Primary);

    const msg = await message.channel.send({
        embeds: [(await generateEmbed(0)).embed],
        components: channels.size <= pageMax ? [] : [new ActionRowBuilder().addComponents(forward)]
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
                new ActionRowBuilder().addComponents(buttons)
            ]
            await interaction.update({
                embeds: [(await generateEmbed(currentIndex)).embed],
                components: components
            })
        })
    }
}
