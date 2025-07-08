const { InteractionContextType, SlashCommandBuilder } = require("discord.js");
module.exports = {
    category: "misc",
    info: "Gives the profile picture of you or the specified user.",
    data: new SlashCommandBuilder()
        .setName("pfp")
        .setDescription("Gives the profile picture of you or the specified user.")
        .setContexts(InteractionContextType.Guild)
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user whose profile picture will be shown.")
        ),
    async execute(interaction) {
        const user = interaction.options.getUser("user") || interaction.user;
        try {
            var pfp = user.displayAvatarURL({
            size: 2048,
                format: "png"
            });
            return interaction.reply(pfp);
        }
        catch (e) {
            console.log(e);
            interaction.reply("❌ That user is invalid!")
        }
    }
}