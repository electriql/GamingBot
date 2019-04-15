exports.info = "Gives the profile picture of the specified user!"
exports.run = async (message, args, client, ops) => {
        if (args[0]) {
                if (message.mentions.members.first()) {    
                        var member = message.mentions.members.first().user;           
                        var pfp = member.displayAvatarURL;
                        return message.channel.send(pfp);
                }
        }
        message.channel.send("❌ That user is invalid!")
}