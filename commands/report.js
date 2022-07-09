const mysql = require('../plugins/mysql');
const {VK} = require('vk-io');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
  trigger: /^(?:report\s+(?<text>.+)|$)/is,
  handler: async (message, args, vk) => {
    const { text } = args.groups;
	const user = await mysql.User.findOne({where: {vkid: message.senderId}, raw: true});
	var rcon_settings = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
	const reports = await mysql.Rcon_Report.findOne({where: {sender: message.senderId}, raw: true});
	let title = `[Группа]`;
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
	if(message.isChat) title = `[Беседа]`
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
	if(!text) return funct.repla('standart', message.user, bot_message.no_data_report, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
	if(reports) return funct.repla('report', message.user, bot_message.found_report, 0, ''+title+'', reports.id, '', '', '', '', '').then(info => {
	message.send(info);
	})
	await mysql.Rcon_Report.create({
	sender: message.senderId,
	messages: text
	}).then(ids => {
	funct.repla('report', message.user, bot_message.report, 0, ''+title+'', ids.dataValues.id, '', '', '', '', '').then(info => {
	vk.api.messages.send({chat_id: rcon_settings.modchat, message: info, random_id: 0});
	});
	return funct.repla('report', message.user, bot_message.report_message, 0, ''+title+'',ids.dataValues.id, '', '', '', '', '').then(info => {
	message.send(info);
	});
    });
}
};