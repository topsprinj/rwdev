const funct = require("../plugins/functions.js");
const mysql = require('../plugins/mysql');
module.exports = {
  trigger: /^(?:rcon addlevel\s+(?<names>.+)\s+(?<id_names>.+)|$)/is,
  handler: async (message, args) => {
    const { names, id_names } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)})
    if(user.level < bots.addlevel) return funct.repla('standart', message.user, bot_message.no_permissions, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    const addlevel_1 = await mysql.Rcon_Level.findOne({where: {id_name: id_names}, limit: 1000});
    const addlevel_2 = await mysql.Rcon_Level.findOne({where: {name: names}, limit: 1000});
    if(addlevel_1) return funct.repla('addlevel', message.user, bot_message.addlevel_found, 0, '', 0, '', '', '', '',id_names).then(info => {message.send(info)});
    if(addlevel_2) return funct.repla('addlevel', message.user, bot_message.addlevel_found, 0, '', 0, '', '', '', '',names).then(info => {message.send(info)});
    mysql.Rcon_Level.create({
    name: names,
    id_name: id_names
    })
    funct.repla('addlevel', message.user, bot_message.addlevel, 0, '', 0, '', '', '', '',id_names).then(info => {message.send(info)});
}};