exports.category = "hidden";
exports.info = "A command that you aren't supposed to and can't use."
exports.run = async(message, args, client, ops, serverData) => {
    if (message.author == ops.owner) {
        if (args[0]) {
            let str = "";
            for (i = 0; i < args.length; i++) {
                str = str + args[i] + " ";
            }
            message.channel.send(str);
        }
        else {
            message.channel.send("❌ You must give me something to say!");
        }
        message.delete();
    }
    else {
        message.channel.send("You shouldn't be using this command...");
    }
    
}
