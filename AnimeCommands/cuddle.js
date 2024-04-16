const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'cuddle',
  description: 'Peluk seseorang!',
  async execute(message, args) {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const cuddleGif = await anime.cuddle();

    const embed = new EmbedBuilder()
      .setColor('#ff9900')
      .setDescription(`${sender} tengah peluk ${targetUser || 'hantu halimunan '}! 🤗`)
      .setImage(cuddleGif);

    message.reply({ embeds: [embed] });
  },
};
