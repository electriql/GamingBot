const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');
const disambiguation = require('../../util').disambiguation;

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'util',
			memberName: 'help',
			aliases: ['commands'],
			description: 'Displays a list of available commands, or detailed information for a specified command.',
			details: oneLine`
				The command may be part of a command name or a whole command name.
				If it isn't specified, all available commands will be listed.
			`,
			examples: ['help', 'help prefix'],
			guarded: true,

			args: [
				{
					key: 'command',
					prompt: 'Which command would you like to view the help for?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, args) { // eslint-disable-line complexity
		msg.channel.send("Check your DMs!")
		const help = {
			"embed": {
				"title": "__**Bot Features**__",
				"description": "**This bot has an automatic join and leave message, curse filter, and more! Here are the commands that I can execute!**",
				"color": 4886754,
				"footer": {
					"icon_url": "https://media.discordapp.net/attachments/415729242341507076/439987020853411844/ElectricDiamondCrop.png?width=676&height=676",
					"text": "Bot Created by @ᗴlectricↁiamond#1684"
				},
				"author": {
					"name": "Bot Information",
					"url": "",
					"icon_url": "https://media.discordapp.net/attachments/415729242341507076/439978267156545546/BotLogo.png?width=676&height=676"
				},
				"fields": [
					{
						"name": "__**User**__",
						"value": "`help`, `uniqueid`"
					},
					
					{
						"name": "__**Fun**__",
						"value": "`8ball`, `number`, `fact`, `pun`"
					},
					{
						"name": "__**Currency**__",
						"value": "`diamonds`, `daily`, `slots`, `wheel`"
					},
					{
						"name": "__**Moderator (must have the Manage Server permission)**__",
						"value": "`toggleprofanity`"
					},
					{
						"name": "**More features to come!**",
						"value": "Send me your suggestions so new features come out sooner!"
					}
				]
			}
		}
			msg.author.send(help);
		
	}
}
