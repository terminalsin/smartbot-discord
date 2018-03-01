const tokens = require('../tokens.json');
const Discord = require("discord.js");
const moment = require(`moment`);
const sql = require(`sqlite`);
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

sql.open(`new.sqlite`);

exports.run = async (client, msg, params) => {
  return new Promise((resolve, reject) => {
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
    const args = msg.content.slice(tokens.prefix.length+exports.help.name).trim().split(/ +/g);
    if(!args) {
      const embedLog = new Discord.MessageEmbed()
        .setAuthor(tokens.generic.messages.invalidSyntax)
        .setDescription(`Please Mention a User to add them!`)
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
    let user = msg.mentions.users.first();
    msg.channel.overwritePermissions(user.id, {VIEW_CHANNEL: true, SEND_MESSAGES: true}).catch(console.error);
    const embedMsg = new Discord.MessageEmbed()
      .setAuthor(`Added User`)
      .setDescription(`${user} Has been added to #${msg.channel.name}`)
      .setColor(tokens.generic.color.default)
      .setTimestamp()
      .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
    msg.channel.send(
      embedMsg,
      '',
      { disableEveryone: true }
    ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
    log.info(`${msg.author.username} Added ${user.username} To ${msg.channel.name}`);
    const embed = new Discord.MessageEmbed()
      .setAuthor(`Added User`)
      .setDescription(`${msg.author.username} added ${user.username} to ${msg.channel.name}`)
      .setColor(tokens.generic.color.default)
      .setTimestamp()
      .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
    client.channels.get(tokens.logID).send(
      embed,
      '',
      { disableEveryone: true }
    ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['']
};

exports.help = {
  name: 'add',
  description: 'add channel command',
  usage: 'add'
};
