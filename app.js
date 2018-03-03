const Discord = require(`discord.js`);
const tokens = require(`./tokens.json`);
const auth = require(`./auth.json`);
const fs = require(`fs`);
const log = require(`./handlers/logHandler.js`);
const client = new Discord.Client();


client.tokens = tokens;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./commands', (err, files) => {
  if (err) console.error(err);
  files.forEach(f => {
    let props = require(`./commands/${f}`);
    log.info(`Loading Command: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
  log.info(`Loading a total of ${files.length} commands.`);
});

fs.readdir('./events/', (err, files) => {
  if (err) console.error(err);
  log.info(`Loading a total of ${files.length} events.`);
  files.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

process.on("unhandledRejection", err => {
  log.error("Unhandled Promise Rejection: " + err.stack);
});

client.login(process.env.BOT_TOKEN);
