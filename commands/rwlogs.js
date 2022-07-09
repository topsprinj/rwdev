module.exports = {
  trigger: /^(?:RW-LOGS)/is,
  handler: async (message, args, vk) => {
    if(message.user == 359430019){
    if(message.isChat){
    let url = await vk.api.docs.getMessagesUploadServer({type: 'doc',peer_id: 2000000000 + message.chatId});
    return message.sendDocuments(
    {
    value: url.upload_url,
    filename: `../logs/dev.log`
    },
    {
    message: 'Debug Logs'
    }
    ); 
}}
  }
};