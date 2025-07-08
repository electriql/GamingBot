const { InteractionContextType, SlashCommandBuilder } = require("discord.js");
module.exports = {
    category: "fun",
    info: "Makes the bot say anything you would like.",
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Makes the bot say anything you would like.")
        .setContexts(InteractionContextType.Guild)
        .addStringOption(option =>
            option.setName("string")
                .setDescription("The string to send.")
                .setRequired(true)
        ),
    async execute(interaction) {
        interaction.reply(interaction.options.getString("string"));
    }
}