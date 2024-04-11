const { VoiceConnectionStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const { getCurrentConnection } = require('./play');

module.exports = {
  name: 'leave',
  description: 'Leave the voice channel',
  execute: async (message, args) => {
    const connection = getCurrentConnection();

    if (!connection || connection.state.status !== VoiceConnectionStatus.Ready) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('**❌ There is no active connection to leave.**');
      return message.reply({ embeds: [embed] });
    }

    if (message.member.voice.channelId !== connection.joinConfig.channelId) {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription('**❌ You need to be in the same voice channel as the bot to make it leave.**');
      return message.reply({ embeds: [embed] });
    }

    // Destroy the connection
    connection.destroy();

    // Inform user
    const embed = new EmbedBuilder()
      .setColor('#00FF00')
      .setDescription('**✅ Bot left the voice channel.**');
    const replyMessage = await message.reply({ embeds: [embed] });

    return replyMessage;
  },
};
