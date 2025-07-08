const { MessageFlags, SlashCommandBuilder } = require("discord.js");
const fs = require('fs');
module.exports = {
    category: "misc",
    info: "Brings up the list of available commands.",
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Brings up the list of available commands.")
        .addStringOption(option =>
            option.setName("command")
                .setDescription("Information on a specific command.")
        ),
    async execute(interaction) {
        const index = require("../index.js");
        if (interaction.options.getString("command")) {
            var commandFile = interaction.options.getString("command");
            try {
                if (fs.existsSync(__dirname + "/" + commandFile + ".js")) {
                    let command = require(__dirname + "/" + commandFile + ".js");
                    return interaction.reply({ content: "`/" + commandFile + "` - " + command.info, flags: MessageFlags.Ephemeral });
                }
                else
                    return interaction.reply({ content: "❌ That command doesn't exist!", flags: MessageFlags.Ephemeral})
            }
            catch (e) {
                console.log(e.stack);
            }
        }
        var categories = new Map();
        const commandFiles = fs.readdirSync(__dirname).filter(file =>
            file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = __dirname + "/" + file;
            const command = require(filePath);
            const fileName = file.slice(0, file.lastIndexOf('.'));
            if ('data' in command && 'execute' in command) {
                if (command.category) {
                    let list = categories.get(command.category) || "";
                    categories.set(command.category, list + "`" + fileName + "`,");
                }
            }
        }
        var fields = [];
        for (const [key, value] of categories.entries()) {
            var formattedKey = "__**" + key.charAt(0).toUpperCase() + key.slice(1) + "**__"
            fields.push({
                "name": formattedKey,
                "value": value.slice(0, value.lastIndexOf(","))
            });
        }
        fields.push({
            "name": "**More features to come!**",
            "value": "Send me your suggestions so new features come out sooner!"
        });
        const help = {
            embed: {
                "title": "__**Commands**__",
                "description": "**Type `/help <command>` to see what each command does!**",
                "color": index.ops.color,
                "footer": {
                    "icon_url": index.ops.owner.displayAvatarURL({
                        size: 2048,
                        format: "png"
                    }),
                    "text": "Bot Created by " + index.ops.owner.tag
                },
                "author": {
                    "name": "Bot Information",
                    "url": "",
                    "icon_url": interaction.client.user.displayAvatarURL({
                        size: 2048,
                        format: "png"
                    }),
                },
                "fields": fields
            }
        }
        interaction.reply({ embeds: [help.embed], flags: MessageFlags.Ephemeral })
    }
}




