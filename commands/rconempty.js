const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
module.exports = {
    trigger: /^(?:rcon$)/is,
    handler: async (message, args) => {
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    funct.repla('no_user', message.user, bot_message.rconinfo, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    }
};