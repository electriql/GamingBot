const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    category: "misc",
    info: "Makes a poll of up to 10 options.",
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Makes a poll of up to 10 options.")
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName("question")
                .setDescription("The question in question.")
                .setMaxLength(256)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("option1")
                .setDescription("The first option.")
                .setMaxLength(400)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("option2")
                .setDescription("The second option.")
                .setMaxLength(400)
        )
        .addStringOption(option =>
            option.setName("option3")
                .setDescription("The third option.")
                .setMaxLength(400)
        )
        .addStringOption(option =>
            option.setName("option4")
                .setDescription("The fourth option.")
                .setMaxLength(400)
        )
        .addStringOption(option =>
            option.setName("option5")
                .setDescription("The fifth option.")
                .setMaxLength(400)
        )
        .addStringOption(option =>
            option.setName("option6")
                .setDescription("The sixth option.")
                .setMaxLength(400)
        )
        .addStringOption(option =>
            option.setName("option7")
                .setDescription("The seventh option.")
                .setMaxLength(400)
        )
        .addStringOption(option =>
            option.setName("option8")
                .setDescription("The eighth option.")
                .setMaxLength(400)
        )
        .addStringOption(option =>
            option.setName("option9")
                .setDescription("The ninth option.")
                .setMaxLength(400)
        )
        .addStringOption(option =>
            option.setName("option10")
                .setDescription("The tenth option.")
                .setMaxLength(400)
        ),
    async execute(interaction) {
        const index = require("../index.js");
        var emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
        var options = [interaction.options.getString("question")];
        for (i = 1; i <= 10; i++)
            if (interaction.options.getString("option" + i))
                options.push(interaction.options.getString("option" + i));
        var list = "";
        for (i = 1; i < options.length; i++) {
            if (i > 10) break;
            else list += emotes[i - 1] + " " + options[i] + "\n";
        }
        const poll = {
            "embed": {
                "title": options[0],
                "description": list,
                "color": index.ops.color,
                "author": {
                    "name": interaction.member.displayName,
                    "url": "",
                    "icon_url": interaction.user.displayAvatarURL({
                        size: 2048,
                        format: "png"
                    })
                },
            }
        }
        interaction.channel.send({ embeds: [poll.embed] }).then(msg => {
            for (i = 0; i < options.length - 1; i++) {
                msg.react(emotes[i]);
            }
        });
        interaction.reply({ content: "Success!", ephemeral: true })
    }
}