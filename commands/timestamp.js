const { InteractionContextType, SlashCommandBuilder } = require("discord.js");
module.exports = {
    category: "misc",
    info: "Gives the timestamp of you or the specifed user. (In PT)",
    data: new SlashCommandBuilder()
        .setName("timestamp")
        .setDescription("Gives the timestamp of you or the specifed user. (In PT)")
        .setContexts(InteractionContextType.Guild)
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user whose timestamp will be shown.")
        ),
    async execute(interaction) {
        const user = interaction.options.getUser("user") || interaction.user;
        try {
            var date = user.createdAt;
            var converted = date.toLocaleString("en-US", {timeZone: "America/Los_Angeles"})
            interaction.reply("**" + user.username + "'s** account was created on **" + converted + " (PT)**");
        }
        catch(e) {
            console.log(e);
            interaction.reply("❌ That user is invalid!")
        }
    }
}