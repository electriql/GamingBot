const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags, SlashCommandBuilder } = require("discord.js");
const emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
module.exports = {
    category: "music",
    info: "Gives a list of up to 10 tracks you can choose to play.",
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("Gives a list of up to 10 tracks you can choose to play.")
        .setDMPermission(false)
        .addSubcommand(subcommand => 
            subcommand.setName("youtube")
            .setDescription("Search with YouTube.")
            .addStringOption(option => 
                option.setName("keywords")
                .setDescription("The keywords for a YouTube search.")
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => 
            subcommand.setName("soundcloud")
            .setDescription("Search with SoundCloud.")
            .addStringOption(option => 
                option.setName("keywords")
                .setDescription("The keywords for a SoundCloud search.")
                .setRequired(true)
            )
        ),
    async execute(interaction) {
        const index = require("../index.js")

        var vc = interaction.member.voice.channel
        if (!vc)
            return interaction.reply({ content: "❌ You must be in a voice channel!", flags: MessageFlags.Ephemeral });

        let plugin = interaction.options.getSubcommand() == "youtube" ?
            index.ytplugin : 
            index.scplugin

        var args = interaction.options.getString("keywords");
        try {
            var tracks = await plugin.search(args)
        } catch (e) {
        console.log(e)
            return interaction.reply({ content: "❌ No results found!", flags: MessageFlags.Ephemeral });
        }
        tracks = tracks.slice(0, 5)

        var ents = []
        var buttons = []
        for (i = 0; i < tracks.length; i++) {
            let length = tracks[i].formattedDuration;
            ents.push({
                'name': (i+1) + ". " + "`[" + length + "]` " + tracks[i].name,
                'value': "📽️ " + tracks[i].uploader.name,
            })

            buttons.push(new ButtonBuilder()
                .setCustomId(i.toString())
                .setLabel((i+1).toString())
                .setStyle(ButtonStyle.Primary)
            )
        }

        var icon;
        await interaction.client.guilds.fetch(process.env.DEV_GUILD).then(guild => {
            icon = guild.emojis.cache.find(emoji => emoji.name == interaction.options.getSubcommand())
        })

        const menu = new EmbedBuilder().setColor(index.ops.color)
            .setTitle(`${icon}  Top ` + ents.length + " Results: \"" + args + "\"")
            .setDescription("### Choose a track:")
            .setFooter({
                iconURL: index.ops.owner.displayAvatarURL({
                    size: 2048,
                    format: "png"
                }),
                text: "Bot Created by " + index.ops.owner.tag
            })
            .setAuthor({
                name: "Searching " + (interaction.options.getSubcommand() == "youtube" ? "YouTube" : "SoundCloud") + "...",
                iconURL: interaction.client.user.displayAvatarURL({
                    size: 2048,
                    format: "png"
                }),
            })
            .setFields(ents)
        const msg = await interaction.reply({
            embeds: [menu],
            components: buttons.length == 0 ? [] : [new ActionRowBuilder().addComponents(buttons)],
            flags: MessageFlags.Ephemeral
        });

        if (buttons.length > 0) {
            const collector = msg.createMessageComponentCollector();
            collector.on('collect', async push => {
                let i = parseInt(push.customId);
                interaction.client.distube.play(vc, tracks[i], {
                    member: interaction.member,
                    metadata: {
                        bot_owner: index.ops.owner,
                        interaction: interaction,
                        editReply: false
                    },
                    textChannel: interaction.channel
                }).catch((e) => {
                    console.log(e)
                    return interaction.editReply({ content: "❌ An error occurred.", flags: MessageFlags.Ephemeral });
                })
                buttons.forEach(button => button.setDisabled(true))
                buttons[i].setStyle(ButtonStyle.Success)
                push.update({
                    embeds: [menu],
                    components: buttons.length == 0 ? [] : [new ActionRowBuilder().addComponents(buttons)],
                    flags: MessageFlags.Ephemeral
                })
                collector.stop()
            })
        }
        /*
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
            
        });*/
    }
}
function secondsToHms(d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}