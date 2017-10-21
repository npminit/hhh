const Line = require('line.js');
const fs = require('fs');
const config = require('./config')

global.Client = new Line.Client({
  channelAccessToken: config.line.channelAccessToken, 
  channelSecret: config.line.channelSecret, 
  port: config.line.port 
}); 

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    Client.on(eventName, (...args) => eventFunction.run(Client, ...args));
  });
});

Client.on("message", (message) => {
  
  if (!message.group) return message.reply("Not a valid group");
  var clan = checkClan(message.group.id);
  var prefix = config.defaultClanSettings.prefix;
  if (clan) prefix = clanData[clan].settings.prefix
  if (message.content.indexOf(prefix) !== 0) return;

  // This is the best way to define args. Trust me.
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  // The list of if/else is replaced with those simple 2 lines:
  try {
    let commandFile = require(`./commands/${command}.js`);
    if (clan) {
      commandFile.run(Client, message, args, clan);
    } else {
      commandFile.run(Client, message, args, null);
    }
  } catch (err) {
    console.log(err);
  }
});

var ready = require('./events/ready');

ready.run(Client);