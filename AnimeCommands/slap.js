const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'slap',
  description: 'Beri tamparan yang hebat!',
  async execute(message, args) {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const slapGif = await anime.slap();

    const embed = new EmbedBuilder()
      .setColor('#ff3300')
      .setDescription(`${sender} kasi ${targetUser || 'hantu halimunan'} tamparan yang hebat kepada! 😠`)
      .setImage(slapGif);

    message.reply({ embeds: [embed] });
  },
};
