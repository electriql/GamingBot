const { SlashCommandBuilder } = require("discord.js");
const voice = require('@discordjs/voice');
module.exports = {
    category: "music",
    info: "Skips the track that is currently playing or to a track at a specified position.",
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the track that is currently playing.")
        .setDMPermission(false)
        .addIntegerOption(option =>
            option.setName("track")
                .setDescription("Skip to play the track at the specified position.")
                .setMinValue(1)
        ),
    async execute(interaction) {
        const index = require("../index.js");
        let fetched = index.ops.active.get(interaction.guildId);
        if (fetched) {
            if (interaction.member.voice.channel) {
                if (voice.getVoiceConnection(interaction.guildId)) {
                    if (interaction.member.voice.channel.id == voice.getVoiceConnection(interaction.guildId).joinConfig.channelId) {
                        if (interaction.options.getInteger("track")) {
                            let number = interaction.options.getInteger("track");
                            if (!fetched.queue[number])
                                return interaction.reply({ content: "❌ There is no track in this spot!", ephemeral: true });
                            let target = fetched.queue[number];
                            for (i = 1; i < number; i++) {
                                fetched.queue[0].looped = -1;
                                fetched.queue[0] = {};
                                fetched.queue.shift();
                            }
                            interaction.reply("Skipped to `" + target.songTitle + "`!");
                        }
                        else {
                            interaction.reply("Skipped!");
                        }
                        fetched.queue[0].looped = -1;
                        fetched.dispatcher.unpause();
                        return fetched.dispatcher.stop();
                    }
                    else {
                        interaction.reply({ content: "❌ You must be in the same voice channel as me to skip.", ephemeral: true });
                    }
                }
                else {
                    interaction.reply({ content: "❌ I am not in a voice channel!", ephemeral: true });
                }
            }
            else {
                interaction.reply({ content: "❌You must be in a voice channel to skip!", ephemeral: true })
            }
        }
        else {
            interaction.reply({ content: "❌ There are no tracks to skip!", ephemeral: true });
        }
    }
}
