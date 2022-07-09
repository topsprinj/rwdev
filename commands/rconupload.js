const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
trigger: /^(?:rcon upload$)/is,
handler: async(message, args) => {
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    if(user.level < bots.rconupload) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    setTimeout(async() => {
        fs.access('./blocklist.yml', fs.F_OK, (err) => {
            if(err) return;
            const bos = yaml.load(fs.readFileSync('./blocklist.yml', 'utf8'));
            if(!bos) return;
            mysql.Rcon_Stats.findAll({limit: 1000}).then(res => {
            if(!res) return;
            for (let id in res) {
                let serve = res[id].name;
                for (let i in bos[serve]) {
                if(bos[serve][i] == undefined||!bos[serve][i]) return;
                mysql.BlockCmd.findOne({where: {cmd: bos[serve][i], server: serve}, limit: 1000}).then(ress => {
                if(!ress||ress === null) {
                mysql.BlockCmd.create({
                cmd: bos[serve][i],
                server: serve
                })
                }
                //Здесь код если есть команды но нам не нужно
                })
                };
            };
            console.log('Upload blocklist.yml');
            
        })
        })
        }, 1500);
        setTimeout(async() => {
        fs.access('./blacklist.yml', fs.F_OK, (err) => {
            if(err) return;
            const bos = yaml.load(fs.readFileSync('./blacklist.yml', 'utf8'));
            if(!bos) return;
            mysql.Rcon_Stats.findAll({limit: 1000}).then(res => {
            if(!res) return;
            for (let id in res) {
                let serve = res[id].name;
                for (let i in bos[serve]) {
                if(bos[serve][i] == undefined||!bos[serve][i]) return;
                mysql.BlackCmd.findOne({where: {cmd: bos[serve][i], server: serve}, limit: 1000}).then(ress => {
                if(!ress||ress === null) {
                mysql.BlackCmd.create({
                cmd: bos[serve][i],
                server: serve
                })
                }
                //Здесь код если есть команды но нам не нужно
                })
                };
            };
            console.log('Upload blacklist.yml');
        })
        })
        }, 2500);
        setTimeout(async() => {
        fs.access('./whitelist.yml', fs.F_OK, (err) => {
            if(err) return;
            const bos = yaml.load(fs.readFileSync('./whitelist.yml', 'utf8'));
            if(!bos) return;
            mysql.Rcon_Stats.findAll({limit: 1000}).then(res => {
            if(!res) return;
            for (let id in res) {
                let serve = res[id].name;
                for (let i in bos[serve]) {
                if(bos[serve][i] == undefined||!bos[serve][i]) return;
                mysql.AllowCmd.findOne({where: {cmd: bos[serve][i], server: serve}, limit: 1000}).then(ress => {
                if(!ress||ress === null) {
                mysql.AllowCmd.create({
                cmd: bos[serve][i],
                server: serve
                })
                }
                //Здесь код если есть команды но нам не нужно
                })
                };
            };
            console.log('Upload whitelist.yml');
        })
        })
        }, 3500);
        return message.send(`*id${message.user} (Upload Successfully)`);
}
};