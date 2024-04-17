const { EmbedBuilder } = require('discord.js');
const {
    MessageEmbed,
    Permissions
  } = require(`discord.js`)
  
module.exports = {
    name: 'ban',
    description: 'Ban a user from the server',
    execute(message, args) {
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.reply('❌ Anda tidak mempunyai hak untuk menggunakan perintah ini.');
        }
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('❌ Anda perlu mention seorang pengguna untuk dilarang.');
        }
        const member = message.guild.members.cache.get(user.id);
        member.ban();
        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('Pengguna Diban ✅')
            .setDescription(`▶️ ${user.tag} telah diban dari server oleh ${message.author.tag}.`)
            .setTimestamp();

        message.reply({ embeds: [embed] });
    },
};
