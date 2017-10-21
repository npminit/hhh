
exports.run = (client, message, args) => {
  var cT = checkClan(message.group.id);
  
  if (!cT) return message.reply('there is no clan linked to this chat');

  if (!args[0]) return message.reply('you must specify troops to Request');

  var troops = args.join(" ");
  
  notify(`${message.author.username} has requested ${troops}`, cT);

}

exports.description = "Request troops `Request Bowlers`";