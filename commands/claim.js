var funcs = require('../util/functions.js');
var config = require('../config');

exports.run = (client, message, args, oldClanTag) => {
  
  if (!args[0]) return message.reply("please specify a clan tag");

  var clanTag = args[0].toUpperCase().replace(/O/g, '0');
  var changed = false;
  var oldClan
  if (oldClanTag) {
    oldClan = Object.assign({}, clanData[oldClanTag]);
  }

  ClanStorage.getItem(message.author.id, (err, userInfo) => {
    if (err) throw err;

    if (oldClanTag && !userInfo) return message.reply('please verify yourself first')

    if (userInfo) userInfo = JSON.parse(userInfo)

    if (oldClanTag && config.securityRoles.indexOf(userInfo.role) == -1) return message.reply('you dont have access to this command');


    funcs.getCurrentWar(clanTag, (data, clanTag) => {
      
      if (!data) return message.reply('something went wrong. please message a admin and ask us to check the logs');
      if (data.reason == 'accessDenied') {
        return message.reply("please public your war log and try again ( it may take 10 minutes for the data to update on the api)")
      } else if (data.reason == 'notFound') {
        return message.reply("that clan doesnt exist please make sure you have the correct clan tag");
      } else if (data.reason == 'notInWar') {
        return message.reply("you're clan in not currently in a war please claim when you have started one (this wont be needed in future versions)");
      }
  
      ClanStorage.getItem("groups")
      .then((groups) => {
        groups.forEach((group, index) => {
          let groupInfo = group.split('//');
    
          /**
           *  groupInfo[0] group id
           *  groupInfo[1] clan tag
          */
    
          if (groupInfo[0] === message.group.id) {
            groups[index] = `${message.group.id}//${clanTag}`
            changed = true
  
            ClanStorage.setItem("groups", groups)
            .then(() => {
              
              if (clanData[clanTag] && clanData[clanTag].channels.indexOf(message.group.id) == -1) {
  
                clanData[clanTag].channels.push(message.group.id)
  
              } else {
                clanData[clanTag] = { channels: [message.group.id], settings: config.defaultClanSettings}
                clanData[clanTag].updateInterval = setInterval(() => {
                  funcs.getCurrentWar(clanTag, (data, clanTag) => {
                    parseCurrentWar(data, clanTag);
                  })
                }, 1000 * config.updateInterval)
              }
  
              if (oldClanTag) {
                var indexOfOld = clanData[oldClanTag].channels.indexOf(message.group.id);
                clanData[oldClanTag].channels.splice(indexOfOld, 1);
                if (clanData[oldClanTag].channels.length == 0) {
                  clearInterval(clanData[oldClanTag].updateInterval);
                  delete clanData[oldClanTag];
                }
              }
  
              parseCurrentWar(data, clanTag);
  
              message.reply(`this group will now recieve updates for ${data.clan.name} instead of ${oldClan.name}`)
  
            })
  
          }
    
        });
        
        if (changed == false) {
  
          groups.push(`${message.group.id}//${clanTag}`);
          ClanStorage.setItem("groups", groups)
          .then(() => {
  
            message.reply(`this group will recieve updates for ${data.clan.name}`)
            
            if (clanData[clanTag] && clanData[clanTag].channels.indexOf(message.group.id) == -1) {
  
              clanData[clanTag].channels.push(message.group.id)
  
            } else {
              clanData[clanTag] = { channels: [message.group.id], settings: config.defaultClanSettings }
              clanData[clanTag].updateInterval = setInterval(() => {
                funcs.getCurrentWar(clanTag, (data, clanTag) => {
                  parseCurrentWar(data, clanTag);
                })
              }, 1000 * config.updateInterval)
            }
  
            if (oldClanTag) {
              var indexOfOld = clanData[oldClanTag].channels.indexOf(message.group.id);
              clanData[oldClanTag].channels.splice(indexOfOld, 1);
              if (clanData[oldClanTag].channels.length == 0) {
                clearInterval(clanData[oldClanTag].updateInterval);
                delete clanData[oldClanTag];
              }
            }
  
            parseCurrentWar(data, clanTag);
  
          })
  
        }
  
      });
  
    }) 

  })

}

exports.description = "add this channel to recieve updates for a clan `claim #clantag`"
