const voice = require('@discordjs/voice');
const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require("discord.js");
module.exports = {
    category: "music",
    info: "Leaves the channel I am currently in.",
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leaves the channel I am currently in.")
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        if (interaction.client.distube.voices.has(interaction.guildId)) {
            interaction.client.distube.voices.leave(interaction.guildId)
            interaction.reply("Successfully Disconnected!")
        }
        else {
            interaction.reply({ content: "❌ I am currently not in a voice channel!", flags: MessageFlags.Ephemeral });
        }
    }
}