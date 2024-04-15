const { VoiceConnectionStatus } = require('@discordjs/voice');
const playModule = require('./play.js');

module.exports = {
  name: 'pause',
  description: 'Jeda pemutaran muzik',
  execute: (message, args) => {
    const currentConnection = playModule.getCurrentConnection();
    if (currentConnection && currentConnection.state.status === VoiceConnectionStatus.Ready) {
      playModule.pause();
    } else {
      message.reply('❌ Bot tidak memainkan sebarang muzik pada masa ini.');
    }
  },
};
