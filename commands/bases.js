
exports.run = (client, message, args) => {
	var clanTag = checkClan(message.group.id);
  if (!clanTag) return message.reply('theres no clan linked to this chat');
  
  Storage.getItem(clanData[clanTag].warId, (err, warData) => {
    if (err) throw err;

    if (!warData) return message.reply('there is no war data');

    if (warData.stats.state == 'warEnded' || warData.stats.state == 'notInWar') return message.reply('There is no war going on');

    list(clanTag, (list) => {
  
      var basesMessage = `${warData.stats.clan.name} vs ${warData.stats.opponent.name}\n\n${list}`
        
      message.reply(basesMessage);
    })

  });

}

exports.description = 'use to see all bases'