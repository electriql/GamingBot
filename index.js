const discord = require('discord.js');

const bot = new discord.Client();

const prefix = "g!"
var express = require('express');
const fs = require('fs');
const moment = require('moment');
const YTDL = require('ytdl-core');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
let serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'));
const symbols = ["⭕", "🔵", "🔶", "⬜", "❤", "🔺", "💠", "🔻"];
const wsymbol = ["💎", "💠", "🔸", "🔻", "🔴", "⭕", "❌", "🚫"];
var profanities = require('profanities');
const servers = {};
const active = new Map();
const prof = new Map();

const { Pool, Client } = require('pg')

const conString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: conString,
  })
  

var app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, function() {
    console.log('Running on port ' + PORT);
});
bot.login(process.env.BOT_TOKEN); 

//DATABASE INTERACTIONS

function dbSelect(pool, db, c1, c2, key, callback) {
    pool.query('SELECT ' + c2 + ' FROM ' + db + ' WHERE ' + c1 + ' = ' + key + ' FETCH FIRST ROW ONLY', [], (err, res) => {
        if (err) {
          throw err;
        }
        return callback(res.rows[0]);
    });
}
function dbUpdate(pool, db, c1, c2, key, value) {
    pool.query('UPDATE ' + db + ' SET ' + c2 + ' = ' + value + ' WHERE ' + c1 + ' = ' + key, [], (err, res) => {
        if (err) {
            console.log(err.stack)
          }
    })
}

function dbInsert(pool, db, c1, c2, key, value) {
    let text = 'INSERT INTO ' +  db + '(' + c1 + ', ' + c2 + ') VALUES($1, $2)';
    let values = [key, value];
      
      pool.query(text, values, (err, res) => {
        if (err) {
          console.log(err.stack)
        } 
      })
}

//

function filter(message) {
    
        //Profanity
        if (message.channel.type == 'text') {
            
            pool.query('SELECT * FROM serverdata WHERE id = ' + message.guild.id, [], (err, res) => {
                if (!res.rows[0]) {
                    pool.query('INSERT INTO serverdata(id, prof) VALUES(' + message.guild.id + ',1)', [], (err, res) => {

                    })
                    console.log(res.rows);
                }
            });
            dbSelect(pool, 'serverdata', 'id', 'prof', message.guild.id, function(data) {

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
function toggleProfanity(guild) {
    // 1 = on, -1 = off
    pool.query('SELECT * FROM serverdata WHERE id = ' + guild.id, [], (err, res) => {
        if (!res.rows[0]) {
            pool.query('INSERT INTO serverdata(id, prof) VALUES(' + guild.id + ',1)', [], (err, res) => {

            })
            console.log(res.rows);
        }
    });
    dbSelect(pool, 'serverdata', 'id', 'prof', guild.id, function(data) {
        var prof = data.prof;
        prof = prof * -1
        dbUpdate(pool, 'serverdata', 'id', 'prof', guild.id, prof);
        
    
    });
    fs.writeFileSync('Storage/serverData.json', JSON.stringify(serverData), (err) => {
        if (err) console.log(err);
    }) 
}

function roll(message) {
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
    dbSelect(pool, 'userdata', 'id', 'diamonds', message.author.id, function(data) {
        var diamonds = data.diamonds;
        if (diamonds < 100) {
            var n = 100 - diamonds;
            const slots = {
                    "embed": {
                    "title": "Slot Machine",
                    "description": "**You need 💎x" + n + " more to use the slot machine!**",
                    "color": 5375
                    }
                }
                message.channel.send(slots);
            }
        else {
            // If slots 4, 5, and 6 are the same then they win.
            console.log(chance);
            if (chance <= 0.25 || (slot4 == slot5 && slot5 == slot6)) {
                var ran = Math.floor(Math.random() * 151) + 49;
                var middle = Math.floor(Math.random() * symbols.length);
                const slots = {
                    "embed": {
                    "title": "Slot Machine",
                    "description": "**You spend 💎x100 on the slot machine...**",
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
                        "value": "**And you win! You get 💎x" + ran + "! Also, you get your 💎x100 back.**"
                        }
                    ]
                    }
                }
                message.channel.send(slots);
                dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds + ran); 
            }
            else {
                const slots = {
                    "embed": {
                    "title": "Slot Machine",
                    "description": "**You spend 💎x100 on the slot machine...**",
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
                        }
                    ]
                    }
                }
                dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds - 100);
                message.channel.send(slots);
            }
        }
    });
    
}
function spin(message) {
    dbSelect(pool, 'userdata', 'id', 'diamonds', message.author.id, function(data) {
        var diamonds = data.diamonds;
        if (diamonds < 200) {
            var n = 200 - diamonds;
            const slots = {
                    "embed": {
                    "title": "Wheel of Diamonds",
                    "description": "**You need 💎x" + n + " more to spin the wheel!**",
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
            if (reward == 0) {
                d = "Awesome! You get 💎x100 and your initial 💎x200!";
                dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds + 100); 
            }
            else if (reward == 1) {
                d = "Nice! You got 💎x50 and your initial 💎x200!";
                dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds + 50); 
            }
            else if (reward == 2) {
                d = "So close! You only get your initial 💎x200!";
            }
            else if (reward == 3) {
                d = "You only get 💎x150 but it could be worse!";
                dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds - 50); 
            }
            else if (reward == 4) {
                d = "You only get 💎x100 back.";
                dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds - 100); 
            }
            else if (reward == 5) {
                d = "You only get 💎x50 back.";
                dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds - 150); 
            }
            else if (reward == 6) {
                d = "You only get 💎x25 back.";
                dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds - 175); 
            }
            else if (reward == 7) {
                d = "Unlucky! You don't get anything!";
                dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds - 200); 
            }
                
            const wheel = {
                "embed": {
                "title": "Wheel of Diamonds",
                "description": "**You spend 💎x200 on the wheel...**",
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
                    }
                ]
                }
            }
            message.channel.send(wheel);
        }
    });
}

//Listners
bot.on('guildMemberAdd', member => {
    
    if (member.guild.id == "240986416555884548") {
        bot.channels.get(member.guild.systemChannelID).send('Welcome to the server ' + member.user + '! Make sure to check your DMs! Have a great time!');
        //var role = member.guild.roles.find('name', 'Member');
        //member.addRole(role);
        const data = {
            "embed": {
            "title": "**Read our rules!**",
            "description": "Make sure to go *[here](https://docs.google.com/document/d/1bPV3zuHWpyLUck_n7J6z1jt2IY-wBPUS6O-46x-hMGc/edit?usp=sharing)* or go to #rules to see our rules. Do this before doing anything else! If you want to apply for donator, type g/donator to visit the form!",
            "color": 6655,
            "image": {}
            }
        };
        member.user.sendMessage(data);
        member.user.send("_**Ranks**_");
        member.user.send("Ranks are a huge part of our server and you should understand how they work. The color next to the rank info is the color that people with the rank will have.");
        const owner = {
            "embed": {
                "title": " _**Leader**_ ",
                "description": "The most powerful rank in the server. Messing with them is the worst idea in the world.",
                "color": 65295,
                "image": {}
                }
            }
        const admin = {
            "embed": {
                "title": " _**Commander**_ ",
                "description": "The second most powerful rank in the server. Respect and listen to them just like with Leaders.",
                "color": 16714752,
                "image": {}
                }
            };
        const premium = {
            "embed": {
                "title": " _**Premium**_ ",
                "description": "A prestige rank on our server. More abilities than members.",
                "color": 4886754,
                "image": {}
                }
        };
        const disciplined = {
            "embed": {
                "title": " _**Disciplined**_ ",
                "description": "People with this rank has been breaking some rules. You better make sure you are not this rank.",
                "color": 2884612,
                "image": {}
                }
        };
        const test = {
            "embed": {
                "title": " _**Member**_ ",
                "description": "Pretty straightforward. This is the rank that most people have and is the default rank.",
                "color": 7309969,
                "image": {}
                }
        };
        
        member.user.sendMessage(disciplined);
        member.user.sendMessage(test);
        member.user.sendMessage(premium);
        member.user.sendMessage(admin);
        member.user.sendMessage(owner);
    }
    else {
        bot.channels.get(member.guild.systemChannelID).send('Welcome to the server ' + member.user + '! Have a great time!');
    }
});
bot.on('guildMemberRemove', member => {
    bot.channels.get(member.guild.systemChannelID).send('**' + member.user.username + '** has left the server. Come back soon.');
});


bot.on('message', message => {

    
    //Command Handler
    let args = message.content.slice(prefix.length).trim().split(' ');
    
    

    let cmd = args.shift().toLowerCase();

    //Messaging
    
    /*if (message.channel.type == 'dm') {
        if (bot.guilds.get(args[0])) {
            var guild = bot.guilds.get(args[0]);
            var msg = "";
            for (i = 1; i < args.length; i++) {
                msg = msg + " " + args[i];
            }
            var channel = bot.channels.get(guild.systemChannelID);
            if (guild.id == '439564187966898176') {
                channel = guild.channels.find('name', 'mainstream');
            }

            channel.send(msg);
        }
    }*/

    // Private Commands

    
    if (message.author.bot) return;
    if ((message.channel.type == "dm" && message.content.startsWith("p!")) && message.author.id === '240982621247635456') {
        try {
            if (!fs.existsSync(__dirname + "/pc/" + cmd + ".js")) return message.channel.send("Unknown Command.");
            let commandFile = require(__dirname + "/pc/" + cmd + ".js");
            
            let client = bot;

            let owner = bot.users.get("240982621247635456");

            

            let ops = {
                active: active,
                prof: prof,
                owner: owner,
            }

            commandFile.run(message, args, client, ops);

        }
        catch (e) {
            console.log(e.stack);
        }
        return;
    }
    if (message.channel.type != 'text') return message.channel.send("Commands must be used in a server channel.");
    if (message.content.startsWith(prefix)) {
        try {
            if (!fs.existsSync(__dirname + "/commands/" + cmd + ".js")) return message.channel.send("Unknown command. Type `g!help` to see a list of commands.");
            let commandFile = require(__dirname + "/commands/" + cmd + ".js");
            
            let client = bot;

            let owner = bot.users.get("240982621247635456");

            

            let ops = {
                active: active,
                prof: prof,
                owner: owner,
            }

            commandFile.run(message, args, client, ops);

        }
        catch (e) {
            console.log(e.stack);
        }
    }
    

    filter(message);

    //Currency
    if (message.channel.type == 'text') {
        
        

        let roles = message.guild.roles;
        
        var date = new Date();
        var time = date.getTime();
        let sender = message.author;
        let msg = message.content.toUpperCase;
            if (message.author.id === '478588483556999169') {
                return;
            }
            else {
                var ran = Math.floor(Math.random() * 10) + 1;
                pool.query('SELECT * FROM userdata WHERE id = ' + sender.id, [], (err, res) => {
                    if (!res.rows[0]) {
                        pool.query('INSERT INTO userdata(id, diamonds, daily) VALUES(' + sender.id + ',0,0)', [], (err, res) => {

                        })
                        console.log(res.rows);
                    }
                });
                setTimeout(function() {
                    dbSelect(pool, 'userdata', 'id', 'diamonds', sender.id, function(data) {
                    
                        var diamonds = data.diamonds;
                        dbUpdate(pool, 'userdata', 'id', 'diamonds', sender.id, diamonds + ran);
                    })
                }, 1000)
                
                
            
                fs.writeFileSync('Storage/userData.json', JSON.stringify(userData), (err) => {
                    if (err) console.log(err);
                }) 
            }
        
        var server = servers[message.guild.id];
        var dispatcher;
        if (message.content.startsWith(prefix + "diamonds")) {
            let sender = message.author;
            dbSelect(pool, 'userdata', 'id', 'diamonds', message.author.id, function(data) {
                    
                var diamonds = data.diamonds;
                message.channel.send("**" + message.author.username + ",** You have 💎x" + diamonds + "!");
            })
            
            
        }
        else if (message.content.startsWith(prefix + "daily")) {
            var date = new Date();
            var time = date.getTime();
            var day = date.getDay();
            var minutes = 1000 * 60;
            var hours = minutes * 60;
            dbSelect(pool, 'userdata', 'id', 'daily', message.author.id, function(data) {
                var daily = data.daily;
                if (daily == 0) {
                    dbSelect(pool, 'userdata', 'id', 'daily', message.author.id, function(output) {
                        var diamonds = output.diamonds;
                        dbUpdate(pool, 'userdata', 'id', 'daily', message.author.id, time);
                        dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds + 100);
                        message.channel.send("You have recieved your daily 💎x100!");
                    });
                }
                else if (time >= daily - (-(hours*24))) {
                    dbSelect(pool, 'userdata', 'id', 'daily', message.author.id, function(output) {
                        var diamonds = output.diamonds;
                        dbUpdate(pool, 'userdata', 'id', 'daily', message.author.id, time);
                        dbUpdate(pool, 'userdata', 'id', 'diamonds', message.author.id, diamonds + 100);
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
        else if (message.content.startsWith(prefix + "slots")) {
            roll(message);
        }
        else if (message.content.startsWith(prefix + "wheel")) {
            spin(message);
            
            
        }

        // Toggle Profanity
        else if (message.content.startsWith(prefix + "toggleprofanity")) {
            if (message.channel.type == 'text') {
                if (message.channel.guild.member(message.author).permissions.has('MANAGE_GUILD')) {
                    toggleProfanity(message.channel.guild);
                    var output = " "
                    setTimeout(function(){
                        dbSelect(pool, 'serverdata', 'id', 'prof', message.guild.id, function(data) {
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
           
     
    }
    
});
bot.on('guildCreate', guild => {
    guild.systemChannel.send("Hello I am **GamingBot!** Thanks for adding me to your server! Do __g!help__ to see what I can do!");
});
bot.on('ready', () => {
    console.log("Gaming launched!");
    bot.user.setActivity('g!help');
    
    setInterval(function (){

        fs.readFile('Storage/userData.json', 'utf8', function(err, data) {
            fs.writeFileSync('Storage/backup.json', JSON.stringify(userData), (err) => {
                if (err) console.log(err);
            })
        });
        fs.readFile('Storage/serverData.json', 'utf8', function(err, data) {
            fs.writeFileSync('Storage/serverBackup.json', JSON.stringify(serverData), (err) => {
                if (err) console.log(err);
            })
        });
        
    }, 1000);
});
