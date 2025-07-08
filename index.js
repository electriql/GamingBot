const prefix = "g!"
const embed_color = 4886754
const fs = require('fs');
const { DisTube, RepeatMode } = require('distube')
const { SoundCloudPlugin } = require('@distube/soundcloud')
require('dotenv').config();
const { ActivityType, ChannelType, Client, Collection, EmbedBuilder, GatewayIntentBits, Partials, MessageFlags } = require("discord.js");
const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.User
    ],
    presence: {
        activities: [{
            type: ActivityType.Custom,
            name: "Gaming Bot",
            state: "Gaming. /help"
        }]
    }
});

// var toggleprofanity = require(__dirname + '/commands/toggleprofanity.js');
const servers = {};
const cooldown = new Map();
const hangman = new Map();
const active = new Map();
const prof = new Map();
const wordles = new Map();

bot.login(process.env['BOT_TOKEN']);

const scplugin = new SoundCloudPlugin()
bot.distube = new DisTube(bot, {
    emitAddListWhenCreatingQueue: false,
    emitAddSongWhenCreatingQueue: false,
    emitNewSongOnly: false,
    joinNewVoiceChannel: true,
    plugins: [
        scplugin,
    ],
    savePreviousSongs: true
})

// bot.distube.on("debug", debug => {
//     console.log(debug)
// })

// bot.distube.on("ffmpegDebug", debug => {
//     console.log(debug)
// })

// JSON INTERACTIONS
function getUserData() {
    return JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
}
function setUserData(data) {
    fs.writeFileSync('Storage/userData.json', JSON.stringify(data, null, 2));
}
function createUser() {
    return {
        diamonds: 0,
        daily: -1
    }
}

// Distube Listeners
bot.distube.on("playSong", (queue, song) => {
    queue.previousSongs = []
    // UI
    const embed = new EmbedBuilder().setColor(embed_color)
        .setTitle(song.name + (queue.repeatMode == RepeatMode.SONG ? " ⟳" : ""))
        .setDescription("**Requested by:** " + song.user.toString() + 
                        "\n**Duration:** `" + song.formattedDuration + "`" +
                        (queue.repeatMode == RepeatMode.QUEUE ? " ⟳" : ""))
        .setURL(song.url)
        .setFooter({
            iconURL: song.metadata.bot_owner.displayAvatarURL({
                size: 2048,
                format: "png"
            }),
            text: "Bot Created by " + song.metadata.bot_owner.tag
        })
        .setAuthor({
            name: "Now Playing...",
            iconURL: queue.client.user.displayAvatarURL({
                size: 2048,
                format: "png"
            }),
        })
        .setThumbnail(song.thumbnail)
    
    // Interaction Handling
    if (song.metadata.editReply) {
        song.metadata.interaction.editReply({ embeds: [embed] })
        song.metadata.editReply = false
    }
    else {
        song.metadata.interaction.channel.send({ embeds: [embed] })
    }
})
bot.distube.on("addSong", (queue, song) => {
    // UI
    const embed = new EmbedBuilder().setColor(embed_color)
        .setTitle(song.name)
        .setDescription("**Requested by:** " + song.user.toString() + 
                        "\n**Duration:** `" + song.formattedDuration + "`" +
                        "\n**Queue position:** `" + (queue.songs.length - 1) + "`" + 
                        (queue.repeatMode == RepeatMode.QUEUE ? " ⟳" : ""))
        .setURL(song.url)
        .setFooter({
            iconURL: song.metadata.bot_owner.displayAvatarURL({
                size: 2048,
                format: "png"
            }),
            text: "Bot Created by " + song.metadata.bot_owner.tag
        })
        .setAuthor({
            name: "Adding to queue...",
            iconURL: queue.client.user.displayAvatarURL({
                size: 2048,
                format: "png"
            }),
        })
        .setThumbnail(song.thumbnail)

    // Interaction Handling
    if (song.metadata.editReply) {
        song.metadata.interaction.editReply({ embeds: [embed] })
        song.metadata.editReply = false
    }
    else {
        song.metadata.interaction.channel.send({ embeds: [embed] })
    }

})
bot.distube.on("finishSong", async (queue, song) => {
    // Refetch stream URL of the next song
    if (queue.repeatMode == RepeatMode.SONG ||
        (queue.repeatMode == RepeatMode.QUEUE && queue.songs.length == 1)) {
        song.stream.url = undefined
    } else if (queue.songs.length > 1) {
        queue.songs[1].stream.url = undefined
    }
})

// Listners
bot.on('guildMemberRemove', member => {
    member.guild.systemChannel.send('**' + member.user.username + '** has left the server.');
});
bot.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand())
        return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        return interaction.reply({
            content: "❌ This command is invalid.",
            flags: MessageFlags.Ephemeral
        });
    }

    if (!interaction.channel.permissionsFor(bot.user).has([PermissionsBitField.Flags.SendMessages]))
        return interaction.reply({ content: "❌ I don't have permission to send messages here!", flags: MessageFlags.Ephemeral})

    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
                content: '❌ There was an error while executing this command!',
                flags: MessageFlags.Ephemeral
            });
		} else {
			await interaction.reply({
                content: '❌ There was an error while executing this command!',
                flags: MessageFlags.Ephemeral
            });
		}
    }
});
bot.on('messageCreate', async message => {
    //Command Handler
    let args = message.content.slice(prefix.length).trim().split(' ');

    let cmd = args.shift().toLowerCase();

    // Private Commands
    if (message.author.bot) return;

    if (message.mentions.has(bot.user) && message.channel.permissionsFor(bot.user).has([
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory
    ]))
        message.reply({ content: "sup" })

    var owner = (await bot.application.fetch()).owner;
    
    if (message.channel.type == ChannelType.DM) {
        if (message.author.id != owner.id) {
            owner.send("**" + message.author.username + "**\n" + message.content);
        }
        else if (message.content.startsWith("p!")) {
            try {
                if (!fs.existsSync(__dirname + "/pc/" + cmd + ".js")) return message.channel.send("Unknown Command.");
                let commandFile = require(__dirname + "/pc/" + cmd + ".js");

                let ops = {
                    active: active,
                    cooldown: cooldown,
                    hangman: hangman,
                    prof: prof,
                    owner: owner,
                    wordles: wordles,
                }
    
                commandFile.run(message, args, bot, ops);
    
            }
            catch (e) {
                console.log(e.stack);
            }
        }
    }
    //toggleprofanity.filter(message);
});
bot.on('guildCreate', guild => {
    guild.systemChannel.send("Hello I am **Gaming Bot!** Thanks for adding me to your server! Do `/help` to see what I can do!");
});
bot.on('ready', async function () {
    var owner = (await bot.application.fetch()).owner;

    bot.commands = new Collection();
    const commandFiles = fs.readdirSync(__dirname + "/commands").filter(file =>
                         file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = __dirname + "/commands/" + file;
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
			bot.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a
                        required "data" or "execute" property.`);
		}
    }

    const ops = {
        active: active,
        hangman: hangman,
        cooldown: cooldown,
        color: embed_color,
        prof: prof,
        owner: owner,
        wordles: wordles,
    }

    console.log("Gaming launched!");

    setInterval(function () {
        cooldown.forEach(function (value, key, map) {
            var updated = {};
            if (value.mine) {
                updated.mine = value.mine - 0.01
                if (value.mine <= 0) delete updated.mine;
            }
            if (value.slots) {
                updated.slots = value.slots - 0.01
                if (value.slots <= 0) delete updated.slots;
            }
            if (value.wheel) {
                updated.wheel = value.wheel - 0.01
                if (value.wheel <= 0) delete updated.wheel;
            }
            if (value.roll) {
                updated.roll = value.roll - 0.01
                if (value.roll <= 0) delete updated.roll;
            }
            cooldown.set(key, updated);
        });
        module.exports = {
            scplugin,
            ops,
            getUserData,
            setUserData,
            createUser,
        }
    }, 10);
});

const express = require('express');
const { PermissionsBitField } = require('discord.js');
const server = express();
server.all('/', (req, res) => {
    res.send('Result: [OK].');
})

server.listen(3000, () => {
    console.log("Server is ready!");
})