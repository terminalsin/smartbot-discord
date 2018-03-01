const tokens = require('../tokens.json');
const Discord = require("discord.js");
const moment = require(`moment`);
const sql = require(`sqlite`);
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

sql.open(`new.sqlite`);

exports.run = async (client, msg, params) => {
  return new Promise((resolve, reject) => {
    var author = msg.author;
    var ticketChannel = msg.channel;
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
    const embed = new Discord.MessageEmbed()
      .setAuthor(`New Commission`)
      .setDescription(`Thanks for choosing Smartbot!\nPlease @tag the roles you think are relevant to your Request`)
      .setColor(tokens.generic.color.default)
      .setTimestamp()
      .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
    msg.channel.send(
      embed,
      '',
      { disableEveryone: true }
    ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
    let collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 100000});
    collector.on(`collect`, msg => {
      let freelancer = msg.mentions.roles.first();
      const embedBudget = new Discord.MessageEmbed()
        .setAuthor(`New Commission`)
        .setDescription(`Please enter the Discord name of the client (e.g. > Dectom#0001)?`)
        .setColor(tokens.generic.color.default)
        .setTimestamp()
        .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
      msg.channel.send(
        embedBudget,
        '',
        { disableEveryone: true }
      ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
      collector.stop();
      collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 100000 });
      collector.on(`collect`, msg => {
        let username = msg.content;
        const embedBudget = new Discord.MessageEmbed()
          .setAuthor(`New Commission`)
          .setDescription(`Great, Whats your budget?`)
          .setColor(tokens.generic.color.default)
          .setTimestamp()
          .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
        msg.channel.send(
          embedBudget,
          '',
          { disableEveryone: true }
        ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
        collector.stop();
        collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 100000 });
        collector.on(`collect`, msg => {
          let budget = msg.content;
          const embedDetails = new Discord.MessageEmbed()
          .setAuthor(`New Commission`)
          .setDescription(`Awesome, Please provide us with any details related to your commission. This can include links and images`)
          .setColor(tokens.generic.color.default)
          .setTimestamp()
          .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
          msg.channel.send(
            embedDetails,
            '',
            { disableEveryone: true }
          ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
          collector.stop();
          collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 100000 });
          collector.on(`collect`, msg => {
            var amount = 9;
            msg.channel.messages.fetch({
              limit: amount,
            }).then((messages) => {
              msg.channel.bulkDelete(messages).catch(error => log.error(error.stack));
              log.info(`${msg.channel.name} Purged Commission Command!`);
            }).catch((error) => { log.error(error)});
            let details = msg.content;
            const embedComplete = new Discord.MessageEmbed()
              .setAuthor(`Commission Completed`)
              .setDescription(`Thanks for choosing Smartbot our Freelancers will get back to you shortly!`)
              .setColor(tokens.generic.color.default)
              .setTimestamp()
              .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
            msg.channel.send(
              embedComplete,
              '',
              { disableEveryone: true }
            ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
            client.channels.get(tokens.commissionsID).send(`${freelancer} You are Needed!`)
            const embedCommission = new Discord.MessageEmbed()
              .setAuthor(`Request from ${msg.author.username}`)
              .setThumbnail(msg.guild.iconURL())
              .setColor(tokens.generic.color.default)
              .setDescription(`**Description**:\n${details}`)
              .addField(`**From**:`, username, true)
              .addField(`**Budget**:`, budget, true)
              .addField(`**Sales Rep**:`, author.username, true)
              .addField(`**Claimed**:`, `none`, true)
              .setTimestamp()
              .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
            client.channels.get(tokens.commissionsID).send(
              embedCommission,
              '',
              { disableEveryone: true }
            ).then(async(msg) => {
              await msg.react("✅");
              const filter = (reaction, user) => reaction.emoji.name === "✅" || user.id === `95222611679653888`;
              const collector = msg.createReactionCollector(filter);
              collector.on(`collect`, async(r, user) => {
                if(user.id == client.user.id) return;
                const embedEdited = new Discord.MessageEmbed()
                  .setAuthor(`Commission Claimed`)
                  .setThumbnail(user.displayAvatarURL())
                  .setColor(tokens.generic.color.error)
                  .setDescription(`**Description**:\n${details}`)
                  .addField(`**From**:`, username, true)
                  .addField(`**Budget**:`, budget, true)
                  .addField(`**Sales Rep**:`, author.username, true)
                  .addField(`**Claimed**:`, `${user.username}`, true)
                  .setTimestamp()
                  .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
                msg.edit(embedEdited).then(msg => {
                  client.channels.get(ticketChannel.id).overwritePermissions(user.id, {VIEW_CHANNEL: true, SEND_MESSAGES: true}).catch(console.error);
                  //client.channels.get(ticketChannel.id).overwritePermissions(user.id, {SEND_MESSAGES: true}).catch(console.error);
                  const embedClaimed2 = new Discord.MessageEmbed()
                  .setAuthor(`Commission Claimed`)
                  .setDescription(`Looks like we found the right freelancer for the job! ${user.username} will be assisting you with your Commission!`)
                  .setColor(tokens.generic.color.default)
                  .setTimestamp()
                  .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
                  client.channels.get(ticketChannel.id).send(
                    embedClaimed2,
                    '',
                    { disableEveryone: true }
                  ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
                  log.info(`Edited Embed. ${user.username} claimed`);
                });
                collector.stop();
              });
            }).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
            collector.stop();
          });
        });
      });
    });
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['commission', 'comissions']
};

exports.help = {
  name: 'comission',
  description: 'Create a Commission',
  usage: 'comission'
};
