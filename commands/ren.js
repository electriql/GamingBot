
//Puns
const puns = [
"Yeeaahhhh!",
 "No ignore pls",
"*Insert Name Here* wanna bortnite?",
"Blytee lytee",
"Hey Blytee",
"Macole!",
"You wanna cry?...",
"Cuz mc is very cool and I wanna be like him",
"This shit blows",
"Appel!",
"Woah I just killed the very cool mc",
"Hey Blytee do u want appel?",
"I finna die",
"Ur head is blocking the wifi"];
const ready = true;
exports.info = "Gives a random Ren quote (There is a lot)"
exports.run = async (message, args, client, ops) => {
        var pun = Math.floor(Math.random() * puns.length);
        var msg = puns[pun];
        message.channel.sendMessage(msg);
        
    }
