const tokens = require('../tokens.json');
const Discord = require("discord.js");
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

exports.run = async (client, msg, params) => {
  return new Promise((resolve, reject) => {
    let collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 100000});
    msg.channel.send(`Reply with "yes" To accept our terms`);
    collector.on(`collect`, msg => {
      let answer = msg.content;
      if(msg.content.toLowerCase().startsWith("yes")) {
        var amount = 3;
        msg.channel.messages.fetch({
          limit: amount,
        }).then((messages) => {
          msg.member.roles.add(`${tokens.welcomeRole}`);
          msg.channel.bulkDelete(messages).catch(error => log.error(error.stack));
          log.info(`${msg.author.username} Verified`);
          msg.author.send(`Thanks for verifying`);
          const embedLog = new Discord.MessageEmbed()
            .setAuthor(`New Verification`)
            .setDescription(`${msg.author.username} Has Verified`)
            .setColor(tokens.generic.color.default)
            .setTimestamp()
            .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
          client.channels.get(`${tokens.logID}`).send(
            embedLog,
            '',
            { disableEveryone: true }
          ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
          collector.stop();
          return;
        }).catch((error) => { log.error(error)});
        return;
      } else {
        msg.author.send(`You must agree to the Terms to Verify!`);
        var amount = 3;
        msg.channel.messages.fetch({
          limit: amount,
        });
        collector.stop();
        return;
      }
    })
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['']
};

exports.help = {
  name: 'verify',
  description: '',
  usage: 'verify'
};
