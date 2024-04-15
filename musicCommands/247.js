const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');

const connections = new Map();
const reconnectIntervals = new Map();

module.exports = {
  name: '247',
  description: 'Tetapkan atau nyahtetapkan saluran radio 24/7 untuk bot',
  execute: async (message, args) => {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('Sertai Saluran Yang Anda Ingin Simpan Bot 24/7!');

      return message.reply({ embeds: [embed] });
    }

    const guildId = message.guild.id;
    const channelId = voiceChannel.id;

    if (connections.has(guildId)) {
      const connection = connections.get(guildId);

      clearInterval(reconnectIntervals.get(guildId));

      if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
        connection.destroy();
      }

      connections.delete(guildId);

      const leaveEmbed = new EmbedBuilder()
        .setColor('#FF0000')
            .setAuthor({
          name: '24/7 Dihentikan!',
          iconURL: 'https://cdn.discordapp.com/attachments/1175488636033175602/1175524927164645446/cross.png?ex=656b8be6&is=655916e6&hm=ff3bbc16f174e02e38a61c8ec86d2e6c44a2b8785147dcfe111bf06054cb05fe&',
          url: 'https://discord.gg/X6RT5VdJPQ'
        })
            .setDescription('**Tingkatkan Jangka Waktu Agar Bot Disimpan 24/7 Untuk Jangka Masa Yang Lama!**');

      return message.reply({ embeds: [leaveEmbed] });
    } else {

      const connection = joinVoiceChannel({
        channelId,
        guildId,
        adapterCreator: message.guild.voiceAdapterCreator,
      });

      connection.on(VoiceConnectionStatus.Ready, () => {
      
        setTimeout(() => {
          if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
            connection.destroy();
          }
          connections.delete(guildId);
          const leaveEmbed = new EmbedBuilder()
              .setColor('#FF0000')
            .setAuthor({
          name: '24/7 Dihentikan!',
          iconURL: 'https://cdn.discordapp.com/attachments/1175488636033175602/1175524927164645446/cross.png?ex=656b8be6&is=655916e6&hm=ff3bbc16f174e02e38a61c8ec86d2e6c44a2b8785147dcfe111bf06054cb05fe&',
          url: 'https://discord.gg/X6RT5VdJPQ'
        })
            .setDescription('**Tingkatkan Jangka Waktu Agar Bot Disimpan 24/7 Untuk Jangka Masa Yang Lama!**');

          message.reply({ embeds: [leaveEmbed] });
        }, 600000); 
        const reconnectInterval = setInterval(() => checkAndReconnect(connection, message, channelId), 10000); 
        reconnectIntervals.set(guildId, reconnectInterval);

        const embed = new EmbedBuilder()
           .setColor('#2b71ec')
     .setAuthor({
          name: '24/7 Diaktifkan!',
          iconURL: 'https://cdn.discordapp.com/attachments/1175488636033175602/1175524855140057209/check.png?ex=656b8bd5&is=655916d5&hm=75eb1b1f6731b0d6bdec686677d5a86f359f4a5acbbd58751d35ec26d852aaa6&',
          url: 'https://discord.gg/X6RT5VdJPQ'
        })
          .setDescription('**Anda perlu menyahaktifkan 24/7 untuk memainkan lagu!**');

        message.reply({ embeds: [embed] });
      });

      connections.set(guildId, connection);
    }
  },
};

async function checkAndReconnect(connection, message, targetChannelId) {
  if (connection) {
    const guildId = connection.joinConfig.guildId;
    const targetVoiceChannel = message.guild.channels.cache.get(targetChannelId);

    if (targetVoiceChannel) {
      await new Promise(resolve => setTimeout(resolve, 6000));

      try {
        const newConnection = joinVoiceChannel({
          channelId: targetChannelId,
          guildId,
          adapterCreator: message.guild.voiceAdapterCreator,
        });

        newConnection.on(VoiceConnectionStatus.Ready, () => {
          console.log('Reconnected to voice channel.');
          connections.set(guildId, newConnection);
        });
        connections.set(guildId, newConnection);
      } catch (error) {
        console.error('Error reconnecting to voice channel:', error.message);
      }
    } else {
      console.log('Specified voice channel not found. Skipped reconnection.');
    }
  }
}
