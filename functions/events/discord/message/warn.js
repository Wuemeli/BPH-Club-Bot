const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

if (context.params.event.content.startsWith('-warn')) {
  let userString = context.params.event.content.split(' ')[1];
  let reason = context.params.event.content.split(' ').slice(2).join(' ') || 'No reason provided.';
  if (!userString || !userString.match(/<@.*>/)) {
    await lib.discord.channels['@0.1.1'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `You must tag a user to warn.`
    });
    return;
  }
  await lib.discord.channels['@0.1.1'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `<@!${context.params.event.author.id}> warned ${userString}!`,
    embed: {
      "type": "rich",
      "title": "Reason",
      "description": '❌  ' + reason,
      "color": 0xAA0000
    }
  });
  await lib.discord.users['@0.1.3'].dms.create({
    recipient_id: `${userString}`,
    content: `<@!${context.params.event.author.id}> warned you!`,
    embed: {
      "type": "rich",
      "title": "Reason",
      "description": '❌  ' + reason,
      "color": 0xAA0000
    }
  });
}
