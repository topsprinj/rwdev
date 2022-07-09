const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
    trigger: /^(?:unban\s+(?<id>.+)|$)/is,
    handler: async(message, args, vk) => {
      const { id } = args.groups;
      const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
      const cid = await funct.convert(`${id}`);
      const target_user = await mysql.User.findOne({where: {vkid: cid}, limit: 1000});
      var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
      var settings = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
      if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(user.level < settings.unban) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(!id) return funct.repla('standart', message.user, bot_message.id_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(!target_user) return funct.repla('standart', message.user, bot_message.no_users, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(target_user.ban == 0) return funct.repla('ban', message.user, bot_message.no_ban, cid, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      mysql.User.update({ ban: 0 }, { where: { vkid: cid }});
      funct.repla('ban', message.user, bot_message.unban_message, cid, '', 0, '', '', '', '', '').then(info => {
      vk.api.messages.send({user_id: cid, message: info, random_id: 0});
      });
      funct.repla('ban', message.user, bot_message.unban, cid, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    }
  };