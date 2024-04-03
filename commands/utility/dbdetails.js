// commands/dbdetails.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { pool } = require('../../database.js');
const { db_database } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dbdetails')
        .setDescription('Get details about the database'),

    async execute(interaction) {
        try {
            const connection = await pool.getConnection();

            // Execute a query to get the list of tables
            const tablesResult = await connection.query('SHOW TABLES');
            const totalTables = tablesResult.length;

            // Respond with database details
            await interaction.reply({content: `Database: ${db_database}\nTotal tables: ${totalTables}`, ephemeral: true});

            connection.release(); // Release the connection back to the pool
        } catch (error) {
            console.error('Error fetching database details:', error);
            await interaction.reply('Error fetching database details. The bot may not be connected to the database.');
        }

    },
};
