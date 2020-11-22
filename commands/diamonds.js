var index = require('../index.js');
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));

const Utils = require("../util.js");

exports.category = "currency";
exports.info = "Shows how many diamonds you currently have."
exports.run = async (message, args, client, ops) => {
    let utils = new Utils();
    var user = message.author;
    if (args[0]) {
        var name = "";
                for (i = 0; i < args.length; i++) {
                      name += args[i] + " "; 
                }
                name = name.trim();
                user = await utils.findUser(message, name);
    }
    index.pool.query('SELECT * FROM userdata WHERE id = ' + user.id, [], (err, res) => {
        if (!res.rows[0]) {
            index.pool.query('INSERT INTO userdata(id, diamonds, daily) VALUES(' + user.id + ',0,0)', [], (err, res) => {
                
            })
        }
    });
    index.dbSelect(index.pool, 'userdata', 'id', 'diamonds', user.id, function(data) {
        if (!data) return message.channel.send("**" + user.username + "** has 💎x0!");
        var diamonds = data.diamonds;
        message.channel.send("**" + user.username + "** has 💎x" + diamonds + "!");
    })
}
