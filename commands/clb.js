
exports.run = (client, message, args) => {
  Storage.getItem('callsLeaderBoard', (err, CLB) => {
    if (err) throw err;

    if (!CLB) return message.reply('theres no data yet')

    for (var clan in CLB) {
      
    }
  })
}