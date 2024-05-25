const { SlashCommandBuilder } = require("discord.js");
const voice = require('@discordjs/voice');
module.exports = {
    category: "music",
    info: "Resumes the current track if paused.",
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current track if paused.")
        .setDMPermission(false),
    async execute(interaction) {
        const index = require("../index.js");
        let fetched = index.ops.active.get(interaction.guildId);
        if (!fetched)
            return interaction.reply({ content: "❌ There is currently no music playing in the server!", ephemeral: true });
        if (!interaction.member.voice.channel)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to resume.", ephemeral: true });
        if (interaction.member.voice.channel.id != voice.getVoiceConnection(interaction.guildId).joinConfig.channelId)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to resume.", ephemeral: true });
        if (fetched.dispatcher.state.status != 'paused')
            return interaction.reply({ content: "❌ This track is already playing!", ephemeral: true });
        fetched.dispatcher.unpause();
        interaction.reply("Succesfully resumed `" + fetched.queue[0].songTitle + "`!");
    }
}