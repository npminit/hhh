var config = require('../config');

exports.run = (client, message, args, clanTag) => {
  if (!clanTag) return message.reply('claim a clan first');

  ClanStorage.getItem(message.author.id, (err, userInfo) => {
    if (err) throw err;

    if (!userInfo) return message.reply('please verify yourself first')

    userInfo = JSON.parse(userInfo)
    
    if (config.securityRoles.indexOf(userInfo.role) == -1) return message.reply('you dont have access to this command');

    if (!args[0] || args[0] != 'true' && args[0] != 'false') return message.reply('specify true or false');
    
    
    ClanStorage.getItem(clanTag, (err, clanSettings) => {
      if (err) throw err;
  
  
      if (clanSettings) {
        clanSettings.hideList = args[0]
        clanData[clanTag].settings.hideList = args[0]
      } else {
        clanSettings = config.defaultClanSettings
        clanSettings.hideList = args[0]
        clanData[clanTag].settings = clanSettings
      }
      ClanStorage.setItem(clanTag, clanSettings)
      .then(() =>  {
        notify(`lists will be ${args[0] == 'true' ? 'hidden' : 'shown'} in attack updates
        
        who changed it?
        username:
        ${message.author.username}
        
        id:
        ${message.author.id}

        profile pic:
        ${message.author.pictureUrl}`, clanTag);
      })
    })

  })

}