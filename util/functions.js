var config = require('../config');

const COC_API_BASE = 'https://api.clashofclans.com/v1'
const async = require('async')
const get = require('simple-get')

const apiRequest = (task, cb) => {
  get.concat({
    url: task.url,
    method: 'GET',
    headers: {
      'authorization': 'Bearer ' + config.cocApiKey,
      'Cache-Control':'no-cache'
    }
  }, (err, res, jsonBuffer) => {
    cb()

    if (jsonBuffer !== undefined) {
      if (jsonBuffer.length > 0) {
        let data = JSON.parse(jsonBuffer)
        task.done(data)
      } else {
        task.done(false)
      }
    } else {
      task.done(false)
    }
  })
}

global.apiQueue = async.queue(apiRequest, 10)

exports.getCurrentWar = (clanTag, done = () => {}) => {
  apiQueue.push({
    url: `${COC_API_BASE}/clans/${encodeURIComponent(clanTag)}/currentwar`,
    done: (data) => {
      if (data.error) return done(null, clanTag); // parseCurrentWar(data, clanTag);
      done(data, clanTag)
    }
  });
}

exports.getWarLog = (clanTag, done = () => {}) => {
  apiQueue.push({
    url: `${COC_API_BASE}/clans/${encodeURIComponent(clanTag)}/warlog`,
    done: done
  })
}

exports.getPlayer = (playerTag, done = () => {}) => {
  playerTag = playerTag.toUpperCase().replace(/O/g, '0');
  if (playerTag.match(/^#[0289PYLQGRJCUV]+$/)) {
    apiQueue.push({
      url: `${COC_API_BASE}/players/${encodeURIComponent(playerTag)}`,
      done: done
    })
  }
}

global.list = (id, done) => {

  var clanTag = id.startsWith('#') ? id : checkClan(id);

  Storage.getItem(`${clanData[clanTag].warId}warCalls`, (err, warCalls) => {
    if (err) throw err;
    Storage.getItem(`${clanData[clanTag].warId}warAttacks`, (err, warAtt) => {
      if (err) throw err;

      let listInfo = ""
      
      warCalls.forEach((call, index) => {
        call = call.split('//')
        if (index == 0) {
    
        } else if (call[0] === "hide") {
    
        } else if (call[0] === "hide" && clanData[clanTag].settings.hideBases == false) {

          listInfo += `${index}. 🌟🌟🌟 100%\n`

        } else if (call[0] === "empty") {
          if (warAtt[index] !== "empty") {
    
            var args = warAtt[index].split(" ");
            var stars = args[0];
            var percent = args[1];
    
            var starMsg = '';
    
            if (stars == 1) {
              starMsg += '🌟';
            } else if (stars == 2) {
              starMsg += '🌟🌟'
            } else {
              starMsg += ''
            }
    
            listInfo += `${index}. ${starMsg} ${percent}%\n`
          } else {
            listInfo += `${index}.\n`
          }
        } else {
          if (warAtt[index] !== "empty") {
    
            var args = warAtt[index].split(" ");
            var stars = args[0];
            var percent = args[1];
    
            var starMsg = '';
    
            if (stars == 1) {
              starMsg += '🌟';
            } else if (stars == 2) {
              starMsg += '🌟🌟'
            } else {
              starMsg += ''
            }
    
            listInfo += `${index}. ${call[0]}, ${starMsg} ${percent}%\n`
          } else {
            listInfo += `${index}. ${call[0]}\n`
          }
        }
      })
    
      if (done) done(listInfo);

    });
  });

}

global.checkClan = (id) => {
  let clanTag = undefined;

  for (var clan in clanData) {
    if (clanData[clan].channels.indexOf(id) > -1) clanTag = clan;
  }

  return clanTag
}

global.notify = (msg, clanTag) => {
  if (clanTag == 'all') {
    for (var clan in clanData) {
      clanData[clan].channels.forEach((group) => {
        Client.sendMessage(group, msg)
      })
    }
  } else {
    clanData[clanTag].channels.forEach((group) => {
      Client.sendMessage(group, msg)
    })
  }
}