const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');

module.exports = {
  trigger: /^(?:give\s+(?<serv>.+)\s+(?<s>.+)|$)/is,
  handler: async (message, args) => {
    const { serv, s } = args.groups;
    
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    
    const cid = await funct.convert(`${s}`);

    const target_user = await mysql.User.findOne({where: {vkid: cid}, limit: 1000});

    const prefix = await mysql.Rcon_Prefix.findOne({where: {name: serv.toLowerCase()},raw: true, limit: 1000});
    
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));

    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    
    var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));

    if(user.level < bots.give) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    
    if(cid == message.senderId) return funct.repla('standart', message.user, bot_message.no_add_server, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});

    if(!target_user) return funct.repla('standart', message.user, bot_message.no_users, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    
    if(!prefix) return funct.repla('give', message.user, bot_message.not_found_server, cid, '', 0, '', '', '', '', '').then(info => {message.send(info)});;
    
    const use = await mysql.sequelize.query('SELECT '+serv.toLowerCase()+' FROM `RWRcon_User` WHERE vkid = '+cid+'', { type: mysql.sequelize.QueryTypes.SELECT});

    if(use[0][serv.toLowerCase()] == 1) return funct.repla('give', message.user, bot_message.user_server, cid, '', 0, '', '', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    
    if(use[0][serv.toLowerCase()] == 0){
      
    await mysql.sequelize.query('UPDATE `RWRcon_User` SET '+serv.toLowerCase()+' = 1 WHERE vkid = '+cid+'', { type: mysql.sequelize.QueryTypes.SELECT});
    
    return funct.repla('give', message.user, bot_message.user_give_server, cid, '', 0, '', '', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    
    };
}
};