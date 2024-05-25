const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    category: "music",
    info: "Loops the currently playing track.",
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Loops the currently playing track.")
        .setDMPermission(false),
    async execute(interaction) {
        const index = require("../index.js");
        let fetched = index.ops.active.get(interaction.guildId);
        if (!fetched)
            return interaction.reply({ content: "❌ There is currently no music playing in the server!", ephemeral: true });
        fetched.queue[0].looped *= -1;
        var looped = fetched.queue[0].looped == 1 ? "now" : "not";
        return interaction.reply("`" + fetched.queue[0].songTitle + "` will " + looped + " be looped!");
    }
}