const {MessageEmbed} = require("discord.js");
require('dotenv').config();
const SETTINGS = process.env;
const superagent = require('superagent');
const SteamAPI = require('steamapi');
const steam = new SteamAPI(SETTINGS.steamtoken);
const flag = require('country-code-emoji');
const Gamedig = require('gamedig');

module.exports = {
    name: SETTINGS.searchTag,
    cooldown: 20,
    aliases: ["s"],
    description: "Search a player up",
    example: `76561198110941835`, // example UID for the help command's example
    showOnHelp: SETTINGS.showOnHelpSearchCommand,
    async execute(message, args) {
        let fetchingData = new MessageEmbed()
                .setTitle("We are fetching the data, please wait... ")
                .setColor("#f2f20e")
        let fetchingSend = await message.channel.send(fetchingData);
        function wrongSyntax() {
            let wrongSyntaxEmbed = new MessageEmbed()
                    .setTitle(`Ooops! Wrong Syntax`)
                    .setDescription(`**Usage of the command: \`${SETTINGS.prefix}${SETTINGS.searchTag} <Your_Steam64ID>\`.**`)
                    .setColor("#ff0300")
                    .setAuthor('SquadStatJS by LeventHAN x 11TStudio', 'https://avatars2.githubusercontent.com/u/25463237?s=400&u=eccc0ee1cd33352f75338889e791a04d1909bcce&v=4', 'https://github.com/11TStudio')
                    .setThumbnail("https://i.imgur.com/fqymYyZ.png");
                wrongSyntaxEmbed.setAuthor('SquadStatJS by LeventHAN x 11TStudio', 'https://avatars2.githubusercontent.com/u/25463237?s=400&u=eccc0ee1cd33352f75338889e791a04d1909bcce&v=4', 'https://github.com/11TStudio')
                wrongSyntaxEmbed.addField(`Example`,`\`${SETTINGS.prefix}${SETTINGS.searchTag} 76561198255784011\``);
                wrongSyntaxEmbed.setTimestamp();
                wrongSyntaxEmbed.setFooter(SETTINGS.author, SETTINGS.footerImg);
                message.channel.send(wrongSyntaxEmbed)
                .then(msg => { msg.delete({timeout: 10000})})
                .then(SETTINGS.deleteUsersCommandOnError==="true"?message.delete({timeout: 10000}):"")
                .then(fetchingSend.delete({timeout: 10}))
                .catch(console.error);
        }
            if (!args.length) {
                wrongSyntax()
                return;
            }

            const steamIDpatter = /^[0-9]{17}$/;
            const uid = args[0];
            const uidValid = steamIDpatter.test(args[0]);

            if (!uidValid) {
                wrongSyntax();
                return;
            }

            var mysql = require('mysql');
            var a = uid;
            var con = mysql.createConnection({
                host: SETTINGS.host,
                user: SETTINGS.user,
                password: SETTINGS.password,
                database: SETTINGS.database
            });

            con.connect(error => {
                if (error) throw error;
                con.query("SELECT m.attacker AS 'Steam_ID', `Name`, `Wounds`,`Kills`,`Deaths`,`Kills`/`Deaths` AS `K/D`,`Revives`,m.id AS 'ID' FROM `DBLog_Wounds` m LEFT JOIN ( SELECT attacker, COUNT(*) AS `Wounds` FROM `DBLog_Wounds` WHERE server IN (" + SETTINGS.serverID + ") GROUP BY attacker ORDER BY time ASC) w ON w.attacker = m.attacker LEFT JOIN (SELECT attacker, COUNT(*) AS `Kills` FROM `DBLog_Deaths` WHERE server IN ("+SETTINGS.serverID+")  GROUP BY attacker) k ON k.attacker = m.attacker LEFT JOIN ( SELECT victim, COUNT(*) AS `Deaths` FROM `DBLog_Deaths` WHERE server IN (" + SETTINGS.serverID + ") GROUP BY victim) d ON d.victim = m.attacker LEFT JOIN (SELECT steamID, lastName AS `Name` FROM `DBLog_SteamUsers`) s ON s.steamID = m.attacker LEFT JOIN ( SELECT reviver, COUNT(*) AS `Revives` FROM `DBLog_Revives` WHERE server IN (" + SETTINGS.serverID + ") GROUP BY reviver ) r ON r.reviver = m.attacker WHERE steamID = '" + a + "' AND server IN (" + SETTINGS.serverID + ")  GROUP BY m.attacker HAVING `K/D` IS NOT NULL ORDER BY `K/D` DESC, time DESC", function (error, result, fields) {
                    if (error) {
                        let dbConnectionEmbed = new MessageEmbed()
                            .setTitle(`Ooops! Database error :( `)
                            .setDescription(`**There was an issue with the database connection please check the console!**`)
                            .setColor("#ff0300")
                            .setAuthor('SquadStatJS by LeventHAN x 11TStudio', 'https://avatars2.githubusercontent.com/u/25463237?s=400&u=eccc0ee1cd33352f75338889e791a04d1909bcce&v=4', 'https://github.com/11TStudio')
                            .setThumbnail("https://i.imgur.com/fqymYyZ.png");
                            dbConnectionEmbed.setAuthor('SquadStatJS by LeventHAN x 11TStudio', 'https://avatars2.githubusercontent.com/u/25463237?s=400&u=eccc0ee1cd33352f75338889e791a04d1909bcce&v=4', 'https://github.com/11TStudio')
                            dbConnectionEmbed.setTimestamp();
                            dbConnectionEmbed.setFooter(SETTINGS.author, SETTINGS.footerImg);
                        message.channel.send(dbConnectionEmbed)
                        .then(msg => { msg.delete({timeout: 10000})})
                        .then(SETTINGS.deleteUsersCommandOnError==="true"?message.delete({timeout: 10000}):"")
                        .then(fetchingSend.delete({timeout: 10}))
                        .catch(console.error);
                        if (error) throw error;
                        return;
                    }
                    if (!result || result.length === 0) {
                        // User is not in the DB or the user did not play in the server.
                        let searchEmbed = new MessageEmbed()
                            .setTitle(`User not found!`)
                            .setDescription(`This player didn't joined our server (yet).`)
                            .setColor("#ff0300")
                            .setAuthor('SquadStatJS by LeventHAN x 11TStudio', 'https://avatars2.githubusercontent.com/u/25463237?s=400&u=eccc0ee1cd33352f75338889e791a04d1909bcce&v=4', 'https://github.com/11TStudio')
                            .setThumbnail("https://i.imgur.com/vFNvpHr.png");
                        searchEmbed.setAuthor('SquadStatJS by LeventHAN x 11TStudio', 'https://avatars2.githubusercontent.com/u/25463237?s=400&u=eccc0ee1cd33352f75338889e791a04d1909bcce&v=4', 'https://github.com/11TStudio')
                        searchEmbed.setTimestamp();
                        searchEmbed.setFooter(SETTINGS.author, SETTINGS.footerImg);
                        return message.channel.send(searchEmbed)
                        .then(msg => { msg.delete({timeout: 5000})})
                        .then(SETTINGS.deleteUsersCommandOnNotFound==="true"?message.delete({timeout: 5000}):"")
                        .then(fetchingSend.delete({timeout: 10}))
                        .catch(console.error);

                    } else {
                        // Steam users country code.
                        steam.getUserSummary(a).then(summary => {
                            let countryFlag = ":pirate_flag: ";
                            if (summary["countryCode"] !== 'undefined' && summary["countryCode"]) {
                                countryFlag = flag(summary["countryCode"]);
                            }

                            let searchEmbed = new MessageEmbed()
                                .setTitle(`Fetched from our server.`)
                                .setDescription(`Command usage: \`${SETTINGS.prefix}${SETTINGS.searchTag} <SteamID64>\``)
                                .setColor("#f82d2a")
                                .setThumbnail(summary["avatar"]["large"])
                                .setAuthor('SquadStatJS by LeventHAN x 11TStudio', 'https://avatars2.githubusercontent.com/u/25463237?s=400&u=eccc0ee1cd33352f75338889e791a04d1909bcce&v=4', 'https://github.com/11TStudio');


                            searchEmbed.addField(
                                `**Player Name**`,
                                `**[${countryFlag}${result[0]["Name"]}](http://steamcommunity.com/profiles/${result[0]["Steam_ID"]})**`,
                                true
                            );

                            searchEmbed.addField(
                                `\u200B`, `\u200B`
                            );

                            searchEmbed.addField(
                                `**K/D**`,
                                `\`\`\`${result[0]["K/D"]}\`\`\``,
                                false
                            );

                            searchEmbed.addField(
                                `**Kills**`,
                                `\`\`\` ${result[0]["Kills"]} \`\`\``,
                                true
                            );

                            searchEmbed.addField(
                                `**Wounds**`,
                                `\`\`\` ${result[0]["Wounds"]} \`\`\``,
                                true
                            );

                            searchEmbed.addField(
                                `**Deaths**`,
                                `\`\`\` ${result[0]["Deaths"]} \`\`\``,
                                true
                            );

                            searchEmbed.addField(
                                `**Amount of Revives**`,
                                `\`\`\`${result[0]["Revives"]}\`\`\``,
                                true
                            );

                            searchEmbed.addField(
                                `\u200B`, `\u200B`
                            );

                            con.query("SELECT attacker, weapon, COUNT(weapon) FROM `DBLog_Deaths` WHERE server IN ("+SETTINGS.serverID+") AND attacker = '" + a + "' GROUP BY weapon  ORDER BY COUNT(weapon) DESC;", function (error1, result1, fields1) {
                                if (error1) throw error1;

                                searchEmbed.addField(
                                    `**Favorite Role**`,
                                    `\`\`\`${result1[0]["weapon"]}\`\`\``,
                                    false
                                );
                            });

                            con.query("SELECT attacker, weapon, COUNT(weapon) FROM `DBLog_Wounds` WHERE server IN ("+SETTINGS.serverID+") AND attacker = '" + a + "' GROUP BY weapon  ORDER BY COUNT(weapon) DESC;", function (error2, result2, fields2) {
                                if (error2) throw error2;

                                searchEmbed.addField(
                                    `**Favorite Gun**`,
                                    `\`\`\`${result2[0]["weapon"]}\`\`\``,
                                    false
                                );

                                // TODO: Battlemetrics is down. Use Superagent for that if steam fails to do what I want.
                                /*
                                superagent.get(`https://api.battlemetrics.com/players/${uid}`)
                                    //.query({ api_key: '', date: '2017-08-02' })
                                    .end((err, res) => {
                                        if (err) { return console.log(err); }
                                        console.log(res.body.url);
                                        console.log(res.body.explanation);
                                    });
                                */
                                /* PlayerSummary {
                                  avatar: {
                                    small: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c5da13940a3d4a9e6b84a5d7dc8527e57dcfe942.jpg',
                                    medium: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c5da13940a3d4a9e6b84a5d7dc8527e57dcfe942_medium.jpg',
                                    large: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/c5/c5da13940a3d4a9e6b84a5d7dc8527e57dcfe942_full.jpg'
                                  },
                                  steamID: '76561198110941835',
                                  url: 'https://steamcommunity.com/id/ESLevent/',
                                  created: 1381765646,
                                  lastLogOff: 1607029925,
                                  nickname: 'LeventHAN',
                                  realName: 'LeventHAN.',
                                  primaryGroupID: '103582791436471997',
                                  personaState: 0,
                                  personaStateFlags: 0,
                                  commentPermission: 1,
                                  visibilityState: 3,
                                  countryCode: 'TR',
                                  stateCode: '34',
                                  cityID: 44967,
                                  gameServerIP: undefined,
                                  gameServerSteamID: undefined,
                                  gameExtraInfo: undefined,
                                  gameID: undefined
                                }
                                */

                                searchEmbed.setTimestamp();
                                searchEmbed.setFooter(SETTINGS.author, SETTINGS.footerImg);
                                if(SETTINGS.deletePlayerStatsEmbed === "true"){
                                    message.channel.send(searchEmbed)
                                    .then(msg => { msg.delete({timeout: SETTINGS.deletePlayerStatsEmbedTimeout})})
                                    .then(SETTINGS.deleteUsersCommandOnSuccess==="true"?message.delete({timeout: 29000}):"")
                                    .then(fetchingSend.delete({timeout: 10}))
                                    .catch(console.error);
                                } else {
                                    message.channel.send(searchEmbed)
                                    .then(SETTINGS.deleteUsersCommandOnSuccess==="true"?message.delete({timeout: 29000}):"")
                                    .then(fetchingSend.delete({timeout: 10}))
                                    .catch(console.error);
                                }

                                if(SETTINGS.showActiveServerEmbed === "true") {
                                    let serverEmbed = new MessageEmbed()
                                        .setTitle(`Server activity - ${summary["nickname"]}`)
                                        .setDescription(`The following is fetched from Steam servers.`)
                                        .setColor("#3c54fd");
                                    if (summary["gameServerIP"]) {
                                        let serverIPort = summary["gameServerIP"].split(":");
                                        Gamedig.query({
                                            type: summary["gameExtraInfo"].toLowerCase(),
                                            host: serverIPort[0]
                                        }).then((state) => {
                                            if (state["raw"]["folder"] === "squad") {
                                                if (state["map"]) {
                                                    let map = state["map"];
                                                    map = map.replace(/ /g, "_");
                                                    map = map.replace(/'/g, "");
                                                    let layerImgURL = "https://squadmaps.com/img/maps/thumbnails/" + map + ".jpg";

                                                    serverEmbed.setThumbnail(layerImgURL);
                                                }
                                            }
                                            serverEmbed.setAuthor('SquadStatJS by LeventHAN x 11TStudio', 'https://avatars2.githubusercontent.com/u/25463237?s=400&u=eccc0ee1cd33352f75338889e791a04d1909bcce&v=4', 'https://github.com/11TStudio');

                                            serverEmbed.addFields(
                                                { name: `:file_cabinet: **Server** & Ping **(~${state["ping"]})**`, value: `**${state["name"]}**` },
                                                { name: `:busts_in_silhouette:  **Players**`, value: `**${state["raw"]["rules"]["PlayerCount_i"]}(${state["raw"]["rules"]["PublicQueue_i"]})/${state["maxplayers"]}**`, inline: true },
                                                );
                                            serverEmbed.setTimestamp();
                                            serverEmbed.setFooter(SETTINGS.author, SETTINGS.footerImg);
                                            if(SETTINGS.deleteActiveServerEmbed === "true"){
                                                message.channel.send(serverEmbed)
                                                .then(msg => { msg.delete({timeout: SETTINGS.deleteActiveServerEmbedTimeout})})
                                                .catch(console.error);
                                            } else {
                                                message.channel.send(serverEmbed)
                                                .catch(console.error);
                                            }
                                            return;
                                        }).catch((error) => {
                                            console.log("There was an error: " + error);
                                            serverEmbed.setTimestamp();
                                            serverEmbed.setFooter(SETTINGS.author, SETTINGS.footerImg);
                                            message.channel.send(serverEmbed)
                                            .then(msg => { msg.delete({timeout: 15000})})
                                            .catch(console.error);
                                        });
                                    } else {
                                        serverEmbed.setDescription(`**${summary["nickname"]} is not playing in a server.**`)
                                        // TODO: Thumbnail with error img + Description that there was an error?
                                        serverEmbed.setTimestamp();
                                        serverEmbed.setFooter(SETTINGS.author, SETTINGS.footerImg);
                                        if(SETTINGS.deleteActiveServerEmbed === "true"){
                                            message.channel.send(serverEmbed)
                                            .then(msg => { msg.delete({timeout: SETTINGS.deleteActiveServerEmbedTimeout})})
                                            .catch(console.error);
                                        } else {
                                            message.channel.send(serverEmbed)
                                            .catch(console.error);
                                        }
                                    }
                                }
                                return;
                            });
                        });
                    }
                });
            });
    }
};