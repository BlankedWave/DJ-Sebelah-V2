const playModule = require('./play.js');
const { VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
  name: 'resume',
  description: 'Sambung pemutaran muzik yang dijeda',
  execute: (message, args) => {
    const currentConnection = playModule.getCurrentConnection();
    if (currentConnection && currentConnection.state.status === VoiceConnectionStatus.Ready) {
      playModule.resume();
    } else {
      message.reply('❌ Bot tidak memainkan sebarang muzik pada masa ini.');
    }
  },
};
