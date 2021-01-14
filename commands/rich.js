var index = require('../index.js');
exports.category = "currency";
exports.info = "Shows the richest people in the server!";
function roundUp(number) {
  if (number - Math.floor(number) != 0) return Math.floor(number) + 1;
  return number;
}
exports.run = async (message, args, client, ops) => {
     var server = message.guild;
     
     let members = [];
     let loops = 0;
     var bots = 0;
    server.members.fetch().then(list => {
      list.forEach(element => {
        if (!element.user.bot) {
          let id = element.id;
          index.pool.query('SELECT * FROM userdata WHERE id = ' + id, [], (err, res) => {
            if (!res.rows[0]) {
                index.pool.query('INSERT INTO userdata(id, diamonds, daily) VALUES(' + id + ',0,0)', [], (err, res) => {
    
                })
            }
          });
          index.dbSelect(index.pool, 'userdata', 'id', 'diamonds', id, function(data) {

            var diamonds = 0;
            if (data) diamonds = data.diamonds;
            members.push({
            "id" : id,
            "diamonds" : diamonds
            });
            var rich = members.sort((a, b) => (a.diamonds < b.diamonds) ? 1 : -1);
            loops++;
            if (loops == server.memberCount - bots) {
              var page = 1;
              var pages = roundUp((server.memberCount - bots) / 5);
              if (!isNaN(args[0]) && args[0] >= 1) {
                if (args[0] > pages) return message.channel.send("❌ There are only **" + pages + "** page(s)! Not **" + args[0] + "**!");
                page = Math.floor(args[0]);
              }
              var str = "** ";
              for(i = 5 * (page - 1); i < page * 5; i++) {
                
                  var member = server.member(rich[i].id);
                  str = str + (i + 1) + ". " + member.user.tag + " - 💎x" + rich[i].diamonds + "\n";
                  if (!rich[i + 1]) break;
              }
              var embed = {

                "embed": {
              
                  "color": 4886754,
                  "footer": {
                    "icon_url": ops.owner.displayAvatarURL({
                      size: 2048,
                      format: "png"
                    }),
                    "text": "Bot Created by " + ops.owner.tag 
                  },
                  "author": {
                    "name": "The Richest in " + server.name,
                    "url": "",
                    "icon_url": client.user.displayAvatarURL({
                      size: 2048,
                      format: "png"
                  }),
                  },
                  "fields": [
                    {
                      "name": "Page " + page + " / " + pages,
                      "value": str + "**"
                    }
                  ]
                }
              }
              message.channel.send(embed);
            }
          });
        }
        else {
            bots++;
        }
      });
    });
    
    
}
