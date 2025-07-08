const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require("discord.js");
const voice = require('@discordjs/voice');
module.exports = {
    category: "music",
    info: "Resumes the current track if paused.",
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current track if paused.")
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        let queue = interaction.client.distube.getQueue(interaction.guild)
        if (!queue)
            return interaction.reply({ content: "❌ There is currently no music playing in the server!", flags: MessageFlags.Ephemeral });
        if (!interaction.member.voice.channel)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to pause.", flags: MessageFlags.Ephemeral });
        if (interaction.member.voice.channel.id != queue.voiceChannel.id)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to pause.", flags: MessageFlags.Ephemeral });
        if (!queue.isPaused())
            return interaction.reply({ content: "❌ This track is already playing!", flags: MessageFlags.Ephemeral });
        queue.resume()
            .then(interaction.reply("Succesfully resumed **`" + queue.songs[0].name + "`**!"))
    }
}