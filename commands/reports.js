const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
  trigger: /^(?:репорты\s+(?<rid>.+)|$)/is,
  handler: async (message, args) => {
    const { rid } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.senderId}});
    const reports = await mysql.Rcon_Report.findOne({where: {id: rid}});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(user.level < bots.reports) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(!rid) return funct.repla('standart', message.user, bot_message.no_number_report, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(!reports) return funct.repla('standart', message.user, bot_message.reports_notfound, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    funct.repla('reports', message.user, bot_message.reports, 0, '', rid, '', '', '', '', '')
    .then(info => {message.send(info)});
  }
};