
exports.run = (client, message, args) => {

  ClanStorage.getItem(message.author.id, (err, user) => {
    if (err) throw err;

    if (user) user = JSON.parse(user)
    if (!user) return message.reply('you dont have any villages')

    var villageMessage = `
    main:
    ${user.accounts.main}
    
    mini:
    `
    for (var i = 0; i < user.accounts.mini.length; i++) {
      villageMessage += `${user.accounts.mini[i]}\n`
    }

    message.reply(villageMessage);

  });

}