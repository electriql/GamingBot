const { SlashCommandBuilder } = require("discord.js");
const MAX_QUEUE = 11;
module.exports = {
    category: "music",
    info: "Returns the current queue of tracks.",
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Returns the current queue of tracks.")
        .setDMPermission(false),
    async execute(interaction) {
        const index = require("../index.js");
        var data = index.ops.active.get(interaction.guildId);
        if (!data) {
            interaction.reply("There are currently no songs in the queue!");
        }
        else if (data.queue) {
            var fields = [];
            var length = data.queue.length > MAX_QUEUE ? MAX_QUEUE : data.queue.length;
            for (i = 1; i < length; i++) {
                fields.push({
                    'name': i + ". " + data.queue[i].songTitle + " `[" + data.queue[i].duration + "]`",
                    'value': "Requested by: " + data.queue[i].requester.toString(),
                })
            }
            var l = ""
            if (data.queue[0].looped) {
                if (data.queue[0].looped == 1) {
                    l = " 🔁"
                }
                var embed = {
                    "embed": {
                        "title": "🔊  " + data.queue[0].songTitle + " `[" + data.queue[0].duration + "]`" + l,
                        "description": "Requested by: " + data.queue[0].requester.toString() + 
                                       "\n\n**__Up Next" +
                                       (data.queue.length > MAX_QUEUE ? " (First " + (MAX_QUEUE - 1) + " out of " + (data.queue.length - 1) + ")" : "") + "__**",
                        "url" : data.queue[0].url,
                        "color": index.ops.color,
                        "footer": {
                            "icon_url": index.ops.owner.displayAvatarURL({
                                size: 2048,
                                format: "png"
                            }),
                            "text": "Bot Created by " + index.ops.owner.tag 
                        },
                        "author": {
                            "name": "Queue",
                            "url": "",
                            "icon_url": interaction.client.user.displayAvatarURL({
                                size: 2048,
                                format: "png"
                            }),
                        },
                        "fields": fields
                    
                    }
                }
                interaction.reply({ embeds: [embed.embed] });
            }
        }
    }
}
