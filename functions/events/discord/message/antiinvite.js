const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const DISCORD_LINKS = ['discord.gg/', 'https://discord.gg/']; 
let event = context.params.event;

const regEx = new RegExp(DISCORD_LINKS.join('|'), 'gi');

let messageContent = event.content;

if (messageContent.match(regEx)) {
  await lib.discord.channels['@0.0.3'].messages.destroy({
    
    message_id: event.id,
    channel_id: event.channel_id,
  });

  await lib.discord.channels['@0.0.6'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `<@!${context.params.event.author.id}> Bitte posten Sie keine Discord-Einladungen auf diesem Server.`, 
  });
}
