const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
  trigger: /^(?:rcon removecmd\s+(?<server>.\w+)\s+(?<cmde>.+)|$)/is,
  handler: async(message, args) => {
    const { server, cmde } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(user.level < bots.rconremovecmd) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    let prefix = await mysql.Rcon_Prefix.findOne({where: {name: server}, raw: true, limit: 1000});
    if(!prefix) return funct.repla('standart', message.user, bot_message.not_found_server, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(bots.block_cmd == 1) {
    const rcon_blockcmd = await mysql.BlockCmd.findOne({where: {cmd: cmde.toLowerCase(), server: server.toLowerCase()}, limit: 1000});
    if(!rcon_blockcmd.cmd && rcon_blockcmd) return funct.repla('removecmd', message.user, bot_message.not_found_cmd, 0, '', 0, '', ''+cmde+'', '', '', '').then(info => {message.send(info)});
    rcon_blockcmd.destroy({ force: true });
    funct.repla('removecmd', message.user, bot_message.unblock_cmd, 0, '', 0, '', ''+cmde.toLowerCase()+'', '', '', '').then(info => {message.send(info)});
    }
    if(bots.block_cmd == 2) {
    const cmd_allow = await mysql.AllowCmd.findOne({where: {cmd: cmde.toLowerCase(), server: server.toLowerCase()}, limit: 1000});      
    if(cmd_allow && !cmd_allow.cmd) return funct.repla('removecmd', message.user, bot_message.not_found_cmd, 0, '', 0, '', '', ''+cmd+'', '', '').then(info => {message.send(info)});
    cmd_allow.destroy({ force: true });
    funct.repla('removecmd', message.user, bot_message.unblock_cmd, 0, '', 0, '', '', ''+cmde.toLowerCase()+'', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    }
  }
};