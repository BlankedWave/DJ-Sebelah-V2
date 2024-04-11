const { VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
  name: 'stop',
  description: 'Stop the music playback',
  execute: async (message, args) => {
    const connection = message.client.getCurrentConnection();

    if (!connection || connection.state.status === VoiceConnectionStatus.Destroyed) {
      return message.reply('**❌ There is no active connection to stop.**');
    }

    if (message.member.voice.channelId !== connection.joinConfig.channelId) {
      return message.reply('**❌ You need to be in the same voice channel as the bot to stop the music.**');
    }

    // Clear the queue
    message.client.queue.length = 0;

    // Destroy the connection
    connection.destroy();

    // Inform user
    return message.reply('**✅ Music playback stopped and queue cleared.**');
  },
};
