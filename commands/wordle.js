const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const answers = fs.readFileSync('Storage/wordleAnswers.txt', 'utf8').split('\n');
const guesses = fs.readFileSync('Storage/wordleGuesses.txt', 'utf8').split('\n');
for (let i = 0; i < guesses.length; i++) {
    guesses[i] = guesses[i].trim();
}
for (let i = 0; i < answers.length; i++) {
    answers[i] = answers[i].trim();
}
module.exports = {
    category: "fun",
    info: "Play a recreation of Wordle!\n" +
          "__**Subcommands**__\n" +
          "`/wordle guess` - Guess a word.\n" +
          "`/wordle start` - Start a game of Wordle.\n" +
          "`/wordle stop` - Stop the current game of Wordle.\n" +
          "`/wordle view` - View the current game of Wordle.",
    data: new SlashCommandBuilder()
        .setName("wordle")
        .setDescription("Play a recreation of Wordle!")
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand.setName("guess")
                .setDescription("Guess a word.")
                .addStringOption(option =>
                    option.setName("word")
                        .setDescription("Type in a 5 letter word!")
                        .setRequired(true)
                        .setMinLength(5)
                        .setMaxLength(5)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName("start")
                .setDescription("Start a game of Wordle.")
        )
        .addSubcommand(subcommand =>
            subcommand.setName("stop")
                .setDescription("Stop the current game of Wordle.")
        )
        .addSubcommand(subcommand =>
            subcommand.setName("view")
                .setDescription("View the current game of Wordle.")
        ),
    async execute(interaction) {
        const index = require('../index.js');
        let data = index.ops.wordles.get(interaction.user.id);
        if (interaction.options.getSubcommand() == "guess") {
            if (!data)
                return interaction.reply({ content: "❌ You don't have an ongoing wordle!", ephemeral: true });
            var guess = interaction.options.getString("word");
            if (guesses.indexOf(guess.toLowerCase()) != -1) {
                data.guessWord(guess);
                data.display(interaction, interaction.client, index.ops);
                if (data.checkWin() == 1) {
                    interaction.channel.send("You guessed the word in **" + data.guesses + "** guess(es)!");
                    return index.ops.wordles.delete(interaction.user.id);
                }
                else if (data.checkWin() == -1) {
                    interaction.channel.send("Unlucky! The word was **" + data.word.toUpperCase() + "**!");
                    return index.ops.wordles.delete(interaction.user.id);
                }
                return;
            }
            return interaction.reply({ content: "❌ Invalid guess!", ephemeral: true });
        }
        else if (interaction.options.getSubcommand() == "start") {
            if (!data) {
                word = answers[Math.floor(Math.random() * answers.length)];
                data = new Wordle(word, interaction.user)
                index.ops.wordles.set(interaction.user.id, data);
                return data.display(interaction, interaction.client, index.ops);
            }
            return interaction.reply({ content: "❌ You already have an ongoing wordle!", ephemeral: true });
        }
        else if (interaction.options.getSubcommand() == "stop") {
            if (!data)
                return interaction.reply({ content: "❌ You don't have an ongoing wordle!", ephemeral: true });
            index.ops.wordles.delete(interaction.user.id);
            return interaction.reply("Stopped your wordle! The word was **" + data.word.toUpperCase() + "**.");
        }
        else if (interaction.options.getSubcommand() == "view") {
            if (!data)
                return interaction.reply({ content: "❌ You don't have an ongoing wordle!", ephemeral: true });
            return data.display(interaction, interaction.client, index.ops);
        }
    }
}
class Wordle {
    owner;
    word;
    guesses = 0;
    list = [];
    squares = [];
    constructor(word, owner) {
        this.word = word;
        this.owner = owner;
    }
    guessWord(guess) {
        // ⬛ 🟩 🟨
        this.guesses++;
        guess = guess.toLowerCase().trim();
        this.list.push(guess);
        let row = ['b', 'b', 'b', 'b', 'b'];
        let temp = guess;
        for (let i = 0; i < word.length; i++) {
            if (word[i] == guess[i]) {
                temp = temp.substring(0, i) + "-" + temp.substring(i + 1);
                row[i] = 'g';
            }
        }
        for (let i = 0; i < this.word.length; i++) {
            if (guess.charAt(i) != this.word.charAt(i)) {
                let index = temp.indexOf(word.charAt(i));
                if (index != -1) {
                    temp = temp.substring(0, index) + "-" + temp.substring(index + 1);
                    row[index] = 'y';
                }
            }
        }
        let str = "";
        row.forEach(char => {
            str += char;
        })
        this.squares.push(str);
    }
    display(interaction, client, ops) {
        let tempKeys = "Q W E R T Y U I O P\n" +
            "A S D F G H J K L\n" +
            "Z X C V B N M\n"
        let board = "";
        let green = new Set();
        let yellow = new Set();
        let black = new Set();
        for (let i = 0; i < this.guesses; i++) {
            let clue = "";
            let colors = "";
            let prev = "";
            for (let j = 0; j < this.list[i].length; j++) {
                let char = this.squares[i].charAt(j);
                let format = "";
                if (char == 'g') {
                    format = "**";
                    colors += '🟩';
                    green.add(this.list[i].charAt(j));
                }
                else if (char == 'y') {
                    colors += '🟨';
                    yellow.add(this.list[i].charAt(j));
                }
                else if (char == 'b') {
                    colors += '⬛';
                    format = "~~";
                    black.add(this.list[i].charAt(j));
                }
                if (prev != format) {
                    clue += prev + format;
                    prev = format;
                }
                clue += this.list[i].charAt(j);
            }
            clue += prev;
            board += colors + " " + clue.toUpperCase() + "\n";
        }

        let keyboard = "";
        for (let i = 0; i < tempKeys.length; i++) {
            let char = tempKeys.charAt(i);
            if (green.has(char.toLowerCase())) {
                keyboard += "**" + char + "** "
            }
            else if (black.has(char.toLowerCase())) {
                keyboard += "~~" + char + "~~ ";
            }
            else if (yellow.has(char.toLowerCase())) {
                keyboard += "__" + char + "__ ";
            }
            else if (char.trim().length != 0) {
                keyboard += "*" + char + "*";
            }
            else keyboard += char;
        }
        board += "\n" + keyboard;
        var embed = {
            "embed": {
                "title": this.guesses + "/6",
                "description": board,
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
                    "name": this.owner.username + "'s Wordle",
                    "url": "",
                    "icon_url": client.user.displayAvatarURL({
                        size: 2048,
                        format: "png"
                    }),
                },
            }
        }
        interaction.reply({ embeds: [embed.embed] });
    }
    checkWin() {
        if (this.squares.length <= 0)
            return 0;
        else if (this.squares[this.squares.length - 1] == "ggggg") {
            return 1;
        }
        else if (this.squares.length >= 6)
            return -1;
        return 0;
    }
}