var index = require('../index.js');
exports.category = "currency";
exports.info = "Roll a die! If you get more than what I roll, then you win some diamonds!";
exports.run = async (message, args, client, ops) => {
    var cooldown = ops.cooldown.get(message.author.id) || {};
    if (cooldown.roll) return message.channel.send("❌ You can use this command again in **" + Math.round(cooldown.roll * 100) / 100 + "** seconds!")
    
    if (args[0] && (!isNaN(args[0]) || args[0].toLowerCase() == "all")) {
        if (args[0].toLowerCase() != "all" && Math.floor(args[0]) < 1) return message.channel.send("❌ That number isn't valid!");
        cooldown.roll = 5;
        ops.cooldown.set(message.author.id, cooldown);
        var pay = args[0];

        var pool = index.pool;
        index.dbSelect(pool, 'userdata', 'id', 'diamonds', message.author.id, function(data) {
            var diamonds = data.diamonds;
            if (args[0].toLowerCase() == "all") pay = diamonds;
            if (diamonds < pay || pay <= 0) {
                const slots = {
                        "embed": {
                        "title": "Slot Machine",
                        "description": "**You don't have enough diamonds for rolling!**",
                        "color": 5375
                        }
                    }
                    message.channel.send(slots);
                }
            else {
                var player = Math.round(Math.random() * 5 + 1);
                var bot = Math.round(Math.random() * 5 + 1);
                var reward = 0;
                var result = "**You Lose!**";
                
                index.dbSelect(pool, 'userdata', 'id', 'diamonds', message.author.id, function(data) {
                    var finalAmount = data.diamonds - pay;
                    if (player > bot) {
                        var multiplier = Math.round((Math.random() * 1.5 + 1.5) * 10) / 10;
                        reward = Math.round(pay * multiplier);
                        result = "**You Win!** You get **" + reward + "** diamonds! And you get your **" + pay + "** diamonds back.\n Multiplier: " + multiplier;
                        finalAmount = Number(finalAmount) + Number(pay) + Number(reward);
                    }
                    index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, finalAmount); 
                    var embed = {
                        "embed": {
                        "title": "You bet coins...",
                        "description": "You rolled a `" + player + "`, I rolled a `" + bot + "`!",
                        "color": 5375,
                        "author": {
                            "name": message.author.username + "'s Roll",
                            "url": "",
                            "icon_url": "https://media.discordapp.net/attachments/415729242341507076/439978267156545546/BotLogo.png?width=676&height=676"
                        },
                        "fields": [
                            {
                            "name": "You now have **" + finalAmount + "** diamonds.",
                            "value": result
                            }
                        ]
                        }
                    }
                    message.channel.send(embed);
                });
            }
        });
    }
    else {
        message.channel.send("❌ You must bet something!");
    }
}