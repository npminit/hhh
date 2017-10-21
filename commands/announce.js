
exports.run = (client, message, args) => {
  if (admins.indexOf(message.author.id) == -1) return message.reply('you dont have access to this command');
  if (!args[0]) return message.reply('specify something to announce');

  var announceMessage = `New Announcement
  Announcer:
  ${message.author.username}

  
  ${args.join(' ')}
  `

  notify(announceMessage, 'all');
}

exports.description = 'announce something to all the clans (restricted access)'