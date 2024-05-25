const { SlashCommandBuilder } = require("discord.js");
const voice = require('@discordjs/voice');
module.exports = {
    category: "music",
    info: "Pauses the current track that is playing.",
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current track that is playing.")
        .setDMPermission(false),
    async execute(interaction) {
        const index = require("../index.js");
        let fetched = index.ops.active.get(interaction.guildId);
        if (!fetched)
            return interaction.reply({ content: "❌ There is currently no music playing in the server!", ephemeral: true });
        if (!interaction.member.voice.channel)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to pause.", ephemeral: true });
        if (interaction.member.voice.channel.id != voice.getVoiceConnection(interaction.guildId).joinConfig.channelId)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to pause.", ephemeral: true });
        if (fetched.dispatcher.state.status == 'paused')
            return interaction.reply({ content: "❌ This track is already paused!", ephemeral: true });
        fetched.dispatcher.pause();
        interaction.reply("Succesfully paused `" + fetched.queue[0].songTitle + "`!")
    }
}