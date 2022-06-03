const Command = require('./Command');

const { MessageEmbed }  = require('Discord.js');

var scSearch = require("soundcloud-search-core");

module.exports = class SearchCommand extends Command {

  constructor(soundCL_ID){
    super();
    this.scSearch = new scSearch(soundCL_ID);
  }

  execute(msg, guildData){
    super.execute(msg, "SearchCommand");

    var query = msg.content.substring(9);

    this.scSearch.tracks(query, 5).then(tracks => {
      const exampleEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Wyniki dla ' + query)
        .setTimestamp();

        var search_result = [];

        for (var i = 0; i < tracks.length; i++) {
          exampleEmbed.addField((i+1) + ". " + tracks[i].title, tracks[i].user.username);

          search_result[i] = {
            title:tracks[i].title,
            creator:tracks[i].user.username,
            url:tracks[i].permalink_url
          }
        }

      msg.channel.send({ embeds: [exampleEmbed] });
      guildData.lastSearch = search_result;
    });
  }
}
