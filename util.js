const { SystemChannelFlags } = require("discord.js");

class Utils {
    async findUser(message, name) {
        var user = message.author;
        await message.guild.members.fetch().then(members => {
            members.forEach(member => {
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
            }) 
        }).catch(console.error);
        return user;
    }
}
module.exports = Utils;
