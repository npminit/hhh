
exports.run = (client, message, args) => {

  if (!args[0]) return message.reply('dont leave the report blank')

  var reportMessage = `User:
  ${message.author.username}

  Id:
  ${message.author.id}

  report:
  ${args.join(' ')}
  `
  
  client.sendMessage(admins, reportMessage)
}

exports.description = 'report bugs';