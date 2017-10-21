exports.run = (client, message, args) => {
  if (admins.indexOf(message.author.id) == -1) return message.reply('must be a admin to reload commands')
  if (!args || args.size < 1) return message.reply("Must provide a command name to reload.");
  // the path is relative to the *current folder*, so just ./filename.js
  delete require.cache[require.resolve(`./${args[0]}.js`)];
  message.reply(`The command ${args[0]} has been reloaded`);
};