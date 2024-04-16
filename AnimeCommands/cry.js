const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'cry',
  description: 'Menunjukkan yang anda sedang menangis!',
  async execute(message, args) {
    const sender = message.author;
    const cryGif = await anime.cry();

    const embed = new EmbedBuilder()
      .setColor('#0000ff')
      .setDescription(`${sender} sedang menangis...`)
      .setImage(cryGif);

    message.reply({ embeds: [embed] });
  },
};
