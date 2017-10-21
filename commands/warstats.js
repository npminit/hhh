const moment = require('moment');

exports.run = (client, message, args) => {
  if (args[0]) {
    let clanTag = args[0].toUpperCase().replace(/O/g, '0')
    if (!clanData[clanTag]) return message.reply('I don\'t appear to have any war data for that clan.')
    Storage.getItem(clanData[clanTag].warId, (err, warData) => {
      if (!warData) return message.reply('War data is missing try again in a little bit. I might still be fetching the data.')
      statsMessage(warData, message)
    });
  } else {

    let clanTag = checkClan(message.group.id);

    Storage.getItem(clanData[clanTag].warId, (err, warData) => {
      if (!warData) return message.reply('War data is missing try again in a little bit. I might still be fetching the data.')
      statsMessage(warData, message)
    });

  }
}

exports.description = "see war stats for the current war";

statsMessage = (WarData, message) => {

  var StatsMessage = `${WarData.stats.clan.name} vs ${WarData.stats.opponent.name}\n`

  if (WarData.stats.state === 'preparation') {
    StatsMessage += `War starts ${moment(WarData.stats.startTime).fromNow()}\n`;
  } else if (WarData.stats.state === 'inWar') {
    StatsMessage += `War ends ${moment(WarData.stats.endTime).fromNow()}\n`;
  } else if (WarData.stats.state === 'warEnded') {
    StatsMessage += `War ended ${moment(WarData.stats.endTime).fromNow()}\n`;
  }

  StatsMessage += `3 Stars:
  ${WarData.stats.clan.threeStars} vs ${WarData.stats.opponent.threeStars}

  MemberCount:
  ${WarData.stats.clan.memberCount} vs ${WarData.stats.opponent.memberCount}

  DestructionPercentage:
  ${WarData.stats.clan.destructionPercentage}% vs ${WarData.stats.opponent.destructionPercentage}%

  Stars:
  ${WarData.stats.clan.stars} vs ${WarData.stats.opponent.stars}
  `

  message.reply(StatsMessage);
}
