var index = require('../index.js');
const Utils = require("../util.js");
exports.category = "currency";
exports.info = "Gives the a user a specified amount of diamonds!"
exports.run = async (message, args, client, ops) => {
    let utils = new Utils();
    if (!args[0]) return message.channel.send("❌ You must specifiy someone to pay!");
    if (args.length == 1) return message.channel.send("❌ Not enough arguments!");
    if (isNaN(args[args.length - 1])) return message.channel.send("❌ The amount must be an integer!");
    var member = message.author;
    var name = "";
    for (i = 0; i < args.length - 1; i++) {
        name += args[i] + " "; 
    }
    name = name.trim();
    member = await utils.findUser(message, name);
    if (!member) return message.channel.send("❌ This user doesn't exist!");
    if (member == message.author) return message.channel.send("❌ You can't pay yourself!");
    if (args[args.length - 1] < 1) return message.channel.send("❌ The amount must be greater than 0!");
    var pay = Math.floor(args[args.length - 1]);
    index.dbSelect(index.pool, 'userdata', 'id', 'diamonds', message.author.id, function(user) {
        if (user.diamonds - pay < 0) return message.channel.send("❌ You can't afford this payment!");
        
        index.dbSelect(index.pool, 'userdata', 'id', 'diamonds', member.id, function(reciever) {
            message.channel.send("Payment successful! Now you have 💎x" + (user.diamonds - pay) + " and " + member.username + " has 💎x" + (reciever.diamonds + pay));
            index.dbUpdate(index.pool, 'userdata', 'id', 'diamonds', message.author.id, user.diamonds - pay);
            index.dbUpdate(index.pool, 'userdata', 'id', 'diamonds', member.id, reciever.diamonds + pay);

        });
    });
}