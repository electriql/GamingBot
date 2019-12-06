
const discord = require('discord.js');

const bot = new discord.Client();
var toggleprofanity = require(__dirname + '/commands/toggleprofanity.js');
const prefix = "g!"
var express = require('express');
const fs = require('fs');
const moment = require('moment');
const YTDL = require('ytdl-core');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
let serverData = JSON.parse(fs.readFileSync('Storage/serverData.json', 'utf8'));

const servers = {};
const cooldown = new Map();
const hangman = new Map();
const active = new Map();
const prof = new Map();

const { Pool, Client } = require('pg');

const conString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: conString,
})
var http = require('http');

const PORT = process.env.PORT || 5000;
http.createServer(function (req, res) {
  res.write('Hello World!');
  
  res.end();
}).listen(PORT);
setInterval(function() {
    http.get("http://discord-gamingbot.herokuapp.com");
}, 180000);
console.log("Running on port " + PORT);

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

//Listners
bot.on('guildMemberAdd', member => {
    
    
});
bot.on('guildMemberRemove', member => {
    bot.channels.get(member.guild.systemChannelID).send('**' + member.user.username + '** has left the server. Come back soon.');
});


bot.on('message', message => {

    // Database initialization
    if (message.channel.type == 'text') {
        let roles = message.guild.roles;

        let sender = message.author;
        let msg = message.content.toUpperCase;
            if (message.author.id === '478588483556999169') {
                return;
            }
            else {
                pool.query('SELECT * FROM userdata WHERE id = ' + sender.id, [], (err, res) => {
                    if (!res.rows[0]) {
                        pool.query('INSERT INTO userdata(id, diamonds, daily) VALUES(' + sender.id + ',0,0)', [], (err, res) => {

                        })
                        console.log(res.rows);
                    }
                });
            }
        
        var dispatcher;
    }
    //Command Handler
    let args = message.content.slice(prefix.length).trim().split(' ');
    
    

    let cmd = args.shift().toLowerCase();

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
                cooldown: cooldown,
                hangman: hangman,
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
    if (message.channel.type != 'text') return;
    if (message.content.startsWith(prefix)) {
        try {
            if (!fs.existsSync(__dirname + "/commands/" + cmd + ".js")) return message.channel.send("Unknown command. Type `g!help` to see a list of commands.");
            let commandFile = require(__dirname + "/commands/" + cmd + ".js");
            
            let client = bot;

            let owner = bot.users.get("240982621247635456");

            

            let ops = {
                active: active,
                hangman: hangman,
                cooldown: cooldown,
                prof: prof,
                owner: owner,
            }
            commandFile.run(message, args, client, ops);

        }
        catch (e) {
            console.log(e.stack);
        }
    }
    

    toggleprofanity.filter(message);

    
    
});
bot.on('guildCreate', guild => {
    guild.systemChannel.send("Hello I am **GamingBot!** Thanks for adding me to your server! Do __g!help__ to see what I can do!");
});
bot.on('ready', () => {
    console.log("Gaming launched!");
    bot.user.setActivity('g!help');
    setInterval(function (){
        cooldown.forEach(function(value, key, map) {
            if (value.mine) {
                var updated = {
                    mine : value.mine - 0.01
                }
                cooldown.set(key, updated);
            }
            if (value.mine <= 0) cooldown.set(key, {});
            
        });
        module.exports = {
            dbSelect,
            dbInsert,
            dbUpdate,
            pool
        }
    }, 10);
});
