const { SlashCommandBuilder } = require('@discordjs/builders');
const { pool } = require('../../database.js');
const { db_database } = require('../../config.json');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('showdb')
        .setDescription('Show the Full DB Tables in Embed'),

    async execute(interaction) {
        try {
            // Reply to the original interaction first
            await interaction.reply({ content: 'Fetching database details...', ephemeral: true });

            const conn = await pool.getConnection();
            const result = await conn.query("SHOW TABLES");
            conn.release();

            if (result.length > 0) {
                const tableList = result.map(row => row[`Tables_in_${db_database}`]);
                const tablesMessage = `Tables in the database: ${tableList.join(', \n')}`;

                const embed = new EmbedBuilder()
                    .setTitle('Database Tables')
                    .setDescription(tablesMessage)
                    .setColor('#0099ff');

                // Use interaction.followUp for additional messages
                interaction.followUp({ embeds: [embed] });
            } else {
                // Use interaction.followUp for additional messages
                interaction.followUp('No tables found in the database.');
            }
        } catch (err) {
            console.error('Error executing SQL:', err);
            // Use interaction.followUp for additional messages
            interaction.followUp({ content: 'An error occurred while fetching tables from the database.', ephemeral: true });
        }
    },
};
