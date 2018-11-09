
    exports.info = "Answers your yes or no questions."
    
    exports.run = async (message, args, client, ops) => {
        var number = Math.floor(Math.random() * 9) + 1;
        if (args.length > 0) {
        if (number == 1) {
            message.reply("Most likely.");
        }
        else if (number == 2) {
            message.reply("Of course not.");
        }
        else if (number == 3) {
            message.reply("Yes.");
        }
        else if (number == 4) {
            message.reply("No.");
        }
        else if (number == 5) {
            message.reply("Don't count on it.");
        }
        else if (number == 6) {
            message.reply("Definitely.");
        }
        else if (number == 7) {
            message.reply("Heck yeah.");
        }
        else if (number == 8) {
            message.reply("Heck no.");
        }
        else if (number == 9) {
            message.reply("Maybe.");
        }
        else if (number == 10) {
            message.reply("We'll see.")
        }
    }
    else {
        message.reply("✗ Ask me something first.");
    }
}
