var Splash = function () {};

Splash.prototype = {
  // _nextScene: 'LevelChooseScene',
  _nextScene: 'Loading',
  _splashSpeed: 1000,
  _splashDelay: 2000,
  _bgColor:'#000000',

  init: function () {
    this.logo       = game.make.sprite(game.world.centerX + 55, game.world.centerY, 'EaeLogo');
    this.logo.alpha = 0;

    utils.centerGameObjects([this.logo]);
    this.MakeTween();
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
    
    utils.addExistingMultiple([this.logo]);
  },

  create: function() {
    this.fadeLogoIn.start();

  },

  

  MakeTween:function(){
    this.fadeLogoIn = game.add.tween(this.logo).to({ alpha: 1 }, this._splashSpeed, Phaser.Easing.Linear.None,false);
    this.fadeLogoOut = game.add.tween(this.logo).to({ alpha: 0 }, this._splashSpeed, Phaser.Easing.Linear.None, false, this._splashDelay); 
    this.fadeLogoOut.onComplete.add(this.StartNextScene, this);

    utils.chainTween(this.fadeLogoIn, this.fadeLogoOut); 
  },

  StartNextScene: function(){
    game.state.start(this._nextScene); 
  }
};
