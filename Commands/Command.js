module.exports = class Command{

  static Log = require('../log.js');

  execute(message, usedCommand){
    Command.Log.info(JSON.stringify(
      {
        Command:usedCommand,
        Requester:message.author.id,
        Guild:message.guild.id,
        ChannelID:message.channel.id
      }
    ))
  }
}
