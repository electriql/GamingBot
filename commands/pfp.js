const { SystemChannelFlags } = require("discord.js");
const Utils = require("../util.js");

exports.info = "Gives the profile picture of the specified user!"
exports.category = "misc";
exports.run = async (message, args, client, ops) => {
        let utils = new Utils();
        var user = message.author;
        if (args[0]) {
                var name = "";
                for (i = 0; i < args.length; i++) {
                      name += args[i] + " "; 
                }
                name = name.trim();
                
                user = await utils.findUser(message, name);
        }

        try {
                var pfp = user.displayAvatarURL({
                        size: 2048,
                        format: "png"
                });
                return message.channel.send(pfp);
        }
        catch (e) {
                console.log(e);
                message.channel.send("❌ That user is invalid!")
        }
}