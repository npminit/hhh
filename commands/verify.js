const funcs = require('../util/functions');

exports.run = (client, message, args, clanTag) => {
  if (!clanTag) return message.reply('this chat isnt linked to a clan')
  if (!args[0]) return message.reply('please specify whether this is your main or mini');
  if (!args[1]) return message.reply('please specify a user tag');

  var type = args[0].toLowerCase();
  var tag = args[1].toUpperCase().replace(/O/g, '0');

  if (type !== 'main' && type !== 'mini') return message.reply('those are not valid account types');
  if (!tag.match(/^#[0289PYLQGRJCUV]+$/)) return message.reply('that is not a valid tag');

  ClanStorage.getItem(message.author.id, (err, user) => {
    if (err) throw err;

    if (user) user = JSON.parse(user)
    if (!user) user = { accounts: { main: "", mini: [] } }

    funcs.getPlayer(tag, (userInfo) => {

      if (userInfo.clan && userInfo.clan.tag != clanTag) return message.reply('this chat isnt linked to the clan of the account you\'re trying to claim for')

      if (type == 'main') {
        user.accounts.main = tag;
        if (userInfo.clan) user.role = userInfo.role
      } else {
        user.accounts.mini.push(tag);
      }

      ClanStorage.setItem(message.author.id, JSON.stringify(user))
      .then(() => {
        message.reply(`you have added ${userInfo.name} as ${type == 'main' ? 'your main' : 'a mini'} account
        Clan:
        ${userInfo.clan.name}

        Role:
        ${userInfo.role}

        TownHallLvL:
        ${userInfo.townHallLevel}
        
        `);
      })

    })

  })
}