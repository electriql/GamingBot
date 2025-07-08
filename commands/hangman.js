// "  ___\n|    |\n|   O\n|  /|\\\n    /\\"
var person = ["  ___\n|    |\n|    \n|",
              "  ___\n|    |\n|   O\n|",
              "  ___\n|    |\n|   O\n|    |",
              "  ___\n|    |\n|   O\n|  /| ",
              "  ___\n|    |\n|   O\n|  /|\\",
              "  ___\n|    |\n|   O\n|  /|\\\n   /",
              "  ___\n|    |\n|   O\n|  /|\\\n    /\\"];
const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require("discord.js");
module.exports = {
    category: "fun",
    info: "Users play the classic game of hangman! Only one game at a time!\n" +
          "__**Subcommands**__\n" +
          "`/hangman guess` - Guess a letter or the entire word.\n" +
          "`/hangman start <custom/random>` - Start a game of hangman, custom or random.\n" +
          "`/hangman stop` - Stop the current game of hangman.\n" +
          "`/hangman view` - View the current game of hangman.",
    data: new SlashCommandBuilder()
        .setName("hangman")
        .setDescription("Play the classic game of hangman!")
        .setContexts(InteractionContextType.Guild)
        .addSubcommand(subcommand =>
            subcommand.setName("guess")
                .setDescription("Guess a letter or the entire word.")
                .addStringOption(option =>
                    option.setName("string")
                        .setDescription("The letter or word to be guessed.")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("start")
                .setDescription("Start a game of hangman.")
                .addStringOption(option =>
                    option.setName("type")
                        .setDescription("The type of hangman game to start.")
                        .addChoices(
                            { name: "random", value: "random" },
                            { name: "custom", value: "custom" },
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("stop")
                .setDescription("Stop the current game of hangman.")
        )
        .addSubcommand(subcommand =>
            subcommand.setName("view")
                .setDescription("View the current game of hangman.")
        ),
    async execute(interaction) {
        const index = require("../index.js");
        let fetched = index.ops.hangman.get(interaction.guildId) || {};
        if (interaction.options.getSubcommand() == "guess") {
            if (!fetched.word)
                return interaction.reply({ content: "❌ There currently is no hangman game!", flags: MessageFlags.Ephemeral });
            if (fetched.wrongGuesses >= person.length - 1)
                return interaction.reply({ content: "❌ This hangman has expired!", flags: MessageFlags.Ephemeral });
            var guess = interaction.options.getString("string");
            if (guess.length > 1 && guess.length != fetched.word.length)
                return interaction.reply({ content: "❌ You can't guess this many letters!", flags: MessageFlags.Ephemeral });
            if (guess.length == 1 && fetched.guessedLetters.includes(guess.toUpperCase()))
                return interaction.reply({ content: "❌ That letter has already been guessed!", flags: MessageFlags.Ephemeral });
            if (fetched.type == "custom" && fetched.host == message.author)
                return interaction.reply({ content: "❌ You are the host of this hangman! Let other people guess your word!", flags: MessageFlags.Ephemeral });
            if (!guess.toLowerCase().match(/^[a-z]+$/i))
                return interaction.reply({ content: "❌ The guess can only have letters a-z!", flags: MessageFlags.Ephemeral });
            var correct = "**" + guess.toUpperCase() + "** is not part of the word!";
            var fetchedUser = fetched.guesses.get(interaction.user.id) || {};
            if (!fetchedUser.correctGuesses) {
                fetchedUser = {
                    correctGuesses: 0,
                    wrongGuesses: 0,
                }
            }


            if (guess.length == 1) {
                if (fetched.word.toUpperCase().includes(guess.toUpperCase())) {
                    correct = "**" + guess.toUpperCase() + "** is part of the word!";
                    fetchedUser.correctGuesses++;
                }
                else {
                    fetchedUser.wrongGuesses++;
                    fetched.wrongGuesses++;
                }
            }
            else {
                if (guess.toUpperCase() == fetched.word.toUpperCase()) {
                    correct = "**" + guess.toUpperCase() + "** is the word!"
                    for (i = 0; i < fetched.word.length; i++) {

                        if (getHangman(interaction.client, index.ops, fetched).embed.description.charAt(i + 4) == "?") {
                            if (!fetched.word.substring(0, i).includes(fetched.word.charAt(i)))
                                fetchedUser.correctGuesses++;
                        }

                    }
                }
                else {
                    correct = "**" + guess.toUpperCase() + "** is not the word!";
                    fetchedUser.wrongGuesses++;
                    fetched.wrongGuesses++;
                }
            }
            fetched.guessedLetters.push(guess.toUpperCase());
            var embed = getHangman(interaction.client, index.ops, fetched);
            embed.embed.fields[0].value = embed.embed.fields[0].value + "\n" + correct;
            interaction.reply({ embeds: [embed.embed] });
            fetched.guesses.set(interaction.user.id, fetchedUser);
            if (fetched.wrongGuesses >= person.length - 1) {
                interaction.channel.send("You are out of guesses! The word is **" + fetched.word.toUpperCase() + "**!");
                if (fetched.type == "random") {
                    rewardUsers(interaction.client, index.ops, fetched, interaction);
                }
                fetched = {};
            }
            else if (embed.embed.description.startsWith("__**" + fetched.word.toUpperCase() + "**__")) {
                interaction.channel.send("You guessed the word!");
                if (fetched.type == "random") {
                    rewardUsers(interaction.client, index.ops, fetched, interaction);
                }
                fetched = {};
            }
            index.ops.hangman.set(interaction.guildId, fetched);
        }
        else if (interaction.options.getSubcommand() == "start") {
            if (fetched.word)
                return interaction.reply({ content: "❌ There is already a hangman game in the server!", flags: MessageFlags.Ephemeral });
            if (interaction.options.getString("type") == "random") {
                import('random-words').then(randomWords => {
                    var word = randomWords.generate({ minLength: 4, maxLength: 20 });
                    console.log(word);
                    fetched = {
                        word: word,
                        wrongGuesses: 0,
                        guessedLetters: [],
                        host: interaction.user,
                        guesses: new Map(),
                        type: "random"
                    }
                    index.ops.hangman.set(interaction.guildId, fetched);
                    interaction.channel.send({ embeds: [getHangman(interaction.client, index.ops, fetched).embed] });
                    interaction.reply({ content: "Success!", flags: MessageFlags.Ephemeral });
                });
            }
            else if (interaction.options.getString("type") == "custom")
                startCustom(interaction, interaction.client, index.ops, fetched);
        }
        else if (interaction.options.getSubcommand() == "stop") {
            if (!fetched.word)
                return interaction.reply({ content: "❌ There currently is no hangman game!", flags: MessageFlags.Ephemeral });
            if (!interaction.guild.members.cache.get(fetched.host.id)) {
                index.ops.hangman.set(interaction.guildId, {});
                return interaction.reply("The host isn't in the server! The game has been stopped automatically.");
            }
            if (interaction.user != fetched.host)
                return interaction.reply({
                    content: "❌ You must be the host of the hangman to stop it! The host is **" + fetched.host.tag + "**",
                    flags: MessageFlags.Ephemeral
                });
            index.ops.hangman.set(interaction.guildId, {});
            interaction.reply("Hangman stopped!");
        }
        else if (interaction.options.getSubcommand() == "view") {
            if (!fetched.word)
                return interaction.reply({ content: "❌ There currently is no hangman game!", flags: MessageFlags.Ephemeral });
            interaction.reply({ embeds: [getHangman(interaction.client, index.ops, fetched).embed] });
        }
    }

}

function rewardUsers(client, ops, data, message) {
    var status = "The word wasn't guessed!"
    var rewards = "";
    var index = require('../index.js');
    var userData = index.getUserData();
    data.guesses.forEach(function (value, key, map) {
        var diamonds = 0;
        diamonds += (value.correctGuesses * 25) - (value.wrongGuesses * 5);
        if (value.correctGuesses == 0 || diamonds <= 0) {
            diamonds = 5;
        }
        rewards += "**" + message.guild.members.cache.get(key).user.tag + "** earned 💎x" + diamonds + "\n";
        if (!userData[key])
            userData[key] = index.createUser();
        userData[key].diamonds += diamonds;
        index.setUserData(userData);
    });
    if (getHangman(client, ops, data).embed.description.startsWith("__**" + data.word.toUpperCase() + "**__")) {
        status = "The word was guessed!";
    }
    var embed = {
        "embed": {
            "title": "**" + status + "**",
            "description": rewards,
            "url": "",
            "color": ops.color,
            "author": {
                "name": "Rewards",
                "url": "",
                "icon_url": client.user.displayAvatarURL({
                    size: 2048,
                    format: "png"
                }),
            }

        }
    }

    message.channel.send({ embeds: [embed.embed] });
}
function getHangman(client, ops, data) {

    var word = "";
    var guessedLetters = "";
    if (!data.guessedLetters[0]) guessedLetters = "(None)"
    for (var i in data.word) {
        var matching = false;
        for (var j in data.guessedLetters) {
            if (data.word.toUpperCase() == data.guessedLetters[j].toUpperCase()) {
                word = data.guessedLetters[j].toUpperCase();
                matching = true;
                break;
            }
            if (data.word.charAt(i).toUpperCase() == data.guessedLetters[j].toUpperCase()) {
                word = word + data.word.charAt(i).toUpperCase();
                matching = true;
            }
        }
        if (matching == false) {
            word = word + "?";
        }
    }
    for (var i in data.guessedLetters) {
        if (!data.word.toUpperCase().includes(data.guessedLetters[i].toUpperCase())) guessedLetters = guessedLetters + "~~" + data.guessedLetters[i].toUpperCase() + "~~"
        else guessedLetters = guessedLetters + data.guessedLetters[i].toUpperCase();
        guessedLetters = guessedLetters + ", ";
    }
    var embed = {
        "embed": {
            "title": person[data.wrongGuesses],
            "description": "__**" + word + "**__ " + " (" + word.length + " letters)",
            "url": "",
            "color": ops.color,
            "footer": {
                "icon_url": ops.owner.displayAvatarURL({
                    size: 2048,
                    format: "png"
                }),
                "text": "Bot Created by " + ops.owner.tag
            },
            "author": {
                "name": "Current Hangman",
                "url": "",
                "icon_url": client.user.displayAvatarURL({
                    size: 2048,
                    format: "png"
                }),
            },
            "fields": [
                {
                    "name": "__Guesses__",
                    "value": guessedLetters
                },
                {
                    "name": "Started by: **" + data.host.tag + "**",
                    "value": "Type: `" + data.type + "`"
                }
            ]

        }
    }
    return embed;
}
function startCustom(interaction, client, ops, fetched) {
    interaction.reply({ content: "Check your DMs!", flags: MessageFlags.Ephemeral });
    try {
        interaction.user.send("What do you want the word to be? (Expires in 30 seconds)")
            .then(async function (msg) {
                ops.hangman.set(interaction.guildId, fetched);
                const filter = m => m.author.equals(interaction.user);
                var wordPromise = new Promise(function getWord(resolve, reject) {
                    const collector = msg.channel.createMessageCollector({ filter, time: 30000 });
                    var word = "";
                    collector.once('collect', function (m) {
                        word = m.content.replace(/\s/g, '');
                        collector.stop();
                    });
                    collector.once('end', collected => {
                        if (!collected.first()) return msg.channel.send("❌ You didn't send a valid message in time!");
                        if (collected.first().content.length < 4 || collected.first().content.length > 20) {
                            getWord(resolve, reject);
                            return msg.channel.send("❌ That word is either too long or too short! The word must be 4-20 characters long! (Excluding spaces)");
                        }
                        for (i = 0; i < word.length; i++) {
                            if (!word.charAt(i).toLowerCase().match(/[a-z]/i)) {
                                getWord(resolve, reject);
                                return msg.channel.send("❌ The word must have only letters a-z!");;
                            }
                        }
                        resolve(word);
                    });
                });
                let word = await wordPromise;

                msg.channel.send("Are you sure you want the word to be **" + word + "**? Type **Y** for yes and **N** to cancel. (Expires in 30 seconds)")
                var decisionPromise = new Promise(function getDecision(resolve, reject) {
                    const collector = msg.channel.createMessageCollector({ filter, time: 30000 });
                    var decision = "";
                    collector.once('collect', function (m) {
                        decision = m.content.trim();
                        collector.stop();
                    });
                    collector.once('end', collected => {
                        if (!collected.first()) return msg.channel.send("❌ You didn't send a valid message in time!");
                        if (collected.first().content.toLowerCase() != "y" && collected.first().content.toLowerCase() != "n") {
                            msg.channel.send("❌ You must type **Y** or **N**!");
                            getDecision(resolve, reject);
                        }
                        if (collected.first().content.toLowerCase() == "n") {
                            // message.channel.send(message.author.tag + " canceled their custom hangman!");
                            ops.hangman.set(interaction.guildId, {});
                            return msg.channel.send("Canceled!");
                        }
                        resolve(decision);
                    });
                });

                let decision = await decisionPromise;
                if (decision) {
                    if (ops.hangman.get(interaction.guildId).word)
                        return msg.channel.send("❌ There is already a hangman game in the server!");
                    msg.channel.send("Hangman started!");
                    fetched = {
                        word: word,
                        wrongGuesses: 0,
                        guessedLetters: [],
                        host: interaction.user,
                        guesses: new Map(),
                        type: "custom"
                    }
                    ops.hangman.set(interaction.guildId, fetched);
                    interaction.channel.send({ embeds: [getHangman(client, ops, fetched).embed] });

                }
                else {
                    msg.channel.send("❌ Something went wrong!");
                }
            });
    }
    catch (e) {
        interaction.channel.reply({ content: "Please turn on DMs!", flags: MessageFlags.Ephemeral });
    }
}