const fs = require('fs');
const Discord = require('discord.js');
const { token, prefix } = require('./config.json');
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    (command.args && !args.length) 
        && message.reply(`Você não adicionou argumentos, ${message.author}!`);

    try {
        command.execute(message, args);
    }
    catch (error) {
        console.error(error);
        message.reply('esse comando não existe!');
    }
});

client.login(token);