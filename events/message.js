const Discord = require(`discord.js`);
const tokens = require('../tokens.json');
const log = require(`../handlers/logHandler.js`);
const client = new Discord.Client();

module.exports = (client, msg) => {
  client.user.setActivity(`${tokens.prefix}help | ${client.users.keyArray().length} Users Online`, { type: `${tokens.activity.type}`, url: `${tokens.activity.url}` });
  if (msg.author.bot) {
    return;
  }
  if (!msg.content.startsWith(tokens.prefix)) return;
  if (!msg.guild) return;
  let command = msg.content.toLowerCase().split(' ')[0].slice(tokens.prefix.length);
  let params = msg.content.split(' ').slice(1);
  let cmd;
  client.cmd = cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    cmd.run(client, msg, params);
  }
};
