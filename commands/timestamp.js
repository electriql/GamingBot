exports.category = "misc";
exports.info = "Says when your account was made! Type in another username to find when their account was made! (In Pacific Time)"
const Utils = require("../util.js");
exports.run = async (message, args, client, ops) => {
        let utils = new Utils();
        var member = message.author;
        if (args[0]) {
                var name = "";
                for (i = 0; i < args.length; i++) {
                      name += args[i] + " "; 
                }
                name = name.trim();
                
                member = await utils.findUser(message, name);
        }
        try {
                var date = member.createdAt;
                var converted = date.toLocaleString("en-US", {timeZone: "America/Los_Angeles"})
                message.channel.send("**" + member.username + "'s** account was created on **" + converted + "**");
        }
        catch(e) {
                console.log(e);
                message.channel.send("❌ That user is invalid!")
        }
}