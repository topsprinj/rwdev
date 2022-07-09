const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
  trigger: /^(?:ответ\s+(?<rid>\d+)\s+(?<text>.+)|$)/is,
  handler: async (message, args, vk) => {
    const { rid, text } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.senderId}});
    const reports = await mysql.Rcon_Report.findOne({where: {id: rid}, raw: true});
    const delreports = await mysql.Rcon_Report.findOne({where: {id: rid}});
    var settings = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(user.level < settings.otvet) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(!rid) return funct.repla('otvet', message.user, bot_message.no_number_report, 0, '', rid, '', '', '', '', '').then(info => {message.send(info)});
    if(!text) return funct.repla('otvet', message.user, bot_message.no_data_report, 0, '', rid, '', '', '', '', '').then(info => {message.send(info)});
    if(!Number(rid) || !rid || !text) return funct.repla('otvet', message.user, bot_message.no_data_report, 0, '', rid, '', '', '', '', '').then(info => {message.send(info)});
	if(!reports) return funct.repla('otvet', message.user, bot_message.notfound_report, 0, '', rid, '', '', '', '', '').then(info => {message.send(info)});
  funct.repla('otvet', message.user, bot_message.otvet_send, 0, text, reports.id, '', '', '', '', '').then(info => {vk.api.messages.send({user_id: reports.sender, message: info, random_id: 0});});
  funct.repla('otvet', message.user, bot_message.otvet_result, 0, text, reports.id, '', '', '', '', '').then(info => {message.send(info)});
  setTimeout(() => {
  delreports.destroy({ force: true });
  }, 1500);


  }
};