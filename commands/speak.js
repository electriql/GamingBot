exports.category = "hidden";
exports.info = "A command that you aren't supposed to and can't use."
const Utils = require("../util.js");
exports.run = async(message, args, client, ops, serverData) => {
    let utils = new Utils();
    if (message.author == ops.owner) {
        if (args[0]) {
            let str = "";
            for (i = 0; i < args.length; i++) {
                str = str + args[i] + " ";
            }
            message.channel.send(utils.insertEmotes(str, client));
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
