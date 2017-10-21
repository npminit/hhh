var config = require('../config')
var funcs = require('../util/functions.js');

exports.run = (client, message, args) => {
  let clanTag = checkClan(message.group.id);

  if (!clanTag) return message.reply("Theres no clan linked to this chat");
  if (clanData[clanTag].updateInterval !== "accessDenied") return message.reply('this chat is already recieving updates');

  message.reply('requesting data now (the api may take 10 minutes to update to public)');

  clanData[clanTag].updateInterval = setInterval(() => {
    funcs.getCurrentWar(clanTag, (data, clanTag) => {
      parseCurrentWar(data, clanTag);
    })
  }, 1000 * config.updateInterval);
  
  funcs.getCurrentWar(clanTag, (data, clanTag) => {
    parseCurrentWar(data, clanTag);
  });
}

exports.description = "used to make the bot recieve updates again incase you had your warLog private `refresh`";