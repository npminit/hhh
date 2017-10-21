const nodePersist = require('node-persist');
const config = require('../config');
const funcs = require('../util/functions');
const warFuncs = require('../util/warFuncs')

exports.run = (Client) => {
  
  // Setup storage for WarData calls etc
  global.Storage = nodePersist.create({
    dir: 'Storage',
    expiredInterval: 1000 * 60 * 60 * 24 * 9 // Cleanup Files older than a week + 2 days for prep / war day.
  })

  // Setup storage for update groups / user data etc etc
  global.ClanStorage = nodePersist.create({
    dir: 'ClanData',
  })
  
  // Init our Storage to be used
  ClanStorage.initSync();
  Storage.initSync();

  global.clanData = {}
  global.admins = [];

  admins = ClanStorage.getItemSync('admins');
  if (!admins) ClanStorage.setItemSync('admins', admins = []);

  var groups = ClanStorage.getItemSync("groups");

  if (!groups) ClanStorage.setItemSync("groups", groups = []);

  // Setup our clanData Object
  groups.forEach((group) => {
    let groupInfo = group.split("//");

    /**
     *  groupInfo[0] channel id
     *  groupInfo[1] clan tag 
    */

    var clanSettings = ClanStorage.getItemSync(groupInfo[1]);
    var settings = config.defaultClanSettings;
    if (clanSettings) settings = clanSettings;

    // check if we've already made an object for that clan
    if (!clanData[groupInfo[1]]) {
      // if not we make one
      clanData[groupInfo[1]] = { channels: [groupInfo[0]], onStartup: true, settings: settings }
    } else {
      // if so we just push our update channel to it
      clanData[groupInfo[1]].channels.push(groupInfo[0])
    }
  })

  // loop through and start checking for updates
  for (clan in clanData) {
    clanData[clan].updateInterval = setInterval(() => {
      funcs.getCurrentWar(clan, (data, clan) => {
        parseCurrentWar(data, clan);
      })
    }, 1000 * config.updateInterval);

    funcs.getCurrentWar(clan, (data, clan) => {
      parseCurrentWar(data, clan);
    });
  }
}