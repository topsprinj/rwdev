const mysql = require('../plugins/mysql');
const yaml = require('js-yaml');
const fs   = require('fs');
var bots = yaml.load(fs.readFileSync('./settings.yml', 'utf8'));
const fetch = require('node-fetch');
const tcpp = require('tcp-ping');

var deve = [];
if(bots.install == true){
setInterval(async() => {
const serv = await mysql.Rcon_Stats.findAll({where: {monitors: 1}, raw: true, limit: 1000});
if(serv.length === deve.length) {deve.length = 0};
for (let id in serv) {
    let serve = serv[id].name;
    const names = deve.map(el => el.name);
    if(names.includes(serve) == true) return;
    deve.push({id: id,name: serve});
    var purl = `https://minecraft-api.com/api/ping/${serv[id].ip}/${serv[id].port}/json`;
    var presult = await fetch(purl).then(res => res.json()).then(body => body).catch(body => body);
    if(presult.version){
tcpp.ping({ address: serv[id].ip, port: serv[id].port }, function(err, data) {
    mysql.Rcon_Stats.update({ 
        player: `${presult.players.online}/${presult.players.max}`,
        ping:  `${Math.round(data.avg)} ms`,
        status: true,
        }, { where: {monitors: true, ip: serv[id].ip, port: serv[id].port}, limit: 1000});
});
}
if(!presult.version){
var qurl = `https://minecraft-api.com/api/query/${serv[id].ip}/${serv[id].port}/json`;
var qresult = await fetch(qurl).then(res => res.json()).then(body => body).catch(body => body);
if(qurl.version){
mysql.Rcon_Stats.update({ 
player: `${qresult.players.online}/${qresult.players.max}`,
ping:  `Query`,
status: true,
}, { where: {monitors: true, ip: serv[id].ip, port: serv[id].port}, limit: 1000});
}
if(!qurl.version) {
mysql.Rcon_Stats.update({ 
    player: `0/0`,
    ping:  `Нет ответа`,
    status: false
    }, { where: {monitors: true, ip: serv[id].ip, port: serv[id].port }, limit: 1000});
}
}
}
}, bots.up_server_info  * 1000);
}
//Math.round(data.avg)