// commands/checkPhoneNumber.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { pool } = require('../../database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkphonenumber')
        .setDescription('Check if a phone number exists in gksphone_settings')
        .addStringOption(option =>
            option.setName('phonenumber')
                .setDescription('The phone number to check')
                .setRequired(true)),

    async execute(interaction) {
        // Assuming the phone number is provided as an option
        const phoneNumber = interaction.options.getString('phonenumber');

        const query = 'SELECT * FROM gksphone_settings WHERE phone_number = ?';

        try {
            const connection = await pool.getConnection();
            
            const result = await connection.query(query, [phoneNumber]);

            // Check if there are any rows matching the condition
            if (result.length > 0) {
                // Rows found, handle the result
                await interaction.reply("Phone number ***" + `${phoneNumber}` + "*** is already owned by a user.");
            } else {
                // No rows found
                await interaction.reply("Phone number ***" + `${phoneNumber}` + "*** is available!.");
            }

            connection.release();
        } catch (error) {
            console.error('Error executing query:', error);
            await interaction.reply('Error while checking the phone number. Please try again later.');
        }
    },
};
