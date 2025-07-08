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
const { InteractionContextType, MessageFlags, SlashCommandBuilder } = require("discord.js");
module.exports = {
    category: "currency",
    info: "Mine for diamonds! However it might not always be successful...",
    data: new SlashCommandBuilder()
        .setName("mine")
        .setDescription("Mine for diamonds! However it might not always be successful...")
        .setContexts(InteractionContextType.Guild),
    async execute(interaction) {
        const index = require("../index.js");
        var user = interaction.user;
        var cooldown = index.ops.cooldown.get(user.id) || {};
        if (cooldown.mine)
            return interaction.reply({ content: "❌ You can use this command again in **" + Math.round(cooldown.mine * 100) / 100 + "** seconds!", flags: MessageFlags.Ephemeral })
        cooldown.mine = 20;
        index.ops.cooldown.set(user.id, cooldown);
        var userData = index.getUserData();
        if (!userData[user.id]) {
            userData[user.id] = index.createUser();
            index.setUserData(userData);
        }

        var chance = Math.random();
        var diamonds = Math.round((Math.random() * 125) + 25);
        var result = "";
        if (chance <= 0.125) {
            result = oScenarios[Math.floor(Math.random() * oScenarios.length)];
        }
        else if (chance <= 0.25 && userData[user.id].diamonds > 0) {
            if (diamonds > userData[user.id].diamonds)
                diamonds = userData[user.id].diamonds;
            result = nScenarios[Math.floor(Math.random() * nScenarios.length)];
            userData[user.id].diamonds -= diamonds;
        }
        else {
            result = pScenarios[Math.floor(Math.random() * pScenarios.length)];
            userData[user.id].diamonds += diamonds;
        }
        index.setUserData(userData);
        result = result.replace('(diamonds)', "**" + diamonds + "**");
        interaction.reply(result);
    }
}