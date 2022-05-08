const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

if (context.params.event.content.toLowerCase().startsWith(`-help`)) {
  await lib.discord.channels['@0.0.6'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `Hey! <@${context.params.event.author.id}> schau in deine DMs ich habe dir meine Commands geschickt!`,
  });
  await lib.discord.users['@0.1.4'].dms.create({
    recipient_id: `${context.params.event.author.id}`,
    content: ` `,
    embed: {
      "type": "rich",
      "title": `BPH Club Help`,
      "description": `Members:\n-punch @user\nModeration:\n-ban @user\n-unban @user\n-kick @user\n-mute @user\n-unmute @user\n-warn @user\n-announce Text`,
      "color": 0x00FFFF
    },
  });
}
