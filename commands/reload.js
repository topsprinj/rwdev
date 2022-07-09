const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
  trigger: /^(?:reload|$)/is,
  handler:  async (message, args,) => {
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    if(!user) return funct.repla('standart', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(user.level < bots.reload) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    funct.repla('standart', message.user, bot_message.reload, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    setTimeout(() => {process.exit(1)}, 1100);
  }
};