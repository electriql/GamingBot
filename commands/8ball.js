const { InteractionContextType, SlashCommandBuilder } = require('discord.js');
const index = require('../index.js');
const responses = [
    "Most likely.",
    "Of course not.",
    "Yes.",
    "No.",
    "Don't count on it.",
    "Definitely.",
    "Hell yeah.",
    "Hell no.",
    "Maybe.",
    "We'll see."
]
module.exports = {
    category: "fun",
    info: "Answers your yes or no questions.",
    data: new SlashCommandBuilder()
        .setName("8ball")
        .setDescription("Answers your yes or no questions.")
        .setContexts(InteractionContextType.Guild)
        .addStringOption(option =>
            option.setName("message")
                .setDescription("The message to ask the 8 ball.")
                .setRequired(true)
        ),
    async execute(interaction) {
        var index = Math.floor(Math.random() * 10);
        interaction.reply(responses[index]);
    }
}