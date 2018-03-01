const tokens = require('../tokens.json');
const Discord = require("discord.js");
const client = new Discord.Client();
const log = require(`../handlers/logHandler.js`);

module.exports = async client => {
  client.user.setActivity(`${tokens.prefix}help | ${client.users.keyArray().length} Users Online`, { type: `${tokens.activity.type}`, url: `${tokens.activity.url}` });
  log.info(`${client.users.keyArray().length} Users Online`);
  const embed = new Discord.MessageEmbed()
    .setAuthor(`${client.user.username} Has been launched`)
    .setDescription(`**Total Users Online** > ${client.users.keyArray().length}\n`)
    .setColor(tokens.generic.color.default)
    .setTimestamp()
    .setFooter(`${tokens.generic.footer} | `, `${tokens.generic.footerURL}`)
  client.channels.get(tokens.logID).send(
    embed,
    '',
    { disableEveryone: true }
  ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
}
