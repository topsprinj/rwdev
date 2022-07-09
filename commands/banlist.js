const mysql = require('../plugins/mysql');
const funct = require("../plugins/functions.js");
const yaml = require('js-yaml');
const fs   = require('fs');
module.exports = {
  trigger: /^(?:банлист|$)/is,
  handler: async (message, args) => {
    let ban;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    const users = await mysql.User.findAll({raw: true, limit: 1000});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    ban = '\n▪Заблокировные▪\n';
    for (let id in users) {
        if(users[id]){
        let user = users[id]; 
        if (user.ban == 1) ban += `&#8195;[@id${user.vkid} (${user.pref})]\n`;
        }
    }
    let text = `\n`;
    if (ban.length != 24) text += ban;
    return message.send(`${text}`);
}
};