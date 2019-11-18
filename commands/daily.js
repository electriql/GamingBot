exports.category = "currency";
var index = require('../index.js');
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
    
    exports.info = "Gives your daily 100 diamonds. Obtainable once every 24 hours."
    exports.run = async (message, args, client, ops) => {
        var date = new Date();
            var time = date.getTime();
            var day = date.getDay();
            var minutes = 1000 * 60;
            var hours = minutes * 60;
            index.dbSelect(index.pool, 'userdata', 'id', 'daily', message.author.id, function(data) {
                var daily = data.daily;
                if (daily == 0) {
                    index.dbSelect(index.pool, 'userdata', 'id', 'daily', message.author.id, function(output) {
                        index.dbUpdate(index.pool, 'userdata', 'id', 'daily', message.author.id, time);
                        index.dbSelect(index.pool, 'userdata', 'id', 'diamonds', message.author.id, function(output) {
                            var diamonds = output.diamonds;
                            index.dbUpdate(index.pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds + 100);
                        });
                         
                        message.channel.send("You have recieved your daily 💎x100!");
                    });
                }
                else if (time >= daily - (-(hours*24))) {
                    index.dbSelect(index.pool, 'userdata', 'id', 'daily', message.author.id, function(output) {
                        index.dbUpdate(index.pool, 'userdata', 'id', 'daily', message.author.id, time);
                        index.dbSelect(index.pool, 'userdata', 'id', 'diamonds', message.author.id, function(output) {
                            var diamonds = output.diamonds;
                            index.dbUpdate(index.pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds + 100);
                        });
                         
                        message.channel.send("You have recieved your daily 💎x100!");
                    });
                }
                else {
                    
                    var next = daily - (-(hours*24));
                    var left = next - time;
                    if (left / 3600000 > 1) {
                        var hour = left / 3600000;
                        let hr = Math.floor(hour);
                        
                        var minute = (left - (hr * 3600000)) / 60000;
                        
                        var min = Math.floor(minute);
                        var second = (left - ((hr * 3600000) + (min * 60000))) / 1000;
                        var s = Math.round(second * 100) / 100
                        message.channel.send("You have already recieved your daily reward! You can receive it again in **" + hr + "** hours, **" + Math.floor(minute) + "** minutes, " + "and **" + s + "** seconds!"); 
                    }
                    else if (left / 60000 > 1) {
                        var minute = left / 60000;
                        var min = Math.floor(minute);

                        var second = (left - ((min * 60000))) / 1000;
                        var s = Math.round(second * 100) / 100
                        
                        message.channel.send("You have already recieved your daily reward! You can receive it again in **" + min + "** minutes, and **" + s + "** seconds!"); 
                    }
                    else {
                        var second = left / 1000;
                        var sec = Math.round(second * 100) / 100
                        message.channel.send("You have already recieved your daily reward! You can receive it again in **" + sec + "** seconds!"); 
                    }
                    
                }
            });
    }