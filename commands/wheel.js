const { SlashCommandBuilder } = require("discord.js");
const wsymbol = ["💎", "💠", "🔸", "🔻", "🔴", "⭕", "❌", "🚫"];
module.exports = {
    category: "currency",
    info: "Gamble some diamonds in a wheel of diamonds! Chances are not equal. \n" +
          "__**Rewards**__\n" +
          "💎 = 300% of Bet\n" +
          "💠 = 200% of Bet\n" +
          "🔸 = 100% of Bet\n" +
          "🔻 = 75% of Bet\n" +
          "🔴 = 50% of Bet\n" +
          "⭕ = 25% of Bet\n" +
          "❌ = 12.5% of Bet\n" +
          "🚫 = Nothing!",
    data: new SlashCommandBuilder()
        .setName("wheel")
        .setDescription("Gamble some diamonds in a wheel of diamonds! Chances are not equal.")
        .setDMPermission(false)
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("The amount to be gambled. (Leave out to gamble all diamonds)")
                .setMinValue(8)
        ),
    async execute(interaction) {
        const index = require("../index.js");
        var user = interaction.user;
        var cooldown = index.ops.cooldown.get(user.id) || {};
        if (cooldown.wheel)
            return interaction.reply({ content: "❌ You can use this command again in **" + Math.round(cooldown.wheel * 100) / 100 + "** seconds!", ephemeral: true })
        var userData = index.getUserData();
        if (!userData[user.id]) {
            userData[user.id] = index.createUser(user.id);
            index.setUserData(userData);
        }
        var pay = interaction.options.getInteger("amount") || userData[user.id].diamonds;
        var diamonds = userData[user.id].diamonds;
        if (diamonds < pay || pay < 8)
            return interaction.reply({ content: "❌ You can't afford to pay this many diamonds!", ephemeral: true });
        cooldown.wheel = 10;
        index.ops.cooldown.set(user.id, cooldown);
        var chance = Math.random();
        if (chance <= 0.2195) reward = Math.round(Math.random());
        else reward = Math.round(Math.random() * 5 + 2);
        var slots = {};
        var slot = reward;
        for (i = 0; i < wsymbol.length; i++) {
            if (slot >= wsymbol.length)
                slot = 0;
            slots[i] = slot;
            slot++;
        }
        var d = "";
        var multiplier = 0;
        var result = 0;
        if (reward == 0) {
            result = diamonds + Math.round(pay * 2);
            d = "Jackpot! You get 💎x" + Math.round(pay * 2) + " and your initial 💎x" + pay + "!";
            multiplier = 3;
        }
        else if (reward == 1) {
            result = diamonds + pay;
            d = "Nice! You got 💎x" + pay + " and your initial 💎x" + pay + "!";
            multiplier = 2;
        }
        else if (reward == 2) {
            result = diamonds;
            d = "So close! You only get your initial 💎x" + pay + "!";
            multiplier = 1;
        }
        else if (reward == 3) {
            result = diamonds - Math.round(pay * 0.25);
            d = "You only get 💎x" + (pay - Math.round(pay * 0.25)) + " but it could be worse!";
            multiplier = 0.75;
        }
        else if (reward == 4) {
            result = diamonds - Math.round(pay * 0.5);
            d = "You only get 💎x" + (pay - Math.round(pay * 0.5)) + " back.";
            multiplier = 0.5;
        }
        else if (reward == 5) {
            result = diamonds - Math.round(pay * 0.75);
            d = "You only get 💎x" + (pay - Math.round(pay * 0.75)) + " back.";
            multiplier = 0.25;
        }
        else if (reward == 6) {
            result = diamonds - Math.round(pay * 0.875);
            d = "You only get 💎x" + (pay - Math.round(pay * 0.875)) + " back.";
            multiplier = 0.125;
        }
        else if (reward == 7) {
            result = diamonds - pay;
            d = "Unlucky! You don't get anything!";
            multiplier = 0;
        }
        const wheel = {
            "embed": {
                "title": "Wheel of Diamonds",
                "description": "**You spend 💎x" + pay + " on the wheel...**",
                "color": index.ops.color,
                "fields": [
                    {
                        "name": "===================",
                        "value": "᲼᲼▪️🟥⬇️🟥▪️\n" +
                                 "᲼᲼⬜▪️" + wsymbol[slots[0]] + "▪️⬜\n" +
                                 "🟥᲼" + wsymbol[slots[7]] + "᲼▪️᲼" + wsymbol[slots[1]] + "᲼🟥\n" +
                                 "⬜" + wsymbol[slots[6]] + "᲼᲼💿᲼᲼" + wsymbol[slots[2]] + "⬜\n" +
                                 "🟥᲼" + wsymbol[slots[5]] + "᲼▪️᲼" + wsymbol[slots[3]] + "᲼🟥\n" +
                                 "᲼᲼⬜▪️" + wsymbol[slots[4]] + "▪️⬜\n" +
                                 "᲼᲼▪️🟥⬜🟥▪️"
                    },
                    {
                        "name": "===================",
                        "value": "**" + d + "**"
                    },
                    {
                        "name": "Prize Multiplier: " + multiplier + "x",
                        "value": "**Total Diamonds: " + (result) + "**"
                    }

                ]
            }
        }
        userData[user.id].diamonds = result;
        index.setUserData(userData);
        interaction.reply({ embeds: [wheel.embed] });
    }
}