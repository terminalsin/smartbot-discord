const tokens = require('../tokens.json');
const Discord = require("discord.js");
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

exports.run = async (client, msg, params) => {
  return new Promise((resolve, reject) => {
    const embedLog = new Discord.MessageEmbed()
      .setAuthor(`${tokens.name} Website`)
      .setDescription(`${tokens.website}`)
      .setColor(tokens.generic.color.default)
      .setTimestamp()
      .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
    msg.channel.send(
      embedLog,
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
  name: 'website',
  description: '',
  usage: 'website'
};
