exports.category = "user";
exports.info = "Says when your account was made! Type in another username to find when their account was made! (In Pacific Time)"
exports.run = async (message, args, client, ops) => {
        var date = message.author.createdAt;
        var member = message.author;
        if (args[0]) {
                var name = "";
                for (i = 0; i < args.length; i++) {
                      name += args[i] + " "; 
                }
                name = name.trim();
                for (i = 0; i < message.guild.memberCount; i++) {
                        if (((name.toLowerCase() == message.guild.members.array()[i].displayName.toLowerCase() 
                        || name.toLowerCase() == message.guild.members.array()[i].user.username.toLowerCase())
                         || name.toLowerCase() == message.guild.members.array()[i].user.tag.toLowerCase())) {    
                                member = message.guild.members.array()[i].user;    
                        }
                        else if (message.mentions.members.first()) {
                                member = message.mentions.members.first().user;           
                                date = member.createdAt;
                        }
                }
        }
        var converted = date.toLocaleString("en-US", {timeZone: "America/Los_Angeles"})
        message.channel.send("**" + member.username + "'s** account was created on **" + converted + "**");
}
