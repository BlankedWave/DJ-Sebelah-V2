const { EmbedBuilder } = require('discord.js');
const db = require("../mongodb");
module.exports = {
    name: 'support',
    description: 'support server of this Bot',
    execute(message, args) {
        const supportServerLink = 'https://discord.gg/X6RT5VdJPQ';
        const embed = new EmbedBuilder()
            .setColor('#FFFFFF')
            .setTitle('Support server')
            .setDescription(`Click [sini](${supportServerLink}) untuk menyertai Discord kami. \nKami ada di sana untukmu sepanjang masa ❤️`)
            .setThumbnail(`https://media1.tenor.com/m/M9mj9avMZrUAAAAC/jeng-malay.gif`)
            .setTimestamp();


        message.reply({ embeds: [embed] });
    },
};
