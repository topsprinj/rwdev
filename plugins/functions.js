const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const {VK} = require('vk-io');
let setttings = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
const logger_1 = require('node-file-logger');
const logger_2 = require('node-file-logger');
const uptime = { sec: 0, min: 0, hours: 0, days: 0 };
const vk = new VK({
token: setttings.bot_token,
apiMode: 'parallel',
pollingGroupId: setttings.bot_id,
});
setInterval(() => {
    uptime.sec++;
    if (uptime.sec == 60) { uptime.sec = 0; uptime.min += 1; }
    if (uptime.min == 60) { uptime.min = 0; uptime.hours += 1; }
    if (uptime.hours == 24) { uptime.hours = 0; uptime.days += 1; }
}, 1000);
function rand(min, max) {return Math.round(Math.random() * (max - min)) + min};
function time() {
    let date = new Date();
    let days = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    var times = hours + ':' + minutes + ':' + seconds
    return times;
};
function data() {
var date = new Date();
let days = date.getDate();
let month = date.getMonth() + 1; 
if (month < 10) month = "0" + month;
if (days < 10) days = "0" + days;
var datas = days + ':' + month + ':' + date.getFullYear() ;
return datas;
};
function rwtime(type) {
	const time = new Date()
	if (time.getSeconds().toString().length == 1) {
		var sec = "0" + time.getSeconds()
	} else {
		var sec = time.getSeconds()
	}
	if (time.getMinutes().toString().length == 1) {
		var min = "0" + time.getMinutes() 
	} else {
		var min = time.getMinutes()
	}
	if (time.getDate().toString().length == 1) {
		var date = "0" + time.getDate()
	} else {
		var date = time.getDate()
	}
	if (time.getHours().toString().length == 1) {
		var hour = "0" + time.getHours()
	} else {
		var hour = time.getHours()
	}
	if (time.getMonth().toString().length == 1) {
		var mon = "0" + Math.round(time.getMonth() + 1)
	} else {
		var mon = Math.round(time.getMonth() + 1)
	}
	mon == 13 ? mon == '01' : null
	if (type == 1) {
		const wdays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
		const mes = ["января", "февравля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
		var gone = "📅 Дата: " + date + " " + mes[time.getMonth()] + " " + time.getFullYear() + " г. (" + wdays[time.getDay()] + ")\n⏰ Время: " + hour + ":" + min + ":" + sec
		return gone
	}
	if (type == 2) {
		return date + "." + mon + "." + time.getFullYear() + " " + hour + ":" + min + ":" + sec
	}
	if(type == 3){
		const mes = ["января", "февравля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
		const wdays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
		return {data:{date: date, mes: mes[time.getMonth()], year: time.getFullYear(), wdays: wdays[time.getDay()]}, time:{hour: hour, min: min, sec: sec}}
	}
};
function isArray(a) {
return (!!a) && (a.constructor === Array);
}
async function repla(type, id, text, id_users, report_title, report_id, ban_prichina, blockcmd, resulte, prefix_server, addlevel) {
    let bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    let setttings = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    let botin = require('../package.json');
    if(type == 'no_user') {
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    };
        return text
        .replace(/%message.user%/, id)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    };
    let user = await mysql.User.findOne({where: {vkid: id}, raw: true, limit: 1000});
    let rcon_level = await mysql.Rcon_Level.findOne({where: {id: user.level}, raw: true, limit: 1000});
    if(type === 'standart') {
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
    if(type === 'addlevel') {
    let addlevels = await mysql.Rcon_Level.findOne({where: {id_name: addlevel}, raw: true, limit: 1000});
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
        .replace(/%addlevel.id%/, addlevels.id)
        .replace(/%addlevel.id_name%/, addlevels.id_name)
        .replace(/%addlevel.name%/, addlevels.name)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
        .replace(/%addlevel.id%/, addlevels.id)
        .replace(/%addlevel.id_name%/, addlevels.id_name)
        .replace(/%addlevel.name%/, addlevels.name)
    }
    if(type === 'помощь'||type === 'профиль') {
    let serv = await mysql.Rcon_Stats.findAll({limit: 1000});
    deve = ``;
    for (let id in serv) {
    let serve = serv[id].name;
    let use = await mysql.sequelize.query('SELECT '+serve+' FROM `RWRcon_User` WHERE vkid = '+user.vkid+'', { type: mysql.sequelize.QueryTypes.SELECT});
    let prefix = await mysql.Rcon_Prefix.findOne({where: {name: serve}, raw: true, limit: 1000});
    let test = JSON.stringify(use).replace(/"|}|{/ig, "").replace("]", "").replace("[", "");
    if(deve == serve) return;
    deve += `${test == serve+':'+''+'0' == true ? `${bot_message.profilsserv_off.replace(/%prefix.server%/, prefix.prefix).replace(/%message.user%/, id).replace(/%user.vkid%/, user.vkid).replace(/%user.id%/, user.id).replace(/%user.pref%/, user.pref).replace(/%user.ban%/, user.ban).replace(/%user.level%/, rcon_level.name).replace(/%bot.coder%/, botin.author.url).replace(/%bot.name%/, setttings.bot_name).replace(/%bot.versions%/, botin.version)}` : `${bot_message.profilsserv_on.replace(/%prefix.server%/, prefix.prefix).replace(/%message.user%/, id).replace(/%user.vkid%/, user.vkid).replace(/%user.id%/, user.id).replace(/%user.pref%/, user.pref).replace(/%user.ban%/, user.ban).replace(/%user.level%/, rcon_level.name).replace(/%bot.coder%/, botin.author.url).replace(/%bot.name%/, setttings.bot_name).replace(/%bot.versions%/, botin.version)}`}\n`;
    };
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%servers%/, deve)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%servers%/, deve)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
    if(type === 'rconstatus') {
    let servv = await mysql.Rcon_Stats.findAll({limit: 1000});
    rss = ``;
    for (let id in servv) {
        let serve = servv[id].name;
        let servs = servv[id].status;
        let prefix = await mysql.Rcon_Prefix.findOne({where: {name: serve}, raw: true, limit: 1000});
        if(rss == `${bot_message.rconserv_off.replace(/%prefix.server%/, prefix.prefix).replace(/%message.user%/, id).replace(/%user.vkid%/, user.vkid).replace(/%user.id%/, user.id).replace(/%user.pref%/, user.pref).replace(/%user.ban%/, user.ban).replace(/%user.level%/, rcon_level.name).replace(/%bot.coder%/, botin.author.url).replace(/%bot.name%/, setttings.bot_name).replace(/%bot.versions%/, botin.version).replace(/%time%/, rwtime(2)).replace(/%uptime.days%/, uptime.days).replace(/%uptime.hours%/, uptime.hours).replace(/%uptime.min%/, uptime.min).replace(/%uptime.sec%/, uptime.sec)}`) return;
        if(rss == `${bot_message.rconserv_on.replace(/%prefix.server%/, prefix.prefix).replace(/%message.user%/, id).replace(/%user.vkid%/, user.vkid).replace(/%user.id%/, user.id).replace(/%user.pref%/, user.pref).replace(/%user.ban%/, user.ban).replace(/%user.level%/, rcon_level.name).replace(/%bot.coder%/, botin.author.url).replace(/%bot.name%/, setttings.bot_name).replace(/%bot.versions%/, botin.version).replace(/%time%/, rwtime(2)).replace(/%uptime.days%/, uptime.days).replace(/%uptime.hours%/, uptime.hours).replace(/%uptime.min%/, uptime.min).replace(/%uptime.sec%/, uptime.sec)}`) return;
        rss += `${servs == '0' ? `${bot_message.rconserv_off.replace(/%prefix.server%/, prefix.prefix).replace(/%message.user%/, id).replace(/%user.vkid%/, user.vkid).replace(/%user.id%/, user.id).replace(/%user.pref%/, user.pref).replace(/%user.ban%/, user.ban).replace(/%user.level%/, rcon_level.name).replace(/%bot.coder%/, botin.author.url).replace(/%bot.name%/, setttings.bot_name).replace(/%bot.versions%/, botin.version).replace(/%time%/, rwtime(2)).replace(/%uptime.days%/, uptime.days).replace(/%uptime.hours%/, uptime.hours).replace(/%uptime.min%/, uptime.min).replace(/%uptime.sec%/, uptime.sec)}` : `${bot_message.rconserv_on.replace(/%prefix.server%/, prefix.prefix).replace(/%message.user%/, id).replace(/%user.vkid%/, user.vkid).replace(/%user.id%/, user.id).replace(/%user.pref%/, user.pref).replace(/%user.ban%/, user.ban).replace(/%user.level%/, rcon_level.name).replace(/%bot.coder%/, botin.author.url).replace(/%bot.name%/, setttings.bot_name).replace(/%bot.versions%/, botin.version).replace(/%time%/, rwtime(2)).replace(/%uptime.days%/, uptime.days).replace(/%uptime.hours%/, uptime.hours).replace(/%uptime.min%/, uptime.min).replace(/%uptime.sec%/, uptime.sec)}`}\n`;
    };
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%rcon.servers%/, rss)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%rcon.servers%/, rss)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
    if(type === 'create') {
    let users = await mysql.User.findOne({where: {vkid: id_users}, raw: true, limit: 1000});
    let rcon_levels = await mysql.Rcon_Level.findOne({where: {id: users.level}, raw: true, limit: 1000});
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%users.vkid%/, users.vkid)
        .replace(/%users.id%/, users.id)
        .replace(/%users.pref%/, users.pref)
        .replace(/%users.ban%/, users.ban)
        .replace(/%users.level%/, rcon_levels.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%users.vkid%/, users.vkid)
        .replace(/%users.id%/, users.id)
        .replace(/%users.pref%/, users.pref)
        .replace(/%users.ban%/, users.ban)
        .replace(/%users.level%/, rcon_levels.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
    if(type === 'delete') {
    let users = await mysql.User.findOne({where: {vkid: id_users}, raw: true, limit: 1000});
    let rcon_levels = await mysql.Rcon_Level.findOne({where: {id: users.level}, raw: true, limit: 1000});
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%users.vkid%/, users.vkid)
        .replace(/%users.id%/, users.id)
        .replace(/%users.pref%/, users.pref)
        .replace(/%users.ban%/, users.ban)
        .replace(/%users.level%/, rcon_levels.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%users.vkid%/, users.vkid)
        .replace(/%users.id%/, users.id)
        .replace(/%users.pref%/, users.pref)
        .replace(/%users.ban%/, users.ban)
        .replace(/%users.level%/, rcon_levels.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
    if(type === 'up'||type === 'down') {
    let users = await mysql.User.findOne({where: {vkid: id_users}, raw: true, limit: 1000});
    let rcon_levels = await mysql.Rcon_Level.findOne({where: {id: users.level}, raw: true, limit: 1000});
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%users.vkid%/, users.vkid)
        .replace(/%users.id%/, users.id)
        .replace(/%users.pref%/, users.pref)
        .replace(/%users.ban%/, users.ban)
        .replace(/%users.level%/, rcon_levels.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%users.vkid%/, users.vkid)
        .replace(/%users.id%/, users.id)
        .replace(/%users.pref%/, users.pref)
        .replace(/%users.ban%/, users.ban)
        .replace(/%users.level%/, rcon_levels.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
    if(type === 'ban') {
    let users = await mysql.User.findOne({where: {vkid: id_users}, raw: true, limit: 1000});
    let rcon_levels = await mysql.Rcon_Level.findOne({where: {id: users.level}, raw: true, limit: 1000});
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%users.vkid%/, users.vkid)
        .replace(/%users.id%/, users.id)
        .replace(/%users.pref%/, users.pref)
        .replace(/%users.ban%/, users.ban)
        .replace(/%users.level%/, rcon_levels.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
        .replace(/%ban.reason%/, ban_prichina)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%users.vkid%/, users.vkid)
        .replace(/%users.id%/, users.id)
        .replace(/%users.pref%/, users.pref)
        .replace(/%users.ban%/, users.ban)
        .replace(/%users.level%/, rcon_levels.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
        .replace(/%ban.reason%/, ban_prichina)
    }
    if(type === 'unban') {
    let users = await mysql.User.findOne({where: {vkid: id_users}, raw: true, limit: 1000});
    let rcon_levels = await mysql.Rcon_Level.findOne({where: {id: users.level}, raw: true, limit: 1000});
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%users.vkid%/, users.vkid)
        .replace(/%users.id%/, users.id)
        .replace(/%users.pref%/, users.pref)
        .replace(/%users.ban%/, users.ban)
        .replace(/%users.level%/, rcon_levels.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%users.vkid%/, users.vkid)
        .replace(/%users.id%/, users.id)
        .replace(/%users.pref%/, users.pref)
        .replace(/%users.ban%/, users.ban)
        .replace(/%users.level%/, rcon_levels.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
    if(type === 'addcmd' || type === 'removecmd') {
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%block.cmd%/, blockcmd)
        .replace(/%prefix.server%/, prefix_server)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%block.cmd%/, blockcmd)
        .replace(/%prefix.server%/, prefix_server)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
    if(type === 'give' || type === 'ungive') {
    let users = await mysql.User.findOne({where: {vkid: id_users}, raw: true, limit: 1000});
    let rcon_levels = await mysql.Rcon_Level.findOne({where: {id: users.level}, raw: true, limit: 1000});
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%users.vkid%/, users.vkid)
        .replace(/%users.id%/, users.id)
        .replace(/%users.pref%/, users.pref)
        .replace(/%users.ban%/, users.ban)
        .replace(/%users.level%/, rcon_levels.name)
        .replace(/%prefix.server%/, prefix_server)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%users.vkid%/, users.vkid)
        .replace(/%users.id%/, users.id)
        .replace(/%users.pref%/, users.pref)
        .replace(/%users.ban%/, users.ban)
        .replace(/%users.level%/, rcon_levels.name)
        .replace(/%prefix.server%/, prefix_server)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
    if(type === 'addserver' || type === 'dellserver') {
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%prefix.server%/, prefix_server)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%prefix.server%/, prefix_server)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
    if(type === 'report') {
    let reports = await mysql.Rcon_Report.findOne({where: {id: report_id}, raw: true});
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%report.title%/, report_title)
        .replace(/%report.id%/, reports.id)
        .replace(/%report.message%/, reports.messagess)
        .replace(/%report.sender%/, reports.sender)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%report.title%/, report_title)
        .replace(/%report.id%/, reports.id)
        .replace(/%report.message%/, reports.messages)
        .replace(/%report.sender%/, reports.sender)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
    if(type === 'otvet') {
    let reports = await mysql.Rcon_Report.findOne({where: {id: report_id}, raw: true});
    let users = await mysql.User.findOne({where: {vkid: reports.sender}, raw: true, limit: 1000});
    let rcon_levels = await mysql.Rcon_Level.findOne({where: {id: users.level}, raw: true, limit: 1000});
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%report.id%/, reports.id)
        .replace(/%report.message%/, reports.messages)
        .replace(/%report.sender%/, reports.sender)
        .replace(/%users.vkid%/, users.vkid)
        .replace(/%users.id%/, users.id)
        .replace(/%users.pref%/, users.pref)
        .replace(/%users.ban%/, users.ban)
        .replace(/%users.level%/, rcon_levels.name)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
        .replace(/%report_text%/, report_title)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%report.id%/, reports.id)
        .replace(/%report.message%/, reports.messages)
        .replace(/%report.sender%/, reports.sender)
        .replace(/%users.vkid%/, users.vkid)
        .replace(/%users.id%/, users.id)
        .replace(/%users.pref%/, users.pref)
        .replace(/%users.ban%/, users.ban)
        .replace(/%users.level%/, rcon_levels.name)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
        .replace(/%report_text%/, report_title)
    }
    if(type === 'reports') {
    let reports = await mysql.Rcon_Report.findOne({where: {id: report_id}});
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%report.id%/, reports.id)
        .replace(/%report.message%/, reports.messages)
        .replace(/%report.sender%/, reports.sender)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%report.id%/, reports.id)
        .replace(/%report.message%/, reports.messages)
        .replace(/%report.sender%/, reports.sender)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
    if(type === 'server_rcon') {
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%prefix.server%/, prefix_server)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
        .replace(/%cmd%/, blockcmd)
        .replace(/%result.server%/, resulte)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%prefix.server%/, prefix_server)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
        .replace(/%cmd%/, blockcmd)
        .replace(/%result.server%/, resulte)
    }
    if(type === 'server') {
    if(isArray(text)){
        return text.join('')
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%prefix.server%/, prefix_server)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
        return text
        .replace(/%message.user%/, id)
        .replace(/%user.vkid%/, user.vkid)
        .replace(/%user.id%/, user.id)
        .replace(/%user.pref%/, user.pref)
        .replace(/%user.ban%/, user.ban)
        .replace(/%user.level%/, rcon_level.name)
        .replace(/%bot.coder%/, botin.author.url)
        .replace(/%bot.name%/, setttings.bot_name)
        .replace(/%prefix.server%/, prefix_server)
        .replace(/%bot.versions%/, botin.version)
        .replace(/%time%/, rwtime(2))
        .replace(/%uptime.days%/, uptime.days)
        .replace(/%uptime.hours%/, uptime.hours)
        .replace(/%uptime.min%/, uptime.min)
        .replace(/%uptime.sec%/, uptime.sec)
    }
}
async function convert(text) {
let i = text
.replace(/vk.com|m.vk.com/ig, "")
.replace("/", "")
.replace(/https:/ig, "")
.replace("//", "")
if(i.includes('[')) {
    i = i.replace("[", "")
    i = i.replace("]", "")
    i = i.split('@')[1]
    i = i
}
let userinfo = [];
const user_info = await vk.api.users.get({ user_ids: i })
.then(res => {
if(res) userinfo.push({
id: res[0].id,
first_name: res[0].first_name,
last_name: res[0].last_name,
can_access_closed: res[0].can_access_closed,
is_closed: res[0].is_closed
});
})
.catch(error => {
if(error) userinfo.push({id: 0});
});
return userinfo[0].id
}
function log(type, types, text) {
if(type == 1){
let options_1 = {
    folderPath: './logs',
    dateBasedFileNaming: true,
    fileNamePrefix: 'UserLogs_',
    fileNameExtension: '.log',
    dateFormat: 'DD_MM_YYYY',
    timeFormat: time(),
}
logger_1.SetUserOptions(options_1);
if(types == 'info') return logger_1.Info(text);
if(types == 'warn') return logger_1.Warn(text);
if(types == 'error') return logger_1.Error(text);
}
if(type == 2){
let options_2 = {
    folderPath: './logs',
    dateBasedFileNaming: true,
    fileNamePrefix: 'RconLogs_', 
    fileNameExtension: '.log',
    dateFormat: 'DD_MM_YYYY',
    timeFormat: time(),
}
logger_2.SetUserOptions(options_2);
if(types == 'info') return logger_2.Info(text);
if(types == 'warn') return logger_2.Warn(text);
if(types == 'error') return logger_2.Error(text);
}
}
/*
async function customcommand(message) {
let args = message.text.split(' ');
let ccmd = require('../cmd.json');
let user = await mysql.User.findOne({where: {vkid: message.senderId}, raw: true, limit: 1000});
if(ccmd[args[0]]){
if(user.level < ccmd[args[0]].level) return;
let text = ccmd[args[0]].answer;
if(ccmd[args[0]].flags) {
for(let key in ccmd[args[0]].flags){
if(ccmd[args[0]].flags[key] == 'standart') {}
}
}
return ccmd[args[0]].answer
}
}
*/
module.exports = {
rand,
time,
data,
rwtime,
isArray,
repla,
convert,
log
}