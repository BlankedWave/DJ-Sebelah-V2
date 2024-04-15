const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const { dequeue, playNextSong, playSong } = require('./play');
const { queue } = require('./play');

module.exports = {
  name: 'skip',
  description: 'Langkau lagu semasa',
  async execute(message, args) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('🐼 Anda perlu berada dalam saluran suara untuk menggunakan arahan ini!');
      return message.reply({ embeds: [embed] });
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    if (connection.state.status === VoiceConnectionStatus.Ready) {
      if (queue.length > 0) {
        const nextSong = dequeue();
        await playSong(connection, nextSong.searchQuery, nextSong.message);

        const embed = new EmbedBuilder()
           .setColor('#2b71ec')
     .setAuthor({
          name: 'Lagu Dilangkau!',
          iconURL: 'https://cdn.discordapp.com/attachments/1175488636033175602/1175488721253052426/right-chevron-.png?ex=656b6a2e&is=6558f52e&hm=7a73aa51cb35f25eba52055c7b4a1b56bbf3a6d150643adc15b52dc533236956&',
          url: 'https://discord.gg/X6RT5VdJPQ'
        })
          .setDescription('**Mari kita teruskan ke rentak seterusnya...**');
        return message.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setColor('#FFFF00')
          .setDescription('**❌ Tiada lagu dalam senarai untuk dilangkau.**');
        return message.reply({ embeds: [embed] });
      }
    } else {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('**❌ Tiada lagu untuk dilangkau. Senarai tunggu kosong.**');
      return message.reply({ embeds: [embed] });
    }
  },
};
