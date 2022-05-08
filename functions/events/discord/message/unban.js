const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

if (context.params.event.content.startsWith('-unban')) {
  let mentions = context.params.event.mentions;
  let mention = mentions[0];
  let canunban = false;
  let guild = await lib.discord.guilds['@0.1.0'].retrieve({
    guild_id: `${context.params.event.guild_id}`,
  });

  if (guild.owner_id === context.params.event.author.id) {
    canunban = true;
  } else {
    let roles = await lib.discord.guilds['@0.1.0'].roles.list({
      guild_id: `${context.params.event.guild_id}`,
    });

    roles = roles.filter((role) => {
      return context.params.event.member.roles.indexOf(role.id) > -1;
    });

    for (let i = 0; i < roles.length; i++) {
      let role = roles[i];
      canunban =
        ((role.permissions & (1 << 3)) ===
          (1 << 3)(role.permissions & (1 << 2))) ===
        1 << 2;

      if (canunban) {
        break;
      }
    }
  }

  if (canunban) {
    try {
      let playerId = context.params.event.content.split(' ')[1];
      let result = await lib.discord.guilds['@0.1.0'].bans.destroy({
        user_id: `${playerId}`,
        guild_id: `${context.params.event.guild_id}`,
      });
      let createdMessage = await lib.discord.channels['@0.1.0'].messages.create(
        {
          channel_id: `${context.params.event.channel_id}`,
          content: 'Member Unbanned',
        }
      );
    } catch (e) {
      console.log(e);
      await lib.discord.channels['@0.1.0'].messages.create({
        channel_id: `${context.params.event.channel_id}`,
        content: 'failed to unban member please check their name/ID again.',
      });
    }
  } else {
    await lib.discord.channels['@0.1.0'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: "You don't have permission!",
    });
  }
}
