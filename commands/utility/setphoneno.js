// commands/updatePhoneNumber.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { pool } = require('../../database.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setphoneno')
        .setDescription('Update a phone number in gksphone_settings')
        .addStringOption(option =>
            option.setName('phonenumber')
                .setDescription('The phone number to update')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('newphonenumber')
                .setDescription('The new phone number')
                .setRequired(true)),

    async execute(interaction) {
        // Assuming the phone number and new phone number are provided as options
        const phoneNumber = interaction.options.getString('phonenumber');
        const newPhoneNumber = interaction.options.getString('newphonenumber');

        const checkNewNumberQuery = 'SELECT * FROM gksphone_settings WHERE phone_number = ?';
        const updateQuery = 'UPDATE gksphone_settings SET phone_number = ? WHERE phone_number = ?';
        const selectQuery = 'SELECT * FROM gksphone_settings WHERE phone_number = ?';

        try {
            const connection = await pool.getConnection();

            // Check if the new phone number already exists
            const checkNewNumberResult = await connection.query(checkNewNumberQuery, [newPhoneNumber]);

            if (checkNewNumberResult.length > 0) {
                // New phone number already exists
                await interaction.reply({content:`Phone number ***${newPhoneNumber}*** is already taken.`, ephemeral: true });
            } else {
                // Check if the existing phone number exists
                const selectResult = await connection.query(selectQuery, [phoneNumber]);

                if (selectResult.length > 0) {
                    // Phone number exists, proceed to update the phone number
                    await connection.query(updateQuery, [newPhoneNumber, phoneNumber]);
                    await interaction.reply(`Phone number ***${phoneNumber}*** has been successfully updated to ***${newPhoneNumber}***.`);
                } else {
                    // Phone number doesn't exist
                    await interaction.reply(`Phone number ***${phoneNumber}*** does not exist.`);
                }
            }

            connection.release();
        } catch (error) {
            console.error('Error executing query:', error);
            await interaction.reply('Error while updating the phone number. Please try again later.');
        }
    },
};
