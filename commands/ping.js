const fetch = require('node-fetch');
const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
module.exports = {
  trigger: /^(?:ping:\s+(?<ip>.+)|$)/is,
  handler: async (message, args) => {
    const { ip } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    let url = `https://api.mcsrvstat.us/2/${ip}`;
    let on = await fetch(url).then(res => res.json()).then(body => body);
    if(on.online == false) return message.send(`⚠ Данный сервер отключен или не существует ⚠`);
    message.send(`
    🌐 IP-Адрес сервера: ${on.ip}
    🌐 Port сервера: ${on.port}
    💫 онлайн: ${on.players.online}/${on.players.max}
    💻 Версия: ${on.version}
    💻 протокол: ${on.protocol}
    📖 Motd: ${on.motd.raw}
    `)

  }
};