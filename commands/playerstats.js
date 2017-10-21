var funcs = require('../util/functions');

exports.run = (client, message, args) => {

  if (args[0]) {
    userStatsMessage(args[0], message);
  } else {
    ClanStorage.getItem(message.author.id, (err, user) => {
      if (err) throw err;

      if (!user) return message.reply('please specify a user tag');
      user = JSON.parse(user);

      userStatsMessage(user.accounts.primary, message);

    })
  }

  
}

userStatsMessage = (userTag, message) => {
  funcs.getPlayer(userTag.toUpperCase().replace(/O/g, '0'), data => {
    
    if (!data || data.hasOwnProperty('reason')) return message.reply('something went wrong');

    let troopLevels = ''
    let count = 0
    data.troops.forEach(troop => {
      troopLevels += `${troop.name}:${troop.level}`
      if (count > 0 && count % 7 === 0) {
        troopLevels += `\n`
      } else {
        if (troop.level === troop.maxLevel) {
          troopLevels +=  '*\n'
        } else {
          troopLevels +=  '\n'
        }
      }
      count++
    })

    let spellLevels = ''
    count = 0
    data.spells.forEach(spell => {
      spellLevels += `${spell.name}:${spell.level}`
      if (count > 0 && count % 7 === 0) {
        spellLevels += '\n'
      } else {
        if (spell.level === spell.maxLevel) {
          spellLevels +=  '*\n'
        } else {
          spellLevels +=  '\n'
        }
      }
      count++
    })

    let heroLevels = ''
    count = 0
    data.heroes.forEach(hero => {

      heroLevels += `${hero.name}:${hero.level}`
      if (count > 0 && count % 7 === 0) {
        heroLevels += '\n'
      } else {
        if (hero.level === hero.maxLevel) {
          heroLevels +=  '*\n'
        } else {
          heroLevels += `\n`
        }
      }
      count++
    })

    var playerMsg = `Name:${data.name}
    Tag:${data.tag}
    
    Clan:${data.clan.name}
    ClanTag:${data.clan.tag}
    
    TroopLevels:
    ${troopLevels}
    
    SpellLevels:
    ${spellLevels}
    
    HeroLevels:
    ${heroLevels}`

    message.reply(playerMsg);
  })
}

exports.description = "9.Check player's profile `playerstats #playertag`";
