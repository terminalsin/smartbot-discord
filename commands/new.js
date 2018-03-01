const tokens = require('../tokens.json');
const Discord = require("discord.js");
const moment = require(`moment`);
const sql = require(`sqlite`);
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

sql.open(`new.sqlite`);

exports.run = async (client, msg, params) => {
  return new Promise((resolve, reject) => {
    const args = msg.content.slice(tokens.prefix.length+exports.help.name).trim().split(/ +/g);
    var currentTime = moment().unix();
    msg.guild.channels.create(`ticket-${currentTime}`, {
      type: `text`,
      overwrites: [
        { id: msg.guild.id, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']},
        { id: msg.author.id, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']},
      ],
      parent: `418609762108702730`,
      reason: `Ticket channel ${currentTime}`
    }).then(cnl => {
      const embedMsg = new Discord.MessageEmbed()
        .setAuthor(`Support Channel Created`)
        .setDescription(`Created new Support Ticket #ticket-${currentTime}`)
        .setColor(tokens.generic.color.default)
        .setTimestamp()
        .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
      msg.channel.send(
        embedMsg,
        '',
        { disableEveryone: true }
      ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
      sql.get(`SELECT * FROM channels WHERE userID = "${msg.author.id}"`).then((row) => {
        if(!row) {
          log.info(`${msg.author.username}'s First Support Ticket'`);
        }
        sql.run(`INSERT INTO channels (userID, userName, id) VALUES("${msg.author.id}", "${msg.author.username}", "${currentTime}")`);
        const embedLog = new Discord.MessageEmbed()
          .setAuthor(`${msg.author.username}`)
          .setDescription(`Created new Support Ticket #ticket-${currentTime}`)
          .setColor(tokens.generic.color.default)
          .setTimestamp()
          .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
        client.channels.get(tokens.logID).send(
          embedLog,
          '',
          { disableEveryone: true }
        ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
        log.info(`${msg.author.username} Created a new Support Channel`);
      }).catch((error) => {
        sql.run(`CREATE TABLE IF NOT EXISTS channels (channelID INTEGER PRIMARY KEY AUTOINCREMENT, userID TEXT, userName TEXT, id TEXT)`);
        log.warn(`${error}`);
      });
      const embed = new Discord.MessageEmbed()
        .setAuthor(`New support ticket`)
        .setThumbnail(msg.guild.iconURL())
        .setDescription(`Thanks for your Support Ticket ${msg.author} Our staff will get back to you shortly!`)
        .setColor(tokens.generic.color.default)
        .setTimestamp()
        .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
      cnl.send(
        embed,
        '',
        { disableEveryone: true }
      ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['']
};

exports.help = {
  name: 'new',
  description: 'new channel command',
  usage: 'new'
};
