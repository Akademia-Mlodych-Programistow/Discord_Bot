const Command = require('./Command');

module.exports = class StopCommand extends Command {
  execute(message, guildData){
    super.execute(message, "StopCommand");

    if (guildData.isplaying) {
      guildData.subscription.unsubscribe();
      guildData.player.stop();
      guildData.connection.destroy();

      guildData.curr_plying = {};
      guildData.isplaying = false;
      guildData.isconnected = false;
    }
  }
}
