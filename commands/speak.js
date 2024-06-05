const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    info: "A command that you aren't supposed to and can't use.",
    data: new SlashCommandBuilder()
        .setName("speak")
        .setDescription("A command that you aren't supposed to and can't use.")
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName("string")
                .setDescription("The string to send.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const index = require("../index.js");
        if (interaction.user == index.ops.owner) {
            await interaction.reply({ content: "hehe", ephemeral: true });
            interaction.deleteReply();
            interaction.channel.send(interaction.options.getString("string"));
        }
        else {
            interaction.reply({ content: "You shouldn't be using this command...", ephemeral: true });
        }
    }
}