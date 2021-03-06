let help = require('./help');
let down = require('./down');
let up = require('./up');
let ban = require('./ban');
let unban = require('./unban');
let system = require('./system');
let unblock = require('./unblock');
let unallow = require('./unallow');
let block = require('./block');
let allow = require('./allow');
let rcon = require('./rcon');
let reload = require('./reload');
let auth = require('./auth');
let give = require('./give');
let ungive = require('./ungive');
let profils = require('./profils');
let geoip = require('./geoip');
let report = require('./report');
let reports = require('./reports');
let otvet = require('./otvet');
let obote = require('./obote');
let url_ping = require('./url-ping');
let create_acc = require('./create-acc');
let delete_acc = require('./delete-acc');
let banlist = require('./banlist');
let dev = require('./dev');
let server = require('./server');
let online = require('./online');
let ping = require('./ping');
let addserver = require('./addserver');
let delserver = require('./delserver');
let server_rcon = require('./server_rcon');
let install = require('./install');
let rwlogs = require('./rwlogs');
let addlevel = require('./addlevel');
let rconcmdmode = require('./rcon-cmdmode');
let rconempty = require('./rconempty');
let rconstatus = require('./rconstatus');
let rconupload = require('./rconupload');
let rconblallow = require('./rconblallow');

module.exports = [rconblallow, rconupload, rconstatus, rconempty, rconcmdmode, addlevel, rwlogs, install, server_rcon, delserver, addserver, ping, online, server, dev, banlist, delete_acc, create_acc, url_ping, obote, reports, report, otvet, geoip, profils, ungive, give, auth, reload, help, up, down, ban, unban, system, unblock, block, unallow, allow, rcon];