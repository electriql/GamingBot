exports.category = "music";
exports.info = "Gives a list of 10 songs you can choose from."
const search = require("yt-search");
const ytdl = require("ytdl-core");
function secondsToHms(d) {
    d = Number(d);

    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}
exports.run = async (message, args, client, ops) => {

    search(args.join(' '), function(err, res) {
        if (err) {
            console.log(err);
            return message.channel.send("❌ An error occurred.");
        }
        
        try {
            if (ytdl.validateURL(res.videos[0].url)) res.videos.splice(0, 1);
        }
        catch (e) {
            console.log(e);
            return message.channel.send("❌ An error occurred.");
        }
        let videos = res.videos.slice(0, 10);

        let resp = [];

        for (var i in videos) {
            let length = videos[i].duration.timestamp;

            resp.push({
                'name': parseInt(i) + 1 + ". " + videos[i].title + " **[" + length + "]**",
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
                    "icon_url": ops.owner.displayAvatarURL,
                    "text": "Bot Created by " + ops.owner.tag //@ᗴlectricↁiamond#1684
                },
                "author": {
                    "name": "Searching...",
                    "url": "",
                    "icon_url": "https://media.discordapp.net/attachments/415729242341507076/439978267156545546/BotLogo.png?width=676&height=676"
                },
                "fields": resp
            }
        }

        const filter = m => m.author.equals(message.author);

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
