const mysql = require('../plugins/mysql');
const funct = require('../plugins/functions.js');
const yaml = require('js-yaml');
const fs   = require('fs');
module.exports = {
    trigger: /^(?:помощь$)/i,
    handler: async (message) => {
      const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
      var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
      if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '')
      .then(info => {message.send(info)});
      const rcon_level = await mysql.Rcon_Level.findOne({where: {id: user.level}, raw: true, limit: 1000});
      funct.repla('помощь', message.user, bot_message[rcon_level.id_name] , 0, '', 0, '', '', '', '', '')
      .then(info => {message.send(info)});
}
  };