const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
  trigger: /^(?:rcon log\s+(?<jobs>.+)|$)/is,
  handler: async(message, args) => {
    const { jobs } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    var settings = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(user.level < settings.rconlog) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(jobs == `file`){
    if(settings.file_log == false){
    const data = fs.readFileSync('./settings.yml', 'utf8').replace('file_log: false', 'file_log: true');
    fs.writeFileSync('./settings.yml', data);
    funct.repla('standart', message.user, bot_message.file_on_log, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    }
    if(settings.file_log == true){
    const data = fs.readFileSync('./settings.yml', 'utf8').replace('file_log: true', 'file_log: false');
    fs.writeFileSync('./settings.yml', data);
    funct.repla('standart', message.user, bot_message.file_off_log, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    }
    }
    if(jobs == `vk`){
    if(settings.vk_log == false){
    const data = fs.readFileSync('./settings.yml', 'utf8').replace('vk_log: false', 'vk_log: true');
    fs.writeFileSync('./settings.yml', data);
    funct.repla('standart', message.user, bot_message.vk_on_log, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    }
    if(settings.vk_log == true){
    const data = fs.readFileSync('./settings.yml', 'utf8').replace('vk_log: true', 'vk_log: false');
    fs.writeFileSync('./settings.yml', data);
    funct.repla('standart', message.user, bot_message.vk_off_log, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    }
    }
    if(jobs == `console`){
    if(settings.console_log == false){
    const data = fs.readFileSync('./settings.yml', 'utf8').replace('console_log: false', 'console_log: true');
    fs.writeFileSync('./settings.yml', data);
    funct.repla('standart', message.user, bot_message.console_on_log, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    }
    if(settings.console_log == true){
    const data = fs.readFileSync('./settings.yml', 'utf8').replace('console_log: true', 'console_log: false');
    fs.writeFileSync('./settings.yml', data);
    funct.repla('standart', message.user, bot_message.console_off_log, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    }
    }
  }
};