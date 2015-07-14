var bot = require("../../terandr");
var fs = require("fs");
var settings = require("./settings");
if (fs.existsSync("settings_dev.js")) {
	settings = require("./settings_dev");
}
var moderationChannels = settings.moderationChannels;
var mainChannel = settings.mainChannel;
var SPAM_THRESHOLD = settings.SPAM_THRESHOLD;
var botTracker = settings.botTracker;
var SPAM_FREQUENCY = settings.SPAM_FREQUENCY;

module.exports = {
  functions: {
    parseText: function(sender, channel, text) {
      if (sender.nick !== botTracker) {
        return false;
      }
      var textSplit = text.indexOf(":");
			if (textSplit == -1) {
				return false;
			}
      var player = text.substr(0, textSplit);
      var message = text.substr(textSplit + 2);
      var numMessages = playerMessagesList.length;
      for (i = 0; i < numMessages; i++) {
        if ((playerMessagesList[i].player == player) && playerMessagesList[i].chat == message) {
          playerMessagesList[i].count++;
          if (playerMessagesList[i].count >= SPAM_THRESHOLD) {
            //Alert: Player Spamming
						//bot.bot.sendLine({"command": "PRIVMSG", "args": [mainChannel], tail: "AdminAlert: " + player + " is spamming \"" + message + "\" on " + channel + ". Count: " + playerMessagesList[i].count});
            bot.bot.message(mainChannel, "AdminAlert: " + player + " is spamming \"" + message + "\" on " + channel + ". Count: " + playerMessagesList[i].count);
						console.log("SPAM");
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
      reduceCount();
    },
  },
  onStart: function() {
    enterChannels();
    reduceCount();
  },
  onMessage: [
    "parseText"
  ],
  commands: [
    {
      viewspam: function(parameters, sender) {
        viewSpamList(parameters, sender);
      }
    }
  ]
};

function viewSpamList(parameters, sender) {
  for (i = 0; i < playerMessagesList.length; i++) {
    if (playerMessagesList[i].count >= SPAM_THRESHOLD || parameters == "all") {
      //bot.bot.message(sender, player + " has said \"" + message + "\" on " + channel + ". Count: " + playerMessagesList[i].count);
      console.log(playerMessagesList[i].player + " has said \"" + playerMessagesList[i].chat + "\" on " + playerMessagesList[i].channel + ". Count: " + playerMessagesList[i].count);
      bot.bot.notice(sender, playerMessagesList[i].player + " has said \"" + playerMessagesList[i].chat + "\" on " + playerMessagesList[i].channel + ". Count: " + playerMessagesList[i].count);
      continue;
    }
  }
}

function reduceCount() {
  if (playerMessagesList.length === 0) {
    return false;
  }
  for (i = 0; i < playerMessagesList.length; i++) {
    playerMessagesList[i].count--;
    if (playerMessagesList[i].count <= 0) {
      playerMessagesList.splice(i, 1);
    }
  }
  setTimeout(reduceCount, SPAM_FREQUENCY * 1000);
}

var playerMessagesList = [];

function enterChannels() {
  for (i = 0; i < moderationChannels.length; i++) {
    bot.bot.join(moderationChannels[i]);
  }
}
