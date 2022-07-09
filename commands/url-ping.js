const mysql = require('../plugins/mysql');
const tcpp = require('tcp-ping');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
  trigger: /^(?:url-ping\s+(?<http>.+)|$)/is,
  handler: async (message, args) => {
    const { http } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000})
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(!http) return funct.repla('standart', message.user, bot_message.no_data, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    tcpp.ping({address: http }, function(err, data) {
    return message.send(`&#8987; Подключение нашего сервера, до сайта: "${http}" составляет: ${Math.round(data.avg)} ms.`);
    });
  }
};