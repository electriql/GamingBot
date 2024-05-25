const { REST, Routes } = require("discord.js");
const fs = require('fs');
const { register } = require("module");
const path = require('path');

const commands = [];
const commandFiles = fs.readdirSync(__dirname + "/commands").filter(file =>
    file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = __dirname + "/commands/" + file;
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    }
    else {
        console.log(`[WARNING] The command at ${filePath} is missing a
                    required "data" or "execute" property.`);
    }
}
deploy();

async function deploy() {
    const rest = new REST().setToken(process.env.BOT_TOKEN);
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID, process.env.DEV_GUILD),
        { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
}