const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
    trigger: /^(?:rcon setmode\s+(?<mode>.+)|$)/is,
    handler: async (message, args) => {
      const { mode } = args.groups;
      const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
      var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
      var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
      if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(user.level < bots.cmdmode) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(mode <= 0||mode >= 3) return funct.repla('standart', message.user, bot_message.block_1_cmd, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      if(mode == 1){
        if(bots.block_cmd == 1) return funct.repla('standart', message.user, bot_message.block_found_1_cmd, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
        const data = fs.readFileSync('./settings.yml', 'utf8').replace('block_cmd: 2', 'block_cmd: 1');
      fs.writeFileSync('./settings.yml', data);
      funct.repla('standart', message.user, bot_message.block_1_cmd, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      }
      if(mode == 2){
      if(bots.block_cmd == 2) return funct.repla('standart', message.user, bot_message.block_found_2_cmd, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      const data = fs.readFileSync('./settings.yml', 'utf8').replace('block_cmd: 1', 'block_cmd: 2');
      fs.writeFileSync('./settings.yml', data);
      funct.repla('standart', message.user, bot_message.block_2_cmd, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      }
    }
  };