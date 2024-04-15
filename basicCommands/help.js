const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { ButtonStyle } = require('discord.js');
const db = require("../mongodb");
module.exports = {
  name: 'help',
  aliases: ['hlp', 'h'],
  description: 'Menunjukkan senarai command yang tersedia',
  execute(message, args) {
    const botUser = message.client.user;
    const botPing = Date.now() - message.createdTimestamp;
    const serverCount = message.client.guilds.cache.size;
    const embed = new EmbedBuilder()
      .setColor('#2b71ec')
      .setAuthor({
        name: 'Saya disini ingin membantu anda!',
        iconURL: 'https://cdn.discordapp.com/attachments/1175487983915376662/1175667506791325706/communication.png?ex=656c10b0&is=65599bb0&hm=e378f1b355a2401bcab504b08a0766001d6b7c090c91ce0a7a7a87c868feb955&', 
        url: 'https://discordapp.com/users/267958390389604362'
    })
     
      .setDescription(`__**STATS :**__\n\n> **📊 Bilangan server:** ${serverCount}\n> **🟢 Bot Ping:** ${botPing}ms\n> **👑 Dibina Oleh [BlankedWave](https://discordapp.com/users/267958390389604362)**\n\n__**COMMANDS :**__ `)
      .addFields(
        // Basic commands category
        {
          name: '▶️  Asas',
          value: '`avatar`, `owner`, `support`, `invite`, `userinfo`',
          inline: true,
        },
        // Music commands category
        {
          name: '▶️  Muzik',
          value: '`play`, `history`,`volume`,`pause`,`resume`,`247`',
          inline: true,
        },
        //fun category
        {
          name: '▶️  Hiburan',
          value: '`joke`, `meme`, `roll`',
          inline: true,
        },
        //image category
        {
          name: '▶️  Gambar',
          value: '`cat`, `dog`',
          inline: true,
        },
        //anime category
        {
          name: '▶️  Anime',
          value: '`-animecommands untuk maklumat lanjut`',
          inline: true,
        },
        // Utility commands category
        {
          name: '▶️  Utility',
          value: '`kick`, `ban`, `serverinfo`,`userinfo`, `clear`',
          inline: true,
        }
      )
      .setThumbnail(botUser.avatarURL({ dynamic: true, format: 'png', size: 1024 }))
      .setImage(`https://media.tenor.com/WDwFEWQxdFAAAAAi/fish.gif`);

    const button1 = new ButtonBuilder()
      .setLabel('Discord')
      .setURL('https://discordapp.com/users/267958390389604362')
      .setStyle(ButtonStyle.Link);

    const button2 = new ButtonBuilder()
      .setLabel('Discord Channel')
      .setURL('https://discord.gg/X6RT5VdJPQ')
      .setStyle(ButtonStyle.Link);

    const button3 = new ButtonBuilder()
      .setLabel('JANGAN TEKAN!')
      .setURL('https://youtu.be/67p1sOD4e2A?si=uTCSgfV-6TWGF99u&t=40')
      .setStyle(ButtonStyle.Link);
      
    const row = new ActionRowBuilder()
      .addComponents(button1, button2, button3);
    
    message.reply({ embeds: [embed], components: [row] });
  },
};
