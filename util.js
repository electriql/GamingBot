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
        sections.forEach(str => {
                client.emojis.cache.forEach(emoji => {
                        if (emoji.identifier == str.replace(":", ""))
                                str = ":" + emoji.name + ":"; 
                })
                string += str;
        })
        console.log(string);
        var output = "";
        var emoteName = ":";
        var emote = false;
        for (i = 0; i < string.length; i++) {
                if (string.charAt(i) != ':') { 
                        if (emote)
                                emoteName += string.charAt(i);
                        else output+=string.charAt(i);
                }
                else {
                        emote = !emote;
                        if (!emote && emoteName.replace(":", "").length > 0) {
                                emoteName+=":";
                                let animated = false;
                                client.emojis.cache.forEach(emoji => {
                                        if (emoji.name.toLowerCase() == emoteName.replace(/:/g, "").toLowerCase()) {
                                                emoteName = emoji.identifier;
                                                animated = emoji.animated;
                                        }
                                })
                                if (animated) output+="<" + emoteName + ">";
                                else output+="<:" + emoteName + ">";
                                emoteName = "";
                        }
                }
        }
        return output;
    }
}
module.exports = Utils;
