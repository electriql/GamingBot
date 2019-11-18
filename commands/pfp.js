exports.info = "Gives the profile picture of the specified user!"
exports.category = "user";
exports.run = async (message, args, client, ops) => {
        var member;
        if (args[0]) {
                for (i = 0; i < message.guild.memberCount; i++) {
                        if (((args[0].toLowerCase() == message.guild.members.array()[i].displayName.toLowerCase() 
                        || args[0].toLowerCase() == message.guild.members.array()[i].user.username.toLowerCase())
                         || args[0].toLowerCase() == message.guild.members.array()[i].user.tag.toLowerCase())) {    
                                member = message.guild.members.array()[i].user;    
                        }
                        else if (message.mentions.members.first()) {
                                if (message.mentions.members.first().user == message.guild.members.array()[i].user) {
                                        member = message.guild.members.array()[i].user; 
                                }
                        }
                }
        }
        else {
                member = message.author;
        }
        try {
                var pfp = member.displayAvatarURL;
                return message.channel.send(pfp);
        }
        catch (e) {
                message.channel.send("❌ That user is invalid!")
        }
}