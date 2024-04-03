// commands/updateIdentifier.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { pool } = require('../../database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcharid')
        .setDescription('Update a user\'s identifier in the database')
        .addStringOption(option =>
            option.setName('identifier')
                .setDescription('The current identifier to update')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('newidentifier')
                .setDescription('The new identifier')
                .setRequired(true)),

    async execute(interaction) {
        // Assuming the current identifier and new identifier are provided as options
        const currentIdentifier = interaction.options.getString('identifier');
        const newIdentifier = interaction.options.getString('newidentifier');

        const checkNewIdentifierQuery = 'SELECT * FROM users WHERE identifier = ?';
        const checkCurrentIdentifierQuery = 'SELECT * FROM users WHERE identifier = ?';
        const updateIdentifierQuery = 'UPDATE users SET identifier = ? WHERE identifier = ?';

        try {
            const connection = await pool.getConnection();

            // Check if the new identifier already exists
            const checkNewIdentifierResult = await connection.query(checkNewIdentifierQuery, [newIdentifier]);

            if (checkNewIdentifierResult.length > 0) {
                // New identifier already exists
                await interaction.reply({ content: `The new identifier ***${newIdentifier}*** is already exist.`, ephemeral: true });
            } else {
                // Check if the current identifier exists
                const checkCurrentIdentifierResult = await connection.query(checkCurrentIdentifierQuery, [currentIdentifier]);

                if (checkCurrentIdentifierResult.length > 0) {
                    // Current identifier exists, proceed to update
                    await connection.query(updateIdentifierQuery, [newIdentifier, currentIdentifier]);
                    await interaction.reply(`Identifier ***${currentIdentifier}*** has been successfully updated to ***${newIdentifier}***.`);
                } else {
                    // Current identifier doesn't exist
                    await interaction.reply(`Identifier ***${currentIdentifier}*** does not exist.`);
                }
            }

            connection.release();
        } catch (error) {
            console.error('Error executing query:', error);
            await interaction.reply('Error while updating the identifier. Please try again later.');
        }
    },
};
