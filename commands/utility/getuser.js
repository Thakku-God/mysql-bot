const { SlashCommandBuilder } = require('@discordjs/builders');
const { pool } = require('../../database.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getuser')
        .setDescription('Get updated user information for a specific identifier')
        .addStringOption(option =>
            option.setName('identifier')
                .setDescription('Specify the identifier')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            // Get the identifier from the user's input
            const identifier = interaction.options.getString('identifier');

            // Reply to the original interaction first
            await interaction.deferReply({ content: `Fetching updated user information for ${identifier}...`, ephemeral: false });

            // Construct and execute the SQL query to retrieve the updated values
            const query = `SELECT firstname, lastname FROM users WHERE identifier = ?`;
            const conn = await pool.getConnection();
            const result = await conn.query(query, [identifier]);
            conn.release();

            // Check if any results were returned
            if (result.length > 0) {
                // Build an embed to display the updated values
                const updatedUser = result[0];
                const embed = new EmbedBuilder()
                    .setTitle("Updated User Information for : ")
                    .setDescription(`${identifier}`)
                    .setColor('#0099ff')
                    .addFields(
                        { name: 'First Name', value: updatedUser.firstname !== null ? updatedUser.firstname.toString() : 'N/A' },
                        { name: 'Last Name', value: updatedUser.lastname !== null ? updatedUser.lastname.toString() : 'N/A' },
                        {
                            name: "Identifier",
                            value: "```" + `\n${identifier}\n` + "```",
                            inline: true
                        }
                    );

                // Use interaction.followUp for additional messages
                interaction.followUp({ embeds: [embed] });
            } else {
                // Use interaction.followUp for additional messages
                interaction.followUp(`No user found with identifier ${identifier}.`);
            }
        } catch (err) {
            console.error('Error executing SQL:', err);
            // Use interaction.followUp for additional messages
            interaction.followUp({ content: 'An error occurred while fetching updated user information.', ephemeral: true });
        }
    },
};
