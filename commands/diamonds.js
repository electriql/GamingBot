const { InteractionContextType, SlashCommandBuilder } = require("discord.js");
module.exports = {
    category: "currency",
    info: "Shows how many diamonds you or a specified user currently has.",
    data: new SlashCommandBuilder()
        .setName("diamonds")
        .setDescription("Shows how many diamonds you or a specified user currently has.")
        .setContexts(InteractionContextType.Guild)
        .addUserOption(option => 
            option.setName("user")
                .setDescription("The user whose diamonds will be shown.")
        ),
    async execute(interaction) {
        const index = require('../index.js');
        var userData = index.getUserData();
        var user = interaction.options.getUser("user") || interaction.user;
        if (!userData[user.id]) {
            userData[user.id] = index.createUser();
            index.setUserData(userData);
        }
        interaction.reply("**" + user.username + "** has 💎x" + userData[user.id].diamonds + "!");
    }
}
