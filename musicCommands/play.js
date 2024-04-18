const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  AudioPlayerStatus,
  entersState,
  VoiceConnectionStatus,
} = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const YouTubeSearch = require('youtube-search');
const { EmbedBuilder } = require('discord.js');
const { updateHistory } = require('./historyUtils');
const config = require('../config.json');
const youtubeAPIKey = config.youtubeAPIKey;
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { InteractionCollector } = require('discord.js');
const { updateHistory, getSearchHistory } = require('./historyUtils');

let isPaused = false;
const youtubeSearchOptions = {
  maxResults: 1,
  key: youtubeAPIKey,
};

const queue = [];
let player;
let currentConnection;
let currentMessage;
function createPlayer() {
  if (!player) {
    player = createAudioPlayer();
    player.on(AudioPlayerStatus.Idle, async () => {
      await playNextSong(currentConnection, currentMessage);
    });
  }
}


function enqueue(song) {
  queue.push(song);
}


function dequeue() {
  return queue.shift();
}
async function displayQueue(message) {
  if (queue.length === 0) {
    const embed = new EmbedBuilder()
      .setAuthor({
          name: 'Perhatian',
          iconURL: 'https://cdn.discordapp.com/attachments/1223544847047065662/1224631171766292500/9596-wrong.gif?ex=661e31a7&is=660bbca7&hm=0176645a3d582d6b93c8447a02cd7b1e7923b316212336fdc0b23b96b5e8ab4b&',
          url: 'https://discord.gg/X6RT5VdJPQ'
        })
      .setDescription('**Senarai main kosong, sila tambah lagu.**')
      .setColor('#ff0000');
    return message.reply({ embeds: [embed] });
  }

  const embed = new EmbedBuilder()
    .setColor('#2b71ec')
    .setAuthor({
      name: 'Senarai Main',
      iconURL: 'https://cdn.discordapp.com/attachments/1175488636033175602/1175488721001398333/queue.png?ex=656b6a2e&is=6558f52e&hm=7b4492b1c7573613cbb8dcac83ba5d5fc55ca607cf535dd11918d619aa6fd7ad&',
      url: 'https://discord.gg/X6RT5VdJPQ'
    })
    .setDescription(queue.map((song, index) => `**${index + 1}.** ${song.searchQuery}`).join('\n'));

  message.reply({ embeds: [embed] });
}


async function playNextSong(connection, message) {
  if (queue.length > 0) {
    const nextSong = dequeue();
    await playSong(connection, nextSong.searchQuery, nextSong.message);
  } else {
    if (!connection.destroyed) {
      connection.destroy();
    }
    const embed = new EmbedBuilder()
      .setAuthor({
          name: 'Senarai Main Kosong',
          iconURL: 'https://cdn.discordapp.com/attachments/1223544847047065662/1224631831178248347/4381-anouncements-animated.gif?ex=661e3245&is=660bbd45&hm=25f3b77985241a4612a8f4946a4631f8add618d9f36a0d9157fb4821aa6d2a0e&',
          url: 'https://discord.gg/X6RT5VdJPQ'
        })
      .setDescription('**Oops! Senarai main kosong. Bot kami sedang berehat. Jumpa nanti!**')
      .setColor('#ffcc00');
    message.reply({ embeds: [embed] });
  }
}

async function playSong(connection, searchQuery, message) {
  createPlayer();

  player.pause();

  let searchResult;
  try {
    searchResult = await YouTubeSearch(searchQuery, youtubeSearchOptions);
  } catch (error) {
    console.error(error);
    return message.reply('❌ Terdapat ralat semasa mencari lagu.');
  }

  if (!searchResult || !searchResult.results.length) {
    return message.reply('❌ Tiada hasil carian untuk query yang diberikan.');
  }

  const video = searchResult.results[0];
  const youtubeLink = `https://www.youtube.com/watch?v=${video.id}`;

  const stream = ytdl(youtubeLink, { filter: 'audioonly' });
  const resource = createAudioResource(stream, {
    inputType: StreamType.Arbitrary,
    inlineVolume: true,
  });

  player.play(resource);
  connection.subscribe(player);

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 20_000);
    await entersState(player, AudioPlayerStatus.Playing, 20_000);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: 'Kini Memainkan Track',
        iconURL: 'https://cdn.discordapp.com/attachments/1140841446228897932/1144671132948103208/giphy.gif', 
        url: 'https://discord.gg/X6RT5VdJPQ'
      })
      .setDescription(`\n ‎ \n▶️ **Butiran :** [${video.title}](${youtubeLink})\n▶️ **Nikmati Pengalaman Muzik YouTube Terbaik ** \n▶️ **Jika pautan rosak, cuba berikan query sekali lagi**`)
      .setImage(video.thumbnails.high.url) 
      .setColor('#2b71ec')
      .setFooter({ text: 'Maklumat lanjut - Gunakan perintah: -help' });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('pause')
          .setLabel('Jeda')
          .setEmoji('⏸️')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('resume')
          .setLabel('Sambung')
          .setEmoji('▶️')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('skip')
          .setLabel('Langkau')
          .setEmoji('⏭️')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()  
        .setCustomId('display_queue')
        .setLabel('Senarai Main')
        .setEmoji('📄')
        .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()  
        .setLabel('Pautan')
        .setURL(youtubeLink)
        .setStyle(ButtonStyle.Link)      
      );

    const replyMessage = await message.reply({ embeds: [embed], components: [row] });

    updateHistory({ title: video.title, link: youtubeLink });

 
    const collector = new InteractionCollector(message.client, {
      filter: interaction => interaction.isButton() && interaction.message.id === replyMessage.id,
      time: 180000, 
    });
    

    collector.on('collect', async interaction => {
      const { member } = interaction;

      switch (interaction.customId) {
        case 'pause':
          pausePlayback();
          await interaction.deferUpdate();
          break;
        case 'resume':
          resumePlayback();
          await interaction.deferUpdate();
          break;
        case 'skip':
          if (member.voice.channel && queue.length > 0) {
            playNextSong(currentConnection, currentMessage);
            const embed = new EmbedBuilder()
              .setColor('#2b71ec')
              .setAuthor({
                name: 'Lagu Dilangkau!',
                iconURL: 'https://cdn.discordapp.com/attachments/1175488636033175602/1175488721253052426/right-chevron-.png?ex=656b6a2e&is=6558f52e&hm=50647a73aa51cb35f25eba52055c7b4a1b56bbf3a6d13adc15b52dc533236956&',
                url: 'https://discord.gg/X6RT5VdJPQ'
              })
              .setDescription('**Mari kita bergerak ke rentak seterusnya...**');
            interaction.reply({ embeds: [embed] });
          } else {
            interaction.deferUpdate();
          }
          break;
        case 'display_queue':
          displayQueue(message);
          await interaction.deferUpdate();
          break;
        default:
          interaction.reply('❌ Respon tidak sah.');
      }
    });
    setTimeout(() => {
      row.components.forEach(button => button.setDisabled(true));
      replyMessage.edit({ components: [row] });
    }, 180000);
    collector.on('end', () => console.log('Button interaction collector ended.'));
  } catch (error) {
    console.error(error);
    if (!connection.destroyed) {
      connection.destroy();
    }
    message.reply('🔴 Terdapat ralat semasa memainkan muzik.');
  }
}



function pausePlayback() {
  if (player && player.state.status === AudioPlayerStatus.Playing) {
    player.pause();
    isPaused = true;

    const embed = new EmbedBuilder()
      .setAuthor({
          name: 'Pemutaran Dijeda!',
          iconURL: 'https://cdn.discordapp.com/attachments/1175488636033175602/1175488720519049337/pause.png?ex=656b6a2e&is=6558f52e&hm=6695d8141e37330b5426f146ec6705243f497f95f08916a40c1db582c6e07d7e&',
          url: 'https://discord.gg/X6RT5VdJPQ'
        })
      .setDescription('**Hentikan rentak! Muzik sedang berehat..**')
      .setColor('#2b71ec');

    currentMessage.reply({ embeds: [embed] });
  } else {
    const embed = new EmbedBuilder()
      .setAuthor({
          name: 'Perhatian',
          iconURL: 'https://cdn.discordapp.com/attachments/1223544847047065662/1224631171766292500/9596-wrong.gif?ex=661e31a7&is=660bbca7&hm=016645a3d582d6b93c8447a02cd7b1e7923b3162127336fdc0b23b96b5e8ab4b&',
          url: 'https://discord.gg/X6RT5VdJPQ'
        })
      .setDescription('**Bot tidak memainkan sebarang lagu.**')
      .setColor('#ff0000');
    currentMessage.reply({ embeds: [embed] });
  }
}

function resumePlayback() {
  if (player && player.state.status === AudioPlayerStatus.Paused) {
    player.unpause();
    isPaused = false;

    const embed = new EmbedBuilder()
       .setAuthor({
          name: 'Pemutaran Diteruskan!',
          iconURL: 'https://cdn.discordapp.com/attachments/1175488636033175602/1175488720762310757/play.png?ex=656b6a2e&is=6558f52e&hm=ae4f01060fe8ae93f062d6574ef064ca0f6b4cf40b172f1bd54d8d405809c7df&',
          url: 'https://discord.gg/X6RT5VdJPQ'
        })
      .setDescription('**Kembali beraksi! Biarkan rentak berputar..**')
      .setColor('#2b71ec');
    currentMessage.reply({ embeds: [embed] });
  } else {
    const embed = new EmbedBuilder()
      .setAuthor({
          name: 'Perhatian',
          iconURL: 'https://cdn.discordapp.com/attachments/1223544847047065662/1224631171766292500/9596-wrong.gif?ex=661e31a7&is=660bbca7&hm=6645a3d582d6b93c8447a02cd7b1e7923b316212017336fdc0b23b96b5e8ab4b&',
          url: 'https://discord.gg/X6RT5VdJPQ'
        })
      .setDescription('**Bot tidak dijeda.**')
      .setColor('#ff0000');

    currentMessage.reply({ embeds: [embed] });
  }
}

const autoplayThreshold = 5; // Adjust the threshold as needed

async function autoplay(connection, message) {
  const searchHistory = getSearchHistory();
  
  if (searchHistory.length < autoplayThreshold) {
    return message.reply('Search history is not sufficient for autoplay.');
  }

  const lastVideo = searchHistory[searchHistory.length - 1];
  const autoplaySearchQuery = lastVideo.title; // Use the title of the last video as the autoplay search query

  const embed = new EmbedBuilder()
    .setAuthor({
      name: 'Autoplay',
      iconURL: 'https://cdn.discordapp.com/attachments/1175488636033175602/1175488721001398333/autoplay.png?ex=656b6a2e&is=6558f52e&hm=7573613cbb8dcac83ba5d5fc55ca607cf535dd117b4492b1c918d619aa6fd7ad&',
      url: 'https://discord.gg/X6RT5VdJPQ'
    })
    .setDescription(`**Searching for the next song...**`)
    .setColor('#2b71ec');

  message.reply({ embeds: [embed] });

  await playSong(connection, autoplaySearchQuery, message);
}

module.exports = {
  name: 'play',
  description: 'Mainkan muzik dari YouTube',
  execute: async (message, args) => {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('**⚠️ Anda perlu berada dalam Voice Channel!**');
    }

    const searchQuery = args.join(' ');
    if (!searchQuery) {
      return message.reply('**▶️ Sila berikan query carian!**');
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    currentConnection = connection; 
    currentMessage = message; 

    if (connection.state.status === VoiceConnectionStatus.Ready) {
      enqueue({ searchQuery, message });
      createPlayer();
      const embed = new EmbedBuilder()
        .setAuthor({
          name: 'Ditambahkan Ke Senarai Main',
          iconURL: 'https://cdn.discordapp.com/attachments/1156866389819281418/1157218651179597884/1213-verified.gif?ex=6517cf5a&is=65167dda&hm=cf7bc8fb4414cb412587ade0af285b77569d2568214d6baab8702ddeb6c38ad5&', 
          url: 'https://discord.gg/X6RT5VdJPQ'
        })
        .setDescription(`**Lagu anda telah ditambah ke senarai main dan sedia dimainkan!**`)
        .setColor('#14bdff')
        .setFooter({ text: 'Gunakan -queue untuk maklumat lanjut' });
      return message.reply({ embeds: [embed] });
    }

    const listener = async (oldState, newState) => {
      if (newState.member.user.bot) {
        return;
      }

      if (oldState.channel && !newState.channel) {
        const membersInChannel = oldState.channel.members.size;
        if (membersInChannel === 1) {
          message.client.removeListener('voiceStateUpdate', listener);

          if (!connection.destroyed) {
            connection.destroy();
          }
        }
      }
    };

    message.client.on('voiceStateUpdate', listener);

    await playSong(connection, searchQuery, message);


    
  },
  autoplay,
  queue,
  dequeue,
  playNextSong,
  playSong,
  pause: () => {
    pausePlayback();
  },
  resume: () => {
    resumePlayback();
  },
  getPlayer: () => player,
  getCurrentConnection: () => currentConnection, 
};
