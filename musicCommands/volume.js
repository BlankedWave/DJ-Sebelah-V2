const { EmbedBuilder } = require('discord.js');
const { getPlayer } = require('./play');

module.exports = {
  name: 'volume',
  description: 'Tetapkan volume bot yang sesuai',
  execute: async (message, args) => {
    const volume = parseFloat(args[0]);

    if (isNaN(volume) || volume < 0 || volume > 100) {
      return message.reply('❌ Sila berikan tahap volume yang sah antara 0 dan 100.');
    }
    const player = getPlayer();

    if (!player) {
      return message.reply('❌ Tiada muzik sedang diputarkan pada masa ini.');
    }
    const resource = player.state.resource;

    if (!resource) {
      return message.reply('❌ Tiada sumber audio dijumpai.');
    }
    resource.volume.setVolume(volume / 100);

    const embed = new EmbedBuilder()
      .setColor('#2b71ec')
     .setAuthor({
          name: 'Kawalan Volume!',
          iconURL: 'https://cdn.discordapp.com/attachments/1175488636033175602/1175488721546645624/volume.png?ex=656b6a2e&is=6558f52e&hm=8215d2f88ab073db1f3b6438c28fd73315ad7e581bb54000dbb06fca387cecf7&',
          url: 'https://discord.gg/X6RT5VdJPQ'
        })
      .setDescription(`**volume diset kepada ${volume}%**`);

    message.reply({ embeds: [embed] });
  },
};
