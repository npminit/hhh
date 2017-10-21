module.exports = {
  line: {
    channelAccessToken: "",
    channelSecret: "",
    port: "8080"
  },
  securityRoles: ['coLeader', 'leader'],
  joinMessage: `HELLO MORTALS I AM HERE TO HELP YOU!
  the default prefix is !.
  
  a few of my commands.
  1. claim #clantag , you can claim your clantag to recieve war updates!
  2. help , so you can see my other commands. (help command needs some styling o-o)`,
  defaultClanSettings: {
    prefix: '!',
    enemyUpdates: true,
    hideList: false,
    hideBases: true
  },
  updateInterval: 60 * 10, // 10 Minutes
  cocApiKey: "",
  finalMinutes: 15,
  messages: {
    prepDay: {
      title: 'War has been declared',
      body: 'The battle begins %date%\n@ %time%'
    },
    clanCastleReminder: {
      title: 'Battle day is going to start in 2 hours',
      body: 'Don\'t forget to fill Clan Castle Reinforcments'
    },
    battleDay: {
      title: 'Battle day has begun!',
      body: 'Good Luck with your Attacks!\nLet\'s win this'
    },
    lastHour: {
      title: 'The final hour is upon us!',
      body: 'If you haven\'t made both of your attacks you better get on it.'
    },
    finalMinutes: {
      title: 'The final minutes are here!',
      body: 'If you haven\'t made both of your attacks you better get on it.'
    }
  }
}
