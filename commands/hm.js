exports.info = "An alias for g!hangman";
exports.run = async (message, args, client, ops) => {
    let commandFile = require('./hangman.js');
    commandFile.run(message, args, client, ops);
}