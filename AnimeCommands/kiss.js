const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'kiss',
  description: 'Bagi ciuman!',
  async execute(message, args) {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const kissGif = await anime.kiss();

    const embed = new EmbedBuilder()
      .setColor('#ff3399')
      .setDescription(`${sender} tengah cium ${targetUser || 'hantu halimunan'}! 😘`)
      .setImage(kissGif);

    message.reply({ embeds: [embed] });
  },
};
