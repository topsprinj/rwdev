const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
const funct = require('../plugins/functions.js');
var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
module.exports = {
  trigger: /^(?:онлайн|$)/is,
  handler: async (message, args) => {
    const user = await mysql.User.findOne({where: {vkid: message.user}, limit: 1000});
    var bot_message = yaml.load(fs.readFileSync('./message.yml', 'utf8'));
    if(!user) return funct.repla('no_user', message.user, bot_message.no_user, 0, '', 0, '', '', '', '', '').then(info => {message.send(info)});
    setTimeout(async () => {
        setTimeout(async () => {}, -99999);
    
        const start = new Date();
            let text = `Онлайн беседы:\n`;
            const d = ``;
            const m = ``;
            let n = 0;
            let p = 0;
            let p2 = 0
    setTimeout(async () => {
        p = Number(p)
        n = Number(n)
    }, -99999);
    
        let r = ``
    
    setTimeout(async () => {
        vk.api.call("messages.getConversationMembers", {
            peer_id: 2000000000 + message.chatId, 
            fields: "online"
        }).then(function(res){
            p += res.profiles.length
            for(i in res.profiles){
                if(res.profiles[i].online == 1){
                if(res.profiles[i].online_app == 2274003 || res.profiles[i].online_app == 3502561 || res.profiles[i].online_app == 6121396 || res.profiles[i].online_app == 2685278 || res.profiles[i].online_app == 5776857 || res.profiles[i].online_app == 5776857 || res.profiles[i].online_app == 3698024) {
            text += `[👤] [id${res.profiles[i].id}| ${res.profiles[i].first_name.charAt(0)}. ${res.profiles[i].last_name}] (📱 Android)\n`
            n += Number(1)
            }
            if(res.profiles[i].online_app == 6146827) {
            text += `[👤] [id${res.profiles[i].id}| ${res.profiles[i].first_name.charAt(0)}. ${res.profiles[i].last_name}] ([📱] VK ME)\n`
            n += Number(1)
            }   
            if(res.profiles[i].online_app == 3682744 || res.profiles[i].online_app == 3140623) {
            text += `[👤] [id${res.profiles[i].id}| ${res.profiles[i].first_name.charAt(0)}. ${res.profiles[i].last_name}] ([📱] iPhone)\n`
            n += Number(1)
            }   
            if(res.profiles[i].online_app == 3682744) {
            text += `[👤] [id${res.profiles[i].id}| ${res.profiles[i].first_name.charAt(0)}. ${res.profiles[i].last_name}] ([🖥] Компьютер)\n`
            n += Number(1)
            }
            if(res.profiles[i].online_app === undefined) {
            text += `[👤] [id${res.profiles[i].id}| ${res.profiles[i].first_name.charAt(0)}. ${res.profiles[i].last_name}] ([❓] Браузер|Программы)\n`
            n += Number(1)  
                }
            }   
            }   
    
    setTimeout(async () => {
    const end = new Date();
    
    r = `${text}
        Всего пользователей: ${p}`
    }, -99999);
    
    setTimeout(async () => {
        message.send(r)
    }, -99999);
    })
    
    setTimeout(async () => {
    function check(status){
            if(status == 1) return "online"
            if(status == 0) return "offline"
           }
           }, -99999);
           }, -99999);
           }, -99999);
  }
};