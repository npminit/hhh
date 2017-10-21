
exports.run = (client, message, args) => {

  if (!args[0]) return message.reply('dont leave the suggestion blank')

  var suggestMessage = `User:
  ${message.author.username}

  Id:
  ${message.author.id}

  suggestion:
  ${args.join(' ')}
  `
  
  client.sendMessage(admins, suggestMessage)
}

exports.description = 'suggest new features';