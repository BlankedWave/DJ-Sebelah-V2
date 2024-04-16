const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'yes',
  description: 'Menyetujui akan perkara tersebut!',
  async execute(message, args) {
    const sender = message.author;
    const yesGif = await anime.yes();

    const embed = new EmbedBuilder()
      .setColor('#00cc66')
      .setDescription(`${sender} berkata iya! 👍`)
      .setImage(yesGif);

    message.reply({ embeds: [embed] });
  },
};
