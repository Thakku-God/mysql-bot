const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Repeats the provided message')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to be sent')
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to send a direct message')
        ),

    async execute(interaction) {
        try {
            // Get the message from the user's input
            const message = interaction.options.getString('message');
            const user = interaction.options.getUser('user');

            // Reply to the original interaction
            await interaction.reply({ content: 'Message Sent', ephemeral: true });

            // Check if a user is specified for a direct message
            if (user) {
                // Send a direct message to the specified user
                user.send(message).catch(error => {
                    // If DM is blocked or any other error occurs, provide a more informative error message
                    console.error('Error sending DM:', error);
                    if (error.code === 50007) {
                        interaction.followUp({ content: `Failed to send a direct message to ${user.tag}. The user may have DMs disabled or blocked.`, ephemeral: true });
                    } else {
                        interaction.followUp({ content: `Failed to send a direct message to ${user.tag}. An unknown error occurred.`, ephemeral: true });
                    }
                });
            } else {
                // Send the message to the current channel
                await interaction.channel.send(message);
            }
        } catch (err) {
            console.error('Error executing command:', err);
            // Use interaction.followUp for additional messages
            interaction.followUp({ content: 'An error occurred while processing the command.', ephemeral: true });
        }
    },
};
