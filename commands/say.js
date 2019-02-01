exports.info = "Makes the bot say anything you would like (Except when profanity is turned on)."
var profanities = require('profanities');

function filter(message) {
    var uppr = message.content.toUpperCase();
    var str = uppr.split(" ");

    for (i = 0; i < str.length; i++) {
        for (x = 0; x < profanities.length; x++) {
            if (str[i] == profanities[x].toUpperCase()) {
                return true;
            }
        }
    }
    return false;
}
exports.run = async(message, args, client, ops) => {
    if (args[0]) {
        var str = ""
        for (i = 0; i < args.length; i++) {
            str = str + args[i] + " ";
        }
        if (!filter(message)) {
            message.channel.send(str)
            message.delete();
        }

    }
    else {
        message.channel.send("❌ You must give me something to say!")
    }
}
