const mysql = require('../plugins/mysql');
const funct = require('../plugins/functions.js');
const yaml = require('js-yaml');
const fs   = require('fs');
module.exports = {
  trigger: /^(?:о боте|$)/is,
  handler: async (message, args) => {
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    funct.repla('standart', message.user, bot_message.obote, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
  }
};