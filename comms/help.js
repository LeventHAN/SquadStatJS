const { MessageEmbed } = require("discord.js");
require('dotenv').config();
const SETTINGS = process.env;

module.exports = {
    name: "help",
    aliases: ["h"],
    cooldown: 30,
    description: "Displays all commands.",
    execute(message) {

        let commands = message.client.commands.array();

        let helpEmbed = new MessageEmbed()
            .setTitle(`SquadStatJS Help`)
            .setDescription("The list of available commands are listed below.")
            .setColor("#00bfff"); // Deep sky blue

        commands.forEach((command) => {
            helpEmbed.addField(
                `**${message.client.prefix}${command.name} ${command.aliases ? `(${command.aliases})` : ""}**`,
                `\`\`\`${command.description}\`\`\``,
                true
            );
        });

        helpEmbed.setTimestamp();
        helpEmbed.setFooter(SETTINGS.author, SETTINGS.footerImg);

        return message.channel.send(helpEmbed).catch(console.error);
    }
};

