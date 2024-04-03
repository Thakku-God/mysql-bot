const { SlashCommandBuilder } = require('@discordjs/builders');
const { pool } = require('../../database.js');
const { EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setname')
        .setDescription('Update user information for a specific identifier')
        .addStringOption(option =>
            option.setName('identifier')
                .setDescription('Specify the identifier')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('firstname')
                .setDescription('Specify the new first name')
        )
        .addStringOption(option =>
            option.setName('lastname')
                .setDescription('Specify the new last name')
        ),

    async execute(interaction) {
        try {
            // Get the identifier, new first name, and new last name from the user's input
            const identifier = interaction.options.getString('identifier');
            const newFirstName = interaction.options.getString('firstname');
            const newLastName = interaction.options.getString('lastname');

            // Reply to the original interaction first
            await interaction.deferReply({ content: `Updating user information for ${identifier}...`, ephemeral: true });

            // Construct and execute the SQL update query
            const updateQuery = `UPDATE users SET firstname = ?, lastname = ? WHERE identifier = ?`;
            const conn = await pool.getConnection();
            await conn.query(updateQuery, [newFirstName, newLastName, identifier]);
            conn.release();

            // Use interaction.followUp for additional messages
            await interaction.followUp(`Updated successfully With ***FirstName: ${newFirstName} - LastName: ${newLastName}***.`);
        } catch (err) {
            console.error('Error executing SQL:', err);
            // Use interaction.followUp for additional messages
            await interaction.followUp({ content: 'An error occurred while updating user information.', ephemeral: true });
        }
    },
};
