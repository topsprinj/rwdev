const {VK} = require('vk-io');
const chalk = require('chalk');
const commands = require('./commands');
const mysql = require('./plugins/mysql');
var monitor = require('./plugins/monitor');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('./plugins/functions.js');
var protect = require('./plugins/protect.js');
var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
const fetch = require('node-fetch');
//const sqlite = require('sqlite3/lib/binding/napi-v3-win32-x64/node_sqlite3.node');
//const sqlite = require('sqlite3/lib/binding/napi-v6-linux-glibc-x64/node_sqlite3.node');
require("file-logger")("./logs/dev.log");
const requests = require('request');
const Downloader = require('nodejs-file-downloader');

const vk = new VK({
token: bots.bot_token,
apiMode: 'parallel',
pollingGroupId: bots.bot_id,
});
vk.updates.on('message_new', async (message) => {
if(message.is('message') && message.isOutbox)
return;
if(!message.senderId)
return;
if(message.senderId < 0)
return;
if(message.isGroup)
return;
message.user = message.senderId;
var settings = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
var users = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
if(users && users.ban == 1) return;
const command = commands.find(
(commandElement) => commandElement.trigger.test(message.text)
);
if(command) {
const args = message.text.match(command.trigger);
return command.handler(message, args, vk);
};
let title = 'В группе';
if(message.ChatId) {title = 'Чат #'+message.chatId+''};
if(settings.file_log == true){funct.log(1, 'info', `${title} VKID: ${message.user} Text: ${message.text}`);};
if(settings.console_log == true){console.log(`${title} VKID: ${message.user} Text: ${message.text}`);};
});
vk.updates.startPolling().then(async() => {
	try {
	console.log(chalk.green.underline.bold(`[>_] Включаюсь...`));
	//let ip = await fetch('https://api.my-ip.io/ip.json').then(res => res.json()).then(body => body);
	let on = await fetch(`http://rimworlda.ru/vkbot/api/index.php?group_id=${bots.bot_id}&status=check`).then(res => res.json()).then(body => body);
	if(on.result == false){

		console.log(chalk.red.underline.bold(`Бот не прошел проверку на подлинность`));
	
		process.exit(1);
	}
	if(on && on.group_id){
	console.log(chalk.green.underline.bold(`Бот прошел проверку на подлинность`));
	setInterval(() => {
	
	if(on.ban == 'true' && on.group_id) {
	
		console.log(chalk.red.underline.bold(`Cожелению, но бот для этой группы заблокирован по причине: ${on.reason}`));
		
		process.exit(1);
	};
	
	}, 5000);
	setInterval(async() => {
	
	if(on.send == 'true'){
	
	vk.api.messages.send({
	
	peer_id: on.vkid, 
	
	message: on.text, 
	
	random_id: 0
	
	});
	await fetch(`http://rimworlda.ru/vkbot/api/?group_id=${bots.bot_id}&status=ok`);
	}
	
	}, 30000);
	
	}
	} catch (error) {
		console.log(chalk.red.underline.bold(`Боту не удалось подключиться к серверу для проверки`));
	
		process.exit(1);
	}
    console.log(chalk.green.underline.bold(`Готов принимать запросы!`));
});
if(bots.widgets_on == true && bots.install == true){
setInterval(async() => {
	let user = await mysql.Rcon_Stats.findAll({where: {monitors: 1}, raw: true, limit: 1000});
	console.log("Обновляю виджет...");
	var tops = []
	if(user){
	for (let i in user) {
	if(!tops[i]) { 
    tops.push({
	id: user[i].id,
	player: user[i].player,
	name: user[i].name,
	ping: user[i].ping,
	wicon: user[i].widgets_icon,
	wurl: user[i].widgets_url
	});
    }}
    tops.sort(function(e, v) {
    if (v.player.split('/')[0] > e.player.split('/')[0]) return 1 
    if (v.player.split('/')[0] < e.player.split('/')[0]) return -1 
    return 0 
    })
	var script = {
	title: `Мониторинг`, 
	head: [
	{
	text: 'Сервер'
	},
	{
	text: 'Игроков',
	align: 'right'
	},
	{
	text: 'Пинг',
	align: 'right'
	}
	],
	body: []
	}
	for (var g = 0; g < 10; g++) { 
	if (tops.length > g) { 
	let ups = g; 
	ups += 1; 
	if(g <= 8) ups = `${ups}`
	if(g == 9) ups = `10` 
    script.body.push([
    {
    icon_id: `${tops[g].wicon}`,
    text: `${tops[g].name}`,
    url: `${tops[g].wurl}`
    },

    {
    text: `${tops[g].player}`
    },

    {
    text: `${tops[g].ping}`
    },
    ])
	} 
	}
	requests.post({url: 'https://api.vk.com/method/appWidgets.update', form:{
	v: '5.88',
	type: 'table',
	code: `return ${JSON.stringify(script)};`,
	access_token:  bots.widgets_token
	}
	},
	function(err, resp, body) {
	console.log(body);
	}
	)
	console.log("Виджет обновлён!");
    }
}, 30000);
}
//Система Авто обновление
setTimeout(async() => {
var checkup = await fetch("http://rimworlda.ru/vkbot/api/?group_id="+bots.bot_id+"&status=check").then(res => res.json()).then(body => body);
var botin = require('./package.json');
if(checkup.update_bot == 'false') return;
if(checkup.version != null&&checkup.version == botin.version) return;
console.log(chalk.green.underline.bold('Начинаю скачивать новую версию бота :)\nпросьба не отклю бота если все же откл сами скачую:)'));
await fetch("http://rimworlda.ru/vkbot/api/?group_id="+bots.bot_id+"&status=update");
const downloader = new Downloader({
url: 'http://f0561292.xsph.ru/rwrcon.zip', 
directory: "./",
fileName: "rwrcon.zip"
});
await downloader.download();
return console.log(chalk.green.underline.bold(`Новая версия лежит в архиве :)`))
}, 1000);
/*
ВРЕМЕННО ЗАБЫТО

const userb = new VK({
token: bots,
});
setTimeout(async() => {
	const requests = require('request');
	const e = fs.createReadStream('./test.jpg');
	vk.api.appWidgets.getGroupImageUploadServer({image_type: '510x128'}).then(data =>{
	console.log("\n"+JSON.stringify(data)+"")
	requests.post({url: data.upload_url, form:{
	image: e,
	}
	},
	function(err, resp, body) {
    let images = JSON.parse(body, function(key, value) {
	return value
    });
	console.log("\n "+JSON.stringify(images)+"")
	vk.api.appWidgets.saveGroupImage({image: images.image, hash: images.hash}).then(body => {
	console.log(body)
	})
	}
	)
	})
}, 2000);

тут тех. закинут файлы в папку 
request.get(message.attachments[0].url)
.pipe(fs.createWriteStream(message.attachments[0].title));
let rwurl = `http://rimworlda.ru/vkbot/api/?group_id=${bots.bot_id}&status=off`;
*/