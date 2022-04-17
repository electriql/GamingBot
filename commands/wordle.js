const { SystemChannelFlags, Options, ReactionUserManager } = require('discord.js');
const fs = require('fs');
const answers = fs.readFileSync('Storage/wordleAnswers.txt', 'utf8').split('\n');
const guesses = fs.readFileSync('Storage/wordleGuesses.txt', 'utf8').split('\n');
for (let i = 0; i < guesses.length; i++) {
    guesses[i] = guesses[i].trim();
}
for (let i = 0; i < answers.length; i++) {
    answers[i] = answers[i].trim();
}
exports.category = "fun";
exports.info = "Play a recreation of Wordle!"
exports.run = async (message, args, client, ops) => {
    let data = ops.wordles.get(message.author.id);
    if (args.length > 0) {
        if (args[0].toLowerCase() == "start") {
            if (!data) {
                word = answers[Math.floor(Math.random() * answers.length)];
                data = new Wordle(word, message.author)
                ops.wordles.set(message.author.id, data);
                return data.display(message.channel, client, ops);
            }
            return message.channel.send("❌ You already have an ongoing wordle!");
        }
        else if (args[0].toLowerCase() == "guess") {
            if (args.length > 1) {
                if (!data) return message.channel.send("❌ You don't have an ongoing wordle!");
                if (guesses.indexOf(args[1].toLowerCase()) != -1) {
                    data.guessWord(args[1]);
                    data.display(message.channel, client, ops);
                    if (data.checkWin() == 1) {
                        message.channel.send("You guessed the word in **" + data.guesses + "** guess(es)!");
                        return ops.wordles.delete(message.author.id);
                    }
                    else if (data.checkWin() == -1) {
                        message.channel.send("Unlucky! The word was **" + data.word.toUpperCase() + "**!");
                        return ops.wordles.delete(message.author.id);
                    }
                    return;
                }
            }
            return message.channel.send("❌ Invalid guess!");
        }
        else if (args[0].toLowerCase() == "stop") {
            if (!data) return message.channel.send("❌ You don't have an ongoing wordle!");
            ops.wordles.delete(message.author.id);
            return message.channel.send("Stopped your wordle! The word was **" + data.word.toUpperCase() + "**.");
        }
        else if (args[0].toLowerCase() == "view") {
            if (!data) return message.channel.send("❌ You don't have an ongoing wordle!");
            return data.display(message.channel, client, ops);
        }
    }
    return message.channel.send("❌ The correct syntax of this command is g!wordle <start,guess,stop,view>!");
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
    display(channel, client, ops) {
        let board = "";
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
                }
                else if (char == 'y')
                    colors += '🟨';
                else if (char == 'b') {
                    colors += '⬛';
                    format = "~~";
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
        var embed = {
            "embed": {
                "title": this.guesses + "/6",
                "description": board,
                "url" : "",
                "color": 4886754,
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
        channel.send({embeds: [embed.embed]});
    }
    checkWin() {
        if (this.squares.length <= 0)
            return 0;
        else if (this.squares.length >= 6)
            return -1;
        return this.squares[this.squares.length - 1] == "ggggg" ? 1 : 0;
    }
}