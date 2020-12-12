/*
*
* You are not permitted to change this code below.
* Everything below SHOULD and MUST be NOT touched unless you have my permission.
*
 */
const { MessageEmbed } = require("discord.js");
require('dotenv').config();
const SETTINGS = process.env;
module.exports = {
    name: "credits",
    aliases: ["c"],
    cooldown: 60,
    description: "Shows bot's credits.",
    showOnHelp: SETTINGS.showOnHelpCreditsCommand,
    execute(message) {
            let creditsEmbed = new MessageEmbed()
                .setTitle(`SquadStatJS Credits`)
                .setImage("https://i.imgur.com/vfK27jY.png")
                .setDescription("This bot was made for the Squad Community by <@152644814146371584>. All other credits are listed below:")
                .setColor("#c4f603"); // Deep sky blue

            creditsEmbed.addField(
                `\u200B`, `\u200B`
            );

            creditsEmbed.addField(
                `**Player Stats**`,
                `\`SquadJS\``,
                true
            );

            creditsEmbed.addField(
                `**Steam Player Info**`,
                `\`SteamAPI\``,
                true
            );

            creditsEmbed.addField(
                `**Steam Server Info**`,
                `\`GameDig\``,
                true
            );

            creditsEmbed.addField(
                `**Country Flags**`,
                `\`Country Code Emoji\``,
                true
            );

            creditsEmbed.addField(
                `**BattleMetrics**`,
                `\`BattleMetrics & SuperAgent\``,
                true
            );

            creditsEmbed.addField(
                `**Discord API**`,
                `\`DiscordJS\``,
                true
            );

            creditsEmbed.addField(
                `**Sponsored by**`,
                `\`Anatolia Squad Community\``,
                true
            );

            // creditsEmbed.setImage()
            creditsEmbed.setTimestamp();
            creditsEmbed.setFooter(SETTINGS.author, SETTINGS.footerImg);

            return message.channel.send(creditsEmbed).catch(console.error);
    }
};
