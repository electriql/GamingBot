const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require("discord.js");
module.exports = {
    category: "music",
    info: "Plays a specified track if in a voice channel.",
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a specified SoundCloud track if in a voice channel.")
        .setContexts(InteractionContextType.Guild)
        .addStringOption(option =>
            option.setName("media")
                .setDescription("Enter keywords to search or a URL.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const index = require("../index.js");
        var vc = interaction.member.voice.channel
        if (!vc)
            return interaction.reply({ content: "❌ You must be in a voice channel!", flags: MessageFlags.Ephemeral });
        var args = interaction.options.getString("media")
        if (!interaction.replied)
            await interaction.deferReply();
        interaction.client.distube.play(vc, args, {
            member: interaction.member,
            metadata: {
                bot_owner: index.ops.owner,
                interaction: interaction,
                editReply: true 
            },
            textChannel: interaction.channel
        }).catch((e) => {
            console.log(e)
            return interaction.editReply({ content: "❌ No results found!", flags: MessageFlags.Ephemeral });
        })
    }   
}

