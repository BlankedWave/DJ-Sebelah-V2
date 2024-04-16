const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'wave',
  description: 'Lambai kepada seseorang!',
  async execute(message, args) {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const waveGif = await anime.wave();

    const embed = new EmbedBuilder()
      .setColor('#00ffcc')
      .setDescription(`${sender} sedang melambai kepada ${targetUser || 'hantu halimunan'}! 👋`)
      .setImage(waveGif);

    message.reply({ embeds: [embed] });
  },
};
