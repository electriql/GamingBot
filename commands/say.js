exports.category = "fun";
exports.info = "Makes the bot say anything you would like (Automatically censors profanity)."
var profanity = require('../profanities.js');
const fs = require('fs');
const serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'));
const Utils = require("../util.js");
function filter(message, serverData) {
    var msg = message.toString();
    var lower = msg.toLowerCase();
    var str = lower.split(" ");

    for (i = 0; i < str.length; i++) {
        for (i = 0; i < str.length; i++) {
            if (profanity.profanities.includes(str[i])) {
                return true;
            }
        }
    }
    return false;
}

exports.run = async(message, args, client, ops, serverData) => {
    let utils = new Utils();
    if (args[0]) {
        let str = ""
        for (i = 0; i < args.length; i++) {
            str = str + args[i] + " ";
        }
        str = await utils.insertEmotes(str, client) + "\n\n - " + message.author.tag;
        message.channel.send(str);
    }
    else {
        message.channel.send("❌ You must give me something to say!")
    }
}