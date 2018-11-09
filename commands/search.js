exports.info = "Gives a list of 10 songs you can choose from."
const search = require("yt-search");
const ytdl = require("ytdl-core");
exports.run = async(message, args, client, ops) => {

    search(args.join(' '), function(err, res) {
        if (err) return message.channel.send("❌ An error occurred. Please contact <@240982621247635456>.");
        
        if (!ytdl.validateURL(res.videos[0].url)) res.videos.splice(0, 1);

        let videos = res.videos.slice(0, 10);

        let resp = [];

        for (var i in videos) {
            resp.push({
                'name': parseInt(i) + 1 + ". " + videos[i].title,
                'value': "Type " + "'" + (parseInt(i) + 1) + "' to play this track!",
            })
        }
        resp.push({
            "name": "🔻",
            "value": "**Type 'cancel' to cancel!**"
      });
        var x = {
            "embed": {
                "title": "Top 10 Results: '" + args.join(' ') + "'",
                "description": "🔻🔻🔻",
                "url" : "",
                "color": 4886754,
                "footer": {
                    "icon_url": "https://media.discordapp.net/attachments/415729242341507076/439987020853411844/ElectricDiamondCrop.png?width=676&height=676",
                    "text": "Bot Created by @ᗴlectricↁiamond#1684"
                },
                "author": {
                    "name": "Searching...",
                    "url": "",
                    "icon_url": "https://media.discordapp.net/attachments/415729242341507076/439978267156545546/BotLogo.png?width=676&height=676"
                },
                "fields": resp
            }
        }

        const filter = m => !m.author.bot;

        message.channel.send(x)
        .then(msg => {
            const collector = message.channel.createMessageCollector(filter);

            collector.videos = videos;

            collector.once('collect', function(m) {
                msg.delete();
                if (!isNaN(m.content) && m.content < videos.length + 1 && m.content > 0) {

                }  
                else if (m.content.toUpperCase() == "CANCEL") {
                    message.channel.send("**Cancelled!**");
                    return;
                }
                else {
                    return message.channel.send("❌ The message is invalid!");
                }
                let commandFile = require('./play.js');
                let a = ["https://www.youtube.com" + this.videos[parseInt(m.content)-1].url]
                
                commandFile.run(message, a, client, ops);
            });
        });
        
    });
}