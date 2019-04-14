
//Puns
const quotes = [
"Yeeaahhhh!",
 "No ignore pls",
"(*Insert Name Here*) wanna bortnite?",
"Blytee lytee",
"hi (*Insert Name Here*)",
"Macole!",
"You wanna cry?...",
"Cuz mc is very cool and I wanna be like him",
"This shit blows",
"Appel!",
"Woah I just killed the very cool mc",
"Hey Blytee do u want appel?",
"I finna die",
"Ur head is blocking the wifi",
"ok baudy",
"uh oh",
"hi nigs",
"(*Insert Name Here*) can I go to ur house?",
"crispy pine appel",
"@(*Insert Ping Here*)"];
const ready = true;
exports.info = "Gives a random Ren quote. Type 'mock' at the end to add a mocking style!" 
exports.run = async (message, args, client, ops) => {
    var quote = Math.floor(Math.random() * quotes.length);
    var msg = quotes[quote];
    if (args[0]) {
        if (args[0].toUpperCase() == "MOCK") {
            let commandFile = require('./mock.js');
            let a = msg.split(' ');
            commandFile.run(message, a, client, ops);
        }
        else { 
            message.channel.send("❌ You must leave this field empty or type 'mock'!")
        }
    }
    else {
        message.channel.sendMessage(msg);   
    }    
    
        
    }
