const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'highfive',
  description: 'Kasi high five kat orang!',
  async execute(message, args) {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const highfiveGif = await anime.highfive();

    const embed = new EmbedBuilder()
      .setColor('#00ccff')
      .setDescription(`${sender} kasi ${targetUser || 'hantu halimunan'} high five! 🖐`)
      .setImage(highfiveGif);

    message.reply({ embeds: [embed] });
  },
};
