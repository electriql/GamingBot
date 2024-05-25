const { SlashCommandBuilder } = require("discord.js");
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
        let fetched = index.ops.active.get(interaction.guildId);
        if (!fetched)
            return interaction.reply({ content: "❌ There is currently no music playing in the server!", ephemeral: true });
        if (!interaction.member.voice.channel)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to clear the queue.", ephemeral: true });
        if (interaction.member.voice.channel.id != voice.getVoiceConnection(interaction.guildId).joinConfig.channelId)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to clear the queue.", ephemeral: true });
        fetched.queue.length = 0;
        fetched.dispatcher.stop();
        index.ops.active.set(interaction.guildId, fetched);
        index.ops.active.delete(interaction.guildId);
        interaction.reply("Successfully cleared the queue!");
    }
}