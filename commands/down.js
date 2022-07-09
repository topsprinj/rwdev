const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');

module.exports = {
    trigger: /^(?:down)\s+(?<usere>.+)?/is,
    handler: async(message, args) => {
      const { usere } = args.groups;
      
        const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});

        const cid = await funct.convert(`${usere}`);

        const target_user = await mysql.User.findOne({where: {vkid: cid}, raw: true, limit: 1000});
        
        var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
        
        var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));

        if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
        
        if(user.level < bots.down) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
        
        if(!usere) return funct.repla('standart', message.user, bot_message.id_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      
        if(!target_user) return funct.repla('standart', message.user, bot_message.no_users, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      
        if(cid == message.senderId) return funct.repla('standart', message.user, bot_message.level_down, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
        
        if(target_user.level == bots.min_down) return funct.repla('down', message.user, bot_message.low_level, cid, '', 0, '', '', '', '', '').then(info => {message.send(info)});
        
        mysql.User.update({ level: mysql.Sequelize.literal(`level - 1`) }, { where: { vkid: cid }});
    
        funct.repla('down', message.user, bot_message.set_level, cid, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    }
  };