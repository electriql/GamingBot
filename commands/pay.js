const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    category: "currency",
    info: "Gives a user a specified amount of diamonds.",
    data: new SlashCommandBuilder()
        .setName("pay")
        .setDescription("Gives a user a specified amount of diamonds.")
        .setDMPermission(false)
        .addUserOption(option =>
            option.setName("user")
                .setDescription("The user to be paid.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("payment")
                .setDescription("The amount to be paid.")
                .setMinValue(1)
                .setRequired(true)
        ),
    async execute(interaction) {
        const index = require("../index.js");
        var sender = interaction.user;
        var receiver = interaction.options.getUser("user");
        if (receiver.bot || sender == receiver)
            return interaction.reply({ content: "❌ This user isn't valid!", ephemeral: true });
        var userData = index.getUserData();
        if (!userData[sender.id]) {
            userData[sender.id] = index.createUser(sender.id);
            index.setUserData(userData);
        }
        if (!userData[receiver.id]) {
            userData[receiver.id] = index.createUser(receiver.id);
            index.setUserData(userData);
        }
        var pay = interaction.options.getInteger("payment");
        if (userData[sender.id].diamonds - pay < 0)
            return interaction.reply("❌ You can't afford this payment!");
        userData[sender.id].diamonds -= pay;
        userData[receiver.id].diamonds += pay;
        index.setUserData(userData);
        interaction.reply("Payment successful! Now you have 💎x" + userData[sender.id].diamonds + " and " + receiver.username + " has 💎x" + userData[receiver.id].diamonds);
    }
}