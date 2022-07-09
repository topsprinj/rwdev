const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
    trigger: /^(?:ban\s+(?<id>.\w.+)\s+(?<prichina>.+)|$)/is,
    handler: async(message, args, vk) => {
      const { id, prichina } = args.groups;
      const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
      const cid = await funct.convert(`${id}`);
      const target_user = await mysql.User.findOne({where: {vkid: cid}, limit: 1000});
      var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
      var settings = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
      if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(user.level < settings.ban) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(!target_user) return funct.repla('standart', message.user, bot_message.no_users, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(cid == message.senderId) return funct.repla('standart', message.user, bot_message.banned_yourself, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(!id) return funct.repla('standart', message.user, bot_message.id_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(!prichina) return funct.repla('standart', message.user, bot_message.not_reason, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(user.level < target_user.level) return funct.repla('ban', message.user, bot_message.userban_level, cid, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(target_user.ban == 1) return funct.repla('ban', message.user, bot_message.isbanned, cid, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(cid == 359430019) return funct.repla('standart', message.user, bot_message.no_users, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      mysql.User.update({ ban: 1 }, { where: { vkid: cid }});
      funct.repla('ban', message.user, bot_message.banned_message, cid, '', 0, ''+prichina+'', '', '', '', '').then(info => {
      vk.api.messages.send({user_id: cid, message: info, random_id: 0});
      });
      funct.repla('ban', message.user, bot_message.banned, cid, '', 0, ''+prichina+'', '', '', '', '').then(info => {message.send(info)});
    }
  };