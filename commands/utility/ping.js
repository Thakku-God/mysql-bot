const { SlashCommandBuilder } = require('discord.js');

const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
		const message = await interaction.fetchReply();
		console.log(message);
	},
};

