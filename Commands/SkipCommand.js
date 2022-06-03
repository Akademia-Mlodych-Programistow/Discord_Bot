const Command = require('./Command');

const { VoiceConnectionStatus, AudioPlayerStatus, joinVoiceChannel, generateDependencyReport,
  createAudioResource, createAudioPlayer } = require('@discordjs/voice');

const scdl = require('soundcloud-downloader').default;


module.exports = class SkipCommand extends Command {

  constructor(client, guildData, soundCL_ID){
    super();
    this.client = client;
    this.soundCL_ID = soundCL_ID;
    this.guildData = guildData;
  }

  execute(message){
    super.execute(message, "SkipCommand");

    if(this.guildData.queue.length > 0){
      if (!this.guildData.isplaying) {
          this.guildData.queue.shift();
      }else {
          this.guildData.subscription.unsubscribe();
          this.guildData.player.stop();
          this.guildData.connection.destroy();

          this.guildData.curr_plying = {};
          this.guildData.isplaying = false;
          this.guildData.isconnected = false;

          this.join_and_play_music(message);
        }
    }else {
      if (this.guildData.isplaying) {
        this.guildData.subscription.unsubscribe();
        this.guildData.player.stop();
        this.guildData.connection.destroy();
        this.guildData.isplaying = false;

        this.guildData.curr_plying = {};
      }else {
        message.reply('kolego kolejka jest pusta :)');
      }
    }
  }

  connect_to_channel(msg, voice_channel, callback) {
    this.guildData.connection = joinVoiceChannel({
      channelId: voice_channel.id,
      guildId: voice_channel.guild.id,
      adapterCreator: voice_channel.guild.voiceAdapterCreator
    })

    this.guildData.connection.on(VoiceConnectionStatus.Ready, callback);
  }

  join_and_play_music(msg) {
    if (!this.guildData)
      return;

    this.guildData.isplaying = true;

    const Guild = this.client.guilds.cache.get(msg.guildId);
    const Memeber = Guild.members.cache.get(msg.author.id);

    let voice_channel = Memeber.voice.channel;

    if (voice_channel) {
      Command.Log.debug("tworze połączenie " + voice_channel.id);

      if (!this.guildData.isconnected){

        this.connect_to_channel(msg, voice_channel, () => {
          this.guildData.isconnected = true;
          this.play(msg)
        });
      }else
        this.play(msg);
    }
  }

  play(msg) {
    const connection = this.guildData.connection;

    Command.Log.debug("CreateAudioPlayer()");

    this.guildData.player = createAudioPlayer();
    const player = this.guildData.player;

    Command.Log.debug("Linking AudioPlayer()");
    this.guildData.subscription = connection.subscribe(player);
    const subscription = this.guildData.subscription;

    player.on(AudioPlayerStatus.Idle, () => {
      subscription.unsubscribe();
      player.stop();

      if (this.guildData.queue.length > 0) {
        Command.Log.debug("Playing next song");
        this.join_and_play_music(msg);

      }else {
        Command.Log.debug("Connection destroy: " + msg.guildId);
        connection.destroy();

        this.guildData.curr_plying = {};
        this.guildData.isconnected = false;
        this.guildData.isplaying = false;
      }
    });

    let song = this.guildData.queue.shift();
    this.guildData.curr_plying = song;

    scdl.download(song.url, this.soundCL_ID).then(stream => {
      let resource = createAudioResource(stream);

      Command.Log.debug("Playing song on : " + msg.guildId);
      player.play(resource);
    });
  }
}
