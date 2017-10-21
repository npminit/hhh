
exports.run = (client, message, args) => {

  var list = ""
  
  var clanTag = checkClan(message.group.id);

  Storage.getItem(`${clanData[clanTag].warId}warCalls`, (err, warCalls) => {
    if (err) throw err;

    warCalls.forEach((call, index) => {
      if (index == 0) {
  
      } else if (call === "empty") {
        list += `${index} \n `
      }
    })
  
  
    message.reply(list);

  });

}

exports.description = 'check which bases arent called "free"'