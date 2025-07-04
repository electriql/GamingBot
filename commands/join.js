const { SlashCommandBuilder } = require("discord.js");
const voice = require('@discordjs/voice');
exports.category = "music";
exports.info = "I join the channel you are currently in."
module.exports = {
    category: "music",
    info: "I join the channel you are currently in.",
    data: new SlashCommandBuilder()
        .setName("join")
        .setDescription("I join the channel you are currently in.")
        .setDMPermission(false),
    async execute(interaction) {
        const index = require("../index.js");
        if (interaction.member.voice.channel) {
            interaction.client.distube.voices.join(interaction.member.voice.channel)
                .then(interaction.reply("Successfully Joined!"))
            // const connection = voice.joinVoiceChannel({
            //     channelId: interaction.member.voice.channel.id,
            //     guildId: interaction.guildId,
            //     adapterCreator: interaction.guild.voiceAdapterCreator,
            //     selfDeaf: false,
            // })
            // let data = index.ops.active.get(interaction.guildId) || {};
            // if (data.dispatcher)
            //     connection.subscribe(data.dispatcher);
        }
        else {
            interaction.reply({ content: "❌ You must be in a voice channel for me to join!", ephemeral: true });
        }
    }
}
