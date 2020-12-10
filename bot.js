require('dotenv').config();
const SETTINGS = process.env;
const {Client, Collection, MessageEmbed} = require('discord.js')
const { join } = require("path");
const { readdirSync } = require("fs");


// The client events
const client = new Client();
client.login(SETTINGS.DISCORD_BOT_TOKEN);
client.commands = new Collection();
client.prefix = SETTINGS.prefix;
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// starting the engine :)
client.on("ready", () => {
    console.log(`${client.user.username} ready!`);
    client.user.setActivity(`${SETTINGS.prefix}help`, { type: "LISTENING" });
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

// on message
client.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(SETTINGS.prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
        client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    if ((SETTINGS.channelRestricted === "true") && (message.channel.id !== SETTINGS.statChannel)) {
        let wrongChannelEmbed = new MessageEmbed()
            .setTitle(`Ooops! Wrong Channel`)
            .setDescription(`**You can only search a player up at <#${SETTINGS.statChannel}>.**`)
            .setColor("#ff0300")
            .setAuthor('SquadStatJS by LeventHAN x 11TStudio', 'https://avatars2.githubusercontent.com/u/25463237?s=400&u=eccc0ee1cd33352f75338889e791a04d1909bcce&v=4', 'https://github.com/11TStudio')
            .setThumbnail("https://i.imgur.com/fqymYyZ.png");
        wrongChannelEmbed.setAuthor('SquadStatJS by LeventHAN x 11TStudio', 'https://avatars2.githubusercontent.com/u/25463237?s=400&u=eccc0ee1cd33352f75338889e791a04d1909bcce&v=4', 'https://github.com/11TStudio')
        wrongChannelEmbed.setTimestamp();
        wrongChannelEmbed.setFooter(SETTINGS.author, SETTINGS.footerImg);
        message.channel.send(wrongChannelEmbed)
        .then(msg => { msg.delete({timeout: 5000})})
        .then(message.delete({timeout: 1000}))
        .catch(console.error);
        return;
    }
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const cdtimestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (cdtimestamps.has(message.author.id)) {
        const expirationTime = cdtimestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            let wrongSyntaxEmbed = new MessageEmbed()
                .setTitle(`Ooops! You are too fast!`)
                .setDescription(`**Usage of this command is protected with a cooldown.**`)
                .setColor("#ff0300")
                .setAuthor('SquadStatJS by LeventHAN x 11TStudio', 'https://avatars2.githubusercontent.com/u/25463237?s=400&u=eccc0ee1cd33352f75338889e791a04d1909bcce&v=4', 'https://github.com/11TStudio')
                .setThumbnail("https://i.imgur.com/fqymYyZ.png");
            wrongSyntaxEmbed.setAuthor('SquadStatJS by LeventHAN x 11TStudio', 'https://avatars2.githubusercontent.com/u/25463237?s=400&u=eccc0ee1cd33352f75338889e791a04d1909bcce&v=4', 'https://github.com/11TStudio')
            wrongSyntaxEmbed.addField(`Try after`,`\`${timeLeft.toFixed(1)}second(s)\``);
            wrongSyntaxEmbed.setTimestamp();
            wrongSyntaxEmbed.setFooter(SETTINGS.author, SETTINGS.footerImg);
            message.channel.send(wrongSyntaxEmbed)
            .then(msg => { msg.delete({timeout: 5000})})
            .then(message.delete({timeout: 5000}))
            .catch(console.error);
            return;
        }
    }

    cdtimestamps.set(message.author.id, now);
    setTimeout(() => cdtimestamps.delete(message.author.id), cooldownAmount);

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("Oops something went wrong... How about try that again?").catch(console.error);
    }

});

// Importing all the commands
const commandList = readdirSync(join(__dirname, "comms")).filter((file) => file.endsWith(".js"));
for (const file of commandList) {
    const command = require(join(__dirname, "comms", `${file}`));
    client.commands.set(command.name, command);
}