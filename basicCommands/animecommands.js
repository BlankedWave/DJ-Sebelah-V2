const { EmbedBuilder } = require('discord.js');
const db = require("../mongodb");
module.exports = {
  name: 'animecommands',
  description: 'Papar senarai command berkaitan anime yang ada!',
  execute(message, args) {
    const embed = new EmbedBuilder()
      .setColor('#FFFFFF')
      .setTitle('Senarai Command Anime')
      .setDescription(`__**✅ Senarai Interaksi Yang Ada**__\n\n▶️ __**Bahagian 1 :**__\n  blush, cuddle, dance, slap, bonk, bully, hug, confused, kiss, pat, happy, smile.\n\n▶️ __**Bahagian 2 :**__\n yes, highfive, wink, wave, thinking, sad, cry, stare, bored, scream, nervous, kill.\n`)
      
      .setImage(`https://cdn.discordapp.com/attachments/1140841446228897932/1142126954775068762/pxfuel.jpg`);
    message.reply({ embeds: [embed] });
  },
};
