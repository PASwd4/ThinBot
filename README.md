# Blessed BNC

A bot and client for <a href="https://github.com/AndrewBelt/hack.chat">hack.chat</a> that uses Node.js which uses the ncurses-like <a href="https://github.com/chjj/blessed">blessed</a> library.

##Usage

``` js
$ npm install
$ nodejs main.js
```
##Controls

- __Spacebar__ - Toggles the list of online users
- __Enter__ - Focus on the input box
- __Escape__ - Sends text if unfocused from input box, otherwise, unfocuses from input box
- __Up/Down Keys__ - Scroll through the chat history
- __Q__ - Terminate the program
- __C__ - Toggles from chat input box to console input box

###Console

Some valid console commands that have been implemented into the bot are:

- `leave` closes the websocket to the current channel.
- `join [channel]` opens a websocket connection to the specified room, if unspecifed, will connect to ?lounge
- `control` toggles the bouncer to be used as a bot and respond to commands of others in the channel (on by default)