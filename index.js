const { Client, Intents, MessageEmbed }  = require('Discord.js');

const PingCommand = require('./Commands/PingCommand.js');
const KittyCommand = require('./Commands/KittyCommand.js');
const DebugCommand = require('./Commands/DebugCommand.js');
const SearchCommand = require('./Commands/SearchCommand.js');
const StopCommand = require('./Commands/StopCommand.js');
const QueueCommand = require('./Commands/QueueCommand.js');
const PlayCommand = require('./Commands/PlayCommand.js');
const SkipCommand = require('./Commands/SkipCommand.js');
const NowPlayingCommand = require('./Commands/NowPlayingCommand.js');
const ShufleCommand = require('./Commands/ShufleCommand.js');

const Log = require('./log');

const client = new Client({ intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_VOICE_STATES ]
});

const soundCL_ID = '';
const secret_key = '';

const prefix = '!!';

var serverData = []

client.on('ready', function() {
  Log.info("zalogowano pomyślnie :)")
});

function createServerEntryIfNeeded(guildId){
  if (!serverData[guildId]) {
    serverData[guildId] = {
      queue:[],
      isplaying:false,
      curr_plying:{},
      isconnected:false,
      lastSearch:[]
    }
  }
}

client.on('messageCreate', function(msg) {
  if (msg.content.startsWith(prefix)) {
    let command = msg.content.split(" ")[0].substring(2);

    createServerEntryIfNeeded(msg.guildId);

    switch (command) {

      case "ping":
        new PingCommand().execute(msg);
      break;

      case "kitty":
        new KittyCommand().execute(msg);
      break;

      case "search":
        new SearchCommand(soundCL_ID).execute(msg, serverData[msg.guildId]);
      break;

      case "debug":
        new DebugCommand().execute(msg, serverData[msg.guildId]);
      break;

      case "stop":
        new StopCommand().execute(msg, serverData[msg.guildId]);
      break;

      case "queue":
        new QueueCommand().execute(msg, serverData[msg.guildId]);
      break;

      case "play":
        new PlayCommand(client, serverData[msg.guildId], soundCL_ID).execute(msg);
      break;

      case "next":
      case "skip":
        new SkipCommand(client, serverData[msg.guildId], soundCL_ID).execute(msg);
      break;

      case "nowplaing":
        new NowPlayingCommand(serverData[msg.guildId]).execute(msg);
      break;

      case "shufle":
        new ShufleCommand(serverData[msg.guildId]).execute(msg);
      break;

      default:
        msg.reply("Szefie takiej komendy ni ma :(");
    }
  }
})

client.login(secret_key);
