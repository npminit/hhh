
exports.run = (client, message, args) => {
  if (admins.indexOf(message.author.id) == -1) return message.reply('you dont have permission to use this command');

  if (!args[0]) return message.reply('please specify an id to respond to');
  
  if (!args[1]) return message.reply('dont leave your response empty');

  var userId = args.splice(0, 1);

  client.sendMessage(userId, args.join(' '));
}