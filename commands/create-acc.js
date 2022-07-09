const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
  trigger: /^(?:rcon addmember\s+(?<id>.+)\s+(?<prefs>.+)\s+(?<lvl>.+)|$)/is,
  handler: async (message, args, vk) => {
    const { id, prefs, lvl } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    const cid = await funct.convert(`${id}`);
    const target_user = await mysql.User.findOne({where: {vkid: cid}, limit: 1000});
    const rcon_level = await mysql.Rcon_Level.findOne({where: {id_name: lvl}, raw: true, limit: 1000});
    var settings = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(user.level < settings.createacc) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(target_user) return funct.repla('standart', message.user, bot_message.user, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(Number(lvl) || !lvl) return funct.repla('standart', message.user, bot_message.id_name_lvl, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    await mysql.User.create({
      pref: prefs,
      level: rcon_level.id,
      ban: false,
      vkid: cid,
      ablc: false
    });
    funct.repla('create', message.user, bot_message.sms_add_access, cid, '', 0, '', '', '', '', '')
    .then(info => {
    vk.api.messages.send({
    user_id: cid, 
    message: info, 
    random_id: 0
    });
    });
    return funct.repla('create', message.user, bot_message.add_access, cid, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    }
};

