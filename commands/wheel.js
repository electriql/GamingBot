
const fs = require('fs');
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
exports.info = "Spins a built-in 'wheel of fortune' where you can win rewards. \n__**Rewards**	__\n💎 = Initial 💎x200 + 💎x100\n💠 = Initial 💎x200 + 💎x50\n🔸 = Initial 💎x200\n🔻 = 💎x150\n🔴 = 💎x100\n⭕ = 💎x50\n❌ = 💎x25\n🚫 = Nothing!"; 
    exports.run = async (message, args, client, ops) => {
        
    }

