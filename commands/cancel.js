
exports.run = (client, message, args) => {
  
    var clanTag = checkClan(message.group.id);
  
    if (!clanTag) return message.reply('there is no clan linked to this chat please us claim');
    if (!args[0]) return message.reply('please specify a spot to cancel');
  
    var number = args.splice(0, 1)[0];
  
    Storage.getItem(clanData[clanTag].warId, (err, warData) => {
      if (err) throw err;
  
      // Check if there is any war data saved
      if (!warData) return message.reply('there is no war data');
      // Check if there is actually a war going on
      if (warData.stats.state == 'warEnded' || warData.stats.state == 'notInWar') return message.reply('There is no war to be cancelling calls');
      if (number < 1 || number > warData.stats.opponent.memberCount) return message.reply(`spots are between 1 and ${warData.stats.opponent.memberCount}`);
  
      Storage.getItem(`${clanData[clanTag].warId}warCalls`, (err, warCalls) => {
        if (err) throw err;
  
        var call = warCalls[number].split('//');
  
        if (call[0] == 'hide') return message.reply('this spot is 3 starred');
        if (warCalls[number] == 'empty') return message.reply('this spot has no call');
        if (call[0] == message.author.username && call[1] != message.author.id) {
          var badUser = message.author;
          message.reply(`@.@ did you think you could fool me sir?!?!?!?! I know you arent the real ${call[0]} and I have notified the real one you have tried to trick me`);
          client.sendMessage(call[1], `someone tried to trick me. they have your account name and tried to cancel your call. profile picture:\n${badUser.pictureUrl}`);
          admins.forEach((admin) => {
            client.sendMessage(admin, `${badUser.id} tried to cancel ${call[0]}'s call ${call[0]}'s id: ${call[1]}`)
          })
        }
        if (call[0] != 'empty' && call[1] != message.author.id) return message.reply(`this spot is taken by ${call[0]}`);
  
        if (!clanData[clanTag].userData) clanData[clanTag].userData = {};
  
        var callerInfo = clanData[clanTag].userData[message.author.id];
  
        if (!callerInfo) callerInfo = { calls: 0 }
        if (callerInfo.calls == 0) return message.reply('you have no calls to cancel 3: please call a base first');
  

        if (call[1] == message.author.id) {
  
          warCalls[number] = 'empty';
          Storage.setItemSync(`${clanData[clanTag].warId}warCalls`, warCalls)

          clanData[clanTag].userData[message.author.id].calls -= 1
          
          list(clanTag, (list) => {
            var callMessage = `${warData.stats.clan.name} vs ${warData.stats.opponent.name}\nStars: ${warData.stats.clan.stars} vs ${warData.stats.opponent.stars}\n\n${number} has been canceled for ${message.author.username}\n\n${list}`
            message.reply(callMessage);
          })

        }
      })
    })
  
  }
  
  exports.description = 'cancel bases you have called "cancel 22"'