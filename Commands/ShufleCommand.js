const Command = require('./Command');

module.exports = class ShufleCommand extends Command {

  constructor(guildData){
    super();
    this.guildData = guildData;
  }

  execute(message){
    super.execute(message, "ShufleCommand");
    //this.guildData.queue.sort(() => Math.random() - 0.5)
    let index = this.guildData.queue.length

    while (0 !== index) {
      let randPos = Math.floor(Math.random() * index);

      index--;

      let temp = this.guildData.queue[index];

      this.guildData.queue[index] = this.guildData.queue[randPos];
      this.guildData.queue[randPos] = temp;
    }
  }
}
