const fs = require('fs');

exports.info = "Shows this page."
exports.run = async (message, args, client, ops) => {
    var str = "";
    fs.readdir(__dirname, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            let commandFile = require(__dirname + '/' + file);
            str = str + "**p!" + file.slice(0, file.length - 3) + "** - " + commandFile.info + "\n";
        });
        message.channel.send(str);
    });
}