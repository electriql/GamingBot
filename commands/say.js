const { SlashCommandBuilder } = require("discord.js");
const Utils = require("../util.js");
module.exports = {
    category: "fun",
    info: "Makes the bot say anything you would like.",
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Makes the bot say anything you would like.")
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName("string")
                .setDescription("The string to send.")
                .setRequired(true)
        ),
    async execute(interaction) {
        let utils = new Utils();
        let str = await utils.insertEmotes(interaction.options.getString("string"), interaction.client)
        interaction.reply(str);
    }
}