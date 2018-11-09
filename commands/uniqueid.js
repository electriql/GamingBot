

    exports.info = "Gives your unique user id."
    exports.run = async (message, args, client, ops) => {
        message.channel.send('**' + message.author.username + '** Your unique id is '+ message.author.id);
    }


