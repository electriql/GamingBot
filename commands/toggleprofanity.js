
const { SystemChannelFlags } = require('discord.js');

exports.info = "A toggleable feature that turns the profanity filter on or off."
exports.category = "moderator";
exports.run = async (message, args, client, ops) => { 
    var index = require('../index.js');
    var pool = index.pool;
    if (message.channel.type == 'GUILD_TEXT') {
        if (message.member.permissions.has('MANAGE_GUILD')) {
            toggleProfanity(message.channel.guild);
            var output = " "
            setTimeout(function(){
                index.dbSelect(pool, 'serverdata', 'id', 'prof', message.guild.id, function(data) {
                    if (data.prof == -1) {
                        output = "off"
                    }
                    else if (data.prof == 1) {
                        output = "on"
                    }
                    message.channel.send("Profanity has been toggled to **" + output + "**!");
                });
            }, 1000)
            
        }
        else {
            message.channel.send("You must have the **Manage Server** permission to execute this command!");
        }
    }
}
function toggleProfanity(guild) {
    // 1 = on, -1 = off
    var index = require('../index.js');
    index.pool.query('SELECT * FROM serverdata WHERE id = ' + guild.id, [], (err, res) => {
        if (!res.rows[0]) {
            index.pool.query('INSERT INTO serverdata(id, prof) VALUES(' + guild.id + ',1)', [], (err, res) => {

            })
        }
    });
    index.dbSelect(index.pool, 'serverdata', 'id', 'prof', guild.id, function(data) {
        var prof = data.prof;
        prof = prof * -1
        index.dbUpdate(index.pool, 'serverdata', 'id', 'prof', guild.id, prof);
        
    
    });
}

exports.filter = function(message) {
    var index = require("../index.js");
    var profanity = require('../profanities.js');
    //Profanity
    if (message.channel.type == 'GUILD_TEXT') {
        index.pool.query('SELECT * FROM serverdata WHERE id = ' + message.guild.id, [], (err, res) => {
            if (res) {
                if (!res.rows[0]) {
                    index.pool.query('INSERT INTO serverdata(id, prof) VALUES(' + message.guild.id + ',1)', [], (err, res) => {
                        if (err) console.log(err);
                    })
                }
            }
        });
        index.dbSelect(index.pool, 'serverdata', 'id', 'prof', message.guild.id, function(data) {
            var pr = -1;
            if (data) pr = data.prof;

            if (pr == 1) {
                var uppr = message.content.toLowerCase();
                var str = uppr.split(" ");
                    for (i = 0; i < str.length; i++) {
                        if (profanity.profanities.includes(str[i])) {
                            if (message.author.bot)
                                return;
                            else {
                                message.delete();
                                message.channel.send(message.author.toString() + " calm down jamal. This is mainland china");
                                const p = message.guild.channels.cache.find(channel => channel.name == 'profanity');
                                if (!p)
                                        message.channel.send('Error: A text channel named "profanity" does not exist. Add one please.');
                                else if (p.type == 'text')
                                    p.send('**' + message.author.username + '** just said a no no word. They said ```' + message.content + '``` __**No no Word:**__ ' + str[i]);
                                else 
                                    message.channel.send('Error: A text channel named "profanity" does not exist. Add one please.');
                                return;
                            }
                
                        }
                    }
            
                }
            });
        }
    
}




