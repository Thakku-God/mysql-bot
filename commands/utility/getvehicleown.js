const { SlashCommandBuilder } = require('@discordjs/builders');
const { pool } = require('../../database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ownedvehicles')
        .setDescription('Get a list of owned vehicles for a specific owner')
        .addStringOption(option =>
            option.setName('owner')
                .setDescription('Specify the owner')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            // Get the owner from the user's input
            const owner = interaction.options.getString('owner');

            // Reply to the original interaction first
            await interaction.deferReply({ content: `Fetching owned vehicles for ${owner}...`, ephemeral: false });

            // Construct and execute the SQL query to retrieve owned vehicles
            const query = `SELECT * FROM owned_vehicles WHERE owner = ?`;
            const conn = await pool.getConnection();
            const result = await conn.query(query, [owner]);
            conn.release();

            // Check if any results were returned
            if (result.length > 0) {
                let response = `Owned Vehicles for ${owner}:\n`;

                // Loop through each vehicle and add its details to the response
                result.forEach((vehicle, index) => {
                    response += `\nVehicle ${index + 1}:\n`;
                    response += `Plate: ${vehicle.plate}\n`;
                    response += `GloveBox: ${vehicle.glovebox}\n`;
                    response += `Trunk: ${vehicle.trunk}\n`;
                    // Add more details as needed
                });

                // Use interaction.followUp for additional messages
                interaction.followUp(response);
            } else {
                // Use interaction.followUp for additional messages
                interaction.followUp(`No owned vehicles found for ${owner}.`);
            }
        } catch (err) {
            console.error('Error executing SQL:', err);
            // Use interaction.followUp for additional messages
            interaction.followUp({ content: 'An error occurred while fetching owned vehicles.', ephemeral: true });
        }
    },
};
