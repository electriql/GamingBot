const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, SlashCommandBuilder } = require("discord.js");
const entries = 10;
module.exports = {
    category: "currency",
    info: "Shows the richest people in the server.",
    data: new SlashCommandBuilder()
        .setName("rich")
        .setDescription("Shows the richest people in the server.")
        .addIntegerOption(option =>
            option.setName("page")
                .setDescription("Show the menu at this page number.")
                .setMinValue(1)
        )
        .setDMPermission(false),
    async execute(interaction) {
        const index = require('../index.js');
        var server = interaction.guild;
        let members = [];
        let loops = 0;
        var bots = 0;
        var userData = index.getUserData();
        await server.members.fetch().then(collection => {
            for (const [key, element] of collection) {
                if (!element.user.bot) {
                    let id = element.id;
                    if (!userData[id]) {
                        userData[id] = index.createUser(id);
                        index.setUserData(userData);
                    }
                    members.push({
                        "id": id,
                        "diamonds": userData[id].diamonds
                    });
                    loops++;
                }
                else {
                    bots++;
                }
            }
        });
        var page = interaction.options.getInteger("page") || 1;
        var pages = Math.ceil((server.memberCount - bots) / entries);
        if (page > pages)
            return interaction.reply({ content: "❌ There are only **" + pages + "** page(s)! Not **" + page + "**!", ephemeral: true });
        var rich = members.sort((a, b) => (a.diamonds < b.diamonds) ? 1 : -1);
        const generateEmbed = async page => {
            var str = "** ";
            for (i = entries * (page - 1); i < page * entries; i++) {
                var member = server.members.cache.get(rich[i].id);
                str = str + (i + 1) + ". " + member.user.tag + " - 💎x" + rich[i].diamonds + "\n";
                if (!rich[i + 1]) break;
            }
            var embed = {

                "embed": {

                    "color": index.ops.color,
                    "footer": {
                        "icon_url": index.ops.owner.displayAvatarURL({
                            size: 2048,
                            format: "png"
                        }),
                        "text": "Bot Created by " + index.ops.owner.tag
                    },
                    "author": {
                        "name": "The Richest in " + server.name,
                        "url": "",
                        "icon_url": interaction.client.user.displayAvatarURL({
                            size: 2048,
                            format: "png"
                        }),
                    },
                    "fields": [
                        {
                            "name": "Page " + page + " / " + pages,
                            "value": str + "**"
                        }
                    ]
                }
            }
            return embed;
        }
        const forward = new ButtonBuilder()
            .setCustomId("forward")
            .setLabel('▶')
            .setStyle(ButtonStyle.Primary);
        const back = new ButtonBuilder()
            .setCustomId("back")
            .setLabel('◀')
            .setStyle(ButtonStyle.Primary);
        var buttons = new ActionRowBuilder();
        var buttons = [];
        if (page > 1)
            buttons.push(back);
        if (page < pages)
            buttons.push(forward);
        const msg = await interaction.reply({
            embeds: [(await generateEmbed(page)).embed],
            components: buttons.length == 0 ? [] : [new ActionRowBuilder().addComponents(buttons)]
        });
        if (buttons.length > 0) {
            const collector = msg.createMessageComponentCollector();
            collector.on('collect', async push => {
                push.customId === "back" ? (page--) : (page++);
                var buttons = [];
                if (page > 1)
                    buttons.push(back);
                if (page < pages)
                    buttons.push(forward);
                await push.update({
                    embeds: [(await generateEmbed(page)).embed],
                    components: buttons.length == 0 ? [] : [new ActionRowBuilder().addComponents(buttons)]
                })
            })
        }
    }
}