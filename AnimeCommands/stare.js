const { EmbedBuilder } = require('discord.js');
const anime = require('anime-actions');
const db = require("../mongodb");
module.exports = {
  name: 'stare',
  description: 'Merenung seseorang!',
  async execute(message, args) {
    const sender = message.author;
    const targetUser = message.mentions.users.first();
    const stareGif = await anime.stare();

    const embed = new EmbedBuilder()
      .setColor('#ff9900')
      .setDescription(`${sender} sedang merenung ${targetUser || 'ke dalam renungan'}... 👀`)
      .setImage(stareGif);

    message.reply({ embeds: [embed] });
  },
};
