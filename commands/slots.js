var index = require('../index.js');
const fs = require('fs');
const symbols = ["⭕", "🔵", "🔶", "⬜", "❤", "🔺", "💠", "🔻"];
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));

exports.category = "currency";
exports.info = "Rolls a slot machine where you can give a custom input."
exports.run = async (message, args, client, ops) => {
    var cooldown = ops.cooldown.get(message.author.id) || {};
    if (cooldown.slots) return message.channel.send("❌ You can use this command again in **" + Math.round(cooldown.slots * 100) / 100 + "** seconds!")
    
    if (args[0] && (!isNaN(args[0]) || args[0].toLowerCase() == "all")) {
        if (args[0].toLowerCase() != "all" && Math.floor(args[0]) < 1) return message.channel.send("❌ That number isn't valid!");
        cooldown.slots = 5;
        ops.cooldown.set(message.author.id, cooldown);
        var pay = args[0];
        
        var pool = index.pool;
        var chance = Math.random();
        var slot1 = Math.floor(Math.random() * symbols.length);
        var slot2 = Math.floor(Math.random() * symbols.length);
        var slot3 = Math.floor(Math.random() * symbols.length);
        var slot4 = Math.floor(Math.random() * symbols.length); 
        var slot5 = Math.floor(Math.random() * symbols.length);
        var slot6 = Math.floor(Math.random() * symbols.length);
        var slot7 = Math.floor(Math.random() * symbols.length);
        var slot8 = Math.floor(Math.random() * symbols.length);
        var slot9 = Math.floor(Math.random() * symbols.length);

        index.dbSelect(pool, 'userdata', 'id', 'diamonds', message.author.id, function(data) {
            var diamonds = data.diamonds;
            if (args[0].toLowerCase() == "all") pay = diamonds;
            if (diamonds < pay || pay <= 0) {
                const slots = {
                        "embed": {
                        "title": "Slot Machine",
                        "description": "**You don't have enough diamonds for the slot machine!**",
                        "color": 5375
                        }
                    }
                    message.channel.send(slots);
                }
            else {
                var multiplier = Math.floor((Math.random() * 15) + 15) / 10;
                // If slots 4, 5, and 6 are the same then they win.
                if (chance <= (1.0/3) || (slot4 == slot5 && slot5 == slot6)) {
                    var middle = Math.floor(Math.random() * symbols.length);
                    var prize = Math.round(multiplier * pay);
                    // The slot machine if someone wins
                    const slots = {
                        "embed": {
                        "title": "Slot Machine",
                        "description": "**You spend 💎x" + pay + " on the slot machine...**",
                        "color": 5375,
                        "fields": [
                            {
                            "name": "==========================",
                            "value": "| " + symbols[slot1] + " | " + symbols[slot2] + " | " + symbols[slot3] + " |"
                            },
                            {
                            "name": "==========================",
                            "value": "| " + symbols[middle] + " | " + symbols[middle] + " | " + symbols[middle] + " | <<<"
                            },
                            {
                            "name": "==========================",
                            "value": "| " + symbols[slot7] + " | " + symbols[slot8] + " | " + symbols[slot9] + " |"
                            },
                            {
                            "name": "==========================",
                            "value": "**And you win! You get 💎x" + prize + "! Also, you get your 💎x" + pay + " back.**"
                            },
                            {
                            "name" : "Prize Multiplier: " + multiplier + "x",
                            "value" : "**Total Diamonds: " + (diamonds + prize) + "**"
                            }
                        ]
                        }
                    }
                    message.channel.send(slots);
                    index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds + prize); 
                }
                else {

                    // The slot machine if someone loses
                    const slots = {
                        "embed": {
                        "title": "Slot Machine",
                        "description": "**You spend 💎x" + pay + " on the slot machine...**",
                        "color": 5375,
                        "fields": [
                            {
                            "name": "==========================",
                            "value": "| " + symbols[slot1] + " | " + symbols[slot2] + " | " + symbols[slot3] + " |"
                            },
                            {
                            "name": "==========================",
                            "value": "| " + symbols[slot4] + " | " + symbols[slot5] + " | " + symbols[slot6] + " | <<<"
                            },
                            {
                            "name": "==========================",
                            "value": "| " + symbols[slot7] + " | " + symbols[slot8] + " | " + symbols[slot9] + " |"
                            },
                            {
                            "name": "==========================",
                            "value": "**And you lose. Better luck next time.**"
                            },
                            {
                            "name" : "Your Prize Multiplier would have been " + multiplier + "x",
                            "value" : "**Total Diamonds: " + (diamonds - pay) + "**"
                            }
                        ]
                        }
                    }
                    var final = diamonds - pay;
                    index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, final);
                    
                    message.channel.send(slots);
                }
            }
        });
    }
    else {
        message.channel.send("❌ You must enter an integer that is greater than 0!");
    }
}
