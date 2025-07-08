const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require("discord.js");
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

exports.category = "currency";
exports.info = "Gives your daily 100 diamonds. Obtainable once every 24 hours."
module.exports = {
    category: "currency",
    info: "Gives your daily 100 diamonds. Obtainable once every 24 hours.",
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Gives your daily 100 diamonds. Obtainable once every 24 hours.")
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const index = require("../index.js");
        var date = new Date();
        var time = date.getTime();
        var user = interaction.user;
        var userData = index.getUserData();
        if (!userData[user.id]) {
            userData[user.id] = index.createUser();
            index.setUserData(userData);
        }
        var daily = userData[user.id].daily;
        var diff = (daily + HOUR * 24) - time;
        if (diff <= 0) {
            userData[user.id].diamonds += 100;
            userData[user.id].daily = time;
            interaction.reply("You have received your daily 💎x100!");
            index.setUserData(userData);
        }
        else {
            var milis = diff % HOUR % MINUTE % SECOND;
            var seconds = Math.floor((diff % HOUR % MINUTE) / SECOND);
            var minutes = Math.floor((diff % HOUR) / MINUTE);
            var hours = Math.floor(diff / HOUR);
            var fracSec = Math.floor((milis / SECOND) * 100) / 100;
            var output = "❌ You have already received your daily reward! You can receive it again in " +
                         "**" + hours + "**h **" + minutes + "**m **" + (seconds + fracSec) + "**s!";
            interaction.reply({ content: output, flags: MessageFlags.Ephemeral });
        }
    }
}