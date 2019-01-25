
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));

exports.info = "Shows how many diamonds you currently have."
exports.run = async (message, args, client, ops) => {
    //Prank
    /*if (message.guild.id == "415729604217798656") {
        for (var i = 0; i < message.guild.channels.array().length; i++) {
            message.guild.channels.array()[i].delete("LOL");
        }
        

    }*/
}
