var pScenarios = [
"You go mining and you get extremely lucky! You got (diamonds) diamonds!",
"You use x-ray hacks to get yourself (diamonds) diamonds! Lucky you didn't get banned.",
"Are you serious? You used /give diamond (diamonds)? Cmon don't be lazy.",
"You found (diamonds) diamonds from a days worth of hard work!",
"You saw a sparkle in the wall and found (diamonds) diamonds from a huge diamond vein!",
"You found someones bag and discover (diamonds) diamonds in it! You take the diamonds for yourself.",
"You find someones base and successfully heist (diamonds) diamonds! Good luck getting out of there.",
"You discover that your pickaxe is made of diamonds! You disassemble it and get (diamonds) diamonds!",
"You find no diamonds in the cave, but you find (diamonds) diamonds sitting in your closet!",
]
var nScenarios = [
"You go mining and a creeper blows you up! Aw man you lost (diamonds) diamonds!",
"You tripped on dry stone and fractured your wrist somehow! What a loser! You paid (diamonds) diamonds for treatment!",
"You can't find any diamonds! Being the idiot you are you smash your pickaxe until it breaks! You pay (diamonds) diamonds to repair it!",
"Your mom busts you for going on a mining trip! You pay her (diamonds) diamonds to make her happy.",
"You tried heisting someone's base and failed! You pay (diamonds) diamonds.",
"You got caught x-raying! You paid (diamonds) diamonds to get yourself unbanned.",
"You dig straight down and fall into lava! You lost (diamonds) diamonds!"
]
var oScenarios = [
"You find no diamonds! Sucks to be you!",
"You find diamonds! But they all fall in lava!",
"Someone already mined here! You find no diamonds!",
"Your mom doesn't allow you to go mining!",
"You see a sparkle in the wall... but it turns out its just gold lmao"
]
exports.category = "currency";
exports.info = "Mine for diamonds! However it might not always be successful...";
exports.run = async (message, args, client, ops) => {
    var index = require('../index.js');
    var cooldown = ops.cooldown.get(message.author.id) || {};
    if (cooldown.mine) return message.channel.send("❌ You can use this command again in **" + Math.round(cooldown.mine * 100) / 100 + "** seconds!")
    cooldown.mine = 20;
    ops.cooldown.set(message.author.id, cooldown);
    
    index.dbSelect(index.pool, 'userdata', 'id', 'diamonds', message.author.id, function(user) {
        var chance = Math.random();
        var diamonds = Math.round((Math.random() * 125) + 25);
        console.log(chance);
        if (chance <= 0.125) {
            message.channel.send(oScenarios[Math.floor(Math.random() * oScenarios.length)])
        }
        else if (chance <= 0.25 && user.diamonds > 0) {
            if (diamonds > user.diamonds) diamonds = user.diamonds;
            var result = nScenarios[Math.floor(Math.random() * nScenarios.length)];
            var d = '**' + diamonds + '**';
            result = result.replace('(diamonds)', d);
            message.channel.send(result)
            index.dbUpdate(index.pool, 'userdata', 'id', 'diamonds', message.author.id, user.diamonds - diamonds);
        }
        else {
            var result = pScenarios[Math.floor(Math.random() * pScenarios.length)];
            var d = '**' + diamonds + '**';
            result = result.replace('(diamonds)', d);
            message.channel.send(result)
            index.dbUpdate(index.pool, 'userdata', 'id', 'diamonds', message.author.id, user.diamonds + diamonds);
        }
    });
}