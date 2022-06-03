const Command = require('./Command');

module.exports = class PingCommand extends Command {
  execute(message){
    super.execute(message, "PingCommand");
    
    message.reply(":joy:");
  }
}
