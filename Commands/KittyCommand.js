const Command = require('./Command');

const httpagent = require('superagent');

module.exports = class KittyCommand extends Command {
  execute(msg){
    super.execute(msg, "KittyCommand");

    httpagent.get('http://aws.random.cat/meow')
      .end(function(err, res) {
        if (err) {
            msg.reply("serwis nie działa Panie :)");
            return;
        }

        let json = JSON.parse(res.res.text);
        if (!json.file) {
          msg.reply("serwis nie działa Panie :)");
          return;
        }
        msg.reply(json.file);
    })
  }
}
