const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
  trigger: /^(?:rcon removemember\s+(?<usere>.+)|$)/is,
  handler: async (message, args) => {
    const { usere } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    const cid = await funct.convert(`${usere}`);
    const target_user = await mysql.User.findOne({where: {vkid: cid}, limit: 1000});
    var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(user.level < bots.deleteacc) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(!target_user) return funct.repla('standart', message.user, bot_message.no_users, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    await funct.repla('delete', message.user, bot_message.delete_user, cid, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    await target_user.destroy({ force: true });
  }
};