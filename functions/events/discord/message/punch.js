const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
if(context.params.event.content.startsWith("-punch")) {
  if (context.params.event.mentions.length !== 1) {
  await lib.discord.channels['@0.1.2'].messages.create({
      channel_id: `${context.params.event.channel_id}`,
      content: `Du musst zeigen, wen du schlagen willst.`
    });
  } else {
  await lib.discord.channels['@0.1.1'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    "content": ``,
    "tts": false,
    "embed": {
      "type": "rich",
      "title": `${context.params.event.mentions[0].username} wurde geschlagen`,
      "description": "",
      "color": 0x00FFFF,
      "image": {
        "url": `https://media1.tenor.com/images/903cf079f0e1fb24a9b11a687d02b242/tenor.gif?itemid=13970904`,
        "height": 0,
        "width": 0
      }
    }
  });
  }
}
