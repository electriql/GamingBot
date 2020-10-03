exports.info = "Manually shuts down the bot.";
exports.run = async (message, args, client, ops) => {
    message.channel.send("Shutting down...");
    setInterval(function() {
        process.exit(69420);
    }, 1000);
}