const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('avataranim')
    .setDescription("Animate an avatar for your bot")
    .addAttachmentOption(option => option.setName('avatar').setDescription('The avatar to animate').setRequired(true)),
    async execute (interaction, client) {
        const { options } = interaction;
        const avatar = options.getAttachment('avatar');

        async function sendMessage (message) {
            const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setDescription(message);

            await interaction.reply({ emveds: [embed], ephemeral: true });
        }

        if (avatar.contentType !== "image/gif") return await sendMessage(`⚠️ please use a gif format for animated emojis`);

        var error;
        await client.user.setAvatar(avatar.url).catch(async err => {
            error = true;
            console.log(err);
            return await sendMessage(`⚠️ Error : \`${err.toString()}\``);

        });

        if (error) return;
        await sendMessage(`🌍 I have uploaded your avatar`);
    } 
}