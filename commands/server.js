const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
  trigger: /^(?:rcon usercone\s+(?<text>.+)|$)/is,
  handler: async (message, args) => {
    const { text } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    const rcon_server = await mysql.Rcon_Stats.findOne({where: {name: text.toLowerCase()}, limit: 1000});
    const prefix = await mysql.Rcon_Prefix.findOne({where: {name: text.toLowerCase()}, limit: 1000});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(user.level < bots.server) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(!rcon_server) return funct.repla('standart', message.user, bot_message.not_found_server, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(!text) return funct.repla('standart', message.user, bot_message.no_data, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(rcon_server.status == 1){
      mysql.Rcon_Stats.update({ status: 0 }, { where: { name: text.toLowerCase() }});
      return funct.repla('server', message.user, bot_message.off_server, 0, '', 0, '', '', '', prefix.prefix, '').then(info => {message.send(info)});
    };
    if(rcon_server.status == 0){
      mysql.Rcon_Stats.update({ status: 1 }, { where: { name: text.toLowerCase() }});
      return  funct.repla('server', message.user, bot_message.on_server, 0, '', 0, '', '', '', prefix.prefix, '').then(info => {message.send(info)});
    };
  }
};