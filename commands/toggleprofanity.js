
const fs = require('fs');

exports.info = "A toggleable feature that turns the profanity filter on or off."
exports.category = "moderator";
let serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'));
exports.run = async (message, args, client, ops) => { 
    var index = require('../index.js');
    var pool = index.pool;
    if (message.channel.type == 'text') {
        if (message.channel.guild.member(message.author).permissions.has('MANAGE_GUILD')) {
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
    fs.writeFileSync('Storage/serverData.json', JSON.stringify(serverData), (err) => {
        if (err) console.log(err);
    }) 
}

exports.filter = function(message) {
    var index = require("../index.js");
    var profanities = require('profanities');
    //Profanity
    if (message.channel.type == 'text') {
        index.pool.query('SELECT * FROM serverdata WHERE id = ' + message.guild.id, [], (err, res) => {
            if (!res.rows[0]) {
                index.pool.query('INSERT INTO serverdata(id, prof) VALUES(' + message.guild.id + ',1)', [], (err, res) => {

                })
            }
        });
        index.dbSelect(index.pool, 'serverdata', 'id', 'prof', message.guild.id, function(data) {

            var pr = data.prof;

            if (pr == 1) {
            
                var uppr = message.content.toUpperCase();
                var str = uppr.split(" ");
                    for (i = 0; i < str.length; i++) {
                        for (x = 0; x < profanities.length; x++) {
                            if (str[i] == profanities[x].toUpperCase()) {
                                if (message.author.id === '478588483556999169') {
                                    
                                    return;
                                }
                                else if (message.author.id === '490674227976863765') {
                                    
                                    return;
                                }
                                else {
                                    message.delete();
                                    message.channel.send("Whoa watch it " + message.author + "! Inappropriate language isn't allowed!");
                                    const p = message.guild.channels.find('name', 'profanity')
                                    if (!p) {
                                        message.channel.send('Error: A channel named "profanity" does not exist. Add one please.');
                                        
                                    return;
                                    }
                                    else {
                                        p.send('**' + message.author.username + '** has been using some bad language just now. They said ```' + message.content + '``` __**Bad Word:**__ ' + str[i]);
                                        return;
                                    }
                                    return;
                                }
                    
                            }
                        }
                    }
            
                }
            });
        }
    
}




