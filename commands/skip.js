const { MessageFlags, SlashCommandBuilder } = require("discord.js");
const { RepeatMode } = require('distube')
const voice = require('@discordjs/voice');
module.exports = {
    category: "music",
    info: "Skips the track that is currently playing or to a track at a specified position.",
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the track that is currently playing or to a specified position.")
        .setDMPermission(false)
        .addIntegerOption(option =>
            option.setName("track")
                .setDescription("The track to skip to.")
                .setMinValue(1)
        ),
    async execute(interaction) {
        const index = require("../index.js");
        let queue = interaction.client.distube.getQueue(interaction.guild);
        if (!queue)
            return interaction.reply({ content: "❌ There is currently no music playing in the server!", flags: MessageFlags.Ephemeral });
        if (!interaction.member.voice.channel)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to clear the queue.", flags: MessageFlags.Ephemeral });
        if (interaction.member.voice.channel.id != queue.voiceChannel.id)
            return interaction.reply({ content: "❌ You must be in the same voice channel as me to clear the queue.", flags: MessageFlags.Ephemeral });

        let pos = interaction.options.getInteger("track")
        if (pos) {
            if (queue.songs.length <= pos)
                return interaction.reply({ content: "❌ There is no track in this spot!", flags: MessageFlags.Ephemeral });
            queue.previousSongs = []
            let song = queue.songs[pos]
            await queue.jump(pos)
            interaction.reply("Skipped to **`" + song.name + "`**!")
            if (queue.repeatMode == RepeatMode.QUEUE && pos > 1)
                queue.addToQueue(queue.previousSongs, -1)
        } else {
            if (queue.songs.length > 1)
                queue.skip()
            else
                queue.stop()
            interaction.reply("Skipped!")
        }
        queue.previousSongs = []
        /*let fetched = index.ops.active.get(interaction.guildId);
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
        }*/
    }
}
