const { MessageFlags, SlashCommandBuilder } = require("discord.js");
const voice = require('@discordjs/voice');
module.exports = {
    category: "music",
    info: "Pauses the current track that is playing.",
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current track that is playing.")
        .setDMPermission(false),
    async execute(interaction) {
        let queue = interaction.client.distube.getQueue(interaction.guild)
        if (!queue)
            return interaction.reply({ content: "❌ There is currently no music playing in the server!", flags: MessageFlags.Ephemeral });
        if (!interaction.member.voice.channel)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to pause.", flags: MessageFlags.Ephemeral });
        if (interaction.member.voice.channel.id != queue.voiceChannel.id)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to pause.", flags: MessageFlags.Ephemeral });
        if (queue.isPaused())
            return interaction.reply({ content: "❌ This track is already paused!", flags: MessageFlags.Ephemeral });
        queue.pause()
            .then(interaction.reply("Succesfully paused **`" + queue.songs[0].name + "`**!"))
    }
}