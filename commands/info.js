const moment = require('moment');

exports.run = (client, message, args, clanTag) => {
  var infoMessage = `${(clanTag) ? clanData[clanTag].name : ''}


  Been announcing coc wars since ${moment("2017-08-25T23:13:33-05:00").format("MMM Do YYYY")}
  `

  message.author.sendMessage(infoMessage);
}