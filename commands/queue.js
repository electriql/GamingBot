const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { RepeatMode } = require("distube")
const MAX_QUEUE = 11; // Default 11
module.exports = {
    category: "music",
    info: "Returns the current queue of tracks.",
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Returns the current queue of tracks.")
        .setDMPermission(false),
    async execute(interaction) {
        const index = require("../index.js");
        const queue = interaction.client.distube.getQueue(interaction.guild)
        var data = index.ops.active.get(interaction.guildId);
        if (!queue) {
            interaction.reply("There are currently no songs in the queue!");
        } else {
            var fields = [];
            var length = queue.songs.length > MAX_QUEUE ? MAX_QUEUE : queue.songs.length;
            for (i = 1; i < length; i++) {
                fields.push({
                    'name': i + ". " + "`[" + queue.songs[i].formattedDuration + "]` " + queue.songs[i].name,
                    'value': "Requested by: " + queue.songs[i].user.toString(),
                })
            }
            var song_looped = queue.repeatMode == RepeatMode.SONG ? "⟳" : ""
            var queue_looped = queue.repeatMode == RepeatMode.QUEUE ? "⟳" : ""
            const embed = new EmbedBuilder().setColor(index.ops.color)
                .setTitle("🔊 `[" + queue.songs[0].formattedDuration + "]` " + queue.songs[0].name + " " + song_looped)
                .setDescription("Requested by: " + queue.songs[0].user.toString() + 
                                "\n### Up Next" +
                                (queue.songs.length > MAX_QUEUE ? " (First " + (MAX_QUEUE - 1) + " out of " + (queue.songs.length - 1) + ")" : "") + ""
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
            // var embed = {
            //     "embed": {
            //         "title": "🔊  " + data.queue[0].songTitle + " `[" + data.queue[0].duration + "]`" + l,
            //         "description": "Requested by: " + data.queue[0].requester.toString() + 
            //                         "\n\n**__Up Next" +
            //                         (data.queue.length > MAX_QUEUE ? " (First " + (MAX_QUEUE - 1) + " out of " + (data.queue.length - 1) + ")" : "") + "__**",
            //         "url" : data.queue[0].url,
            //         "color": index.ops.color,
            //         "footer": {
            //             "icon_url": index.ops.owner.displayAvatarURL({
            //                 size: 2048,
            //                 format: "png"
            //             }),
            //             "text": "Bot Created by " + index.ops.owner.tag 
            //         },
            //         "author": {
            //             "name": "Queue",
            //             "url": "",
            //             "icon_url": interaction.client.user.displayAvatarURL({
            //                 size: 2048,
            //                 format: "png"
            //             }),
            //         },
            //         "fields": fields
                
            //     }
            // }
            interaction.reply({ embeds: [embed] });
        }
    }
}
