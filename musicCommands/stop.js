const { VoiceConnectionStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const { getCurrentConnection } = require('./play');

module.exports = {
  name: 'stop',
  description: 'Stop the music playback',
  execute: async (message, args) => {
    const connection = getCurrentConnection();

    if (!connection || connection.state.status === VoiceConnectionStatus.Destroyed) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('**❌ There is no active connection to stop.**');
      return message.reply({ embeds: [embed] });
    }

    if (message.member.voice.channelId !== connection.joinConfig.channelId) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('**❌ You need to be in the same voice channel as the bot to stop the music.**');
      return message.reply({ embeds: [embed] });
    }

    // Clear the queue
    message.client.queue.length = 0;

    // Destroy the connection
    connection.destroy();

    // Inform user
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setDescription('**✅ Music playback stopped and queue cleared.**');
    return message.reply({ embeds: [embed] });
  },
};
