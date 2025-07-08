const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require("discord.js");
const symbols = ["⭕", "🔵", "🔶", "⬜", "❤", "🔺", "💠", "🔻"];
module.exports = {
    category: "currency",
    info: "Gamble some diamonds in a slot machine!",
    data: new SlashCommandBuilder()
        .setName("slots")
        .setDescription("Gamble some diamonds in a slot machine!")
        .setContexts(InteractionContextType.Guild)
        .addIntegerOption(option => 
            option.setName("amount")
                .setDescription("The amount to be gambled. (Leave out to gamble all diamonds)")
                .setMinValue(1)
        ),
    async execute(interaction) {
        const index = require("../index.js");
        var user = interaction.user;
        var userData = index.getUserData();
        if (!userData[user.id]) {
            userData[user.id] = index.createUser(user.id);
            index.setUserData(userData);
        }
        var cooldown = index.ops.cooldown.get(user.id) || {};
        if (cooldown.slots)
            return interaction.reply({ content: "❌ You can use this command again in **" + Math.round(cooldown.slots * 100) / 100 + "** seconds!", flags: MessageFlags.Ephemeral })
        var pay = interaction.options.getInteger("amount") || userData[user.id].diamonds;
        cooldown.slots = 5;
        index.ops.cooldown.set(user.id, cooldown);
        if (userData[user.id].diamonds < pay || userData[user.id].diamonds == 0)
            return interaction.reply({ content: "❌ You can't afford to pay this many diamonds!", flags: MessageFlags.Ephemeral });
        var chance = Math.random();
        var slots = [];
        var result = [];
        var multiplier = Math.floor((Math.random() * 15) + 15) / 10;
        slots.push([symbols[Math.floor(Math.random() * symbols.length)],
                    symbols[Math.floor(Math.random() * symbols.length)],
                    symbols[Math.floor(Math.random() * symbols.length)]
                    ]);
        if (chance <= 4 / 13) {
            var middle = symbols[Math.floor(Math.random() * symbols.length)];
            slots.push([middle, middle, middle]);
            var prize = Math.round(multiplier * pay);
            userData[user.id].diamonds += prize;
            result.push(
                {
                    "name": "==========================",
                    "value": "**And you win! You get 💎x" + prize + "! Also, you get your 💎x" + pay + " back.**"
                },
                {
                    "name": "Prize Multiplier: " + multiplier + "x",
                    "value": "**Total Diamonds: " + userData[user.id].diamonds + "**"
                }
            )
        }
        else {
            userData[user.id].diamonds -= pay;
            var middle1 = symbols[Math.floor(Math.random() * symbols.length)];
            var middle2 = symbols[Math.floor(Math.random() * symbols.length)];
            var middle3 = symbols[Math.floor(Math.random() * symbols.length)];
            while (middle1 == middle2 && middle2 == middle3) {
                var middle1 = symbols[Math.floor(Math.random() * symbols.length)];
                var middle2 = symbols[Math.floor(Math.random() * symbols.length)];
                var middle3 = symbols[Math.floor(Math.random() * symbols.length)];
            }
            slots.push([middle1, middle2, middle3]);
            result.push(
                {
                    "name": "==========================",
                    "value": "**And you lose. Better luck next time.**"
                },
                {
                    "name": "Your Prize Multiplier would have been " + multiplier + "x",
                    "value": "**Total Diamonds: " + userData[user.id].diamonds + "**"
                }
            )
        }
        slots.push([symbols[Math.floor(Math.random() * symbols.length)],
                    symbols[Math.floor(Math.random() * symbols.length)],
                    symbols[Math.floor(Math.random() * symbols.length)]
                    ]);
        var display = [
            {
                "name": "==========================",
                "value": "| " + slots[0][0] + " | " + slots[0][1] + " | " + slots[0][2] + " |"
            },
            {
                "name": "==========================",
                "value": "| " + slots[1][0] + " | " + slots[1][1] + " | " + slots[1][2] + " | <<<"
            },
            {
                "name": "==========================",
                "value": "| " + slots[2][0] + " | " + slots[2][1] + " | " + slots[2][2] + " |"
            }
        ].concat(result);
        const embed = {
            "embed": {
                "title": "Slot Machine",
                "description": "**You spend 💎x" + pay + " on the slot machine...**",
                "color": index.ops.color,
                "fields": display
            }
        }
        interaction.reply({ embeds: [embed.embed] })
        index.setUserData(userData);
    }
}