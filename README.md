# Blessed BNC

A bot and client for <a href="https://github.com/AndrewBelt/hack.chat">hack.chat</a> that uses Node.js which uses the ncurses-like <a href="https://github.com/chjj/blessed">blessed</a> library.

![Blessed BNC](https://raw.githubusercontent.com/Rhondonize/Blessed-BNC/master/screenshot.png)

##Usage

``` js
$ git clone https://github.com/Rhondonize/Blessed-BNC/
$ cd Blessed-BNC
$ npm install
$ nodejs main.js
```
Note: some installations of Node.js will use the `node` command rather than `nodejs`

##Commands

All chat commands for this BNC's bot features are currently listed in the [wiki](https://github.com/Rhondonize/Blessed-BNC/wiki).

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
