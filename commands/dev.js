const osu =  require('node-os-utils');
const os = require('os'); 
const tcpp = require('tcp-ping');
const cpu = osu.cpu;
const mem = osu.mem;
module.exports = {
  trigger: /^(?:Developer\s+(?<text>.+)|$)/is,
  handler: async (message, args) => {
  const { text } = args.groups;
  const info = await mem.info();
  const cpuPercentage = await cpu.usage();
  if(text == 'author'){
  message.send(`
  ★ Автор: Степан Коршунов
  ★ Ссылка: vk.com/lucifer2033
  `)
  }
  if(text == 'RWRCON_Dev' && message.user == 359430019) {
  tcpp.ping({ address: 'vk.com' }, function(err, data) {
  message.send(`
  ★ Автор: Степан Коршунов
  ★ Ссылка: vk.com/lucifer2033
  ★ Система:
  Type: ${os.type()}
  Arch: ${os.arch()}
  Platform: ${process.platform}
  Release: ${os.release()} 
  Пинг: ${Math.round(data.avg)}ms
  Cpu: ${cpuPercentage}%
  Общая память: ${info.totalMemMb}MB
  Использовано памяти: ${info.usedMemMb}MB
  Tекущия свободная память: ${info.freeMemMb}MB
  `)
  })
}
}
};