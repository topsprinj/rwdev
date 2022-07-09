const funct = require('../plugins/functions.js');
const utils = require('../plugins/utils.js');
const mysql = require('../plugins/mysql');
module.exports = {
  trigger: /^(?:test\s+(?<text>.+)|$)/is,
  handler: async (message, args) => {
    const { text } = args.groups;
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    if(!user) return message.send(`⚠ У Вас недостаточно прав для использования бота! Приобретите статус [CONSOLE] и Вы сможете использовать команды!`);


  }
};