/**
 * Require our modules 
*/

const crypto = require('crypto');
const config = require('../config')

fixISO = (str) => {
  return str.substr(0,4) + "-" + str.substr(4,2) + "-" + str.substr(6,5) + ":" + str.substr(11,2) + ":" +  str.substr(13)
}

reportMessage = (WarData, remindermsg) => {
  
  var reminder = `${WarData.stats.clan.name} vs ${WarData.stats.opponent.name}\n\n**${remindermsg.title}**\n\n${remindermsg.body}`

  Storage.setItemSync(clanData[WarData.stats.clan.tag].warId, WarData)
  notify(reminder, WarData.stats.clan.tag);

}

attackMessage = (WarData, attackData) => {

  var settings = clanData[WarData.stats.clan.tag].settings;
  
  Storage.getItem(`${clanData[WarData.stats.clan.tag].warId}warAttacks`, (err, warAtt) => {
    if (err) throw err;
    Storage.getItem(`${clanData[WarData.stats.clan.tag].warId}warCalls`, (err, warCalls) => {
      if (err) throw err;

      let attacker = clanData[WarData.stats.clan.tag].Players[attackData.attackerTag]
      let defender = clanData[WarData.stats.clan.tag].Players[attackData.defenderTag]
    
      if (attackData.who == "clan") {

        var callerId = warCalls[defender.mapPosition].split('//')[1]

        warCalls[defender.mapPosition] = 'empty'
        if (callerId && clanData[clanTag].userData[callerId]) clanData[clanTag].userData[callerId].calls -=1
        if (attackData.stars === 3) {
          warCalls[defender.mapPosition] = 'hide';
        }
        
        Storage.setItemSync(`${clanData[WarData.stats.clan.tag].warId}warCalls`, warCalls)


        var args = warAtt[defender.mapPosition].split(" ");
        
        var stars = args[0];
        var percent = args[1];
  
        if (warAtt[defender.mapPosition] == 'empty' || stars < attackData.stars || stars == attackData.stars && percent < attackData.destructionPercentage) {
          warAtt[defender.mapPosition] = `${attackData.stars} ${attackData.destructionPercentage}`
          Storage.setItemSync(`${clanData[WarData.stats.clan.tag].warId}warAttacks`, warAtt)
        }

        var attackMessage = `${WarData.stats.clan.name} attacked ${WarData.stats.opponent.name}
        Attacker: ${attacker.mapPosition}. ${attacker.name}
        Defender: ${defender.mapPosition}. ${defender.name}
        destructionPercentage: ${attackData.destructionPercentage}%
        stars: `;
        for (let i = 0; i < attackData.stars; i++) {
          attackMessage += "🌟";
        }
  
        list(WarData.stats.clan.tag, (list) => {
          WarData.lastReportedAttack = attackData.order
  
          Storage.setItemSync(clanData[WarData.stats.clan.tag].warId, WarData)
  
          notify(`${attackMessage}\n\n${settings.hideList == true ? '' : list}`, WarData.stats.clan.tag);
  
        })

      } else if (settings.enemyUpdates) {

        var attackMessage = `${WarData.stats.opponent.name} attacked ${WarData.stats.clan.name}
        Attacker: ${attacker.mapPosition}. ${attacker.name}
        Defender: ${defender.mapPosition}. ${defender.name}
        destructionPercentage: ${attackData.destructionPercentage}%
        stars: `;
        for (let i = 0; i < attackData.stars; i++) {
          attackMessage += "🌟";
        }
  
        list(WarData.stats.clan.tag, (list) => {
          WarData.lastReportedAttack = attackData.order
  
          Storage.setItemSync(clanData[WarData.stats.clan.tag].warId, WarData)
  
          notify(`${attackMessage}\n\n${settings.hideList == true ? '' : list}`, WarData.stats.clan.tag);
  
        })

      }

    })
  })

}

global.parseCurrentWar = (war, cT) => {
  // Making sure we actually have war data to mess with lol
  
  if (war && war.reason != 'notFound' && war.reason != 'accessDenied' && war.state != 'notInWar') {
    // create a hash to use as the id
    let warId = crypto.createHash('sha1').update(war.clan.tag + war.opponent.tag + war.preparationStartTime).digest('hex');

    clanData[war.clan.tag].warId = warId
    clanData[war.clan.tag].name = war.clan.name;

    var WarData = Storage.getItem(warId, (err, WarData) => {
      if (err) throw err;

      if (!WarData) {
        WarData = { lastReportedAttack: 0, prepDayReported: false, clanCastleReported: false, battleDayReported: false, lastHourReported: false, finalMinutesReported: false, warEndedReported: false };

        var newArrays = new Array(war.teamSize + 1).fill("empty")
        newArrays[0] = "dont use me"

        Storage.setItemSync(`${warId}warCalls`, newArrays);
  
        Storage.setItemSync(`${warId}warAttacks`, newArrays);
  
      } else if (clanData[war.clan.tag].onStartup) {
        var warCalls = Storage.getItemSync(`${clanData[war.clan.tag].warId}warCalls`)
 
        clanData[war.clan.tag].userData = {};
        
        warCalls.forEach((call, index, calls) => {
          if (call !== "hide" && call !== "empty" && call !== "dont use me") {
            var callInfo = call.split("//");
  
            if (clanData[war.clan.tag].userData[call[1]]) {
              clanData[war.clan.tag].userData[call[1]].calls++
            } else {
              clanData[war.clan.tag].userData[call[1]] = { calls:0 }
            }
          }
        });
  
      }
  
      let tmpAttacks = {}
      clanData[war.clan.tag].Players = {}
      war.clan.members.forEach(member => {
        clanData[war.clan.tag].Players[member.tag] = member
        if (member.attacks) {
          member.attacks.forEach(attack => {
            tmpAttacks[attack.order] = Object.assign(attack, {who: 'clan'})
          })
        }
      })
      war.opponent.members.forEach(member => {
        clanData[war.clan.tag].Players[member.tag] = member
        if (member.attacks) {
          member.attacks.forEach(attack => {
            tmpAttacks[attack.order] = Object.assign(attack, {who: 'opponent'})
          })
        }
      })
  
      WarData.stats = {
        state: war.state,
        endTime: war.endTime,
        startTime: war.startTime,
        hitrate: {
          TH9v9: {
            clan: {
              attempt: 0,
              success: 0
            },
            opponent: {
              attempt: 0,
              success: 0
            }
          },
          TH10v10: {
            clan: {
              attempt: 0,
              success: 0
            },
            opponent: {
              attempt: 0,
              success: 0
            }
          },
          TH10v11: {
            clan: {
              attempt: 0,
              success: 0
            },
            opponent: {
              attempt: 0,
              success: 0
            }
          },
          TH11v11: {
            clan: {
              attempt: 0,
              success: 0
            },
            opponent: {
              attempt: 0,
              success: 0
            }
          }
        },
        clan: {
          tag: war.clan.tag,
          name: war.clan.name,
          stars: war.clan.stars,
          threeStars: 0,
          attacks: war.clan.attacks,
          destructionPercentage: war.clan.destructionPercentage,
          memberCount: war.clan.members.length
        },
        opponent: {
          tag: war.opponent.tag,
          name: war.opponent.name,
          stars: war.opponent.stars,
          threeStars: 0,
          attacks: war.opponent.attacks,
          destructionPercentage: war.opponent.destructionPercentage,
          memberCount: war.opponent.members.length
        }
      }
  
      let attacks = []
      let earnedStars = {}
      let attacked = {}
      Object.keys(tmpAttacks).forEach(k => {
        let attack = tmpAttacks[k]
        let clanPlayer
        let opponentPlayer
        if (attack.who === 'clan') {
          clanPlayer = clanData[war.clan.tag].Players[attack.attackerTag]
          opponentPlayer = clanData[war.clan.tag].Players[attack.defenderTag]
        } else if (attack.who === 'opponent') {
          opponentPlayer = clanData[war.clan.tag].Players[attack.attackerTag]
          clanPlayer = clanData[war.clan.tag].Players[attack.defenderTag]
        }
        if (attack.stars === 3) {
          if (attack.who === 'clan') {
            WarData.stats.clan.threeStars++
          } else if (attack.who === 'opponent') {
            WarData.stats.opponent.threeStars++
          }
        }
        if (clanPlayer.townhallLevel === 9 && opponentPlayer.townhallLevel === 9) {
          if (attack.who === 'clan') {
            WarData.stats.hitrate.TH9v9.clan.attempt++
          } else if (attack.who === 'opponent') {
            WarData.stats.hitrate.TH9v9.opponent.attempt++
          }
          if (attack.stars === 3) {
            if (attack.who === 'clan') {
              WarData.stats.hitrate.TH9v9.clan.success++
            } else if (attack.who === 'opponent') {
              WarData.stats.hitrate.TH9v9.opponent.success++
            }
          }
        } else if (clanPlayer.townhallLevel === 10) {
          if (opponentPlayer.townhallLevel === 10) {
            if (attack.who === 'clan') {
              WarData.stats.hitrate.TH10v10.clan.attempt++
            } else if (attack.who === 'opponent') {
              WarData.stats.hitrate.TH10v10.opponent.attempt++
            }
            if (attack.stars === 3) {
              if (attack.who === 'clan') {
                WarData.stats.hitrate.TH10v10.clan.success++
              } else if (attack.who === 'opponent') {
                WarData.stats.hitrate.TH10v10.opponent.success++
              }
            }
          } else if (opponentPlayer.townhallLevel === 11) {
            if (attack.who === 'clan') {
              WarData.stats.hitrate.TH10v11.clan.attempt++
            } else if (attack.who === 'opponent') {
              WarData.stats.hitrate.TH10v11.opponent.attempt++
            }
            if (attack.stars === 3) {
              if (attack.who === 'clan') {
                WarData.stats.hitrate.TH10v11.clan.success++
              } else if (attack.who === 'opponent') {
                WarData.stats.hitrate.TH10v11.opponent.success++
              }
            }
          }
        } else if (clanPlayer.townhallLevel === 11 && opponentPlayer.townhallLevel === 11) {
          if (attack.who === 'clan') {
            WarData.stats.hitrate.TH11v11.clan.attempt++
          } else if (attack.who === 'opponent') {
            WarData.stats.hitrate.TH11v11.opponent.attempt++
          }
          if (attack.stars === 3) {
            if (attack.who === 'clan') {
              WarData.stats.hitrate.TH11v11.clan.success++
            } else if (attack.who === 'opponent') {
              WarData.stats.hitrate.TH11v11.opponent.success++
            }
          }
        }
  
        let newStars = 0
        let fresh = false
        if (!attacked[attack.defenderTag]) {
          fresh = true
          attacked[attack.defenderTag] = true
        }
        if (earnedStars[attack.defenderTag]) {
          newStars = attack.stars - earnedStars[attack.defenderTag]
          if (newStars < 0) newStars = 0
          if (earnedStars[attack.defenderTag] < attack.stars) earnedStars[attack.defenderTag] = attack.stars
        } else {
          earnedStars[attack.defenderTag] = attack.stars
          newStars = attack.stars
        }
        attacks.push(Object.assign(attack, {newStars: newStars, fresh: fresh}))
      })
  
      let startTime = new Date(fixISO(war.startTime))
      let endTime = new Date(fixISO(war.endTime))
      let prepTime = startTime - new Date()
      let remainingTime = endTime - new Date()
      if (war.state == 'preparation') {
        if (!WarData.prepDayReported) {
  
          let prepDay = config.messages.prepDay
          prepDay.body = prepDay.body.replace('%date%', startTime.toDateString()).replace('%time%', startTime.toTimeString())
          WarData.prepDayReported = true
          reportMessage(WarData, prepDay)
  
        } else if (!WarData.clanCastleReported && prepTime < 120 * 60 * 1000) {
          let clanCastleReminder = config.messages.clanCastleReminder;
          WarData.clanCastleReported = true
          reportMessage(WarData, clanCastleReminder);
        }
      }
      if (!WarData.battleDayReported && startTime < new Date()) {
  
        let battleDay = config.messages.battleDay
        WarData.battleDayReported = true
        reportMessage(WarData, battleDay)
  
      }
      if (!WarData.lastHourReported && remainingTime < 60 * 60 * 1000) {
  
        let lastHour = config.messages.lastHour
        WarData.lastHourReported = true
        reportMessage(WarData, lastHour)
  
      }
      if (!WarData.finalMinutesReported && remainingTime < config.finalMinutes * 60 * 1000) {
  
        let finalMinutes = config.messages.finalMinutes
        WarData.finalMinutesReported = true
        reportMessage(WarData, finalMinutes)
  
      }
      if (!WarData.warEndedReported && war.state == "warEnded") {
        WarData.warEndedReported = true
  
        var WinMessage;
  
        var ClanStars = WarData.stats.clan.stars,
            OpponentStars = WarData.stats.opponent.stars;
  
        if (ClanStars < OpponentStars) {
          WinMessage = "We Lost D:"
        } else if (ClanStars > OpponentStars) {
          WinMessage = "We Won :D"
        } else if (ClanStars == OpponentStars) {
          WinMessage = "it was a draw @.@"
        }
  
        reportMessage(WarData, {
          title: `War Ended!`,
          body: `${WarData.stats.clan.name} vs ${WarData.stats.opponent.name}\n\n${WinMessage}\nStars: ${WarData.stats.clan.stars} vs ${WarData.stats.opponent.stars}`
        })
      }
      let reportFrom = WarData.lastReportedAttack
  
      attacks.slice(reportFrom).forEach(attack => {
  
        attackMessage(WarData, attack);
  
      })
      Storage.setItemSync(warId, WarData);

    });
  } else if (war && war.reason == 'notInWar') {

    console.log(clan.tag.toUpperCase().replace(/O/g, '0') + ' Clan is currently not in war.')
    console.log(war)

  } else if (war && war.reason == 'accessDenied') {

    clearInterval(clanData[cT].updateInterval);
    clanData[cT].updateInterval = "accessDenied";
    notify("War Log is set to private", cT);

  } else if (war && war.reason == 'notFound') {
    delete clanData[cT];
    notify("This clanTag is not attached to any clan, check if its correct?", cT);

    groups.forEach((group, index) => {
      group = group.split("//");
      if (group[1] == cT) {
        groups.splice(index, 1);
      } 
    })
    ClanStorage.setItemSync("groups", groups);

  }
}