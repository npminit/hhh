
exports.run = (client, message, args) => {

  var clanTag = checkClan(message.group.id);

  if (!clanTag) return message.reply('there is no clan linked to this chat please us claim');
  if (!args[0]) return message.reply('please specify a spot to call');

  var number = args.splice(0, 1);
  var user = args.join(' ');

  Storage.getItem('callsLeaderBoard', (err, CLB) => {
    if (err) throw err;

    if (!CLB) {
      CLB = {};
    } else {
      CLB = JSON.parse(CLB);
    }

    Storage.getItem(clanData[clanTag].warId, (err, warData) => {
      if (err) throw err;
  
      // Check if there is any war data saved
      if (!warData) return message.reply('there is no war data');
      // Check if there is actually a war going on
      if (warData.stats.state == 'warEnded' || warData.stats.state == 'notInWar') return message.reply('There is no war to be calling oponents');
  
      if (number < 1 || number > warData.stats.opponent.memberCount) return message.reply(`spots are between 1 and ${warData.stats.opponent.memberCount}`);
  
      Storage.getItem(`${clanData[clanTag].warId}warCalls`, (err, warCalls) => {
        if (err) throw err;
  
        var call = warCalls[number].split('//');
  
        if (call[0] == 'hide') return message.reply('this spot is 3 starred');
        if (call[1] == message.author.id) return message.reply('you have already called this spot');
        if (call[0] != 'empty' && call[1] != message.author.id) return message.reply(`this spot is taken by ${call[0]}`);
  
        if (!clanData[clanTag].userData) clanData[clanTag].userData = {};
  
        if (!clanData[clanTag].userData[message.author.id]) clanData[clanTag].userData[message.author.id] = { calls: 0 }
        if (clanData[clanTag].userData[message.author.id].calls >= 2) return message.reply('you already have two calls please cancel one before calling another');
  
        if (call[0] == 'empty') {
  
          var caller = message.author.username
          if (user) caller = user;
  
          warCalls[number] = `${caller}//${message.author.id}//${new Date().getTime()}`;
          Storage.setItemSync(`${clanData[clanTag].warId}warCalls`, warCalls)

          clanData[clanTag].userData[message.author.id].calls++
          if (!CLB[clanTag]) {
            CLB[clanTag] = { name: clanData[clanTag].name, calls: 0 }
          }

          CLB[clanTag].calls++
          Storage.setItemSync(`callsLeaderBoard`, JSON.stringify(CLB));
          
          list(clanTag, (list) => {
            var callMessage = `${warData.stats.clan.name} vs ${warData.stats.opponent.name}\nStars: ${warData.stats.clan.stars} vs ${warData.stats.opponent.stars}\n\n${number} has been called for ${caller}\n\n${list}`
  
            message.reply(callMessage);
          })
  
        }
      })
    })


  })

}

exports.description = 'call bases for war "call 22" or "call 22 MinyAccount"'