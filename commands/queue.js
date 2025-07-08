const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, InteractionContextType, SlashCommandBuilder } = require("discord.js");
const { RepeatMode } = require("distube")
const MAX_QUEUE = 1; // Default 10
module.exports = {
    category: "music",
    info: "Returns the current queue of tracks.",
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Returns the current queue of tracks.")
        .setContexts(InteractionContextType.Guild)
        .addIntegerOption(option => 
            option.setName("page")
            .setDescription("Specify a certain page.")
            .setRequired(false)
            .setMinValue(1)
        ),
    async execute(interaction) {
        const index = require("../index.js");
        const queue = interaction.client.distube.getQueue(interaction.guild)
        if (!queue) {
            interaction.reply("There are currently no songs in the queue!");
        } else {
            var pages = Math.ceil((queue.songs.length - 1) / MAX_QUEUE)
            const generateEmbed = async page => {
                var fields = [];
                let first = (page - 1) * MAX_QUEUE + 1
                let last = Math.min(page * MAX_QUEUE, queue.songs.length - 1)
                for (i = first; i <= last; i++) {
                    fields.push({
                        'name': i + ". " + "`[" + queue.songs[i].formattedDuration + "]` " + queue.songs[i].name,
                        'value': "Requested by: " + queue.songs[i].user.toString(),
                    })
                }
                var song_looped = queue.repeatMode == RepeatMode.SONG ? "⟳" : ""
                var queue_looped = queue.repeatMode == RepeatMode.QUEUE ? "⟳" : ""
                var paused = queue.paused ? "⏸︎" : "▶"
                const embed = new EmbedBuilder().setColor(index.ops.color)
                    .setTitle(paused + " `[" + queue.songs[0].formattedDuration + "]` " + queue.songs[0].name + " " + song_looped)
                    .setDescription("Requested by: " + queue.songs[0].user.toString() + 
                                    "\n### Up Next" +
                                    (last == 0 ? "" : `\nPage ${page} of ${pages}`)
                                    )
                    .setURL(queue.songs[0].url)
                    .setFooter({
                        iconURL: queue.songs[0].metadata.bot_owner.displayAvatarURL({
                            size: 2048,
                            format: "png"
                        }),
                        text: "Bot Created by " + index.ops.owner.tag
                    })
                    .setAuthor({
                        name: "Queue " + queue_looped,
                        iconURL: queue.client.user.displayAvatarURL({
                            size: 2048,
                            format: "png"
                        }),
                    })
                    .setFields(fields)
                    .setThumbnail(queue.songs[0].thumbnail)
                return embed
            }

            const forward = new ButtonBuilder()
                .setCustomId("forward")
                .setLabel('→')
                .setStyle(ButtonStyle.Primary);
            const back = new ButtonBuilder()
                .setCustomId("back")
                .setLabel('←')
                .setStyle(ButtonStyle.Primary);
            
            var buttons = new ActionRowBuilder();
            var buttons = [];
            let page = interaction.options.getInteger("page") || 1;
            if (page > 1)
                buttons.push(back);
            if (page < pages)
                buttons.push(forward);
            const msg = await interaction.reply({
                embeds: [(await generateEmbed(page))],
                components: buttons.length == 0 ? [] : [new ActionRowBuilder().addComponents(buttons)]
            });
            if (buttons.length > 0) {
                const collector = msg.createMessageComponentCollector();
                collector.on('collect', async push => {
                    push.customId === "back" ? (page--) : (page++);
                    pages = Math.ceil((queue.songs.length - 1) / MAX_QUEUE)
                    if (page > pages)
                        page = pages
                    var buttons = [];
                    if (page > 1)
                        buttons.push(back);
                    if (page < pages)
                        buttons.push(forward);
                    await push.update({
                        embeds: [(await generateEmbed(page))],
                        components: buttons.length == 0 ? [] : [new ActionRowBuilder().addComponents(buttons)]
                    })
                })
            }
        }
    }
}
