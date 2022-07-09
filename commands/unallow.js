const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');

module.exports = {
    trigger: /^(?:rcon removeblock\s+(?<server>.\w+)\s+(?<cmde>.+)|$)/is,
    handler: async(message, args) => {
    const { server, cmde } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(user.level < bots.removeblock) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    let prefix = await mysql.Rcon_Prefix.findOne({where: {name: server.toLowerCase()}, raw: true, limit: 1000});
    if(!prefix) return funct.repla('standart', message.user, bot_message.not_found_server, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    const cmd_black = await mysql.BlackCmd.findOne({where: {cmd: cmde.toLowerCase(), server: server.toLowerCase()}, limit: 1000});      
    if(cmd_black && cmd_black.cmd != cmde) {return funct.repla('addcmd', message.user, bot_message.not_found_cmd, 0, '', 0, '', '', ''+cmde+'', ''+prefix.prefix+'', '').then(info => {message.send(info)});};
    cmd_black.destroy({ force: true });
    funct.repla('addcmd', message.user, bot_message.unblock_cmd, 0, '', 0, '', ''+cmde.toLowerCase()+'', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    }
};