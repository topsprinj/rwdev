const mysql = require('../plugins/mysql');
const fs = require('fs');
const yaml = require('js-yaml');
var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
module.exports = {
    trigger: /^(?:install\s+(?<nick>.+)|$)/is,
    handler: async (message, args) => {
    const { nick } = args.groups;
    if(bots.install == true) return;
    await mysql.User.create({
        pref: nick,
        level: 5,
        ban: false,
        vkid: message.user,
        ablc: true
        });
    await mysql.Rcon_Level.create({
        name: 'Console',
        id_name: 'cons'
        });
    await mysql.Rcon_Level.create({
        name: 'Модератор',
        id_name: 'mod'
        });
    await mysql.Rcon_Level.create({
        name: 'Администратор',
        id_name: 'admin'
        });
    await mysql.Rcon_Level.create({
        name: 'Гл.Администратор',
        id_name: 'gladmin'
        });
    await mysql.Rcon_Level.create({
        name: 'Руководитель',
        id_name: 'rukovaditel'
        });
    setTimeout(() => {
        const data = fs.readFileSync('./settings.yml', 'utf8').replace('install: false', 'install: true');
        fs.writeFileSync('./settings.yml', data);
    }, 1500);
    return message.send(`*id${message.user} (Install Successfully)`);
    }
};