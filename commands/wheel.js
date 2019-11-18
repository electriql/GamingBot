var index = require('../index.js');
const wsymbol = ["💎", "💠", "🔸", "🔻", "🔴", "⭕", "❌", "🚫"];
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
exports.category = "currency";
exports.info = "Spins a built-in 'wheel of fortune' where you can win rewards. \n__**Rewards**	__\n💎 = Initial Bet + 5x(Initial Bet)\n💠 = Initial Bet + 2.5x(Initial Bet)\n🔸 = Initial Bet\n🔻 = 75% of Bet\n🔴 = 50% of Bet\n⭕ = 25% of Bet\n❌ = 12.5% of Bet\n🚫 = Nothing!"; 
    exports.run = async (message, args, client, ops) => {
        if (args[0] && (!isNaN(args[0]) || args[0].toLowerCase() == "all")) {
            if (args[0].toLowerCase() != "all" && Math.floor(args[0]) < 8) return message.channel.send("❌ That number isn't valid!");
            var pay = args[0];
            var pool = index.pool;
            index.dbSelect(pool, 'userdata', 'id', 'diamonds', message.author.id, function(data) {
                var diamonds = data.diamonds;
                if (args[0].toLowerCase() == "all") pay = diamonds;
                if (diamonds < pay || pay <= 0) {
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
                    var reward = Math.floor(Math.random() * wsymbol.length);
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
                    if (reward == 0) {
                        d = "Awesome! You get 💎x" + Math.round(pay * 5) + " and your initial 💎x" + pay +"!";
                        index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds + Math.round(pay * 5)); 
                        multiplier = 5;
                    }
                    else if (reward == 1) {
                        d = "Nice! You got 💎x" + (pay * 2.5) + " and your initial 💎x" + pay +"!";
                        index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds + Math.round(pay * 2.5));
                        multiplier = 2.5; 
                    }
                    else if (reward == 2) {
                        d = "So close! You only get your initial 💎x" + pay +"!";
                        multiplier = 1;
                    }
                    else if (reward == 3) {
                        d = "You only get 💎x" + Math.round(pay * 0.75) + " but it could be worse!";
                        index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds - Math.round(pay * 0.25)); 
                        multiplier = 0.75;
                    }
                    else if (reward == 4) {
                        d = "You only get 💎x" + Math.round(pay * 0.5) + " back.";
                        index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds - Math.round(pay * 0.5)); 
                        multiplier = 0.5;
                    }
                    else if (reward == 5) {
                        d = "You only get 💎x" + Math.round(pay * 0.25) + " back.";
                        index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds - Math.round(pay * 0.75)); 
                        multiplier = 0.25;
                    }
                    else if (reward == 6) {
                        d = "You only get 💎x" + Math.round(pay * 0.125) + " back.";
                        index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds - Math.round(pay * 0.875)); 
                        multiplier = 0.125;
                    }
                    else if (reward == 7) {
                        d = "Unlucky! You don't get anything!";
                        index.dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds - pay); 
                        multiplier = 0;
                    }

                    index.dbSelect(pool, 'userdata', 'id', 'diamonds', message.author.id, function(data2) {    
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
                                "value" : "**Total Diamonds: " + (data2.diamonds) + "**"
                                }
                                
                            ]
                            }
                        }
                        message.channel.send(wheel);
                    });
                }
            });
        }
        else {
            message.channel.send("❌ You must enter an integer that is greater than or equal to 8!");
        }
    }

