const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'bully',
  description: 'Buli orang lain dalam discord!',
  async execute(message, args) {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const bullyGif = await anime.bully();

    const embed = new EmbedBuilder()
      .setColor('#9933ff')
      .setDescription(`${sender} tengah membuli ${targetUser || 'hantu halimunan'}! 😆`)
      .setImage(bullyGif);

    message.reply({ embeds: [embed] });
  },
};
