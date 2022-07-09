const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');

module.exports = {
  trigger: /^(?:Профиль|$)/is,
  handler: async (message, args) => {
    var user = await mysql.User.findOne({where: {vkid: message.user}, raw: true, limit: 1000});
    const bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '')
    .then(info => {message.send(info)});
    funct.repla('профиль', message.user, bot_message.profils, 0, '', 0, '', '', '', '')
    .then(info => {message.send(info)});
}
};