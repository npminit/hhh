
exports.run = (client, message, args, clanTag) => {
  if (!clanTag) return message.reply('this chat is not linked to a chat');

  var settings = clanData[clanTag].settings;

  var settingsMessage = `current settings for ${clanData[clanTag].name}
  prefix: ${settings.prefix}
  enemy updates: ${settings.enemyUpdates}
  hide list: ${settings.hideList}
  hide bases: ${settings.hideBases}
  `

  message.reply(settingsMessage)
}