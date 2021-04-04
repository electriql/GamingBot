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
    async insertEmotes(string, client) {
        string = string.replace(/</g, ">");
        var sections = string.split(">");
        string = "";
        var output = "";
        sections.forEach(str => {
                client.emojis.cache.forEach(emoji => {
                        if (emoji.identifier == str.replace(":", ""))
                                str = ":" + emoji.name + ":"; 
                })
                string += str;
        })
        var end = 0;
        for (i = 0; i < string.length; i++) {
                var emote = false;
                if (string.charAt(i) == ':') {
                        end = string.indexOf(":", i + 1);
                        if (end != -1) {
                                var emoteName = string.substring(i + 1, end);
                                let animated = false;
                                client.emojis.cache.forEach(emoji => {
                                        if (emoji.name.toLowerCase() == emoteName.toLowerCase()) {
                                                emote = true;
                                                emoteName = emoji.identifier;
                                                animated = emoji.animated;
                                        }
                                })
                                if (emote) {
                                        i = end;
                                        if (animated) output+="<" + emoteName + ">";
                                        else output+="<:" + emoteName + ">";
                                }
                                
                        }
                }
                if (!emote) output+=string.charAt(i);
        }
        return output;
    }
}
module.exports = Utils;
