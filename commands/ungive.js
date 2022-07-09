const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
  trigger: /^(?:ungive\s+(?<serv>.+)\s+(?<s>.+)|$)/is,
  handler: async (message, args) => {
    const { serv, s } = args.groups;
    
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});

    const cid = await funct.convert(`${s}`);
    
    const users = await mysql.User.findOne({where: {vkid: cid}, limit: 1000});

    const prefix = await mysql.Rcon_Prefix.findOne({where: {name: serv.toLowerCase()}, limit: 1000});

    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    
    var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));

    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    
    if(user.level < bots.ungive) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    
    if(cid == message.senderId) return funct.repla('standart', message.user, bot_message.ungive_yourself, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    
    if(!users) return funct.repla('standart', message.user, bot_message.no_users, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});

    if(!prefix) return funct.repla('ungive', message.user, bot_message.not_found_server, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    
    const use = await mysql.sequelize.query('SELECT '+serv.toLowerCase()+' FROM `RWRcon_User` WHERE vkid = '+cid+'', { type: mysql.sequelize.QueryTypes.SELECT});

    if(use[0][serv.toLowerCase()] == 0) return funct.repla('ungive', message.user, bot_message.ungive_no, cid, '', 0, '', '', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    
    if(use[0][serv.toLowerCase()] == 1){
      
    await mysql.sequelize.query('UPDATE `RWRcon_User` SET '+serv.toLowerCase()+' = 0 WHERE vkid = '+cid+'', { type: mysql.sequelize.QueryTypes.SELECT});
      
    return  funct.repla('ungive', message.user, bot_message.ungive_remove, cid, '', 0, '', '', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    
    };
}
};