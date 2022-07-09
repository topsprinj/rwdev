const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
    trigger: /^(?:rcon blallow\s+(?<id>.\w.+)|$)/is,
    handler: async(message, args) => {
      const { id } = args.groups;
      const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
      const cid = await funct.convert(`${id}`);
      const target_user = await mysql.User.findOne({where: {vkid: cid}, limit: 1000});
      var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
      var settings = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
      if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(user.level < settings.blallow) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(!target_user) return funct.repla('standart', message.user, bot_message.no_users, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(!id) return funct.repla('standart', message.user, bot_message.id_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(target_user.ablc == 0){
      mysql.User.update({ ablc: 1 }, { where: { vkid: cid }});
      funct.repla('unban', message.user, bot_message.blallow_on, cid, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      }
      if(target_user.ablc == 1){
      mysql.User.update({ ablc: 0 }, { where: { vkid: cid }});
      funct.repla('unban', message.user, bot_message.blallow_off, cid, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      }
    }
  };