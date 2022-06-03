const Command = require('./Command');

module.exports = class NowPlayingCommand extends Command {

  constructor(guildData){
    super();
    this.guildData = guildData;
  }

  execute(message){
    super.execute(message, "NowPlayingCommand");

    if(Object.keys(this.guildData.curr_plying) != 0){
      message.reply(this.guildData.curr_plying.creator + " " + this.guildData.curr_plying.title);
    }else {
      message.reply("szefie nic nie gram :()");
    }
    
  }
}
