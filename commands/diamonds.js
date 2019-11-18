var index = require('../index.js');
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));

exports.category = "currency";
exports.info = "Shows how many diamonds you currently have."
exports.run = async (message, args, client, ops) => {
    var user = message.author;
    if (args[0]) {
            for (i = 0; i < message.guild.memberCount; i++) {
                    if (((args[0].toLowerCase() == message.guild.members.array()[i].displayName.toLowerCase() 
                    || args[0].toLowerCase() == message.guild.members.array()[i].user.username.toLowerCase())
                     || args[0].toLowerCase() == message.guild.members.array()[i].user.tag.toLowerCase())) {    
                            user = message.guild.members.array()[i].user;    
                    }
                    else if (message.mentions.members.first()) {
                            if (message.mentions.members.first().user == message.guild.members.array()[i].user) {
                                    user = message.guild.members.array()[i].user; 
                            }
                    }
            }
    }
    index.pool.query('SELECT * FROM userdata WHERE id = ' + user.id, [], (err, res) => {
        if (!res.rows[0]) {
            pool.query('INSERT INTO userdata(id, diamonds, daily) VALUES(' + user.id + ',0,0)', [], (err, res) => {

            })
            console.log(res.rows);
        }
    });
    index.dbSelect(index.pool, 'userdata', 'id', 'diamonds', user.id, function(data) {
    var diamonds = data.diamonds;
    message.channel.send("**" + user.username + "** has 💎x" + diamonds + "!");
    })
}
