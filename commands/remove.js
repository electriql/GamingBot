const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require("discord.js");
const voice = require('@discordjs/voice');
module.exports = {
    category: "music",
    info: "Removes the track in a specified spot in the music queue.",
    data: new SlashCommandBuilder()
        .setName("remove")
        .setDescription("Removes the track in a specified spot in the msuic queue.")
        .setContexts(InteractionContextType.Guild)
        .addIntegerOption(option =>
            option.setName("track")
                .setDescription("The position of the track to be removed.")
                .setRequired(true)
                .setMinValue(1)
        ),
    async execute(interaction) {
        const index = require("../index.js");
        const queue = interaction.client.distube.getQueue(interaction.guild)
        if (!queue)
            return interaction.reply({ content: "❌ There is currently no music playing in the server!", flags: MessageFlags.Ephemeral });
        if (!interaction.member.voice.channel)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to pause.", flags: MessageFlags.Ephemeral });
        if (interaction.member.voice.channel.id != queue.voiceChannel.id)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to pause.", flags: MessageFlags.Ephemeral });
        let number = interaction.options.getInteger("track");
        if (!queue.songs[number])
            return interaction.reply({ content: "❌ This spot in the queue is not occupied! If you want to see the queue, type `/queue`!", flags: MessageFlags.Ephemeral });
        let removed = queue.songs.splice(number, 1)[0];
        interaction.reply("Successfully Removed **`" + removed.name + "`** from the queue!");
    }
}