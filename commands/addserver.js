const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
trigger: /^(?:rcon addserver\s+(?<ip>.+)\s+(?<port>.+)\s+(?<rcon_port>.+)\s+(?<rcon_password>.+)\s+(?<name>.+)\s+(?<prefix>.+)|$)/is,
handler: async (message, args) => {
    const { ip, port, rcon_port, rcon_password, name, prefix } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    const rcon_server = await mysql.Rcon_Data.findOne({where: {name: name.toLowerCase()}, limit: 1000});
    let regexp = /[^a-zA-Z]/i;
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(user.level < bots.addserver) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(!ip||!port||!rcon_port||!rcon_password||!name) return funct.repla('standart', message.user, bot_message.no_data, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(regexp.test(name) == true) return funct.repla('standart', message.user, bot_message.no_eng, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(rcon_server) return funct.repla('standart', message.user, bot_message.server, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    const servname = name.toLowerCase();
    mysql.Rcon_Data.create({
        name: servname,
            ip: ip,
            rcon_port: rcon_port,
            rcon_password: rcon_password,
    });
    mysql.Rcon_Stats.create({
        name: servname,
        player: '0/0',
            ping: '0ms',
            status: false,
            monitors: true,
            ip: ip,
            port: port,
            widgets_icon: 'id359430019',
            widgets_url: 'vk.com/rimworlda'
    });
    mysql.Rcon_Prefix.create({
        name: servname,
        prefix: prefix
    });
    mysql.queryInterface.addColumn('RWRcon_User', ''+servname+'', { type: mysql.DataTypes.BOOLEAN, defaultValue: 0});
    funct.repla('addserver', message.user, bot_message.added_server, 0, '', 0, '', '', '', prefix, '')
    .then(info => {message.send(info)});
    }
};