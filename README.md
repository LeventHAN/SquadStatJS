<div align="center">

<img src="img/logo/squadstatjs-logo.png" alt="Logo" width="500"/>

#### SquadStatJS
[![GitHub contributors](https://img.shields.io/github/contributors/11TStudio/SquadStatJS.svg?style=flat-square)](https://github.com/11TStudio/SquadStatJS/graphs/contributors)
[![GitHub release](https://img.shields.io/github/license/11TStudio/SquadStatJS.svg?style=flat-square)](https://github.com/11TStudio/SquadStatJS/blob/master/LICENSE)

<br>

[![GitHub issues](https://img.shields.io/github/issues/11TStudio/SquadStatJS.svg?style=flat-square)](https://github.com/11TStudio/SquadStatJS/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr-raw/11TStudio/SquadStatJS.svg?style=flat-square)](https://github.com/11TStudio/SquadStatJS/pulls)
[![GitHub issues](https://img.shields.io/github/stars/11TStudio/SquadStatJS.svg?style=flat-square)](https://github.com/11TStudio/SquadStatJS/stargazers)



<br><br>
</div>

## About
SquadStatJS is a Discord bot that shows the SQUAD players statistics using the database that [SquadJS](https://github.com/Thomas-Smyth/SquadJS) is producing.

## Using SquadStatJS
You can use this to entertain the players in your community. It will simulate the players in your server to play better and longer.

### Prerequisites
 * Git
 * [Node.js](https://nodejs.org/en/) (Current) - [Download](https://nodejs.org/en/)
 * [SquadJS](https://github.com/Thomas-Smyth/SquadJS)

### Installation
1. Clone the repository: `git clone https://github.com/11TStudio/SquadStatJS`
2. Configure the `.env.example` file. And when done SAVE and delete the .example. (At the end the file should look like: `.env`)
3. Run `npm install` via the terminal.
4. Start your bot: `node bot.js&`. (I recommend you to use [pm2](https://pm2.keymetrics.io))
5. Star this repo if you liked!

### Configuring SquadStatJS
SquadJS can be configured via a JSON configuration file which, by default, is located in the SquadJS and is named [config.json](https://github.com/Thomas-Smyth/SquadJS/blob/master/config.json).

The config file needs to be valid JSON syntax. If an error is thrown saying the config cannot be parsed then try putting the config into a JSON syntax checker (there's plenty to choose from that can be found via Google).

#### Server
The following section of the configuration contains information about your Squad server.
```json
# Main Settings
prefix="!"
game="squad"

# Connection Settings
serverIP="127.0.0.1"
DISCORD_BOT_TOKEN="YOUR_BOT_TOKEN"
steamtoken="YOUR_STEAM_TOKEN"
# BM is not used yet
# battleMetricsToken="BATTLE_METRICS_TOKEN"

# Restrict the usage of the bot on a specific channel/room
channelRestricted=true
statChannel="IF_ABOFE_TRUE_FILL_IN_CHANNELID"

# Embed settings false = do not delete / true = delete | timeout is in milliseconds
deletePlayerStatsEmbed=true
deletePlayerStatsEmbedTimeout="29000"
showActiveServerEmbed=true
deleteActiveServerEmbed=true
deleteActiveServerEmbedTimeout="29000"


# SquadJS Database Settings
host="127.0.0.1"
user="squadjs"
password="Your_Password"
database="squadjs"
# Write your serverID's all separated by ,(comma) like in the example below and the last one should not have any comma.
serverID="1,2,3"

# Visual Settings
footerImg="https://cdn.discordapp.com/icons/676475499538808842/a_b40c3b2dc58d06d3d1a5d34510205cd4.gif"
author="©️ Anatolia Squad Community"
```
 * `prefix` - The symbol/letter that your bot will use, default is `!`.
 * `game` - For now it is useless. Just don't touch it.
 * `serverIP` - The public IP of your Squad Game Server.
 * `DISCORD_BOT_TOKEN` - Obvius your bot token.
 * `steamtoken` - Your Steam Token, it will be used for the activity of the player (which server is he rightnow etc...).
 * `battleMetricsToken` - It is not usefull for now. Don't touch it.
 * `channelRestricted` - You can choose between `true` and `false`. `false`: Players can use the commands everywehere in the servr. `true`: Will check the channelID (see `statChannel`) and respond only for that room. It will promt an error if you use it elsewhere.
 * `statChannel` - The room/channelID that players can use the bot (only works if `channelRestricted=true`).
 * `deletePlayerStatsEmbed` - Toggles the delete function of the bot on/off for the Player Stats Embed (`true`: on | `false`: off)
 * `deletePlayerStatsEmbedTimeout` - The delete time in milliseconds for the Player Stats Embed! Default: `29000` = 29seconds
 * `showActiveServerEmbed` - Toggles the steam embed status message for players. (`true`: embed message is showing active server player is playing | `false`: does not show the active playing server embed) If this is `false` than `deleteActiveServerEmbed` and `deleteActiveServerEmbedTimeout` will be irrelevant.
 * `deleteActiveServerEmbed` - Toggles the delete function of the bot on/off for the active playing @ server embed (`true`: on | `false`: off)
 * `deleteActiveServerEmbedTimeout` - The delete time in milliseconds for the Active Server Embed! Default: `29000` = 29seconds
 * `host` - The database IP that SquadJS is using.
 * `user` - The username for that DB.
 * `password` - The password for that DB.
 * `database` - The database name for SquadJS.
 * `serverID` - The server ID that you would want to filter (most of the time it should be just "1" if you have multiple servers than you can write "1,2,etc..").
 * `footerImg` - The little logo/image on the footer of each embed.
 * `author` - The text next to `footerImg`
 

## Commands and Examples
The following is a list of commands built into SquadJS, you can click their title for more information:

<details>
      <summary>search</summary>
      <h2>Search for players statistics</h2>
      <p>The <code>search</code> command will automatically check if the player is saved in your DB and if so it will show his statistics.</p>
      <h3>Example Image</h3>
       <div align="center">
       <img src="img/examples/example_1.jpg" alt="Example !search" width="250"/>
       </div>
</details>
<details>
      <summary>credits</summary>
      <h2>Credits</h2>
      <p>The <code>credits</code> command will show the credits for the bot.</p>
      <h3>Example Image</h3>
       <div align="center">
       <img src="img/examples/example_2.jpg" alt="Example !search" width="250"/>
       </div>
</details>
<details>
      <summary>help</summary>
      <h2>Help with the commands</h2>
      <p>The <code>help</code> command will automatically grab all available commands and show them.</p>
      <h3>Example Image</h3>
       <div align="center">
       <img src="img/examples/example_3.jpg" alt="Example !search" width="250"/>
       </div>
</details>



## Creating Your Own Command
To create your own command you need a basic knowledge of NodeJS and DiscordJS.

I made a `comms/command.js.example` ready to be edited. Just delete the `.example` from it and you will be ready to go.
More about [DiscordJS](https://discord.js.org/#/docs/main/stable/general/welcome)


## Statement on Accuracy
Some of the information SquadJS collects from Squad servers was never intended or designed to be collected. Therefor it could be that the information the bot is showing is not 100% correct, because SquadJS issues/errors/miscalculation.

## Contribute
TODO...

## Credits
SquadStatJS would not be possible without:
 * [SquadJS](https://github.com/Thomas-Smyth/SquadJS) the main reason this bot exist.
 * [Anatolia Squad Community](https://www.anatoliacommunity.com) For helping me test the bot.

## License
```
Boost Software License - Version 1.0 - August 17th, 2003

Copyright (c) 2020 LeventHAN-11TStudio

Permission is hereby granted, free of charge, to any person or organization
obtaining a copy of the software and accompanying documentation covered by
this license (the "Software") to use, reproduce, display, distribute,
execute, and transmit the Software, and to prepare derivative works of the
Software, and to permit third-parties to whom the Software is furnished to
do so, all subject to the following:

The copyright notices in the Software and this entire statement, including
the above license grant, this restriction and the following disclaimer,
must be included in all copies of the Software, in whole or in part, and
all derivative works of the Software, unless such copies or derivative
works are solely in the form of machine-executable object code generated by
a source language processor.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. IN NO EVENT
SHALL THE COPYRIGHT HOLDERS OR ANYONE DISTRIBUTING THE SOFTWARE BE LIABLE
FOR ANY DAMAGES OR OTHER LIABILITY, WHETHER IN CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
```