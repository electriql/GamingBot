const { SlashCommandBuilder } = require("discord.js");
const voice = require('@discordjs/voice');
module.exports = {
    category: "music",
    info: "Removes the track in a specified spot in the music queue.",
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Removes the track in a specified spot in the msuic queue.")
        .setDMPermission(false)
        .addIntegerOption(option =>
            option.setName("track")
                .setDescription("The position of the track to be removed.")
                .setRequired(true)
                .setMinValue(1)
        ),
    async execute(interaction) {
        const index = require("../index.js");
        let fetched = index.ops.active.get(interaction.guildId);
        if (!fetched)
            return interaction.reply({ content: "❌ There is currently no music playing in the server!", ephemeral: true });
        if (!interaction.member.voice.channel)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to pause.", ephemeral: true });
        if (interaction.member.voice.channel.id != voice.getVoiceConnection(interaction.guildId).joinConfig.channelId)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to pause.", ephemeral: true });
        let number = interaction.options.getInteger("track");
        if (!fetched.queue[number])
            return interaction.reply({ content: "❌ This spot in the queue is not occupied! If you want to see the queue, type `/queue`!", ephemeral: true });
        var removed = fetched.queue.splice(number, 1)[0];
        index.ops.active.set(interaction.guildId, fetched);
        interaction.reply("Successfully Removed `" + removed.songTitle + "` from the queue!");
    }
}