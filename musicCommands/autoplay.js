// autoplay.js

const { autoplay, autoplaySearchQuery } = require('./play');

module.exports = {
  name: 'autoplay',
  description: 'Enable or disable autoplay feature.',
  execute(message, args) {
    const action = args[0]?.toLowerCase();
    const isAutoplayEnabled = autoplaySearchQuery !== '';

    switch (action) {
      case 'enable':
        if (isAutoplayEnabled) {
          return message.reply('Autoplay is already enabled.');
        }
        return message.reply('Autoplay has been enabled.');
      case 'disable':
        if (!isAutoplayEnabled) {
          return message.reply('Autoplay is already disabled.');
        }
        return message.reply('Autoplay has been disabled.');
      default:
        return message.reply('Invalid action. Please use `enable` or `disable`.');
    }
  },
};
