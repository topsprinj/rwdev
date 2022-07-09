const Rcon = require('modern-rcon');
const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
module.exports = {
  trigger: /^(?:\/(?<server>.+):(?<cmds>.+)|$)/is,

  handler: async (message, args, vk) => {
  
    const { server, cmds } = args.groups;
    
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));

    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});

    const rcon_server = await mysql.Rcon_Stats.findOne({where: {name: server.split(':')[0].toLowerCase()}, limit: 1000});
    
    const rcon_level = await mysql.Rcon_Level.findOne({where: {id: user.level}, limit: 1000});
    
    const block = await mysql.BlockCmd.findOne({where: {cmd: args[2].split(' ')[0].toLowerCase(), server: server.split(':')[0].toLowerCase()}, limit: 1000});
    
    const blocke = await mysql.BlockCmd.findOne({where: {cmd: args[2].toLowerCase(), server: server.split(':')[0].toLowerCase()}, limit: 1000});
    
    const black = await mysql.BlackCmd.findOne({where: {cmd: args[2].split(' ')[0].toLowerCase(), server: server.split(':')[0].toLowerCase()}, limit: 1000});
    
    const blacke = await mysql.BlackCmd.findOne({where: {cmd: args[2].toLowerCase(), server: server.split(':')[0].toLowerCase()}, limit: 1000});
    
    var settings = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
    
    const prefix = await mysql.Rcon_Prefix.findOne({where: {name: server.split(':')[0].toLowerCase()}, limit: 1000});
    
    const rcon_data = await mysql.Rcon_Data.findOne({where: {name: server.split(':')[0].toLowerCase()}, limit: 1000});
    
    const cmd_allow = await mysql.AllowCmd.findOne({where: {cmd: args[2].split(' ')[0].toLowerCase(), server: server.split(':')[0].toLowerCase()}, limit: 1000});
   
    let regexp = /[^a-zA-Z]/ig;

    if(regexp.test(args.groups.server.split(':')[0].toLowerCase()) == true) return;

    if(!rcon_server) return funct.repla('standart', message.user, bot_message.not_found_server, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});

    const use = await mysql.sequelize.query('SELECT '+server.split(':')[0].toLowerCase()+' FROM `RWRcon_User` WHERE vkid = '+message.user+'', { type: mysql.sequelize.QueryTypes.SELECT});

    if(JSON.stringify(rcon_server.status) == 1) return funct.repla('server_rcon', message.user, bot_message.off_server_rcon, 0, '', 0, '', '', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    
    const server_rcon = new Rcon(rcon_data.ip, port = rcon_data.rcon_port, rcon_data.rcon_password, timeout = 5000);

    if(JSON.stringify(use[0][server.split(':')[0].toLowerCase()]) == 0 && user.level < settings.send_rcon_max) return funct.repla('server_rcon', message.user, bot_message.not_access_server, 0, '', 0, '', ''+cmds.toLowerCase()+'', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});

    let zaprets1 = args[2].split(' ')[0].toLowerCase();

    let zaprets2 = args[2].toLowerCase();

    if(black && black.cmd == zaprets1 && user.ablc == 0||blacke && blacke.cmd == zaprets2 && user.ablc == 0) {return funct.repla('server_rcon', message.user, bot_message.not_access_cmd, 0, '', 0, '', ''+cmds.toLowerCase()+'', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});};

    if(settings.block_cmd == 1){

    if(user.level >= settings.send_rcon_min, user.level < settings.send_rcon_max){
  
    if(block && block.cmd == zaprets1||blocke && blocke.cmd == zaprets2) {return funct.repla('server_rcon', message.user, bot_message.access_cmd, 0, '', 0, '', ''+cmds.toLowerCase()+'', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});};

    await funct.repla('server_rcon', message.user, bot_message.connect_server, 0, '', 0, '', ''+cmds.toLowerCase()+'', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});

    if(server_rcon.hasAuthed == false) {
    
    await server_rcon.connect().catch(err => {
    
    if(settings.vk_log == true && err){vk.api.messages.send({chat_id: settings.system_chat, message:`⚠ ${prefix.prefix} Ошибка при подключении к серверу ⚠ ${err}`, random_id: 0})};
    
    if(settings.console_log == true && err){console.log(`${prefix.prefix} Ошибка при подключении к серверу ${err}`)};
    
    if(settings.file_log == true && err){funct.log(2, 'error', `⚠ ${prefix.prefix} Ошибка при подключении к серверу ⚠ ${err}`)};

    });
    
    };

    server_rcon.send(`${cmds}`).then(res => {
    
    if(settings.vk_log == true){vk.api.messages.send({chat_id: settings.logchat, message:`${prefix.prefix}\nПользователь VK: @id${message.senderId}(${user.pref})\nVK ID: ${message.senderId}\nLvL: ${rcon_level.name}\nиспользовал команду ${cmds}\nчерез бота!`, random_id: 0})};
    
    if(settings.console_log == true){console.log(`${prefix.prefix}\nПользователь VK: ${message.senderId}\nLvL: ${rcon_level.name}\nИспользовал команду ${cmds}\nчерез бота!`)};
    
    if(settings.file_log == true){funct.log(1, 'info', `${prefix.prefix} | Пользователь VK: ${message.senderId} | LvL: ${rcon_level.name} | Использовал команду ${cmds} через бота!`)};

    if(res == "") return funct.repla('server_rcon', message.user, bot_message.empty_reason, 0, '', ''+cmds.toLowerCase()+'', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    
    return funct.repla('server_rcon', message.user, bot_message.server_reason, 0, '', 0, '', ''+cmds.toLowerCase()+'', ''+res.replace(/§./g, '').slice(0, 4000)+'', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    
    }).catch(err => {    
    
    if(settings.vk_log == true){vk.api.messages.send({chat_id: settings.system_chat, message:`⚠ Ошибка сервера ${prefix.prefix}: ${err}`, random_id: 0})};
    
    if(settings.console_log == true){console.log(`⚠ Ошибка сервера ${prefix.prefix}: ${err}`)};
    
    if(settings.file_log == true){funct.log(2, 'error', `⚠ Ошибка сервера ${prefix.prefix}: ${err}`)};

    return message.send(`⚠ Ошибка ⚠`);
  
    });
    
    server_rcon.disconnect();

    };
    
    if(user.level >= settings.send_rcon_max){
    
    await funct.repla('server_rcon', message.user, bot_message.connect_server, 0, '', 0, '', ''+cmds.toLowerCase()+'', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});

    if(server_rcon.hasAuthed == false) {
    
    await server_rcon.connect().catch(err => {
    
    if(settings.vk_log == true && err){vk.api.messages.send({chat_id: settings.system_chat, message:`⚠ ${prefix.prefix} Ошибка при подключении к серверу ⚠ ${err}`, random_id: 0})};
    
    if(settings.console_log == true && err){console.log(`${prefix.prefix} Ошибка при подключении к серверу ${err}`)};
    
    if(settings.file_log == true && err){funct.log(2, 'error', `⚠ ${prefix.prefix} Ошибка при подключении к серверу ⚠ ${err}`)};
    
    });

    };
    
    server_rcon.send(`${cmds}`).then(res => {
    
    if(settings.vk_log == true){vk.api.messages.send({chat_id: settings.logchat, message:`${prefix.prefix}\nПользователь VK: @id${message.senderId}(${user.pref})\nVK ID: ${message.senderId}\nLvL: ${rcon_level.name}\nиспользовал команду ${cmds}\nчерез бота!`, random_id: 0})};
    
    if(settings.console_log == true){console.log(`${prefix.prefix}\nПользователь VK: ${message.senderId}\nLvL: ${rcon_level.name}\nИспользовал команду ${cmds}\nчерез бота!`)};
    
    if(settings.file_log == true){funct.log(1, 'info', `${prefix.prefix} | Пользователь VK: ${message.senderId} | LvL: ${rcon_level.name} | Использовал команду ${cmds} через бота!`)};

    if(res == "") return funct.repla('server_rcon', message.user, bot_message.empty_reason, 0, '', ''+cmds.toLowerCase()+'', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    
    return funct.repla('server_rcon', message.user, bot_message.server_reason, 0, '', 0, '', ''+cmds.toLowerCase()+'', ''+res.replace(/§./g, '').slice(0, 4000)+'', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    
    }).catch(err => {    
    
    if(settings.vk_log == true){vk.api.messages.send({chat_id: settings.system_chat, message:`⚠ Ошибка сервера ${prefix.prefix}: ${err}`, random_id: 0})};
    
    if(settings.console_log == true){console.log(`⚠ Ошибка сервера ${prefix.prefix}: ${err}`)};
    
    if(settings.file_log == true){funct.log(2, 'error', `⚠ Ошибка сервера ${prefix.prefix}: ${err}`)};

    return message.send(`⚠ Ошибка ⚠`);
  
    });
    
    server_rcon.disconnect();

    };
    
    };

    if(settings.block_cmd == 2){
    
    if(user.level >= settings.send_rcon_min, user.level < settings.send_rcon_max){
    
    let zaprets1 = args[2].split(' ')[0].toLowerCase();
  
    if (cmd_allow && cmd_allow.cmd != zaprets1) {return funct.repla('server_rcon', message.user, bot_message.not_allow_cmd, 0, '', 0, '', ''+cmds.toLowerCase()+'', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});};

    funct.repla('server_rcon', message.user, bot_message.connect_server, 0, '', 0, '', ''+cmds.toLowerCase()+'', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});

    if(server_rcon.hasAuthed == false){

    await server_rcon.connect().catch(err => {
    
    if(settings.vk_log == true && err){vk.api.messages.send({chat_id: settings.system_chat, message:`⚠ ${prefix.prefix} Ошибка при подключении к серверу ⚠ ${err}`, random_id: 0})};
    
    if(settings.console_log == true && err){console.log(`${prefix.prefix} Ошибка при подключении к серверу ${err}`)};
    
    if(settings.file_log == true && err){funct.log(2, 'error', `⚠ ${prefix.prefix} Ошибка при подключении к серверу ⚠ ${err}`)};

    });

    };

    server_rcon.send(`${cmds}`).then(res => {
    
    if(settings.vk_log == true){vk.api.messages.send({chat_id: settings.logchat, message:`${prefix.prefix}\nПользователь VK: @id${message.senderId}(${user.pref})\nVK ID: ${message.senderId}\nLvL: ${rcon_level.name}\nиспользовал команду ${cmds}\nчерез бота!`, random_id: 0})};
    
    if(settings.console_log == true){console.log(`${prefix.prefix}\nПользователь VK: ${message.senderId}\nLvL: ${rcon_level.name}\nИспользовал команду ${cmds}\nчерез бота!`)};
    
    if(settings.file_log == true){funct.log(1, 'info', `${prefix.prefix} | Пользователь VK: ${message.senderId} | LvL: ${rcon_level.name} | Использовал команду ${cmds} через бота!`)};

    if(res == "") return funct.repla('server_rcon', message.user, bot_message.empty_reason, 0, '', ''+cmds.toLowerCase()+'', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    
    return funct.repla('server_rcon', message.user, bot_message.server_reason, 0, '', 0, '', ''+cmds.toLowerCase()+'', ''+res.replace(/§./g, '').slice(0, 4000)+'', ''+prefix.prefix+'', '').then(info => {message.send(info)});

    }).catch(err => {    
    
    if(settings.vk_log == true){vk.api.messages.send({chat_id: settings.system_chat, message:`⚠ Ошибка сервера ${prefix.prefix}: ${err}`, random_id: 0})};
    
    if(settings.console_log == true){console.log(`⚠ Ошибка сервера ${prefix.prefix}: ${err}`)};
    
    if(settings.file_log == true){funct.log(2, 'error', `⚠ Ошибка сервера ${prefix.prefix}: ${err}`)};

    return message.send(`⚠ Ошибка ⚠`);
  
    });
    
    server_rcon.disconnect();

    }
    
    if(user.level >= settings.send_rcon_max){
    funct.repla('server_rcon', message.user, bot_message.connect_server, 0, '', 0, '', ''+cmds.toLowerCase()+'', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});

    if(server_rcon.hasAuthed == false){
    
    await server_rcon.connect().catch(err => {
  
    if(settings.vk_log == true && err){vk.api.messages.send({chat_id: settings.system_chat, message:`⚠ ${prefix.prefix} Ошибка при подключении к серверу ⚠ ${err}`, random_id: 0})};
    
    if(settings.console_log == true && err){console.log(`${prefix.prefix} Ошибка при подключении к серверу ${err}`)};
    
    if(settings.file_log == true && err){funct.log(2, 'error', `⚠ ${prefix.prefix} Ошибка при подключении к серверу ⚠ ${err}`)};

    });

    };

    server_rcon.send(`${cmds}`).then(res => {
    
    if(settings.vk_log == true){vk.api.messages.send({chat_id: settings.logchat, message:`${prefix.prefix}\nПользователь VK: @id${message.senderId}(${user.pref})\nVK ID: ${message.senderId}\nLvL: ${rcon_level.name}\nиспользовал команду ${cmds}\nчерез бота!`, random_id: 0})};
    
    if(settings.console_log == true){console.log(`${prefix.prefix}\nПользователь VK: ${message.senderId}\nLvL: ${rcon_level.name}\nИспользовал команду ${cmds}\nчерез бота!`)};
    
    if(settings.file_log == true){funct.log(1, 'info', `${prefix.prefix} | Пользователь VK: ${message.senderId} | LvL: ${rcon_level.name} | Использовал команду ${cmds} через бота!`)};

    if(res == "") return funct.repla('server_rcon', message.user, bot_message.empty_reason, 0, '', ''+cmds.toLowerCase()+'', '', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    
    return funct.repla('server_rcon', message.user, bot_message.server_reason, 0, '', 0, '', ''+cmds.toLowerCase()+'', ''+res.replace(/§./g, '').slice(0, 4000)+'', ''+prefix.prefix+'', '').then(info => {message.send(info)});
    
    }).catch(err => {    
    
    if(settings.vk_log == true){vk.api.messages.send({chat_id: settings.system_chat, message:`⚠ Ошибка сервера ${prefix.prefix}: ${err}`, random_id: 0})};
    
    if(settings.console_log == true){console.log(`⚠ Ошибка сервера ${prefix.prefix}: ${err}`)};
    
    if(settings.file_log == true){funct.log(2, 'error', `⚠ Ошибка сервера ${prefix.prefix}: ${err}`)};

    return message.send(`⚠ Ошибка ⚠`);
  
    });
    
    server_rcon.disconnect();

    }

    }
  }
};
