const tokens = require('../tokens.json');
const Discord = require("discord.js");
const moment = require(`moment`);
const sql = require(`sqlite`);
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

sql.open(`new.sqlite`);

exports.run = async (client, msg, params) => {
  return new Promise((resolve, reject) => {
    if(!msg.member.hasPermission('KICK_MEMBERS')) {
      const embedLog = new Discord.MessageEmbed()
        .setAuthor(tokens.generic.messages.noPermissions)
        .setDescription(`You don't have Permissions to execute that Command!`)
        .setColor(tokens.generic.color.error)
        .setTimestamp()
        .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
      msg.channel.send(
        embedLog,
        '',
        { disableEveryone: true }
      ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
      return;
    }
    if(!msg.channel.name.startsWith(`ticket`)) {
      const embedLog = new Discord.MessageEmbed()
        .setAuthor(tokens.generic.messages.noPermissions)
        .setDescription(`That Command can only be executed in a Tickets Channel`)
        .setColor(tokens.generic.color.error)
        .setTimestamp()
        .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
      msg.channel.send(
        embedLog,
        '',
        { disableEveryone: true }
      ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
      return;
    }
    msg.channel.delete();
    const embedLog = new Discord.MessageEmbed()
      .setAuthor(`${msg.author.username}`)
      .setDescription(`${msg.author.username} Closed support ticket channel #${msg.channel.name}`)
      .setColor(tokens.generic.color.error)
      .setTimestamp()
      .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
    client.channels.get(tokens.logID).send(
      embedLog,
      '',
      { disableEveryone: true }
    ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
    log.info(`${msg.author.username} Closed ${msg.channel.name}`);
    return;
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['']
};

exports.help = {
  name: 'close',
  description: 'close channel command',
  usage: 'close'
};
