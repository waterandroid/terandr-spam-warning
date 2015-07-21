var IRC = require("internet-relay-chat");
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
			if ((textSplit == -1) || (text.indexOf("has joined the game") !== -1) || (text.indexOf("has left the game") !== -1) || (text.indexOf("!add") !== -1) || (text.indexOf("!remove") !== -1)) {
				return false;
			}
      var player = text.substr(0, textSplit);
      var message = text.substr(textSplit + 2);
      var numMessages = playerMessagesList.length;
			player = fixPlayerName(player);
      for (i = 0; i < numMessages; i++) {
        if ((playerMessagesList[i].player == player) && playerMessagesList[i].chat == message) {
          playerMessagesList[i].count++;
          if (playerMessagesList[i].count >= SPAM_THRESHOLD && playerMessagesList[i].alerted === false) {
            //Alert: Player Spamming
						//bot.bot.sendLine({"command": "PRIVMSG", "args": [mainChannel], tail: "AdminAlert: " + player + " is spamming \"" + message + "\" on " + channel + ". Count: " + playerMessagesList[i].count});
            bot.bot.message(mainChannel, "AdminAlert: " + player + " is spamming \"" + message + "\" on " + channel + ". Count: " + playerMessagesList[i].count);
						playerMessagesList[i].alerted = true;
						console.log("SPAM");
          }
          return true;
        }
      }
      playerMessagesList.push({player:player, chat:message, channel:channel, count:1, alerted:false});
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
    if (playerMessagesList[i].count >= SPAM_THRESHOLD - 2) {
      console.log(playerMessagesList[i].player + " has said \"" + playerMessagesList[i].chat + "\" on " + playerMessagesList[i].channel + ". Count: " + playerMessagesList[i].count);
      bot.bot.notice(sender, playerMessagesList[i].player + " has said \"" + playerMessagesList[i].chat + "\" on " + playerMessagesList[i].channel + ". Count: " + playerMessagesList[i].count);
      continue;
    }
		if (parameters == "all" && playerMessagesList[i].count >= 2) {
			console.log(playerMessagesList[i].player + " has said \"" + playerMessagesList[i].chat + "\" on " + playerMessagesList[i].channel + ". Count: " + playerMessagesList[i].count);
			continue;
		}
  }
	console.log("-- END OF SPAM LIST --");
}

function reduceCount() {
  if (playerMessagesList.length === 0) {
		setTimeout(reduceCount, SPAM_FREQUENCY * 1000);
    return false;
  }
  for (i = 0; i < playerMessagesList.length; i++) {
    playerMessagesList[i].count--;
		playerMessagesList[i].alerted = false;
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

function fixPlayerName(name) {
	if (name.indexOf("*DEAD*") !== -1) {
		name = name.substr(name.indexOf(" ") + 1);
	}
	if (name.indexOf("*SPEC*") !== -1) {
		name = name.substr(name.indexOf(" ") + 1);
	}
	if (name.indexOf("(TEAM)") !== -1) {
		name = name.substr(name.indexOf(" ") + 1);
	}
	name = name.substr(3, name.length - 4);
	return name;
}
