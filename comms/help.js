const { MessageEmbed } = require("discord.js");
require('dotenv').config();
const SETTINGS = process.env;

module.exports = {
    name: "help",
    aliases: ["h"],
    cooldown: 30,
    description: "Displays all commands with their examples.",
    showOnHelp: SETTINGS.showOnHelpHelpCommand,
    execute(message) {

        let commands = message.client.commands.array();

        let helpEmbed = new MessageEmbed()
            .setTitle(`SquadStatJS Help`)
            .setDescription("The list of available commands are listed below. Some commands have examples.")
            .setColor("#00bfff"); // Deep sky blue

        commands.forEach((command) => {
            if(command.showOnHelp === "true"){
                helpEmbed.addField(
                    `**${message.client.prefix}${command.name} ${command.aliases ? `(${command.aliases})` : ""}** ${command.example ? `${command.example}` : ""}`,
                    `\`\`\`${command.description}\`\`\``,
                    false
                );
            }
        });

        helpEmbed.setTimestamp();
        helpEmbed.setFooter(SETTINGS.author, SETTINGS.footerImg);

        return message.channel.send(helpEmbed).catch(console.error);
    }
};

