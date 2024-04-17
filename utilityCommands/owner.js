const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'owner',
    description: 'Bot owner info',
    execute(message, args) {
        const DiscordLink = 'https://discord.com/users/267958390389604362';
        const DiscordGuild = 'https://discord.gg/X6RT5VdJPQ';
        const embed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle(' 🫅 Info Pemilik')
            .setDescription(`__**Tentang Saya**__:\n 🤖 Hai semua! Saya Muhammad Aqil Ismail, manusia yang sibuk mencari tujuan hidupnya. Kadang-kadang, saya rasa seperti bot yang tersesat di dalam alam siber! Tetapi jangan risau, saya masih ada untuk memberi keceriaan di Discord!\n ❤️ [BlankedWave](${DiscordLink})\n 💙 [Discord Sebelah](${DiscordGuild})`)

            .setTimestamp();


        message.reply({ embeds: [embed] });
    },
};
