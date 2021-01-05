const {MessageEmbed} = require("discord.js");
require('dotenv').config();
const SETTINGS = process.env;

module.exports = {
    name: SETTINGS.searchClanTag,
    cooldown: 60,
    aliases: ["sc"],
    description: `Show a clan's top players up.`,
    example: `'[8mm]' TOP5`,
    showOnHelp: SETTINGS.showOnHelpSearchClanCommand,
    async execute(message, args) {
        function wrongSyntax() {
            let wrongSyntaxEmbed = new MessageEmbed()
                    .setTitle(`Ooops! Wrong Syntax`)
                    .setDescription(`**Usage of the command was wrong please check the examples below!**`)
                    .addField(`**Example usage: **`, `\`\`\`${SETTINGS.prefix}${SETTINGS.searchClanTag} "[8mm]" TOP10\`\`\``, false)
                    .addField(`**Example usage #2: **`, `\`\`\`${SETTINGS.prefix}${SETTINGS.searchClanTag} 'BADGER' TOP5\`\`\``, false)
                    .addField(`**Example usage #3: **`, `\`\`\`${SETTINGS.prefix}${SETTINGS.searchClanTag} "77th" TOP3\`\`\``, false)
                    .addField(`**Example usage #4: **`, `\`\`\`${SETTINGS.prefix}${SETTINGS.searchClanTag} '8mm'\`\`\``, false)
                    .setColor("#ff0300")
                    .setThumbnail("https://i.imgur.com/fqymYyZ.png");
                wrongSyntaxEmbed.setAuthor('SquadStatJS by LeventHAN x 11TStudio', 'https://avatars2.githubusercontent.com/u/25463237?s=400&u=eccc0ee1cd33352f75338889e791a04d1909bcce&v=4', 'https://github.com/11TStudio');
                wrongSyntaxEmbed.setTimestamp();
                wrongSyntaxEmbed.setFooter(SETTINGS.author, SETTINGS.footerImg);
                message.channel.send(wrongSyntaxEmbed)
                .then(msg => { msg.delete({timeout: 15000}) })
                .then(SETTINGS.deleteUsersCommandOnError === "true" ? message.delete({timeout: 15000}) : "")
                .catch(console.error);
        }
            if (!args.length) {
                wrongSyntax();
                return;
            }

            if(!message.content.match(/(["'])((?:\\\1|(?:(?!\1)).)*)(\1)/)) {
                wrongSyntax();
                return;
            }
            const clanTag = message.content.match(/(["'])((?:\\\1|(?:(?!\1)).)*)(\1)/)[2];
            const amount = args[args.length-1];
            const topAmount = amount ? amount.toUpperCase() : "TOP3";
            let limit = "";
            let topURL = "";
            let emoji = [];
            switch(topAmount){
                case "TOP3":
                    limit = "3";
                    emoji = [":first_place:", ":second_place:", ":third_place:"];
                    topURL = "https://i.imgur.com/HIlMSi2.jpg";
                    break;
                case "TOP5":
                    limit = "5";
                    emoji = [":first_place:", ":second_place:", ":third_place:", ":four:", ":five:"];
                    topURL = "https://i.imgur.com/YXrSRTG.jpg";
                    break;
                case "TOP10":
                    limit = "10";
                    emoji = [":first_place:", ":second_place:", ":third_place:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:", ":keycap_ten:"];
                    topURL= "https://i.imgur.com/Mlgr7I8.jpg";
                    break;
                default:
                    limit = "3";
                    emoji = [":first_place:", ":second_place:", ":third_place:"];
                    topURL= "https://i.imgur.com/HIlMSi2.jpg";
            }

            let fetchingData = new MessageEmbed()
                .setTitle("We are fetching the data, please wait... ")
                .setColor("#f2f20e")
            let fetchingSend = await message.channel.send(fetchingData);

            var mysql = require('mysql');
            var con = mysql.createConnection({
                host: SETTINGS.host,
                user: SETTINGS.user,
                password: SETTINGS.password,
                database: SETTINGS.database
            });

            con.connect(error => {
                if (error) throw error;
                con.query("SELECT m.attacker AS 'Steam ID', `Name`, `Wounds`, `Kills`, `Deaths`, `Kills`/`Deaths` AS `K/D`, `Revives`, `Favorite Gun`, `Favorite Role`, `TeamKills` FROM `DBLog_Wounds` m LEFT JOIN (SELECT attacker, COUNT(*) AS `Wounds`, weapon AS `Favorite Gun` FROM `DBLog_Wounds` WHERE server IN (" + SETTINGS.serverID + ") GROUP BY attacker ORDER BY time ASC) w ON w.attacker = m.attacker LEFT JOIN (SELECT attacker, COUNT(*) AS `TeamKills` FROM `DBLog_Deaths` WHERE server = 1 AND teamkill = 1 GROUP BY attacker) tk ON tk.attacker = m.attacker LEFT JOIN (SELECT attacker, COUNT(*) AS `Kills`, weapon AS `Favorite Role` FROM `DBLog_Deaths` WHERE server IN (" + SETTINGS.serverID + ") GROUP BY attacker) k ON k.attacker = m.attacker LEFT JOIN (SELECT victim, COUNT(*) AS `Deaths` FROM `DBLog_Deaths` WHERE server IN (" + SETTINGS.serverID + ") GROUP BY victim) d ON d.victim = m.attacker LEFT JOIN (SELECT steamID, lastName AS `Name` FROM `DBLog_SteamUsers`) s ON s.steamID = m.attacker LEFT JOIN (SELECT reviver, COUNT(*) AS `Revives` FROM `DBLog_Revives` WHERE server IN (" + SETTINGS.serverID + ") GROUP BY reviver) r ON r.reviver = m.attacker WHERE server IN (" + SETTINGS.serverID + ") AND `Name` LIKE ('%" + clanTag + "%') GROUP BY m.attacker HAVING `K/D` IS NOT NULL ORDER BY `K/D` DESC, time DESC LIMIT "+limit+";", function (error, result, fields) {
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
                        .then(SETTINGS.deleteUsersCommandOnError === "true" ? message.delete({timeout: 10000}) : "")
                        .then(fetchingData.delete({timeout: 1}))
                        .catch(console.error);
                        fetchingSend.delete({timeout: 1});
                        if (error) throw error;
                        return;
                    }
                    let searchEmbed = new MessageEmbed()
                    limit = result.length;
                    //return;
                    if(!result || result.length === 0) {
                        searchEmbed.setTitle(`We coulnd't find ${clanTag}`)
                                    .setDescription(`Please re-check your clan tag.`)
                                    .addField(`**Example usage: **`, `\`\`\`${SETTINGS.prefix}${SETTINGS.searchClanTag} "[8mm]" TOP10\`\`\``, false)
                                    .addField(`**Example usage #2: **`, `\`\`\`${SETTINGS.prefix}${SETTINGS.searchClanTag} 'BADGER' TOP5\`\`\``, false)
                                    .addField(`**Example usage #3: **`, `\`\`\`${SETTINGS.prefix}${SETTINGS.searchClanTag} "77th" TOP3\`\`\``, false)
                                    .addField(`**Example usage #4: **`, `\`\`\`${SETTINGS.prefix}${SETTINGS.searchClanTag} '8mm'\`\`\``, false)
                                    .setColor("#f82d2a")
                                    .setThumbnail('https://i.imgur.com/fqymYyZ.png')
                                    .setAuthor('SquadStatJS by LeventHAN x 11TStudio', 'https://avatars2.githubusercontent.com/u/25463237?s=400&u=eccc0ee1cd33352f75338889e791a04d1909bcce&v=4', 'https://github.com/11TStudio');
                                    searchEmbed.setTimestamp();
                                    searchEmbed.setFooter(SETTINGS.author, SETTINGS.footerImg);
                                    message.channel.send(searchEmbed)
                                    .then(msg => { msg.delete({timeout: 15000})})
                                    .then(SETTINGS.deleteUsersCommandOnError === "true" ? message.delete({timeout: 10000}) : "");
                                    fetchingSend.delete({timeout: 1});
                                    return;
                    } else {
                        searchEmbed.setTitle(`TOP ${limit} of ${clanTag}`)
                                .setDescription(`Command usage: \`${SETTINGS.prefix}${SETTINGS.searchClanTag} "<CLAN-TAG>" <TOP-10-5-3>\``)
                                .setColor("#f82d2a")
                                .setThumbnail(topURL)
                                .setAuthor('SquadStatJS by LeventHAN x 11TStudio', 'https://avatars2.githubusercontent.com/u/25463237?s=400&u=eccc0ee1cd33352f75338889e791a04d1909bcce&v=4', 'https://github.com/11TStudio');
                        for (let i = 0; i<limit; i++){
                            searchEmbed.addField(`${emoji[i]} ** ${result[i]["Name"]} - K/D: [${result[i]["K/D"]}%] ** (TK: ${result[i]["TeamKills"] || "0"}) `, `\`\`\`KILL: ${result[i]["Kills"]} - WOUND: ${result[i]["Wounds"]} - DEATH: ${result[i]["Deaths"]} - Revive: ${result[i]["Revives"]}\`\`\``,false);
                        }
                        searchEmbed.setTimestamp();
                        searchEmbed.setFooter(SETTINGS.author, SETTINGS.footerImg);
                        if(SETTINGS.deleteClanStatsEmbed === "true"){
                            message.channel.send(searchEmbed)
                            .then(SETTINGS.deleteUsersCommandOnSuccess === "true" ? message.delete({timeout: 5000}) : "")
                            .then(msg => { msg.delete({timeout: SETTINGS.deleteClanStatsEmbedTimeout})});
                            fetchingSend.delete({timeout: 1});
                        } else {
                            message.channel.send(searchEmbed)
                            .then(SETTINGS.deleteUsersCommandOnSuccess === "true" ? message.delete({timeout: 5000}) : "");
                            fetchingSend.delete({timeout: 1});
                        }
                    }
                });
            return;
        });
    }
};
