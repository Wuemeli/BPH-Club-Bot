const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

if (context.params.event.content.startsWith(`-kick`)) {
  let mentions = context.params.event.mentions;
  let mention = mentions[0];
  let canKick = false;
  let guild = await lib.discord.guilds['@0.1.0'].retrieve({
    guild_id: `${context.params.event.guild_id}`,
  });

  if (guild.owner_id === context.params.event.author.id) {
    canKick = true;
  } else {
    let roles = await lib.discord.guilds['@0.1.0'].roles.list({
      guild_id: `${context.params.event.guild_id}`,
    });

    roles = roles.filter((role) => {
      return context.params.event.member.roles.indexOf(role.id) > -1;
    });

    for (let i = 0; i < roles.length; i++) {
      let role = roles[i];
      canKick =
        (role.permissions & (1 << 3)) === 1 << 3 ||
        (role.permissions & (1 << 1)) === 1 << 1;

      if (canKick) {
        break;
      }
    }
  }

  if (canKick) {
    try {
      let result = await lib.discord.guilds['@0.1.0'].members.destroy({
        user_id: `${mention.id}`,
        guild_id: `${context.params.event.guild_id}`,
      });

      let createdMessage = await lib.discord.channels['@0.1.0'].messages.create(
        {
          channel_id: `${context.params.event.channel_id}`,
          content: `member kicked`,
        }
      );
    } catch (e) {
      console.log(e);
      await lib.discord.channels['@0.1.0'].messages.create({
        channel_id: `${context.params.event.channel_id}`,
        content: `failed to remove member`,
      });
    }
  } else {
    await lib.discord.channels['@0.1.0'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `sorry you don't have permission`,
    });
  }
}
