const mysql = require('../plugins/mysql');
const osu =  require('node-os-utils');
const os = require('os'); 
const tcpp = require('tcp-ping');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
const cpu = osu.cpu;
const mem = osu.mem;
module.exports = {
  trigger: /^(?:System|$)/is,
  handler: async(message, args) => {
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000})
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(user.level < bots.system) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '').then(info => {message.send(info)});
    const info = await mem.info();
    const cpuPercentage = await cpu.usage();
    tcpp.ping({ address: 'vk.com' }, function(err, data) {
    var tmem = info.totalMemMb.toString().split('.')[0];
    var umem = info.usedMemMb.toString().split('.')[0];
    var fmem = info.freeMemMb.toString().split('.')[0];
    var tmems = ``;
    var umems = ``;
    var fmems = ``;
    //totalmemmb
    if(tmem.length == 3) {tmems = `${tmem} MB`};
    if(tmem.length == 4) {tmems = `${tmem.substring(0, 1)} GB`};
    if(tmem.length == 5) {tmems = `${tmem.substring(0, 2)} GB`};
    if(tmem.length == 6) {tmems = `${tmem.substring(0, 3)} GB`};
    //usedmemmb
    if(umem.length == 3) {umems = `${umem} MB`};
    if(umem.length == 4) {umems = `${umem.substring(0, 1)} GB`};
    if(umem.length == 5) {umems = `${umem.substring(0, 2)} GB`};
    if(umem.length == 6) {umems = `${umem.substring(0, 3)} GB`};
    //freememmb
    if(fmem.length == 3) {fmems = `${fmem} MB`};
    if(fmem.length == 4) {fmems = `${fmem.substring(0, 1)} GB`};
    if(fmem.length == 5) {fmems = `${fmem.substring(0, 2)} GB`};
    if(fmem.length == 6) {fmems = `${fmem.substring(0, 3)} GB`};
    message.send(`
    Type: ${os.type()}
    Arch: ${os.arch()}
    Platform: ${process.platform}
    Release: ${os.release()} 
    Пинг: ${Math.round(data.avg)}ms
    Cpu: ${cpuPercentage}%
    Общая память: ${tmems}
    Использовано памяти: ${umems}
    Tекущия свободная память: ${fmems}
    `)
    }
    )
}
};