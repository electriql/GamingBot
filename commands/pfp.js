const { SystemChannelFlags } = require("discord.js");

exports.info = "Gives the profile picture of the specified user!"
exports.category = "misc";
exports.run = async (message, args, client, ops) => {
        var user = message.author;
        if (args[0]) {
                var name = "";
                for (i = 0; i < args.length; i++) {
                      name += args[i] + " "; 
                }
                name = name.trim();
                message.guild.members.forEach(member => {
                        if (((name.toLowerCase() == member.displayName.toLowerCase() 
                        || name.toLowerCase() == member.user.username.toLowerCase())
                         || name.toLowerCase() == member.user.tag.toLowerCase())) {    
                                user = member.user;
                        }
                        else if (message.mentions.members.first()) {
                                if (message.mentions.members.first().user == member.user) {
                                        user = member.user; 
                                }
                        }
                });
        }

        try {
                var pfp = user.displayAvatarURL;
                return message.channel.send(pfp);
        }
        catch (e) {
                console.log(e);
                message.channel.send("❌ That user is invalid!")
        }
}