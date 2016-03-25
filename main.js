/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/hack-chat/hack-chat.d.ts" />


process.title = 'RhoBot';

if (process.argv[2] != undefined) {
var cmdarg = process.argv[2];
}
if (process.argv[3] != undefined) {
var cmdline = process.argv[3];
}

if (cmdarg == "-h" || cmdarg == "--help" || cmdarg == "-help" || cmdarg == "?" || cmdarg == "-?") {
	console.log("\nUsage:  nodejs filename.js [-r channel]\n");
	process.exit(1);
} else if (cmdarg == "-r") {
	if (cmdline != undefined) {
	var room = cmdline;
} else {
	console.log("\nUsage:  nodejs filename.js [-r channel]\n");
	process.exit(1);
	}
} else if (cmdarg != undefined) {
	console.log("\nUsage:  nodejs filename.js [-r channel]\n");
	process.exit(1);
} else {
	var room = "lounge";
}



var userName = "RhoBot";
var tripCode = "samplepassword";
var datafile = "data.txt";

var HackChat = require("hack-chat");
var d, bl, g = 0;
var hour, mins, secs = 0;
var marking = 0;
var fs = require("fs");
var sys = require("sys");
var path = require("path");
var control = true;
var toOutput = "";
var trips = [];
var facts = [];
var babby = [];
var afk = [];
var afkd = -1;
var checkBabby = 0;
var questionRegex = /(?:tell\s+me|what\s*.?\s*s)\s+Truth\s+(?:#|number|no|n)?\s*(\d+)/i;

var chat = new HackChat.Session(room, (userName + "#" + tripCode));


var blessed = require('blessed');

/**
* Screen Layout
*/

var screen = blessed.screen({
dockBorders: 'true'
});


var chatIn = blessed.textarea({

bottom: '0',
left: 'center',
width: '100%',
height: '20%',
label: userName,
border: {
type: 'line'
},
style: {
fg: 'green',
bg: 'black',
border: {
fg: '#ffffff'
}
}

});

var consoleBox = blessed.textarea({

bottom: '0',
left: 'center',
hidden: 'true',
width: '100%',
height: '20%',
label: "Console",
border: {
type: 'bg',
ch: '#'
},
style: {
fg: 'green',
bg: 'black',
border: {
fg: '#ffffff'
}
}

});


var chatBox = blessed.log({
top: '0',
left: '0',
width: '80%',
height: '82%',
content: 'Bot for hack.chat, made by {bold}Rhondonize{/bold}! Uses the {bold}blessed{/bold} library.\n\nPress {bold}ENTER{/bold} to type, press {bold}ESC{/bold} to quit typing\nPress {bold}ESC{/bold} again to send the message. Press {bold}Q{/bold} to quit.\nTo show and hide the side pane, use {bold}SPACE{/bold}. Scroll with arrow keys.\n\n\n',
tags: true,
label: 'hack.chat/?' + room,
alwaysScroll: 'true',
scrollable: 'true',
scrollbar: {
bg: 'green',
fg: 'green'
},
border: {
type: 'line'
},
style: {
fg: 'white',
bg: 'black',
border: {
fg: '#ffffff'
}
}
});

var onlineBox = blessed.list({
top: '0',
right: '0',
width: '20%',
height: '82%',
content: '',
tags: true,
label: 'Online Users',
/*
alwaysScroll: 'true',
scrollable: 'true',
scrollbar: {
bg: 'green',
fg: 'green'
},
*/
border: {
type: 'line'
},
selected: {
bg: 'red'
},
item: {
bg: 'red'
},
style: {
fg: 'white',
bg: 'black',
border: {
fg: '#ffffff'
}
}
});

screen.append(onlineBox);
screen.append(chatBox);
screen.append(consoleBox);
screen.append(chatIn);
chatIn.focus();

function rand(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

function start() {

setInterval(function() {
screen.render();
}, 200);

}

/**
* Main
*/

function irlTime() {
hour = new Date().getHours();
mins = new Date().getMinutes();
secs = new Date().getSeconds();

if (hour < 10) {
hour = "0" + hour;
}
if (mins < 10) {
mins = "0" + mins;
}
if (secs < 10) {
secs = "0" + secs;
}
return ("[" + hour + ":" + mins + ":" + secs + "] ");
}

var ChatListen = function() {};

function main() {
screen.on('keypress', function(ch, key) {
if (key.name === 'q' || key.name === 'C-c' || key.name === 'S-c') {
return process.exit(0);
}
if (key.name === 'space') {
onlineBox.toggle();
if (onlineBox.hidden) {
	chatBox.width = '100%';
	return 0;
} else {
	chatBox.width = '80%';
	return 1;
}

}
if (key.name === 'c') {
consoleBox.toggle();
chatIn.toggle();
return 0;
}
if (key.name === 'up') {
return chatBox.scroll(-1);
}
if (key.name === 'down') {
return chatBox.scroll(1);
}
if (key.name === 'enter') {
if (chatIn.hidden === false) {
	return chatIn.readInput();
} else {
	return consoleBox.readInput();
}
}
if (key.name === 'escape') {
if (chatIn.hidden === false) {
	if (chatIn.value !== "") {
		chat.sendMessage(chatIn.value);
		return chatIn.clearValue();
	}
} else {
	if (consoleBox.value !== "") {
		var cmd = consoleBox.value;
		if (cmd === 'leave') {
			chat.leave();
			chatBox.pushLine(irlTime() + userName + " {bold}(you){/bold} left.");
			onlineBox.clearItems();

		}
		if (cmd.substring(0, 4) === 'join' && cmd.substring(5, cmd.length) != undefined && cmd.substring(5, cmd.length) != "") {
			room = cmd.substring(5, cmd.length);
			chat = new HackChat.Session(room, (userName + "#" + tripCode));
			chatBox.pushLine(irlTime() + userName + " {bold}(you){/bold} joined channel ?" + room + ".");
			ChatListen();
		}
		if (cmd === 'control') {
			if (control) {
				control = false;
				chatBox.pushLine(irlTime() + "Bot control {bold}off{/bold}.");
			} else {
				control = true;
				chatBox.pushLine(irlTime() + "Bot control {bold}on{/bold}.");
			}
		}
		return consoleBox.clearValue();
	}
}


}

});


return start();

}

main();

fs.readFile(path.join(__dirname, datafile), "utf8", function(err, data) {
var p, i, line;
if (err) {
throw err;
}
var lines = data.split("\n");


for (i = 0; i < lines.length; i++) {
line = lines[i].trim();
	if (line[0] === '#') {
		continue;
	}
	if (line.length === 0) {
		continue;
	}
facts.push(line);

}
if (facts.length === 0) {
	chatBox.content = chatBox.content + "\n" + "No truths found.";
	return;
}


var lastMessage = new Date().getTime();
var lastQuote = new Date().getTime();



function include(arr, obj, markIt) {
	for (i = 0; i < arr.length; i++) {
		if (markIt) {
			marking = i;
		}
		if (arr[i] == obj) {
			return true;
		}
	}
}



function saveSend(message, latexify) {
lastMessage = new Date().getTime();
if (latexify != 0) {
message = message.replace(/~/g, "\\ ");
message = message.replace(/\^/g, "\\ ");
message = message.replace(/\\/g, "\\ ");
message = message.replace(/ /g, "\\ ");
message = message.replace(/_/g, "\\ ");
message = message.replace(/\?/g, "? ");
message = message.replace(/{/g, "");
message = message.replace(/}/g, "");
if (latexify === 1) {
	message = message.replace(/\\\\/g, "\\");
	message = message.replace(/\$/g, "\\$");
	message = message.replace(/\>/g, "\\>");
	message = message.replace(/\</g, "\\<");
	message = message.replace(/#/g, "\\#");
	message = message.replace(/%/g, "\\%");
	message = message.replace(/&/g, "\\&");
} else {
	message = message.replace(/\|/g, "\\ ");
	message = message.replace(/\$/g, "\\ ");
	message = message.replace(/\>/g, "\\ ");
	message = message.replace(/\</g, "\\ ");
	message = message.replace(/#/g, "\\ ");
	message = message.replace(/%/g, "\\ ");
	message = message.replace(/&/g, "\\ ");
	message = message.replace(/\\/g, "\\ ");
}
}

if (latexify === 1) {

message = "$" + message + " $";

d = 0;
for (i = 0; i < message.length; i++) {
	d++;
	if (d > 80 && message.substring(i, i + 1) === " ") {
		message = message.substring(0, i) + " $ \n $ ~ " + message.substring(i + 1, message.length)
		d = 0;
	}
}
} else if (latexify === 2) {
message = "$\\text\{" + message + "\}$";
} else if (latexify === 3) {
message = "$\\tiny\{\\text\{" + message + "\}\}$";
} else if (latexify === 4) {
message = "$\\small\{\\text\{" + message + "\}\}$";
} else if (latexify === 5) {
message = "$\\large\{\\text\{" + message + "\}\}$";
} else if (latexify === 6) {
message = "$\\huge\{\\text\{" + message + "\}\}$";
}
chat.sendMessage(message);
}

function saveInvite(nickname) {
chat.invite(nickname);
}

function centerText(line, width) {
var output = "";
for (var i = 0; i < (width - line.length) / 2 - 1; i++) {
output = output + ' ';
}
output = output + line;
for (var i = 0; i < ((width - line.length) / 2 + 1); i++) {
output = output + ' ';
}
if (line.length % 2 == 1) {
output = output.substring(0, output.length - 1);
}
return output;
}

//** CHAT LISTENERS  **//

ChatListen = function() {

chat.on("ratelimit", function(time) {
chatBox.pushLine("####################\n!!! RATE LIMITED !!!\n####################");
});

chat.on("invited", function(nick, channel, time) {
chatBox.pushLine("### Sent invitation to channel: ?" + channel + " for " + nick + " ###");
});

chat.on("invitation", function(nick, channel, time) {
chatBox.pushLine("### Got invited to channel: ?" + channel + " by " + nick + " ###");
});

chat.on("warn", function(text) {
chatBox.pushLine("*WARN*: " + text);
});

chat.on("error", function(err) {
chatBox.pushLine("ERROR: " + err);
});

chat.on("banned", function(time) {
chatBox.pushLine("!!! {bold}BANNED{/bold}: You're are banned. !!!");
});

chat.on("info", function(text) {
chatBox.pushLine("*INFO*: " + text);
});

chat.on("nicknameInvalid", function(time) {
chatBox.pushLine("\n" + "\n\n!!! This nickname has invalid characters! (" + userName + ")");
process.exit()
});

chat.on("nicknameTaken", function(time) {
chatBox.pushLine("\n" + "\n\n!!! Someone has this bot's nickname and is in the channel! (" + userName + ") !!!\n\n");
process.exit()
});

chat.on("onlineSet", function(nicks) {
chatBox.pushLine("\n" + irlTime() + userName + " {bold}(you){/bold} joined.");
onlineBox.add("");
for (var p = 0; p < nicks.length; p++) {
	if (nicks[p] === "Rhondonize" || nicks[p] === "Rhondo" || nicks[p] === userName) {
		onlineBox.add("{bold}" + nicks[p] + "{/bold}");
	} else {
		onlineBox.add(nicks[p]);
	}
}
});

chat.on("onlineAdd", function(nick) {
hour = new Date().getHours();
mins = new Date().getMinutes();
secs = new Date().getSeconds();

if (hour < 10)
	hour = "0" + hour;
if (mins < 10)
	mins = "0" + mins;
if (secs < 10)
	secs = "0" + secs;

chatBox.pushLine(irlTime() + nick + " joined.");
//Highlight certain usernames
if (nick === "Rhondonize" || nick === "Rhondo" || nick === userName || trip === "OHNyey") {
	onlineBox.add("{bold}" + nick + "{/bold}");
} else {
	onlineBox.add(nick);
}
});

chat.on("onlineRemove", function(nick) {
hour = new Date().getHours();
mins = new Date().getMinutes();
secs = new Date().getSeconds();

if (hour < 10)
	hour = "0" + hour;
if (mins < 10)
	mins = "0" + mins;
if (secs < 10)
	secs = "0" + secs;

chatBox.pushLine(irlTime() + nick + " left.");


for (var ite = 0; ite < onlineBox.items.length; ite++) {

	var checkingNick = escape(onlineBox.items[ite].getLines());
	if (checkingNick == nick || checkingNick == "%1B%5B1m" + nick + "%1B%5B22m") {
		onlineBox.removeItem(ite);
	}

}


});


/*//////   STARTS HERE   //////*/

chat.on("chat", function(nick, text, time, isAdmin, trip) {


if (trip === "undefined") {

	chatBox.pushLine(irlTime() + "       # " + nick + ": " + text);

} else {

	chatBox.pushLine(irlTime() + trip + " # " + nick + ": " + text);

}


toOutput = "";
// Checks if the last message was sent in less than 4 seconds and if the message
// Wasn't by the bot itself, as well as if controls are turned off
if (lastMessage - new Date().getTime() < -4000 && nick != userName && control) {






	for (g = 0; g < afk.length; g++) {
		if (afk[g] === nick) {
			afkd = g;
		}
	}

	if (afkd === -1) {
		if (text.indexOf("/afk") > -1) {
			afk.push(nick);
			afkd = -1;
			return saveSend("~ @" + nick + " is AWAY.", 0);
		}
	}

	if (afkd > -1) {
		afk.splice(afkd, 1);
		afkd = -1;
		return saveSend("~ @" + nick + " is BACK.", 0);
	}

	afkd = -1;




	if (text.substring(0, 6) == "~bear ") {
		//Specify access only to certain users
		if (trip == "9uiLLf" || trip == "OHNyey") {
			var Y = '• ';

			var bearSay = [
			    "",
			    "",
			    "",
			    "",
			    ""
			];
			bearSay[-1] = text.substring(6, text.length);
  		bearSay[-1] = bearSay[-1].replace(/(\r\n|\n|\r)/gm, " ");
			if (bearSay[-1].length < 210) {

				if (bearSay[-1].length < 55) {
					bearSay[2] = bearSay[-1];
				} else if (bearSay[-1].length < 88) {
					for (var w1 = bearSay[-1].substring(0, text.length / 2 - 2).length; w1 > 0; w1--) {
						if (bearSay[-1].substring(w1, w1 - 1) == " ") {
							w1;
							break;
						}
					}
					bearSay[1] = bearSay[-1].substring(0, w1);
					bearSay[3] = bearSay[-1].substring(w1, text.length);
				} else if (bearSay[-1].length < 130) {
					for (var w1 = bearSay[-1].substring(0, text.length * 0.33 - 1).length; w1 > 0; w1--) {
						if (bearSay[-1].substring(w1, w1 - 1) == " ") {
							break;
						}
					}
					for (var w2 = bearSay[-1].substring(0, text.length * 0.66 - 1).length; w2 > 0; w2--) {
						if (bearSay[-1].substring(w2, w2 - 1) == " ") {
							break;
						}
					}
					bearSay[1] = bearSay[-1].substring(0, w1);
					bearSay[2] = bearSay[-1].substring(w1, w2);
					bearSay[3] = bearSay[-1].substring(w2, text.length);
				} else if (bearSay[-1].length < 170) {


					for (var w1 = bearSay[-1].substring(0, text.length * 0.25 - 1).length; w1 > 0; w1--) {
						if (bearSay[-1].substring(w1, w1 - 1) == " ") {
							break;
						}
					}
					for (var w2 = bearSay[-1].substring(0, text.length * 0.5 - 1).length; w2 > 0; w2--) {
						if (bearSay[-1].substring(w2, w2 - 1) == " ") {
							break;
						}
					}
					for (var w3 = bearSay[-1].substring(0, text.length * 0.75 - 1).length; w3 > 0; w3--) {
						if (bearSay[-1].substring(w3, w3 - 1) == " ") {
							break;
						}
					}

					bearSay[0] = bearSay[-1].substring(0, w1);
					bearSay[1] = bearSay[-1].substring(w1, w2);
					bearSay[2] = bearSay[-1].substring(w2, w3);
					bearSay[3] = bearSay[-1].substring(w3, text.length);
				} else if (bearSay[-1].length < 210) {

					for (var w1 = bearSay[-1].substring(0, text.length * 0.2 - 1).length; w1 > 0; w1--) {
						if (bearSay[-1].substring(w1, w1 - 1) == " ") {
							break;
						}
					}
					for (var w2 = bearSay[-1].substring(0, text.length * 0.4 - 1).length; w2 > 0; w2--) {
						if (bearSay[-1].substring(w2, w2 - 1) == " ") {
							break;
						}
					}
					for (var w3 = bearSay[-1].substring(0, text.length * 0.6 - 1).length; w3 > 0; w3--) {
						if (bearSay[-1].substring(w3, w3 - 1) == " ") {
							break;
						}
					}
					for (var w4 = bearSay[-1].substring(0, text.length * 0.8 - 1).length; w4 > 0; w4--) {
						if (bearSay[-1].substring(w4, w4 - 1) == " ") {
							break;
						}
					}

					bearSay[0] = bearSay[-1].substring(0, w1);
					bearSay[1] = bearSay[-1].substring(w1, w2);
					bearSay[2] = bearSay[-1].substring(w2, w3);
					bearSay[3] = bearSay[-1].substring(w3, w4);
					bearSay[3] = bearSay[-1].substring(w4, text.length);
				}


        saveSend(
            "    " + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y +"\n"
          + "   " + Y + centerText(bearSay[0],60) + Y +"\n"
          + "  " + Y + centerText(bearSay[1],62) + Y +"\n"
          + " " + Y + centerText(bearSay[2],64) + Y +"\n"
          + "  " + Y + centerText(bearSay[3],62) + Y +"\n"
          + "   " + Y + centerText(bearSay[4],60) + Y +"\n"
          + "    " + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y + Y +"\n"
          +"     \\\n"
          +"      \\         __\n"
          +"     __/~~\\-''-`_ |\n"
          +"__- - {            \\\n"
          +"     /             \\\n"
          +"    /       ;o    o }\n"
          +"    |              ;\n"
          +"                   '\n"
          +"       \\_       (..)\n"
          +"         ''-_ _ _ /\n"
          +"           /\n"
          +"          /\n",0);


			} else {
				saveSend("That exceeds the length of the max quote size.", 0);
			}
		} else {
			saveSend("I'm not letting you do that.", 2);
		}
	}


	if (text == "~invite") {
		//Exclude access to certain users
		if (trip === "OHNyey") {
			return saveSend("Specify invite recipient, syntax:\n  ~invite (user)", 0);
		} else {
			return saveSend("I'm not letting you do that.", 2);
		}
	} else if (text.substring(0, 8) == "~invite ") {
		//Exclude access to certain users
		if (trip === "OHNyey") {
			if (text.substring(8, text.length).trim() == "") {
				return saveSend("Specify invite recipient, syntax: \n  ~invite (user)", 0);
			} else {
				saveInvite(text.substring(8, text.length).trim());
				return saveSend("I sent an invite to user " + text.substring(8, text.length).trim() + ", if they exist.", 0);
			}
		} else {
			return saveSend("I'm not letting you do that.", 0);
		}
	}


	if (text == "~help" || text == "~h")
		return saveSend("You can ask for a piece of truth (e.g. whats truth 1 )\n\n Other commands are: \n ~bear [phrase] # /afk # ~invite [user] # ~clear # ~repeat", 0);

	if (text.substring(0, 8) == "~repeat ") {
		//Exclude access to certain users
		if (trip === "OHNyey") {
			return saveSend(text.substring(8, text.length), 0);
		} else {
			return saveSend(text.substring(8, text.length), 0);
		}
	}

	if (text.substring(0, 7) == "~clear") {
		//Exclude access to certain users
		if (trip === "OHNyey") {
			return saveSend("~\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \nRhoBot: Chat cleared.", 0);
		} else {
			return saveSend("I'm not letting you do that.", 0);
		}
	}

	var result = questionRegex.exec(text);
	if (result && result.length == 2) {
		var n = parseInt(result[1]) - 1;
		if (n >= 0 && n < facts.length)
			saveSend("Truth #" + (n + 1) + ": " + facts[n], 0);
	}

} else if (control === false) {
	if (text.substring(0, 1) === "~") {
		saveSend("* I'm not taking any commands right now *", 0);
	}
} else if (nick === userName) {
	//This is the bot's own message, disregarding
} else {
	chatBox.pushLine("{bold}### Messages are being sent too fast, ignoring ###{/bold}");
}

});

chat.on("joining", function() {

//Message to be sent on joinging a room, one after a 3000 delay after the other
setTimeout(function() {
	//saveSend("I'M ON",0);
	setTimeout(function() {
		//saveSend("AND READY FOR ACTION.",0);
	}, 3000)
}, 3000)

setInterval(function() {
	chat.ping(); //KEEP ALIVE
}, 0.4 * 60 * 1000);
});
}
//Runs the function to listen for content from the websocket through hackchat's session
ChatListen();
});
