const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const momenttz = require('moment-timezone');

let message = null;

module.exports = async (event, context) => {
  if (context.params.event.content.startsWith('-say')) {
    await lib.discord.channels['@0.1.1'].messages.destroy({
      message_id: `${context.params.event.id}`,
      channel_id: `${context.params.event.channel_id}`,
    });
    message = await lib.discord.channels['@0.1.0'].messages.create({
      channel_id: context.params.event.channel_id,
      content: event.content.split(' ').slice(1).join(' '),
    });

    let result = await lib.discord.guilds['@0.1.0'].retrieve({
      guild_id: `${context.params.event.guild_id}`,
    });

    let timestamp = context.params.event.timestamp;
    let date = momenttz(timestamp);
    let formattedTime = date.tz('Asia/Calcutta').format('hh:mma z');
    console.log(formattedTime);
    let dateString = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Calcutta',
    });
    console.log(dateString);
    await lib.discord.channels['@0.1.1'].messages.create({
      channel_id: `${process.env.log_channel_id}`,
      content: '',
      tts: false,
      embed: {
        type: 'rich',
        title: '  ',
        description: `**<@!${context.params.event.author.id}>** just used the say command, here's what they said: **${message.content}**.Here's when they sent the message:${formattedTime}. In **${result.name}** Server`,
        color: 0x00ffff,
      },
    });
  }
};
