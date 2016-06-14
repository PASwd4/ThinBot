/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/hack-chat/hack-chat.d.ts" />


process.title = 'RhoBot';

/*if (/^(-h|--help|-\?)$/.test(process.argv[2])) {
console.log('Just run it,\nnodejs main.js');
return process.exit(0);
}*/

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



var userName = "RondoDuo";
var tripCode = "secretstuffgoeshere";
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
var muted = [];
var regularsList = ["rhondo","notadmin","rondeau","tooty","toastystoemp","m4gnv5","asdf","minusgix","fapinterface","vvhitehead","cornbot","_0x17","bacon","rut","tbott","existentialistbear","coderrank","shrooms","overkill","nanotech","luckypants","valkyre"];
var trips = [];
var facts = [];
var babby = [];
var afk = [];
var afkd = -1;
var checkBabby = 0;
var questionRegex = /(?:tell\s+me|what\s*.?\s*s)\s+Truth\s+(?:#|number|no|n)?\s*(\d+)/i;


var Cleverbot = require('./cleverbot');
var CBot = new Cleverbot;
var autoResponder = false;


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
		if (cmd === 'auto') {
			if (autoResponder) {
				autoResponder = false;
				chatBox.pushLine(irlTime() + "AutoResponder {bold}off{/bold}.");
			} else {
				autoResponder = true;
				chatBox.pushLine(irlTime() + "AutoResponder {bold}on{/bold}.");
			}
		}
		return consoleBox.clearValue();
	}
}


}

});


return start();

}

/**
* Execute
*/

main();




fs.readFile(path.join(__dirname, datafile), "utf8", function(err, data) {
var p, i, babbymark, factmark, line;
if (err) {
throw err;
}
var lines = data.split("\n");

for (p = 0; p < lines.length; p++) {
if (lines[p] === "~") {
if (babbymark == null) {
	babbymark = p;
} else {
	factmark = p;
}
}
}

for (i = babbymark + 1; i < factmark; i++) {
//console.log(i + ": " + lines[i]);
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
//chatBox.content = chatBox.content + "\n" + "No truths found.";
return;
}

for (i = 0; i < babbymark; i++) {
//chatBox.pushLine(i + ": " + lines[i]);

var lineb = lines[i];
if (lineb[0] === '#') {
continue;
}
if (lineb.length === 0) {
continue;
}
babby.push(lineb);

}
if (babby.length === 0) {
chatBox.pushLine("\n" + "No babbies found.");
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
//if (true) {
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


function writeUpdates() {
for (var c = 0; c < babby.length; c++) {
toOutput = toOutput + babby[c] + "\n";
}
toOutput = toOutput + "~\n"

for (var c = 0; c < facts.length; c++) {
toOutput = toOutput + facts[c] + "\n";
}
toOutput = toOutput + "~\n"

fs.writeFile("data.txt", toOutput, function(err) {
if (err) {
	return console.log("### ERROR ###: \n" + err);
}

});
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
if (nick === "Rhondonize" || nick === "Rhondo" || nick === userName) {
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


if(text.toLowerCase() == "~control"){
	if (trip == "OHNyey") {
		if(control){
			control = false;
			return saveSend("Control off.",4);
		}else{
			control = true;
			return saveSend("Control on.",4);
		}
	}
}

//Cleverbot AutoResponder

if(text.toLowerCase() == "~auto"){
	if (trip == "OHNyey") {
		if(autoResponder){
			autoResponder = false;
			return saveSend("AutoResponder off.",4);
		}else{
			autoResponder = true;
			return saveSend("AutoResponder on.",4);
		}
	}
}

if(regularsList.indexOf(nick.toLowerCase()) == -1 && (text.indexOf("hack") != -1 || text.indexOf("facebook") != -1 || text.indexOf("instagram") != -1 || text.indexOf("snapchat") != -1 || text.indexOf("wifi pass") != -1 || text.indexOf("social media") != -1 || text.indexOf("kali") != -1 || text.indexOf("dos") != -1 || text.indexOf("loic") != -1 || text.indexOf("hoic") != -1 || text.indexOf("anon") != -1)){
var res = text.toLowerCase().replace(userName, "cleverbot")
var directMe = (text.indexOf("@"+userName) != -1);
if (nick != userName) {
	Cleverbot.prepare(function() {
		CBot.write(res, function(response) {
			var autoAnswer = response.message;
			var refine = autoAnswer.replace("Cleverbot", userName);
			refine = refine.replace("3600", "lol¡");
			if ((refine.indexOf("Clever") == -1) && (refine.indexOf("app") == -1))
				return saveSend(refine,0);
		});
	});
}
}


if(autoResponder){
var res = text.toLowerCase().replace(userName, "cleverbot")
var directMe = (text.indexOf("@"+userName) != -1);
var directOther = ((!directMe) && text.indexOf("@") != -1);
var talkChance = Math.floor(Math.random() * 10) <= (text.indexOf("?") == -1 ? 1 : 4);
if (!directOther && ( directMe || talkChance) && nick != userName) {
	Cleverbot.prepare(function() {
		CBot.write(res, function(response) {
			var autoAnswer = response.message;
			var refine = autoAnswer.replace("Cleverbot", userName);
			refine = refine.replace("3600", "lol¡");
			if ((refine.indexOf("Clever") == -1) && (refine.indexOf("app") == -1))
				return saveSend(refine,0);
		});
	});
}
}


if (muted.indexOf(nick) != -1 && nick != userName){

var toMute = "";

for (var muet = 0; muet < text.length; muet++){

	if (text.substring(muet,muet+1)===' '){
		toMute = toMute+" ";
	}else if (muet%2==0){


		toMute = toMute+"=̿̿̿̿̿̿̿̿";
	}else{

		toMute = toMute+" ̿̿̿̿̿̿̿̿";
	}
}


return saveSend(toMute,0);

}else if (lastMessage - new Date().getTime() < -5000 && nick != userName && control) {


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
		//Exclude access to certain users
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
				} else if (bearSay[-1].length < 120) {
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
				} else if (bearSay[-1].length < 160) {


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
				} else if (bearSay[-1].length < 197) {

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


        return saveSend(
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
				return saveSend("That exceeds the length of the max quote size.", 0);
			}
		} else {
			return saveSend("I'm not letting you do that.", 2);
		}
	}


	if (text.trim() == "~off" && trip == "OHNyey"){
		return saveSend("Closing.", 1);
		process.exit();

	}

	if (text.substring(0, 6).trim() == "~mute" && trip == "OHNyey"){
		if(text.substring(6,text.length).trim() != "Rhondonize" && text.substring(6,text.length).trim() != userName ){
			muted.push(text.substring(6,text.length).trim());
			return saveSend(text.substring(6,text.length).trim()+" has been muted.", 1);
		}
	}

	if (text.substring(0, 8).trim() == "~unmute" && trip == "OHNyey"){

		var indexOut = muted.indexOf(text.substring(8,text.length).trim());
		if( indexOut != -1){
			muted.splice(indexOut, 1);
			return saveSend(text.substring(8,text.length).trim()+" has been unmuted.", 1);

		}
	}

	text = text.toLowerCase();


	if (text == "~invite") {
		if (trip === "OHNyey") {
			return saveSend("Specify invite recipient, syntax:\n  ~invite (user)", 0);
		} else {
			return saveSend("I'm not letting you do that.", 2);
		}
	} else if (text.substring(0, 8) == "~invite ") {
		if (trip === "OHNyey") {
			if (text.substring(8, text.length).trim() == "") {
				return saveSend("Specify invite recipient, syntax: \n  ~invite (user)", 0);
			} else {
				saveInvite(text.substring(8, text.length).trim());
				return saveSend("I sent an invite to user " + text.substring(8, text.length).trim() + ".", 0);
			}
		} else {
			return saveSend("I'm not letting you do that.", 0);
		}
	}


	if (text.substring(0, 5) == "~baby") {

		if (include(babby, nick, true)) {

			if (babby[marking + 1].substring(0, 1) === "1") {
				return saveSend("Did you really forget? I'm pregnant with your baby, " + nick + "!", 0);
			} else {
				return saveSend("No, I'm not pregnant with a baby of yours, " + nick + ".", 0);
			}

		} else {
			return saveSend("Excuse me? I don't know you.", 0);
		}
	}

	if (text.substring(0, 7) == "~babies") {
		if (babby.length != 0) {

			for (bl = 0; bl < babby.length; bl += 3) {
				if (babby[bl + 1].substring(0, 1) === "1") {
					toOutput = toOutput + babby[bl] + ", ";
				}
			}
			if (toOutput === "") {
				return saveSend("I'm not pregnant... ARE YOU CALLING ME FAT OR SOMETHING!?", 0);
			} else {
				return saveSend("I'm pregnant with the babies of " + toOutput + "and your mom.", 0);
			}
		} else {
			return saveSend("I'm not pregnant... ARE YOU CALLING ME FAT OR SOMETHING!?", 0);
		}
	}

	if (text == "~help" || text == "~h")
		return saveSend("Yeah, you do need help. \nHow about this, to cheer you up, you can ask for a piece of truth (e.g. whats truth 1 ) Other commands are: \n  ~impregnate # ~abort # ~baby # ~babies # ~child # ~children # /afk # ~invite\n  ~clear", 0);

	if (text.substring(0, 8) == "~repeat ") {
		if (trip === "OHNyey") {
			return saveSend(text.substring(8, text.length), 0);
		} else {
			return saveSend(text.substring(8, text.length), 0);
		}
	}

	if (text.substring(0, 7) == "~clear") {
		if (trip === "OHNyey") {
			return saveSend("~\n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \nRhoBot: Chat cleared.", 0);
		} else {
			return saveSend("I'm not letting you do that.", 0);
		}
	}

	if (text === "~children") {
		if (babby.length != 0) {

			for (bl = 0; bl < babby.length; bl += 3) {
				if (babby[bl + 1].substring(1, 2) === "1") {
					toOutput = toOutput + babby[bl] + ", ";
				}
			}
			if (toOutput === "") {
				return saveSend("I don't have kids!", 0);
			} else {
				return saveSend("I have kids with " + toOutput + "and your mom.", 0);
			}
		} else {
			return saveSend("I don't have kids!", 0);
		}
	}

	if (text == "~child") {

		if (include(babby, nick, true)) {


			if (babby[marking + 1].substring(1, 2) === "1") {
				return saveSend("What!? Don't tell me you forgot about our child, " + nick + "!", 0);
			} else {
				return saveSend("We don't have any kids together.", 0);
			}

		} else {
			return saveSend("I don't believe we have a child together...", 0);
		}
	}

	if (text == "~impregnate") {
		if (include(babby, nick, true)) {
			if (babby[marking + 1].substring(0, 1) === "0") {

				//console.log(babby[marking]+"'s stat was " + babby[marking+1]);
				babby[marking + 1] = "1" + babby[marking + 1].substring(1, 3);
				//console.log(babby[marking]+"'s stat is now " + babby[marking+1]);

				//console.log(babby[marking]+"'s time was " + babby[marking+2]);
				babby[marking + 2] = new Date().getTime();
				//console.log(babby[marking]+"'s time is now " + babby[marking+2]);

				writeUpdates();

				return saveSend("\t\t\t\t\tI just got pregnant with " + nick + "'s baby!\n\t\t\t(Wait 9 days to unlock ~child commands or choose to ~abort)", 0);

			} else {
				return saveSend("I'm already pregnant with a baby of yours, " + nick + ".", 0);
			}
		} else {

			toOutput = nick + "\n" + "100" + "\n" + new Date().getTime() + "\n";

			//console.log(nick+" didn't have a stat.");
			babby.splice(0, 0, new Date().getTime());
			babby.splice(0, 0, "100");
			babby.splice(0, 0, nick);
			//console.log(babby[0]+"'s stat is now " + babby[1]);

			writeUpdates();

			return saveSend("\t\t\t\t\tI just got pregnant with " + nick + "'s baby!\n\t\t\t(Wait 9 days to unlock ~child commands or choose to ~abort)", 0);


		}
	}

	if (text == "~abort") {
		if (include(babby, nick, true)) {
			if (babby[marking + 1].substring(0, 1) === "1") {
				//console.log(babby[marking]+"'s stat was " + babby[marking+1]);
				babby[marking + 1] = "0" + babby[marking + 1].substring(1, 3);
				//console.log(babby[marking]+"'s stat is now " + babby[marking+1]);

				writeUpdates();

				return saveSend("" + nick + " just punched me in the stomach and our baby popped out too early!\n\t\t\t(You will no longer unlock access to ~child commands)", 0);

			} else {
				return saveSend("I'm not pregnant with a baby of yours, " + nick + ".", 0);
			}
		} else {
			return saveSend("I'm sorry, have we ever even mated, " + nick + "?", 0);
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
	//console.log("Own message.");
} else {
	chatBox.pushLine("{bold}### Messages are being requested too fast! ###{/bold}");
}

});

chat.on("joining", function() {

setTimeout(function() {
	//saveSend("I'M BACK.",0);
	setTimeout(function() {
		//saveSend("AND READY FOR ACTION.",0);
	}, 3000)
}, 3000)

setInterval(function() {
	chat.ping(); //KEEP ALIVE

	for (bl = 0; bl < babby.length; bl += 3) {

		if (babby[bl + 1].substring(0, 1) === "1") {
			if ((babby[bl + 2] - new Date().getTime()) < -10 * 60 * 1000) {
				saveSend("\t\t  AHHHH HOLY SHIT I'M GIVING BIRTH, AHHHHHH FUUUUCK\n \t\t\t(" + babby[bl] + " unlocked access to ~child commands!)", 0);
				//console.log(babby[bl] + "'s stat was " + babby[bl+1]);
				babby[bl + 1] = "01" + babby[bl + 1].substring(2, 3);
				//console.log(babby[bl] + "'s stat is now " + babby[bl+1]);

				writeUpdates();
				break;
			}
		}
	}
}, 0.4 * 60 * 1000);
});
}
ChatListen();
});
