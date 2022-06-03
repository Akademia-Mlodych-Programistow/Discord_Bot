const Command = require('./Command');

module.exports = class DebugCommand extends Command {
  execute(message, guildData){
    super.execute(message, "DebugCommand");

    console.log(guildData);
  }
}
