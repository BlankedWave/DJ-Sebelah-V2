const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Mengeluarkan seorang pengguna dari server',
    execute(message, args) {
        // Memeriksa jika pengguna mempunyai kebenaran yang diperlukan untuk menggunakan perintah ini
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply('❌ Anda tidak mempunyai hak untuk menggunakan perintah ini.');
        }

        // Memeriksa jika seorang pengguna disebut dalam perintah
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('❌ Anda perlu mention seorang pengguna untuk dikeluarkan.');
        }

        // Mengeluarkan pengguna yang disebut
        const member = message.guild.members.cache.get(user.id);
        member.kick();

        // Mencipta objek embed
        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Pengguna Dikeluarkan ✅')
            .setDescription(`▶️ ${user.tag} telah dikeluarkan dari server oleh ${message.author.tag}.`)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
