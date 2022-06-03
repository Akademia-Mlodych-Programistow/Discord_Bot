const Command = require('./Command');

const { MessageEmbed }  = require('Discord.js');

module.exports = class QueueCommand extends Command {
  execute(msg, guildData){
    super.execute(msg, "QueueCommand");

    if (!guildData){
      msg.reply("Sznowny Panie serwer nie ma kolejki.")
      return;
    }

    var page = msg.content.substring("queue".length + 3);
    //console.log(page);
    const exampleEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Kolejka')
      .setTimestamp()

    var search_result = []

    const tracks = guildData.queue

    if (guildData.isplaying) {
      let track = guildData.curr_plying;

      exampleEmbed.addField("Now playing: " + track.title, track.creator);
    }

    for (var i = 0; i < Math.min(tracks.length, 10); i++)
      exampleEmbed.addField((i+1) + ". " + tracks[i].title, tracks[i].creator);

    if (tracks.length > 10)
      exampleEmbed.addField("Szefie kolejka ma ponad 10 utworów, dodaj liczbę by wyświelać kolejne strony :)");

    msg.channel.send({ embeds: [exampleEmbed] });
  }
}
