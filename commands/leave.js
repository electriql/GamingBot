const voice = require('@discordjs/voice');
const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    category: "music",
    info: "Leaves the channel I am currently in.",
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Leaves the channel I am currently in.")
        .setDMPermission(false),
    async execute(interaction) {
        const index = require("../index.js");
        let fetched = index.ops.active.get(interaction.guildId);
        //let connection = voice.getVoiceConnection(interaction.guildId);
        if (interaction.client.distube.voices.has(interaction.guildId)) {
            // if (fetched) {
            //     for (i = 0; i < fetched.queue.length; i++) {
            //         fetched.queue[i].looped = 0;
            //     }
            //     fetched.queue = [];
            //     if (fetched.dispatcher)
            //         fetched.dispatcher.stop();
            //     index.ops.active.delete(interaction.guildId);
            // }
            //connection.destroy()
            interaction.client.distube.voices.leave(interaction.guildId)
            interaction.reply("Successfully Disconnected!")
        }
        else {
            interaction.reply({ content: "❌ I am currently not in a voice channel!", ephemeral: true });
        }
    }
}