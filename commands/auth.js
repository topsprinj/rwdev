const ygg = require ('yggdrasil') ({host : 'https://authserver.mojang.com'});
const mysql = require('../plugins/mysql');
const funct = require('../plugins/functions.js');
const yaml = require('js-yaml');
const fs   = require('fs');
module.exports = {
  trigger: /^(?:auth\s+(?<username>.\w.+)\s+(?<password>.+)|$)/is,
  handler: async (message, args) => {
    const { username, password } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(message.isChat) return funct.repla('standart', message.user, bot_message.chat, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(!username || !password) return;
    ygg.auth({
      token: '',
      agent: 'Minecraft', 
      version: 1, 
      user: `${username}`,
      pass: `${password}`,
      requestUser: true 
    }).then(
      (response)=>{
        if(response){
        funct.repla('standart', message.user, bot_message.connect_acc, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      }},
      (error)=>{
        if(error){
        funct.repla('standart', message.user, bot_message.no_connect_acc, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
      }}
    );
  }
};
//ot 
//of 