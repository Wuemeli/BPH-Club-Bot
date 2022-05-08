const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

if (context.params.event.content.startsWith(`-ban`)) {
  let mentions = context.params.event.mentions;
  let mention = mentions[0];
  let canban = false;
  let guild = await lib.discord.guilds['@0.1.0'].retrieve({
    guild_id: `${context.params.event.guild_id}`,
  });

  if (guild.owner_id === context.params.event.author.id) {
    canban = true;
  } else {
    let roles = await lib.discord.guilds['@0.1.0'].roles.list({
      guild_id: `${context.params.event.guild_id}`,
    });

    roles = roles.filter((role) => {
      return context.params.event.member.roles.indexOf(role.id) > -1;
    });

    for (let i = 0; i < roles.length; i++) {
      let role = roles[i];
      canban =
        (role.permissions & (1 << 3)) === 1 << 3 ||
        (role.permissions & (1 << 2)) === 1 << 2;

      if (canban) {
        break;
      }
    }
  }

  if (canban) {
    try {
      let result = await lib.discord.guilds['@0.1.0'].bans.create({
        user_id: `${mention.id}`,
        guild_id: `${context.params.event.guild_id}`,
        delete_message_days: 7,
        reason: `banned for a reason`,
      });

      let createdMessage = await lib.discord.channels['@0.1.0'].messages.create(
        {
          channel_id: `${context.params.event.channel_id}`,
          content: `member banned`,
        }
      );
    } catch (e) {
      console.log(e);
      await lib.discord.channels['@0.1.0'].messages.create({
        channel_id: `${context.params.event.channel_id}`,
        content: `failed to ban member`,
      });
    }
  } else {
    await lib.discord.channels['@0.1.0'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `sorry you don't have permission`,
    });
  }
}
