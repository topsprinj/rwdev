const yaml = require('js-yaml');
const fs   = require('fs');
const mysql = require('./mysql');
const chalk = require('chalk');
var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
if(bots.send_rcon_min == bots.send_rcon_max){

console.log(chalk.red.underline.bold(`Недопустимые настройки send_rcon_min и send_rcon_max не могут быть одинаковые`));

process.exit(1);

}
if(bots.send_rcon_min > bots.send_rcon_max){

console.log(chalk.red.underline.bold(`Недопустимые настройки send_rcon_min не может быть выше send_rcon_max`));

process.exit(1);

}
if(bots.send_rcon_min <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для send_rcon_min не может быть равен или быть ниже 0`));

process.exit(1);

}
if(bots.send_rcon_max <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для send_rcon_max не может быть равен или быть ниже 0`));

process.exit(1);

}
if(bots.up <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для up не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.addserver <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для addserver не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.addblock <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для addblock не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.ban <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для ban не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.rconaddcmd <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для rconaddcmd не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.createacc <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для createacc не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.deleteacc <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для deleteacc не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.down <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для down не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.give <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для give не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.otvet <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для otvet не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.cmdmode <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для cmdmode не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.reload <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для reload не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.report <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для reports не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.server <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для server не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.removeblock <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для removeblock не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.block_cmd <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для block_cmd не могут быть ровно или ниже 0`));

process.exit(1);

}

if(bots.block_cmd >= 3){

console.log(chalk.red.underline.bold(`Недопустимые настройки для block_cmd не могут быть выше 2`));

process.exit(1);

}

if(bots.unban <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для unban не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.rconremovecmd <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для rconremovecmd не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.ungive <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для ungive не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.max_up <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для max_up не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.min_down <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для max_up не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.addlevel <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для addlevel не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.rconlog <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для rconlog не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.rconstatus <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для rconstatus не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.rconupload <= 0){

console.log(chalk.red.underline.bold(`Недопустимые настройки для rconupload не могут быть ровно или ниже 0`));

process.exit(1);

}
if(bots.install == true){
setInterval(async() => {
const user = await mysql.User.findAll({raw: true, limit: 1000});

for (let id in user) {

const rcon_level = await mysql.Rcon_Level.findOne({where: {id: user[id].level}, raw: true, limit: 1000});

if(!rcon_level) {

mysql.User.update({ level: 1 }, { where: { level: user[id].level }});

}

}

mysql.User.update({ level: 1 }, { where: { level: mysql.sequelize.literal('level <= 0') }});

}, 10000);
}