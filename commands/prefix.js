var config = require('../config');

exports.run = (client, message, args, clanTag) => {
  if (!clanTag) return message.reply('claim a clan first');

  ClanStorage.getItem(message.author.id, (err, userInfo) => {
    if (err) throw err;

    if (!userInfo) return message.reply('please verify yourself first')

    userInfo = JSON.parse(userInfo)
    
    if (config.securityRoles.indexOf(userInfo.role) == -1) return message.reply('you dont have access to this command');

    if (!args[0]) return message.reply('specify a prefix please');
    if (args[0].length > 3) return message.reply('max length of a prefix is 3')
    
    
    ClanStorage.getItem(clanTag, (err, clanSettings) => {
      if (err) throw err;
  
  
      if (clanSettings) {
        clanSettings.prefix = args[0]
        clanData[clanTag].settings.prefix = args[0]
      } else {
        clanSettings = config.defaultClanSettings
        clanSettings.prefix = args[0]
        clanData[clanTag].settings = clanSettings
      }
      ClanStorage.setItem(clanTag, clanSettings)
      .then(() =>  {
        notify(`this clans prefix has been set to ${args[0]}
        
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