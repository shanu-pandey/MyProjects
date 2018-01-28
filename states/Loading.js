var Loading = function () {};

Loading.prototype = {
  // _nextScene: 'LevelChooseScene',
  _nextScene: 'MainMenuScene',
  _bgColor:'#000000',
  _percentagePosition:{x:WIDTH/2, y:HEIGHT/2 + 250},
  _hintsPos:{
    txt:{x:WIDTH/2, y:HEIGHT - 150},
    sprite:{x:WIDTH/2, y:HEIGHT/2 + 300}
  },
  _hints:[
    {"text": "Stay in the correct lane to catch the yellow ones!", "sprite":null },
    {"text": "Press BASS BAR to capture the blue BASS!", "sprite":null }
  ],
  _hintsInd:0,
  _hintsLength:2,
  loadingLogoPos:{x:WIDTH / 2,y:HEIGHT/2},
  _mag:10,
  _speed:2,

  init: function () {
    this.loadingLogo = game.make.sprite(this.loadingLogoPos.x, this.loadingLogoPos.y, 'player_white');
    this.loadingLogo.scale.setTo(0.3);

    this.hintTxt = game.make.text(this._hintsPos.txt.x, this._hintsPos.txt.y, this._hints[this._hintsInd].text, {font: "100px vector_battleregular", fill: 'white'});
    this.percentageTxt = game.make.text(this._percentagePosition.x, this._percentagePosition.y, '0%', {font: "80px vector_battleregular", fill: 'white'});

    utils.centerGameObjects([this.percentageTxt, this.hintTxt, this.loadingLogo]);
    utils.zeroAlpha([this.percentageTxt, this.hintTxt, this.loadingLogo]);
    this.MakeTween();
    this.hintIn.start();
    this.percentageIn.start();
    this.logoIn.start();
  },

  preload: function () {
    game.stage.backgroundColor = this._bgColor;

    // musicPlayer = game.add.audio('castle');
    // musicPlayer.loop = true;
    // musicPlayer.play();
    // if (musicPlayer.name !== "castle" && gameOptions.playMusic) {
    //   musicPlayer.stop();
    //   musicPlayer = game.add.audio('castle');
    //   musicPlayer.loop = true;
    //   musicPlayer.play();
    // }
    
    // load imgs 
    this.LoadImages();
    this.LoadSpriteSheets();

    this.LoadMusic();

    // Load vid
    this.LoadVideos();
    utils.addExistingMultiple([this.percentageTxt, this.hintTxt, this.loadingLogo]);
  },

  loadUpdate:function(){  
    // update the loading percentage
    this.percentageTxt.setText(this.load.progress + '%');

    this.loadingLogo.angle += Math.abs((this._mag * Math.sin(game.time.now * this._speed)));
  },

  create: function() {
    this.percentageTxt.setText('100%');
    this.percentageOut.start();
    this.logoOut.start();
    this.AddGameStates();
  },

  MakeTween:function(){
    this.logoIn = game.add.tween(this.loadingLogo).to({ alpha: 1 }, this._splashSpeed, Phaser.Easing.Linear.None, false);
    this.logoOut = game.add.tween(this.loadingLogo).to({ alpha: 0 }, this._splashSpeed, Phaser.Easing.Linear.None, false);

    this.percentageIn = game.add.tween(this.percentageTxt).to({ alpha: 1 }, this._splashSpeed, Phaser.Easing.Linear.None, false);
    this.percentageOut = game.add.tween(this.percentageTxt).to({ alpha: 0 }, this._splashSpeed, Phaser.Easing.Linear.None, false);

    this.hintIn = game.add.tween(this.hintTxt).to({ alpha: 1 }, this._splashSpeed, Phaser.Easing.Linear.None, false);
    this.hintOut = game.add.tween(this.hintTxt).to({ alpha: 0 }, this._splashSpeed, Phaser.Easing.Linear.None, false, this._splashDelay * 20);
    utils.chainTween(this.hintIn, this.hintOut);
    this.hintOut.onComplete.add(this.ChangeHint, this);

    this.percentageOut.onComplete.add(this.StartNextScene, this);
  },

  ChangeHint:function(){
    this._hintsInd += 1;
    if(this._hintsInd == this._hintsLength){
      this._hintsInd = 0;
    }
    this.hintTxt.setText(this._hints[this._hintsInd].text);
    this.hintIn.start();
  },

  AddGameStates:function(){
    game.state.add('Loading', Loading);
    game.state.add('MainGameScene', MainGameScene);
  },
  
  LoadMusic:function(){
    game.load.audio('music_0','assets/sounds/Lunar_120BPM.wav');
    game.load.audio('music_1','assets/sounds/MidnightFunk_120BPM.wav');
    game.load.audio('scratch','assets/sounds/RecordScratch.wav');

    this.LoadTracks();
    this.LoadVO();
  },

  LoadVO:function(){
    game.load.audio('vo_groovy','assets/sounds/VO/GroovyBaby.wav');
    game.load.audio('vo_shagadelic','assets/sounds/VO/Shagadelic.wav');
    game.load.audio('vo_yeahbaby','assets/sounds/VO/YeahBaby.wav');
    game.load.audio('vo_losemojo','assets/sounds/VO/ILostMyMojo.wav');

    game.load.audio('vo_dont','assets/sounds/VO/swluke.wav');
  },

  LoadTracks:function(){
    // Lunar
    game.load.audio('music_0_0','assets/sounds/Lunar/Drums.wav');
    game.load.audio('music_0_1','assets/sounds/Lunar/Chords.wav');
    game.load.audio('music_0_2','assets/sounds/Lunar/Chorus.wav');
    game.load.audio('music_0_3','assets/sounds/Lunar/Bell.wav');
    game.load.audio('music_0_4','assets/sounds/Lunar/Lead.wav');
    game.load.audio('music_0_5','assets/sounds/Lunar/Phaser.wav');
    game.load.audio('music_0_6','assets/sounds/Lunar/Snare.wav');
  },

  LoadSpriteSheets:function(){
     game.load.spritesheet('player_audio_spritesheet', 'assets/sprites/PlayerAudiowave_SpriteSheet.png', 145, 145, 13);
     game.load.spritesheet('player_ear_spritesheet', 'assets/sprites/PlayerEars_SpriteSheet.png', 145, 145, 11);
     game.load.spritesheet('player_death', 'assets/images/player/PlayerDeath.png', 552, 362, 45);


     game.load.spritesheet('menu_title_spritesheet', 'assets/images/UI/menu/TitleTextSpritesheet.png', 2048, 2048, 4);

     // enemy beats
     // game.load.spritesheet('Ring', 'assets/images/enemy/tempest_npc_beats_bass_reduced_glowing.png', 1000, 1000, 15);
     game.load.spritesheet('Ring', 'assets/images/enemy/tempest_npc_beats_bassGreen_reduced_glowing.png', 1024, 1024, 30);

     game.load.spritesheet('enemy_eighth_02', 'assets/images/enemy/tempest_npc_beats_eighthnote_02_glowing.png', 350, 350, 9);
     game.load.spritesheet('enemy_full_02', 'assets/images/enemy/tempest_npc_beats_fullnote_03_hueShift_glowing.png', 350, 350, 60);
     game.load.spritesheet('enemy_half_02', 'assets/images/enemy/tempest_npc_beats_halfnote_02_glowing.png', 350, 350, 30);
     game.load.spritesheet('enemy_quart_02', 'assets/images/enemy/tempest_npc_beats_quarternote_02_glowing.png', 350, 350, 15);

     // explosion
     game.load.spritesheet('beats_explosion', 'assets/images/ExplosionSpriteSheet.png', 570, 441, 18);
   
     game.load.spritesheet('dance_spritesheet', 'assets/images/splash/Title_Woman_Spritesheet.png', 512, 512, 60);
     game.load.spritesheet('dance_cheat', 'assets/images/UI/menu/tempest_cheatCode_dancer.png', 1024, 512, 60);

  },


  LoadImages:function(){
    // loading Scene
    this.LoadLevelImgs();
    this.LoadPlayerImgs();
    this.LoadEnemyImgs();
    this.LoadUIImgs();

    // menu sprites
    // game.load.image('menu_bg', 'assets/images/menu/bg2.png');
  },

  LoadUIImgs:function(){
    game.load.image('galaxy_bg', 'assets/images/Galaxy.jpg');

    game.load.image('menu_title', 'assets/images/UI/menu/Title.png');
    game.load.image('menu_start', 'assets/images/UI/menu/Start_Button.png');

    game.load.image('encourage_good', 'assets/images/UI/Good.png');
    game.load.image('encourage_great', 'assets/images/UI/Great.png');
    game.load.image('encourage_excellent', 'assets/images/UI/Excellent.png');
    game.load.image('encourage_miss', 'assets/images/UI/Miss.png');
    game.load.image('ui_score', 'assets/images/UI/Score.png');

    game.load.image('ui_level_complete', 'assets/images/UI/Level_complete.png');
    game.load.image('ui_highscore', 'assets/images/UI/HighScore.png');
    game.load.image('ui_black_overlay','assets/images/black_overlay.png');

    // fail screen
    game.load.image('exit', 'assets/images/UI/failscreen/exit.png');
    game.load.image('retry', 'assets/images/UI/failscreen/retry.png');
    game.load.image('game_over', 'assets/images/UI/failscreen/Game_over.png');
    
    // multiplier sprite
    game.load.image('mult_1', 'assets/images/UI/multiplier/x1.png');
    game.load.image('mult_10', 'assets/images/UI/multiplier/x10.png');
    game.load.image('mult_25', 'assets/images/UI/multiplier/x25.png');
    game.load.image('mult_50', 'assets/images/UI/multiplier/x50.png');

    this.LoadScoreImgs();
  },
  LoadScoreImgs:function(){
    game.load.image('score_0', 'assets/images/UI/score/0.png');
    game.load.image('score_1', 'assets/images/UI/score/1.png');
    game.load.image('score_2', 'assets/images/UI/score/2.png');
    game.load.image('score_3', 'assets/images/UI/score/3.png');
    game.load.image('score_4', 'assets/images/UI/score/4.png');
    game.load.image('score_5', 'assets/images/UI/score/5.png');
    game.load.image('score_6', 'assets/images/UI/score/6.png');
    game.load.image('score_7', 'assets/images/UI/score/7.png');
    game.load.image('score_8', 'assets/images/UI/score/8.png');
    game.load.image('score_9', 'assets/images/UI/score/9.png');
  },

  LoadPlayerImgs:function(){
    // game.load.image('player', 'assets/images/players/ship.png');
    game.load.image('player', 'assets/images/players/PlayerTest_Base_00.png');
    // game.load.image('player_bullet', 'assets/images/player/Player_bullet.png');
  },

  LoadEnemyImgs:function(){
    //Enemy Objects
    // game.load.image('green_spiral', 'assets/images/enemy/Green_Spiral.png');
    // game.load.image('pulse', 'assets/images/enemy/Pulse.png');
    // game.load.image('purple_square', 'assets/images/enemy/Purple_Square.png');
    // game.load.image('red_x', 'assets/images/enemy/Red_X.png');

  },

  LoadLevelImgs:function(){
    game.load.image('level_0', 'assets/images/levels/simple_level_test_01.png');
    //Environment
    game.load.image('level_1', 'assets/images/environment/background1_circle/firstIteration_backgroundCircle_full.png');

    this.LoadLevel1Img();

    game.load.image('level_3', 'assets/images/environment/bg_8Sided_full.png');
    // game.load.image('level_3', 'assets/images/environment/bg_12Sided_full_op2.png');
    // game.load.image('object_2', 'assets/images/levels/object_2.png');
  },

  LoadLevel1Img:function(){
    game.load.image('level_1_back', 'assets/images/environment/level_1/bg_00_colorGradient.jpg');
    game.load.image('level_1_center', 'assets/images/environment/level_1/bg_01_center.png');
    // game.load.image('level_1_ring_1', 'assets/images/environment/level_1/bg_02_ring1.png');
    // game.load.image('level_1_ring_2', 'assets/images/environment/level_1/bg_03_ring2.png');
    // game.load.image('level_1_ring_3', 'assets/images/environment/level_1/bg_04_ring3.png');
    // game.load.image('level_1_ring_4', 'assets/images/environment/level_1/bg_05_ring4.png');

    // pieces
    // game.load.image('level_1_0', 'assets/images/environment/level_1/bg_14_lane09.png');
    // game.load.image('level_1_1', 'assets/images/environment/level_1/bg_13_lane08.png');
    // game.load.image('level_1_2', 'assets/images/environment/level_1/bg_12_lane07.png');
    // game.load.image('level_1_3', 'assets/images/environment/level_1/bg_11_lane06.png');
    // game.load.image('level_1_4', 'assets/images/environment/level_1/bg_10_lane05.png');
    // game.load.image('level_1_5', 'assets/images/environment/level_1/bg_09_lane04.png');
    // game.load.image('level_1_6', 'assets/images/environment/level_1/bg_08_lane03.png');
    // game.load.image('level_1_7', 'assets/images/environment/level_1/bg_07_lane02.png');
    // game.load.image('level_1_8', 'assets/images/environment/level_1/bg_06_lane01.png');
    // game.load.image('level_1_9', 'assets/images/environment/level_1/bg_21_lane16.png');
    // game.load.image('level_1_10', 'assets/images/environment/level_1/bg_20_lane15.png');
    // game.load.image('level_1_11', 'assets/images/environment/level_1/bg_19_lane14.png');
    // game.load.image('level_1_12', 'assets/images/environment/level_1/bg_18_lane13.png');
    // game.load.image('level_1_13', 'assets/images/environment/level_1/bg_17_lane12.png');
    // game.load.image('level_1_14', 'assets/images/environment/level_1/bg_16_lane11.png');
    // game.load.image('level_1_15', 'assets/images/environment/level_1/bg_15_lane10.png');

  },

  LoadVideos:function(){
    // game.load.video('vid_ex','assets/mov/ex.mp4'); 
    game.load.video('vid_BG','assets/mov/BG_Loop_LQ_5min.mp4'); 
    // game.load.video('vid_BG','assets/mov/BG_Loop.mp4'); 
    game.load.video('vid_menu','assets/mov/TitleStars.mp4'); 
  },

  StartNextScene: function(){
    game.state.start(this._nextScene); 
  }
};
