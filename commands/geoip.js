const mysql = require('../plugins/mysql');
const ip2location = require('ip-to-location' );
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
  trigger: /^(?:geoip\s+(?<pats>.+)|$)/is,
  handler: async (message, args) => {
    const { pats } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    if(!pats) return funct.repla('standart', message.user, bot_message.no_data, 0, '', 0, '', '', '', '', '')
    .then(info => {message.send(info)});
    ip2location.fetch(`${pats}`,  function(err,  res){
    message.send(`${JSON.stringify(res, null, '　\t').replace(/"|}|{/ig, "")}`)})
  }
};