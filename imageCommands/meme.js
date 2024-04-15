const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'meme',
  aliases: ['randommeme'],
  description: 'Displays a random meme',
  async execute(message, args) {
    try {
      const response = await axios.get('https://some-random-api.ml/meme');
      const memeUrl = response.data.image;

      if (!memeUrl) {
        throw new Error('Failed to fetch meme.');
      }

      const embed = new EmbedBuilder()
        .setColor('#FF4500')
        .setTitle('Random Meme 😄')
        .setImage(memeUrl);

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching meme:', error);
      message.reply('Sorry, I couldn\'t fetch a meme at the moment.');
    }
  },
};
