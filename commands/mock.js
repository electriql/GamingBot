const { InteractionContextType, SlashCommandBuilder } = require("discord.js");
const Utils = require("../util.js");
exports.category = "fun";
exports.info = "Mocks the given string!"
module.exports = {
    category: "fun",
    info: "Mocks the given string.",
    data: new SlashCommandBuilder()
        .setName("mock")
        .setDescription("Mocks the given string.")
        .setContexts(InteractionContextType.Guild)
        .addStringOption(option =>
            option.setName("string")
                .setDescription("The string to be mocked.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("style")
                .setDescription("Choose the style of mockery.")
                .setRequired(true)
                .addChoices(
                    { name: "oPtIoN oNe", value: "1" },
                    { name: "OpTiOn TwO", value: "2" }
                )
        ),
    async execute(interaction) {
        let utils = new Utils();
        let output = ""
        var lower = interaction.options.getString("style") == "1" ? true : false;
        for (const letter of interaction.options.getString("string")) {
            if (letter.toLowerCase() != letter.toUpperCase()) {
                output += lower ? letter.toLowerCase() : letter.toUpperCase();
                lower = !lower;
            }
            else {
                output += letter;
            }
        }
        output = output + " ";
        output = await utils.insertEmotes(output, interaction.client);
        interaction.reply(output);
    }
}