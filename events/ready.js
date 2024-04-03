// main file

const { Events } = require('discord.js');
const { pool } = require('../database'); // Adjust the path accordingly
const { clientId, guildId, token, db_host, db_user, db_password, db_database } = require('../config.json');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Discord bot is ready! Logged in as ${client.user.tag}`);

        // Check the database connection
        try {
            const connection = await pool.getConnection();

            // Execute a query to get the list of tables
            const tablesResult = await connection.query('SHOW TABLES');
            const totalTables = tablesResult.length;

            console.log(`Database connection is ready! Database: ${db_database}`);
            // Log the total number of tables
            console.log(`Total tables in the database: ${totalTables}`);

            connection.release(); // Release the connection back to the pool
        } catch (error) {
            console.error('Error connecting to the database:', error);
            console.log('Bot will still run, but without a database connection.');
        }
    },
};
