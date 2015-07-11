var bot = require("../../terandr");

module.exports = {
  functions: {
    parseText: function(sender, channel, text) {
      var textSplit = text.indexOf(":");
      var steamUser = text.substr(0, textSplit);
      var message = text.substr(textSplit + 2);
      var numMessages = playerMessagesList.length;
      for (i = 0; i < numMessages; i++) {
        if ((playerMessagesList[i].player == steamUser) && playerMessagesList[i].chat == message) {
          playerMessagesList[i].count++;
          if (playerMessagesList[i].count >= 4) {
            //Alert: Player Spamming
            bot.bot.message(mainChannel, "AdminAlert: " + steamUser + " is spamming \"" + message + "\" on " + channel + ". Count: " + playerMessagesList[i].count);
          }
          return true;
        }
      }
      playerMessagesList.push({player:steamUser, chat: message, channel: channel, count: 1});
      return true;
    },
    enterChannels: function() {
      for (i = 0; i < moderationChannels.length; i++) {
        //bot.bot.message("#waterandroid", "HI");
        bot.bot.join(moderationChannels[i]);
      }
    }
  },
  onStart: [
    "enterChannels",
  ],
  onMessage: [
    "parseText"
  ]
};

var botTracker = "waterandroid"; //change this to Firepowered when working
var mainChannel = "#waterandroid";
var playerMessagesList = [
  {
    player: "test",
    chat: "Hi! I like binds!",
    channel: "#FP-ABHT",
    count: 1
  },
  {
    player: "test2",
    chat: "Hello! I love binds more!",
    channel: "FP-ABHT",
    count: 4
  },
];

function parseText(text) {
  var textSplit = text.indexOf(":");
  var steamUser = text.substr(1, textSplit - 1);
  var message = text.substr(textSplit + 1);
  var numMessages = playerMessagesList.length;
  for (i = 0; i < numMessages; i++) {
    if ((playerMessagesList[i].player == steamUser) && playerMessagesList[i].chat == message) {
      playerMessagesList[i].count++;
      if (playerMessagesList[i].count >= 4) {
        //Alert: Player Spamming
        bot.message(mainChannel, "AdminAlert: " + SteamUser + "is spamming \"" + message + "\" on " + channel);
      }
      return true;
    }
  }
  playerMessagesList.push({player:steamUser, chat: message, channel: channel, count: 1});
  return true;
}

var moderationChannels = [
  /*  "#FP-AB2F",
  "#FP-ABDB",
  "#FP-ABDK",
  "#FP-ABHT",
  "#FP-ABHV",
  "#FP-ABJP",
  "#FP-ABMGE",
  "#FP-ABPL",
  "#FP-ABSURF",
  "#FP-ABTR1",
  "#FP-ABUN1",
  "#FP-PHDB",
  "#FP-PHFT",
  "#FP-PHHV",
  "#FP-PHJP",
  "#FP-PHMGE",
  "#FP-PHPL",
  "#FP-PHTB",*/
  "#waterandroid2"
];
