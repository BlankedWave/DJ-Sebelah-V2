const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'dance',
  description: 'Joget angan tak sudah!',
  async execute(message, args) {
    const sender = message.author;
    const danceGif = await anime.dance();

    const embed = new EmbedBuilder()
      .setColor('#ffcc00')
      .setDescription(`${sender} sedang berjoget! 💃🕺`)
      .setImage(danceGif);

    message.reply({ embeds: [embed] });
  },
};
