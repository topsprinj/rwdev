const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
trigger: /^(?:rcon removeserver\s+(?<name>.+)|$)/is,
handler: async (message, args) => {
    const { name } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    const rcon_prefix = await mysql.Rcon_Prefix.findOne({where: {name: name.toLowerCase()}, limit: 1000});
    const rcon_stats = await mysql.Rcon_Stats.findOne({where: {name: name.toLowerCase()}, limit: 1000});
    const rcon_data = await mysql.Rcon_Data.findOne({where: {name: name.toLowerCase()}, limit: 1000});
    let regexp = /[^a-zA-Z]/i;
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(user.level < bots.delserver) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(!name) return funct.repla('standart', message.user, bot_message.no_data, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(regexp.test(name) == true) return funct.repla('standart', message.user, bot_message.no_eng, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(!rcon_data) return funct.repla('standart', message.user, bot_message.not_found_server, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    let names = name.toLowerCase();
        console.log('Step 1/2 (OK)!');
        funct.repla('dellserver', message.user, bot_message.delete_server, 0, '', 0, '', '', '', rcon_prefix.prefix, '')
        .then(info => {message.send(info)});
        
        mysql.queryInterface.removeColumn('RWRcon_User', names);
        console.log('Step 2/2 (OK)!');
        rcon_prefix.destroy({ force: true });
        rcon_stats.destroy({ force: true });
        rcon_data.destroy({ force: true });
    }
};