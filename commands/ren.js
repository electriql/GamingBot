
//Puns
const quotes = [
"Yeeaahhhh!",
 "No ignore pls",
"(*Insert Name Here*) wanna bs?",
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
"i thought it was funny",
"and it would be really funny",
"are you guys doing something without me?",
"hey (*Insert Name Here*) can I go to ur house tomorrow?",
"crispy pine appel",
"@(*Insert Ping Here*)",
"and it was really funny",
"(*Insert Object Here*) can go eat shit and die",
"and its really cool",
"*Gay laugh*"];
const ready = true;
exports.category = "fun";
exports.info = "Gives a random Ren (very gay) quote. Type 'mock' at the end to add a mocking style!" 
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
