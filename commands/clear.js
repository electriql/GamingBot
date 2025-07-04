const { MessageFlags, SlashCommandBuilder } = require("discord.js");
const voice = require('@discordjs/voice');
module.exports = {
    category: "music",
    info: "Clears all the tracks in the music queue.",
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clears all the tracks in the music queue.")
        .setDMPermission(false),
    async execute(interaction) {
        const index = require("../index.js");
        let queue = interaction.client.distube.getQueue(interaction.guild);
        if (!queue)
            return interaction.reply({ content: "❌ There is currently no music playing in the server!", flags: MessageFlags.Ephemeral });
        if (!interaction.member.voice.channel)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to clear the queue.", flags: MessageFlags.Ephemeral });
        if (interaction.member.voice.channel.id != queue.voiceChannel.id)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to clear the queue.", flags: MessageFlags.Ephemeral });
        queue.stop()
            .then(interaction.reply("Successfully cleared the queue!"));
    }
}