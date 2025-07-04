const { MessageFlags, SlashCommandBuilder } = require("discord.js");
const voice = require('@discordjs/voice');
const search = require("yt-search");
const YTDL = require('distube');
module.exports = {
    category: "music",
    info: "Plays a specified track if in a voice channel.",
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a specified track if in a voice channel.")
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName("media")
                .setDescription("Enter keywords to search or a URL.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const index = require("../index.js");
        var vc = interaction.member.voice.channel
        if (!vc)
            return interaction.reply({ content: "❌ You must be in a voice channel!", flags: MessageFlags.Ephemeral });
        var args = interaction.options.getString("media")
        if (!interaction.replied)
            await interaction.deferReply();
        interaction.client.distube.play(vc, args, {
            member: interaction.member,
            metadata: {
                bot_owner: index.ops.owner,
                interaction: interaction,
                editReply: true 
            },
            textChannel: interaction.channel
        }).catch((e) => {
            console.log(e)
            return interaction.editReply({ content: "❌ No results found!", flags: MessageFlags.Ephemeral });
        })

        // if (!YTDL.validateURL(args)) {
        //     const list = await search(args);
        //     args = await list.videos[0].url;
        // }
        // this.playUrl(interaction, args);
    },
    async playUrl(interaction, args) {
        const index = require("../index.js");
        try {
            YTDL.validateURL(args);
        }
        catch (e) {
            console.log(e);
            return interaction.editReply({ content: "❌ An error occurred.", ephemeral: true });
        }
        let data = index.ops.active.get(interaction.guildId) || {};

        if (!data.connection) data.connection = voice.joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false,
        })
        if (!data.queue) {
            data.queue = [];
        }

        data.guildID = interaction.guildId;
        let info = await YTDL.getInfo(args);
        let length = secondsToHms(info.videoDetails.lengthSeconds);

        data.queue.push({
            songTitle: info.videoDetails.title,
            url: args.toString(),
            announceChannel: interaction.channel.id,
            requester: interaction.user,
            duration: length,
            looped: -1,
        });
        if (!data.dispatcher) {
            play(interaction.client, index.ops, data, interaction, true);
        }
        else {
            var embed1 = {
                "embed": {
                    "title": info.videoDetails.title,
                    "description": "**Requested by:** " + interaction.user.toString() + 
                                   "\n**Duration:** `" + length + "`" +
                                   "\n**Queue position:** `" + (data.queue.length - 1) + "`",
                    "url": args,
                    "color": index.ops.color,
                    "footer": {
                        "icon_url": index.ops.owner.displayAvatarURL({
                            size: 2048,
                            format: "png"
                        }),
                        "text": "Bot Created by " + index.ops.owner.tag
                    },
                    "author": {
                        "name": "Adding to queue...",
                        "url": "",
                        "icon_url": interaction.client.user.displayAvatarURL({
                            size: 2048,
                            format: "png"
                        }),
                    },
                }
            }
            interaction.editReply({ embeds: [embed1.embed] });
            index.ops.active.set(interaction.guildId, data);
        }
    }
}
function secondsToHms(d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}
async function play(client, ops, data, interaction, first) {
    var l = data.queue.length - 1;
    var loop = "";
    if (data.queue[0].looped == 1) loop = " 🔁";
    if (data.queue) {
        var embed = {
            "embed": {
                "title": data.queue[0].songTitle + loop,
                "description": "**Requested by:** " + data.queue[0].requester.toString() + 
                               "\n**Duration:** `" + data.queue[0].duration + "`" +
                               "\n**Queue length:** `" + l + "`",
                "url": data.queue[0].url,
                "color": ops.color,
                "footer": {
                    "icon_url": ops.owner.displayAvatarURL({
                        size: 2048,
                        format: "png"
                    }),
                    "text": "Bot Created by " + ops.owner.tag
                },
                "author": {
                    "name": "Now Playing...",
                    "url": "",
                    "icon_url": client.user.displayAvatarURL({
                        size: 2048,
                        format: "png"
                    })
                }
            }
        }
    }
    
    if (first)
        interaction.editReply({ embeds: [embed.embed] });
    else
        interaction.channel.send({ embeds: [embed.embed] });

    const player = voice.createAudioPlayer()
    data.dispatcher = player;
    var audio = YTDL(data.queue[0].url, {
        filter: "audioonly",
        fmt: "mp3",
        highWaterMark: 1 << 62,
        liveBuffer: 1 << 62,
        dlChunkSize: 0,
        bitrate: 128,
        quality: "highestaudio"
    });
    const resource = voice.createAudioResource(audio, {
        inlineVolume: true
    });
    resource.volume.setVolumeDecibels(-10);
    data.dispatcher.play(resource);
    voice.getVoiceConnection(interaction.guildId).subscribe(player);
    data.dispatcher.guildID = data.guildID;
    ops.active.set(data.dispatcher.guildID, data);
    data.dispatcher.on(voice.AudioPlayerStatus.Idle, async function () {
        finish(client, ops, this, interaction, data);
    });

}
async function finish(client, ops, dispatcher, interaction, data) {

    if (data.queue[0]) {
        if (data.queue[0].looped) {
            if (data.queue[0].looped == -1) data.queue.shift();
        }
    }

    if (data.queue.length > 0) {
        ops.active.set(dispatcher.guildID, data);

        play(client, ops, data, interaction, false);
    }
    else {
        ops.active.delete(dispatcher.guildID);
    }

}


