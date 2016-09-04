if (process.argv[2] != undefined) {
var room = process.argv[2];
} else {
	var room = "programming";
}
if (process.argv[3] != undefined) {
var userName = process.argv[3];
} else {
	var userName = "ThinBot";
}
if (process.argv[4] != undefined) {
var tripCode = process.argv[4];
} else {
	var tripCode = "secretpass";
}

var HackChat = require("hack-chat");

var chat = new HackChat.Session(room, (userName + "#" + tripCode));

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

ChatListen = function() {

chat.on("ratelimit", function(time) {
console.log("* Rate Limited");
});

chat.on("invitation", function(nick, channel, time) {
console.log("* Invited to ?" + channel + " by " + nick);
});

chat.on("warn", function(text) {
console.log("* " + text);
});

chat.on("error", function(err) {
console.log("* Error: " + err);
});

chat.on("banned", function(time) {
console.log("* Your IP is banned");
});

chat.on("info", function(text) {
console.log("* " + text);
});

chat.on("nicknameInvalid", function(time) {
console.log("* This nickname contains invalid characters.");
process.exit()
});

chat.on("onlineSet", function() {
	console.log("\n" + irlTime() + "Connected to ?" + room + " as " + userName + "\n");
});

chat.on("nicknameTaken", function(time) {
console.log("* This name already exists");
process.exit()
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

console.log(irlTime() + nick + " joined.");
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

console.log(irlTime() + nick + " left.");


});
}

ChatListen();

chat.on("chat", function(nick, text, time, isAdmin, trip) {


if (trip === "undefined") {

	trip = "NONE";

	console.log(irlTime() + "[NONE] # " + nick + ": " + text);

} else {

	console.log(irlTime() + trip + " # " + nick + ": " + text);

}

if (text == "/help" || text == "/h") {
	chat.sendMessage("Your help message here.");
}

});