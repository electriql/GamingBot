var index = require('../index.js');
const wsymbol = ["💎", "💠", "🔸", "🔻", "🔴", "⭕", "❌", "🚫"];
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
exports.category = "currency";
exports.info = "Spins a built-in 'wheel of fortune' where you can win rewards. Chances are not equal. \n__**Rewards**	__\n💎 = Initial Bet + 2x(Initial Bet)\n💠 = Initial Bet + 1x(Initial Bet)\n🔸 = Initial Bet\n🔻 = 75% of Bet\n🔴 = 50% of Bet\n⭕ = 25% of Bet\n❌ = 12.5% of Bet\n🚫 = Nothing!"; 
    exports.run = async (message, args, client, ops) => {
        var cooldown = ops.cooldown.get(message.author.id) || {};
        if (cooldown.wheel) {
            return message.channel.send("❌ You can use this command again in **" + Math.round(cooldown.wheel * 100) / 100 + "** seconds!")
        }
        if (args[0] && (!isNaN(args[0]) || args[0].toLowerCase() == "all")) {
            var pay = args[0];
            var pool = index.pool;
            index.dbSelect(pool, 'userdata', 'id', 'diamonds', message.author.id, function(data) {
                var diamonds = data.diamonds;
                if (args[0].toLowerCase() == "all") pay = diamonds;
                if (diamonds < pay || pay < 8) {
                    const slots = {
                            "embed": {
                            "title": "Wheel of Diamonds",
                            "description": "**You don't have enough diamonds to bet this much on the wheel!**",
                            "color": 5375
                            }
                        }
                        message.channel.send(slots);
                }
                else {
                    cooldown.wheel = 10;
                    ops.cooldown.set(message.author.id, cooldown);
                    var chance = Math.random();
                    if (chance <= 0.2) reward = Math.round(Math.random());
                    else reward = Math.round(Math.random() * 5 + 2)
                    var slot1 = reward - 1;
                    var slot3 = reward + 1;
                    var slot4 = reward + 2;
                    var slot5 = reward + 3;
                    var slot6 = reward + 4;
                    var slot7 = reward + 5;
                    var slot8 = reward + 6;
                    if (slot1 < 0) {
                        slot1 = 7;
                    }
        
        
                    if (slot3 > 7) {
                        slot3 = 0;
                        slot4 = 1;
                        slot5 = 2;
                        slot6 = 3;
                        slot7 = 4;
                        slot8 = 5;
                    }
                    if (slot4 > 7) {
                        slot4 = 0;
                        slot5 = 1;
                        slot6 = 2;
                        slot7 = 3;
                        slot8 = 4;
                    }
                    if (slot5 > 7) {
                        slot5 = 0;
                        slot6 = 1;
                        slot7 = 2;
                        slot8 = 3;
                    }
                    if (slot6 > 7) {
                        slot6 = 0;
                        slot7 = 1;
                        slot8 = 2;
                    }
                    if (slot7 > 7) {
                        slot7 = 0;
                        slot8 = 1;
                    }
                    if (slot8 > 7) {
                        slot8 = 0;
                    }
        
                    var d = "";
                    var multiplier = 0;
                    var result = 0;
                    if (reward == 0) {
                        result = diamonds + Math.round(pay * 2);
                        d = "Jackpot! You get 💎x" + Math.round(pay * 2) + " and your initial 💎x" + pay +"!";
                        index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, result); 
                        multiplier = 3;
                    }
                    else if (reward == 1) {
                        result = diamonds + Math.round(pay * 2.5);
                        d = "Nice! You got 💎x" + Math.round(pay) + " and your initial 💎x" + pay +"!";
                        index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, result);
                        multiplier = 2; 
                    }
                    else if (reward == 2) {
                        result = diamonds;
                        d = "So close! You only get your initial 💎x" + pay +"!";
                        multiplier = 1;
                    }
                    else if (reward == 3) {
                        result = diamonds - Math.round(pay * 0.25);
                        d = "You only get 💎x" + Math.round(pay * 0.75) + " but it could be worse!";
                        index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, result); 
                        multiplier = 0.75;
                    }
                    else if (reward == 4) {
                        result = diamonds - Math.round(pay * 0.5);
                        d = "You only get 💎x" + Math.round(pay * 0.5) + " back.";
                        index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, result); 
                        multiplier = 0.5;
                    }
                    else if (reward == 5) {
                        result = diamonds - Math.round(pay * 0.75);
                        d = "You only get 💎x" + Math.round(pay * 0.25) + " back.";
                        index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, result); 
                        multiplier = 0.25;
                    }
                    else if (reward == 6) {
                        result = diamonds - Math.round(pay * 0.875);
                        d = "You only get 💎x" + Math.round(pay * 0.125) + " back.";
                        index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, result); 
                        multiplier = 0.125;
                    }
                    else if (reward == 7) {
                        result = diamonds - pay;
                        d = "Unlucky! You don't get anything!";
                        index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, result); 
                        multiplier = 0;
                    }

                        const wheel = {
                            "embed": {
                            "title": "Wheel of Diamonds",
                            "description": "**You spend 💎x" + pay + " on the wheel...**",
                            "color": 5375,
                            "fields": [
                            {
                                "name": "================",
                                "value": "================"
                                },
                                {
                                "name": "---------vv-----------",
                                "value": "| " + wsymbol[slot1] + " | " + wsymbol[reward] + " | " + wsymbol[slot3] + " |"
                                },
                                {
                                "name": "| " + wsymbol[slot8] + " | 🌀 | " + wsymbol[slot4] + " |",
                                "value": "| " + wsymbol[slot7] + " | " + wsymbol[slot6] + " | " + wsymbol[slot5] + " |"
                                },
                                {
                                "name": "-----------------------",
                                "value": "================"
                                },
                                {
                                "name": "================",
                                "value": "**" + d + "**"
                                },
                                {
                                "name" : "Prize Multiplier: " + multiplier + "x",
                                "value" : "**Total Diamonds: " + (result) + "**"
                                }
                                
                            ]
                            }
                        }
                        message.channel.send(wheel);
                }
            });
        }
        else {
            message.channel.send("❌ You must enter an integer that is greater than or equal to 8!");
        }
    }

