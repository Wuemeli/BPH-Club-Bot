const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
let result = await lib.discord.users['@0.1.1'].me.status.update({
  activity_name: `you!`, 
  activity_type: 'WATCHING', 
  status: 'ONLINE', 
});
