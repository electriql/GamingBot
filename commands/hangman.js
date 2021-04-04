// "  ___\n|    |\n|   O\n|  /|\\\n    /\\"
var randomWords = require('random-words');
var person = ["  ___\n|    |\n|    \n|","  ___\n|    |\n|   O\n|","  ___\n|    |\n|   O\n|    |","  ___\n|    |\n|   O\n|  /| ","  ___\n|    |\n|   O\n|  /|\\","  ___\n|    |\n|   O\n|  /|\\\n   /","  ___\n|    |\n|   O\n|  /|\\\n    /\\"];
exports.category = "fun";
exports.info = "Users play the classic game of hangman! Only one game at a time! \n **g!hangman guess - ** guess a letter or the entire word. \n **g!hangman start <random/custom> -** Start a hangman game \n - **random** - the bot chooses a random word (whoever guesses the word wins diamonds!) \n - **custom** - the user chooses a custom word \n **g!hangman stop -** stops the game. \n **g!hangman view -** views the status of the current game. \n **Aliases:** `hm`"
function rewardUsers(client, ops, data, message) {
    var status = "The word wasn't guessed!"
    var rewards = "";
    var index = require('../index.js');
    data.guesses.forEach(function (value, key, map) {
        var diamonds = 0;
        diamonds += (value.correctGuesses * 25) - (value.wrongGuesses * 5);
        if (value.correctGuesses == 0 || diamonds <= 0) {
            diamonds = 5;
        }
        rewards += "**" + message.guild.members.cache.get(key).user.tag + "** earned 💎x" + diamonds + "\n";
        index.dbSelect(index.pool, 'userdata', 'id', 'diamonds', key, function(user) {
            index.dbUpdate(index.pool, 'userdata', 'id', 'diamonds', key, user.diamonds + diamonds);
        });
    })
    if (getHangman(client, ops, data).embed.description.startsWith("__**" + data.word.toUpperCase() + "**__")) {
        status = "The word was guessed!";
    }
    var embed = {
        "embed": {
            "title": "**" + status + "**",
            "description": rewards,
            "url" : "",
            "color": 4886754,
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
    
    message.channel.send(embed);
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
                "value" : "Type: `" + data.type + "`"
            }
            ]
          
        }
    }
    return embed;
}
exports.run = async (message, args, client, ops) => {
    let fetched = ops.hangman.get(message.guild.id) || {};
     if (!args[0]) return message.channel.send("❌ The correct syntax of this command is g!hangman <start,guess,stop,view>!");
     if (args[0].toLowerCase() == "start") {
         if(!args[1]) return message.channel.send("❌ The correct syntax of this command is g!hangman start <random/custom>!");
         
         if (fetched.word) return message.channel.send("❌ There is already a hangman game in the server!");
         if (args[1].toLowerCase() == "random") {
            var word = randomWords.wordList[Math.floor(Math.random() * randomWords.wordList.length)];
            while (word.length < 4 || word.length > 20) {
                word = randomWords.wordList[Math.floor(Math.random() * randomWords.wordList.length)];
            }
            console.log(word);
            fetched = {
                word : word,
                wrongGuesses : 0,
                guessedLetters : [],
                host: message.author,
                guesses: new Map(),
                type : "random"
            }
            ops.hangman.set(message.guild.id, fetched);
            message.channel.send(getHangman(client, ops, fetched));
         }
         else if (args[1].toLowerCase() == "custom") {
            message.channel.send("Check your DMs!");
            try {
                
                message.author.send("What do you want the word to be? (Expires in 30 seconds)")
                .then(async function(msg) {
                    if (!fetched.host) fetched.host = message.author;
                    else return msg.channel.send("❌ A hangman is being created by **" + fetched.host.tag + "**!");
                    ops.hangman.set(message.guild.id, fetched);
                    const filter = m => m.author.equals(message.author);
                    var wordPromise = new Promise(function getWord(resolve, reject) {
                        const collector = msg.channel.createMessageCollector(filter, {time: 30000});
                        var word = "";
                        collector.once('collect', function(m) {
                            word = m.content.replace(/\s/g,'');
                            collector.stop();
                        });
                        collector.once('end', collected => {
                            if (!collected.array()[0]) return msg.channel.send("❌ You didn't send a valid message in time!");
                            if (collected.array()[0].content.length < 4 || collected.array()[0].content.length > 20) {
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
                        const collector = msg.channel.createMessageCollector(filter, {time: 30000});
                        var decision = "";
                        collector.once('collect', function(m) {
                            decision = m.content.trim();
                            collector.stop();
                        });
                        collector.once('end', collected => {
                            if (!collected.array()[0]) return msg.channel.send("❌ You didn't send a valid message in time!");
                            if (collected.array()[0].content.toLowerCase() != "y" && collected.array()[0].content.toLowerCase() != "n") {
                                msg.channel.send("❌ You must type **Y** or **N**!");
                                getDecision(resolve, reject);
                            } 
                            if (collected.array()[0].content.toLowerCase() == "n") {
                                message.channel.send(message.author.tag + " canceled their custom hangman!");
                                ops.hangman.set(message.guild.id, {});
                                return msg.channel.send("Canceled!");
                            }
                            resolve(decision);
                        });
                    });

                    let decision = await decisionPromise;
                    if (decision) {
                        msg.channel.send("Hangman started!");
                        fetched = {
                            word : word,
                            wrongGuesses : 0,
                            guessedLetters : [],
                            host: message.author,
                            guesses: new Map(),
                            type : "custom"
                        }
                        ops.hangman.set(message.guild.id, fetched);
                        message.channel.send(getHangman(client, ops, fetched));
                        
                    }
                    else {
                        msg.channel.send("❌ Something went wrong!");
                    }
                });
            }
            catch (e) {
                message.author.send("Please turn on DMs!");
            }
         }
         else {
            return message.channel.send("❌ The correct syntax of this command is g!hangman start <random/custom>!");
         }
        
     }
     else if (args[0].toLowerCase() == "view") {
        if (!fetched.word) return message.channel.send("❌ There currently is no hangman game!");
        message.channel.send(getHangman(client, ops, fetched));
     }
     else if (args[0].toLowerCase() == "stop") {
         if (!fetched.word) return message.channel.send("❌ There is currently no hangman game!");
         if (!message.guild.members.cache.get(fetched.host.id)){
            ops.hangman.set(message.guild.id, {});
            return message.channel.send("The host isn't in the server! The game has been stopped automatically.");
         } 
         if (message.author != fetched.host) return message.channel.send("❌ You must be the host of the hangman to stop it! The host is **" + fetched.host.tag + "**");
         ops.hangman.set(message.guild.id, {});
         message.channel.send("Hangman stopped!");
     }
     else if (args[0].toLowerCase() == "guess") {
        if (!fetched.word) return message.channel.send("❌ There currently is no hangman game!");
        if (!args[1]) return message.channel.send("❌ You must guess a letter or the entire word!");
        if (fetched.wrongGuesses >= person.length - 1) return message.channnel.send("❌ This hangman has expired!");
        if (args[1].length > 1 && args[1].length != fetched.word.length) return message.channel.send("❌ You can't guess this many letters!");
        if (args[1].length == 1 && fetched.guessedLetters.includes(args[1].toUpperCase())) return message.channel.send("❌ That letter has already been guessed!");
        if (fetched.type == "custom" && fetched.host == message.author) return message.channel.send("❌ You are the host of this hangman! Let other people guess your word!");
        if (!args[1].toLowerCase().match(/[a-z]/i)) return message.channel.send("❌ The guess can only have letters a-z!");
        var correct = "**" + args[1].toUpperCase() + "** is not part of the word!";
        var fetchedUser = fetched.guesses.get(message.author.id) || {};
        if (!fetchedUser.correctGuesses) {
            fetchedUser = {
                correctGuesses : 0,
                wrongGuesses : 0,
            }
        }

        
        if (args[1].length == 1) {
            if (fetched.word.toUpperCase().includes(args[1].toUpperCase())) {
                correct = "**" + args[1].toUpperCase() + "** is part of the word!";
                fetchedUser.correctGuesses++;
            }
            else {
                fetchedUser.wrongGuesses++;
                fetched.wrongGuesses++;
            }
        }
        else {
            if (args[1].toUpperCase() == fetched.word.toUpperCase()) {
                correct = "**" + args[1].toUpperCase() + "** is the word!"
                for (i = 0; i < fetched.word.length; i++) {
                    var index = i + 4;

                    if (getHangman(client, ops, fetched).embed.description.charAt(index) == "?"){
                        if (!fetched.word.substring(0, i).includes(fetched.word.charAt(i)))
                            fetchedUser.correctGuesses++;
                    }
                        
                }
            }
            else {
                correct = "**" + args[1].toUpperCase() + "** is not the word!";
                fetchedUser.wrongGuesses++;
                fetched.wrongGuesses++;
            }
        }
        fetched.guessedLetters.push(args[1].toUpperCase());
        var embed = getHangman(client, ops, fetched);
        embed.embed.fields[0].value = embed.embed.fields[0].value + "\n" + correct;
        message.channel.send(embed);
        fetched.guesses.set(message.author.id, fetchedUser);
        if (fetched.wrongGuesses >= person.length - 1) {
            message.channel.send("You are out of guesses! The word is **" + fetched.word.toUpperCase() + "**!");
            if (fetched.type == "random") {
                rewardUsers(client, ops, fetched, message);
            }
            fetched = {};
        }
        else if (embed.embed.description.startsWith("__**" + fetched.word.toUpperCase() + "**__")) {
            message.channel.send("You guessed the word!");
            if (fetched.type == "random") {
                rewardUsers(client, ops, fetched, message);
            }
            fetched = {};
        }
        ops.hangman.set(message.guild.id, fetched);
     }
     else {
        
        return message.channel.send("❌ The correct syntax of this command is g!hangman <guess,start,stop,view>!");
     }
    
}
