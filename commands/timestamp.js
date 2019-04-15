exports.info = "Says when your account was made! Type in another username to find when their account was made!"
exports.run = async (message, args, client, ops) => {
        var date = message.author.createdAt;
        var member = message.author;
        if (args[0]) {
                if (message.mentions.members.first()) {    
                        var member = message.mentions.members.first().user;           
                        var date = member.createdAt;
                }
                else {
                        var member = message.author;
                }
        }
        message.channel.send("**" + member.username + "'s** account was created on **" + date + "**");
}
