const tokens = require(`../tokens.json`);
const Discord = require(`discord.js`);
const sql = require(`sqlite`);
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

exports.run = async (client, msg, args) => {
  return new Promise((resolve, reject) => {
    const embed = new Discord.MessageEmbed()
      .setTitle(`${tokens.name} Bot's Help Menu`)
      .setThumbnail(client.user.displayAvatarURL())
      .setColor(tokens.generic.color.default)
      .setDescription(`${tokens.name} Commands. Lovingly made by Dectom#0001`)
      .addField(`${tokens.prefix}help`,`Sends the help menu`, true)
      .addField(`${tokens.prefix}new`,`Creates Support Channel`, true)
      .setTimestamp()
      .setFooter(`${tokens.generic.footer} `, `${tokens.generic.footerURL}`)
    if(msg.channel.name.startsWith(`ticket`)) {
      embed.addField(`${tokens.prefix}close`, `Close the Ticket`, true)
      embed.addField(`${tokens.prefix}add`, `Add a user`, true)
      embed.addField(`${tokens.prefix}commission`,`Create a Commission`, true)
    }
    msg.channel.send(
      embed,
      '',
      { disableEveryone: true }
    ).catch((error) => {client.channels.get(tokens.logID).send(error); console.log(error)});
    log.info(`${msg.author.username} Asked for Help`);
  });
}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['']
};

exports.help = {
  name: `help`,
  description: `Displays a Help Menu`,
  usage: `help`
}
