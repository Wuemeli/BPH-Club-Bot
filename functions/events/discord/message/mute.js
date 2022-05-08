const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const prefix = require('prefix-parser');
const { guild_id, channel_id, content } = context.params.event;




const muteCommand = '-mute'
const unmuteCommand = '-unmute'
const roleCommand = '-mute-role' 





let [argsRole, infoOrErrorRole] = prefix(roleCommand, `Set the mute role for your server.`)
  .role('Role')
  .parse(content);

if (infoOrErrorRole) {
  return lib.discord.channels['@0.1.2'].messages.create({
    channel_id,
    content: infoOrErrorRole,
  });
} else if (argsRole) {
  if (!await isAdmin()) return 
  const [role_id] = argsRole
  await setMuteRole(role_id)
  await lib.discord.channels['@0.0.6'].messages.create({
    channel_id,
    content: `Mute role is now <@&${role_id}>`,
  })
  return
}



const [argsMute, infoOrErrorMute] = prefix(muteCommand, `Mute a user.`)
  .user('User')
  .text('Reason')
  .parse(content);

if (infoOrErrorMute) {
  return lib.discord.channels['@0.1.2'].messages.create({
    channel_id,
    content: infoOrErrorMute,
  });
} else if (argsMute) {
  if (!await isAdmin()) return
  
  const muteRoleId = await getMuteRole()
  if (!muteRoleId) return
  
  const [user_id, reason] = argsMute
  
  await lib.discord.guilds['@0.1.0'].members.roles.update({
    guild_id, user_id,
    role_id: muteRoleId,
  });
  
  await lib.discord.channels['@0.0.6'].messages.create({
    channel_id,
    content: ``,
    embed: {
      title: ``,
      type: 'rich',
      color: 0xabccff,
      description: `<@${user_id}> is muted: ${reason}`
    }
  })
  return
}



const [argsUnmute, infoOrErrorUnmute] = prefix(unmuteCommand, `Unmute a user.`)
  .user('User')
  .parse(content);

if (infoOrErrorUnmute) {
  return lib.discord.channels['@0.1.2'].messages.create({
    channel_id,
    content: infoOrErrorUnmute,
  });
} else if (argsUnmute) {
  if (!await isAdmin()) return
  
  const muteRoleId = await getMuteRole()
  if (!muteRoleId) return
  
  const [user_id] = argsUnmute
  
  await lib.discord.guilds['@0.1.0'].members.roles.destroy({
    guild_id, user_id,
    role_id: muteRoleId,
  });
  
  await lib.discord.channels['@0.0.6'].messages.create({
    channel_id,
    content: ``,
    embed: {
      title: ``,
      type: 'rich',
      color: 0xabccff,
      description: `<@${user_id}> is unmuted`
    }
  })
  return
}



async function isAdmin() {
  let isAdmin = false;
  let guildInfo = await lib.discord.guilds['@0.1.0'].retrieve({ guild_id });
  let roles = await lib.discord.guilds['@0.1.0'].roles.list({ guild_id });
  let userRoles = roles.filter(role => context.params.event.member.roles.includes(role.id)); 
  
  if (guildInfo.owner_id === context.params.event.author.id)
    isAdmin = true;
  else
    for (let i = 0; i < userRoles.length; i++) {
      let _role = userRoles[i];
      if (_role.permission_names.includes('ADMINISTRATOR')) {
        isAdmin = true;
        break;
      }
    }
  
  if (!isAdmin)
    await lib.discord.channels['@0.1.1'].messages.create({
      channel_id,
      content: `Sorry, you don't have permission to use this command. You need to have the <@&${adminRoleId}> role.`
    });
    
  return isAdmin
}


async function setMuteRole(muteRoleId) {
  const muteRoleMap = await lib.utils.kv['@0.1.16'].get({ key: 'mute-role-map', defaultValue: {} });
  muteRoleMap[context.params.event.guild_id] = muteRoleId;
  await lib.utils.kv['@0.1.16'].set({ key: 'mute-role-map', value: muteRoleMap });
}


async function getMuteRole() {
  const muteRoleMap = await lib.utils.kv['@0.1.16'].get({ key: 'mute-role-map', defaultValue: {} });
  const muteRoleId = muteRoleMap[context.params.event.guild_id]
  if (!muteRoleId)
    await lib.discord.channels['@0.1.1'].messages.create({
      channel_id,
      content: `A mute role ID has not been set for this server. Please use the \`${roleCommand} <@role>\` command to set one.`
    });
  return muteRoleId
}
