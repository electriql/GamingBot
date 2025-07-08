const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, InteractionContextType, MessageFlags, SlashCommandBuilder } = require("discord.js");
const emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
module.exports = {
    category: "music",
    info: "Gives a list of up to 10 tracks you can choose to play.",
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("Gives a list of up to 5 SoundCloud tracks you can choose to play.")
        .setContexts(InteractionContextType.Guild)
        .addStringOption(option => 
            option.setName("keywords")
            .setDescription("The keywords for a SoundCloud search.")
            .setRequired(true)
        ),
    async execute(interaction) {
        const index = require("../index.js")

        var vc = interaction.member.voice.channel
        if (!vc)
            return interaction.reply({ content: "❌ You must be in a voice channel!", flags: MessageFlags.Ephemeral });

        var args = interaction.options.getString("keywords");
        try {
            var tracks = await index.scplugin.search(args)
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
            icon = guild.emojis.cache.find(emoji => emoji.name == "soundcloud")
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
                name: "Searching SoundCloud...",
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
                interaction.deleteReply()
            })
        }
    }
}