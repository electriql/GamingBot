const { SlashCommandBuilder } = require("discord.js");
const search = require("yt-search");
const ytdl = require("ytdl-core");
const emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
module.exports = {
    category: "music",
    info: "Gives a list of up to 10 tracks you can choose to play.",
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("Gives a list of up to 10 tracks you can choose to play.")
        .setDMPermission(false)
        .addStringOption(option => 
            option.setName("keywords")
                .setDescription("The keywords used for searching.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const index = require("../index.js");
        await interaction.deferReply();
        var args = interaction.options.getString("keywords");
        search(args, function(err, res) {
            if (err) {
                console.log(err);
                return interaction.editReply({ content: "❌ An error occurred." });
            }
            
            try {
                if (ytdl.validateURL(res.videos[0].url)) res.videos.splice(0, 1);
            }
            catch (e) {
                console.log(e);
                return interaction.editReply({ content: "❌ An error occurred.", ephemeral: true });
            }
            let videos = res.videos.slice(0, 10);
    
            let resp = [];
            var choices = [];

            for (var i in videos) {
                let length = videos[i].duration.timestamp;
                choices.push(emotes[parseInt(i)]);
                resp.push({
                    'name': emotes[parseInt(i)] + " " + videos[i].title + " `[" + length + "]`",
                    'value': "📽️ " + videos[i].author.name,
                })
            }
            var x = {
                "embed": {
                    "title": "🔎 Top " + choices.length + " Results: \"" + args + "\"",
                    "description": "Choose by reacting to the corresponding choice or ❌ to cancel.",
                    "url" : "",
                    "color": index.ops.color,
                    "footer": {
                        "icon_url": index.ops.owner.displayAvatarURL({
                            size: 2048,
                            format: "png"
                        }),
                        "text": "Bot Created by " + index.ops.owner.tag
                    },
                    "author": {
                        "name": "Searching...",
                        "url": "",
                        "icon_url": interaction.client.user.displayAvatarURL({
                            size: 2048,
                            format: "png"
                        }),
                    },
                    "fields": resp
                }
            }
    
            interaction.editReply({ embeds: [x.embed], ephemeral: true })
                       .then(async function(msg) {
                for (i = 0; i < choices.length; i++) {
                    msg.react(choices[i]);
                }
                msg.react("❌");
                const filter = (reaction, user) => {
                    return (choices.some(element => element == reaction.emoji.name) ||
                            reaction.emoji.name == "❌") && user.id == interaction.user.id;
                }
                const collector = msg.createReactionCollector({ filter: filter });
    
                collector.videos = videos;
    
                collector.once('collect', async function(reaction, user) {
                    msg.reactions.removeAll();
                    if (reaction == "❌") {
                        interaction.editReply({ content: "Canceled!", embeds: [] });
                        return;
                    }
                    else {
                        let index = choices.findIndex(element => element == reaction);
                        let play = require('./play.js');
                        let link = this.videos[index].url;
                        play.playUrl(interaction, link);
                    }
                });
            });
            
        });
    }
}
function secondsToHms(d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}