const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
module.exports = async (event, context) => {
  let text = event.content.substr(event.content.indexOf(' ') + 1);
  let v = process.env;
  let date = new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York',
    month: 'numeric',
    day: 'numeric',
  });
  let server = await lib.discord.guilds['@0.1.0'].retrieve({
    guild_id: event.guild_id,
  });
  let color = 0x00b3ff; 

  if (event.content.toLowerCase().startsWith(`${v.prefix}announce`)) {
    await lib.discord.channels['@0.0.1'].messages.destroy({
      message_id: event.id,
      channel_id: event.channel_id,
    });
    if (event.channel_id === `${v.announcement_channel_id}`) {
      if (text !== `${v.prefix}announce`) {
        await lib.discord.channels['@0.1.1'].messages.create({
          channel_id: `${v.announcement_channel_id}`,
          content: `@everyone`, 
          embed: {
            title: `📢 Ankündigung`,
            color: color,
            description: `${text}`,
            footer: {
              text: `${date}  •  ${server.name}`,
            },
          },
        });
      }
    } else {
      await lib.discord.channels['@0.0.1'].messages.create({
        channel_id: event.channel_id,
        content: `<@!${event.author.id}>`,
        embed: {
          title: ``,
          description: `⛔️ That command can only be used in <#${v.announcement_channel_id}>.`,
          color: 0xff0000,
        },
      });
    }
  }
};
