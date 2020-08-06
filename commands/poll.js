exports.category = "misc";
exports.info = "Makes a poll of up to 10 options. Syntax: \"option_1\" \"option_2\"...";

exports.run = async (message, args, client, ops) => {
    //var emotes = [":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];
    var emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
    var split = args.join(" ").split("\"");
    var options = [];
    split.forEach(element => {
        
        if (element.trim() != '') {
            options.push(element);
        }
    });
    if (options.length > 11) {
        for (i = 10; i < options.length; i++) {
            options[10] = options[10].concat(' ', options[i]);
            options.pop(options[i]);
        }
    }
    else if (options.length < 2) return message.channel.send("❌ You must have a question and at least one option!");
    var list = "";
    for (i = 1; i < options.length; i++) {
        if (i > 10) break;
        else list+= emotes[i - 1] + " " + options[i] + "\n";
    }
    const poll =  {
        "embed": {
            "title": options[0],
            "description": list,
            "color": 4886754,
            "author": {
                "name": message.member.displayName,
                "url": "",
                "icon_url": message.author.displayAvatarURL
            },
        }
    }
    message.channel.send(poll).then(msg => {
        for (i = 0; i < options.length - 1; i++) {
            msg.react(emotes[i]);
        }
    });
    message.delete();
}
