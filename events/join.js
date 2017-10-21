const config = require('../config')

exports.run = (client, group) => {
  group.sendMessage(config.joinMessage);
}