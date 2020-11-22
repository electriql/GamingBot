
//Puns
const puns = [
"Did you hear about the guy whose whole left side was cut off? He's all right now.",
 "I wasn't originally going to get a brain transplant, but then I changed my mind.",
"Yesterday I accidentally swallowed some food coloring. The doctor says I'm OK, but I feel like I've dyed a little inside.",
"I wondered why the baseball was getting bigger. Then it hit me.",
"Why don't some couples go to the gym? Because some relationships don't work out.",
"A friend of mine tried to annoy me with bird puns, but I soon realized that toucan play at that game.",
"I'd tell you a chemistry joke but I know I wouldn't get a reaction.",
"Have you ever tried to eat a clock? It's very time consuming.",
"I once got into so much debt that I couldn't even afford my electricity bills, they were the darkest times of my life.",
"Did you hear about the guy who got hit in the head with a can of soda? He was lucky it was a soft drink.",
"When notes get in treble, bass-ically they get put behind bars. The alto-nate punishment is to push them off a clef and hope they land flat on sharp objects.",
"A man just assaulted me with milk, cream and butter. How dairy.",
"The experienced carpenter really nailed it, but the new guy screwed everything up.",
"If there was someone selling drugs in this place, weed know.",
"I used to be a banker but I lost interest",
"He drove his expensive car into a tree and found out how the Mercedes bends.",
"I relish the fact that you've mustard the strength to ketchup to me.",
"I'm reading a book about anti-gravity. It's impossible to put down.",
"I went to the dentist without lunch, and he gave me a plate.",
"A prisoner's favorite punctuation mark is the period. It marks the end of his sentence."];

exports.category = "fun";
exports.info = "Gives a random pun."
exports.run = async (message, args, client, ops) => {
        var pun = Math.floor(Math.random() * puns.length);
        var msg = puns[pun];
        message.channel.send(msg + " *Ba doom, crash!*");
    }
