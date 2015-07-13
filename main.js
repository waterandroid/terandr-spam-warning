var bot = require("../../terandr");
var fs = require("fs");
var settings = require("./settings");
if (fs.existsSync("settings_dev.js")) {
	settings = require("./settings_dev");
}
var moderationChannels = settings.moderationChannels;
var mainChannel = settings.mainChannel;

module.exports = {
  functions: {
    parseText: function(sender, channel, text) {
      var textSplit = text.indexOf(":");
      var player = text.substr(0, textSplit);
      var message = text.substr(textSplit + 2);
      var numMessages = playerMessagesList.length;
      for (i = 0; i < numMessages; i++) {
        if ((playerMessagesList[i].player == player) && playerMessagesList[i].chat == message) {
          playerMessagesList[i].count++;
          if (playerMessagesList[i].count >= 4) {
            //Alert: Player Spamming
            bot.bot.message(mainChannel, "AdminAlert: " + player + " is spamming \"" + message + "\" on " + channel + ". Count: " + playerMessagesList[i].count);
          }
          return true;
        }
      }
      playerMessagesList.push({player:player, chat: message, channel: channel, count: 1});
      return true;
    },
    enterChannels: function() {
      for (i = 0; i < moderationChannels.length; i++) {
        bot.bot.join(moderationChannels[i]);
      }
    },
    reduceCount: function() {
      if (playerMessagesList.length === 0) {
        return false;
      }
      for (i = 0; i < playerMessagesList.length; i++) {
        if (playerMessagesList <= 1) {
          playerMessagesList.splice(i, 1);
        }
        playerMessagesList[i].count--;
      }
    },
  },
  onStart: [
    "enterChannels",
    "reduceCount"
  ],
  onMessage: [
    "parseText"
  ],
  commands: [
    {
      viewspam: function(parameters) {
        viewSpamList(parameters);
      }
    }
  ]
};

function viewSpamList(parameters) {

}

var playerMessagesList = [
  {
    player: "test",
    chat: "Hi! I like spam!",
    channel: "#foo",
    count: 1
  },
  {
    player: "test2",
    chat: "Hello! I love spam more!",
    channel: "#bar",
    count: 4
  },
];
