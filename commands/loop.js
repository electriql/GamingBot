const { MessageFlags, SlashCommandBuilder } = require("discord.js");
const { RepeatMode } = require("distube")
module.exports = {
    category: "music",
    info: "Loops the currently playing track.",
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Loop the current track, the whole queue, or nothing.")
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName("mode")
                .setDescription("The looping setting.")
                .addChoices(
                    { name : "queue", value : "queue" },
                    { name : "song", value : "song" },
                    { name : "none", value : "none" }
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const index = require("../index.js");
        let queue = interaction.client.distube.getQueue(interaction.guild)
        if (!queue)
            return interaction.reply({ content: "❌ There is currently no music playing in the server!", flags: MessageFlags.Ephemeral });
        if (interaction.member.voice.channel.id != queue.voiceChannel.id)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to skip.", flags: MessageFlags.Ephemeral });

        queue.setRepeatMode(RepeatMode.DISABLED)
        switch (interaction.options.getString("mode")) {
            case "none":
                interaction.reply("Looping disabled!")
                break;
            case "queue":
                queue.setRepeatMode(RepeatMode.QUEUE)
                interaction.reply("The whole queue will now be looped!")
                break;
            default:
                queue.setRepeatMode(RepeatMode.SONG)
                interaction.reply("**`" + queue.songs[0].name + "`** will now be looped!")
                break;
        }
    }
}