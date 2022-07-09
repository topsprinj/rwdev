const mysql = require('../plugins/mysql');
const funct = require('../plugins/functions.js');
const yaml = require('js-yaml');
const fs   = require('fs');

module.exports = {
  trigger: /^(?:rcon addcmd\s+(?<server>.\w+)\s+(?<cmde>.+)|$)/is,
  handler: async(message, args) => {
    const { server, cmde } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});    
    if(user.level < bots.rconaddcmd) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    let prefix = await mysql.Rcon_Prefix.findOne({where: {name: server.toLowerCase()}, raw: true, limit: 1000});
    if(!prefix) return funct.repla('standart', message.user, bot_message.not_found_server, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(bots.block_cmd == 1) {
    const rcon_blockcmd = await mysql.BlockCmd.findOne({where: {cmd: cmde.toLowerCase(),server: server.toLowerCase()}, limit: 1000});
    if(rcon_blockcmd && rcon_blockcmd.cmd == cmde) return funct.repla('addcmd', message.user, bot_message.blocked_cmd, 0, '', 0, '', ''+cmde.toLowerCase()+'', '', '', '').then(info => {message.send(info)});
    mysql.BlockCmd.create({cmd: cmde.toLowerCase(),server: server.toLowerCase()});
    funct.repla('addcmd', message.user, bot_message.block_cmd, 0, '', 0, '', ''+cmde.toLowerCase()+'', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    }
    if(bots.block_cmd == 2) {
    const cmd_allow = await mysql.AllowCmd.findOne({where: {cmd: cmde.toLowerCase(), server: server.toLowerCase()}, limit: 1000});      
    if(cmd_allow && cmd_allow.cmd == cmde) return funct.repla('addcmd', message.user, bot_message.blocked_cmd, 0, '', 0, '', '', ''+cmde.toLowerCase()+'', '', '').then(info => {message.send(info)});
    mysql.AllowCmd.create({cmd: cmde.toLowerCase(), server: server.toLowerCase()});
    funct.repla('addcmd', message.user, bot_message.block_cmd, 0, '', 0, '', '', ''+cmde.toLowerCase()+'', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    }
    /*
    if(settings.block_cmd == 3) {
    const cmd_black = await mysql.BlackCmd.findOne({where: {cmd: cmde, server: server}, limit: 1000});      
    if(cmd_black && cmd_black.cmd == cmde) {return funct.repla('addcmd', message.user, bot_message.found_cmd, 0, '', 0, '', '', ''+cmde+'', '', '').then(info => {message.send(info)});};
    mysql.BlackCmd.create({cmd: cmde, server: server});
    funct.repla('addcmd', message.user, bot_message.add_cmd, 0, '', 0, '', '', ''+cmde+'', '', '').then(info => {message.send(info)});
    }
    */
  }
};