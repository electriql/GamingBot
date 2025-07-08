const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require("discord.js");
const voice = require('@discordjs/voice');
exports.category = "music";
exports.info = "I join the channel you are currently in."
module.exports = {
    category: "music",
    info: "I join the channel you are currently in.",
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("I join the channel you are currently in.")
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const index = require("../index.js");
        if (interaction.member.voice.channel) {
            interaction.client.distube.voices.join(interaction.member.voice.channel)
                .then(interaction.reply("Successfully Joined!"))
        }
        else {
            interaction.reply({ content: "❌ You must be in a voice channel for me to join!", flags: MessageFlags.Ephemeral });
        }
    }
}
