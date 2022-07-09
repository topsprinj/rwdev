const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
    trigger: /^(?:up)\s+(?<usere>.+)?/is,
    handler: async(message, args) => {
      
      const { usere } = args.groups;
      
      const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
      
      const cid = await funct.convert(`${usere}`);

      const users = await mysql.User.findOne({where: {vkid: cid}, limit: 1000});
      
      const rcon_level = await mysql.Rcon_Level.findOne({where: {id: users.level}, raw: true, limit: 1000});
      
      var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));

      var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));

      if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      
      if(user.level < bots.up) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      
      if(!usere) return funct.repla('standart', message.user, bot_message.id_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      
      if(!users) return funct.repla('standart', message.user, bot_message.no_users, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      
      if(user.level <= users.level) return funct.repla('up', message.user, bot_message.up_level_rank, cid, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      
      if(cid == message.senderId) return funct.repla('standart', message.user, bot_message.up_level_block, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      
      if(users.level == bots.max_up) return funct.repla('up', message.user, bot_message.up_level_max, cid, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      
      mysql.User.update({ level: mysql.Sequelize.literal(`level + 1`) }, { where: { vkid: cid }});
      
      funct.repla('up', message.user, bot_message.up_level_give, cid, '', 0, '', '', '', '', '').then(info => {message.send(info)});
  }
};