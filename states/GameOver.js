var GameOver = function () {};

GameOver.prototype = {
  _exitSprite:null,
  _retrySprite:null,
  _gameOverSprite:null,
  _background:null,
  _player:null,
  _splashSpeed: 200,
  _splashDelay: 200,
  _bgColor:'#535456',
  _option: "retry",
  _video: null,
  _keyPress_1:false,
  _keyPress_0:false,
  _keyPress_p:false,
  _keyPress_e:false,
  _keyPress_s:false,
  _keyPress_t:false,

  init: function () {
	//game.state.remove("MainGameScene");
    // this.logo = game.make.sprite(game.world.centerX, game.world.centerY, 'EaeLogo');
    // this.logo.alpha = 0;
    // this.logo.anchor.setTo(0.5);
    // this.MakeTween();
  },

  preload: function () {    

  },

  create: function() {
	// game.state.add('MainGameScene', MainGameScene);
    // game.stage.backgroundColor = this._bgColor;
    // this.fadeLogoIn.start();
	this.AddVideo();
	this._retrySprite = game.add.sprite(500, 1000, 'retry');
	this._exitSprite = game.add.sprite(1500, 1000, 'exit');
	this._gameOverSprite = game.add.sprite(1000, 500, 'game_over');
	this._player = game.add.sprite(470, 1250, 'player_white');
	this._background = game.add.sprite(0,0, 'game_over_background');
	this._exitSprite.anchor.setTo(0.5, 0.5);
	this._exitSprite.scale.setTo(1.5);
	this._retrySprite.anchor.setTo(0.5, 0.5);
	this._retrySprite.scale.setTo(1.5);
	this._gameOverSprite.anchor.setTo(0.5, 0.5);
	this._gameOverSprite.scale.setTo(2);
	this._player.anchor.setTo(0.5, 0.5);
	this._player.scale.setTo(0.35);
	this._keyPress_1 = false;
    this._keyPress_0 = false;
    this._keyPress_p = false;
    this._keyPress_e = false;
    this._keyPress_s = false;
    this._keyPress_t = false;
  },

  update: function(){
	   if (game.input.keyboard.isDown(Phaser.Keyboard.ONE))
		  this._keyPress_1 = true;
      
	  if (game.input.keyboard.isDown(Phaser.Keyboard.ZERO))
		  this._keyPress_0 = true;
      
	  if (game.input.keyboard.isDown(Phaser.Keyboard.P))
		  this._keyPress_p = true;
      
	  if (game.input.keyboard.isDown(Phaser.Keyboard.E))
		  this._keyPress_e = true;
      
	  if (game.input.keyboard.isDown(Phaser.Keyboard.S))
		  this._keyPress_s = true;
      
	  if (game.input.keyboard.isDown(Phaser.Keyboard.T))
		  this._keyPress_t = true;
	  
	  if (this._keyPress_1 && this._keyPress_0 && this._keyPress_p && this._keyPress_e && this._keyPress_s && this._keyPress_t)
		  lives = 100;
	  
	  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
      {
		if (this._player.x != 470)
		{
			this._player.x = 470;
			this._option = "retry";
		}
      }	  

	  else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
      {
		  if (this._player.x != 1470)
		  {			  
			  this._player.x = 1470;
			  this._option = "exit";
		  }
      }
	  
	  if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || game.input.keyboard.isDown(Phaser.Keyboard.B))
	  {
		  if (this._option == "retry")
			  this.Retry();
		  else if (this._option == "exit")
			  this.Exit();
	  }
  },
  
  AddVideo:function(){
    this._video = game.add.video('vid_BG');
    this._video.play(true);
    this._video.addToWorld(WIDTH/2, HEIGHT/2, 0.5, 0.5, 1, 1);
  },

  // MakeTween:function(){
    // this.fadeLogoIn = game.add.tween(this.logo).to({ alpha: 1 }, this._splashSpeed, Phaser.Easing.Linear.None);
    // this.fadeLogoOut = game.add.tween(this.logo).to({ alpha: 0 }, this._splashSpeed, Phaser.Easing.Linear.None, false, this._splashDelay); 
    // utils.chainTween(this.fadeLogoIn,this.fadeLogoOut);
    // //this.fadeLogoOut.onComplete.add(this.StartNextScene, this);
  // },
  
  Retry: function(){
	  next = "MainGameScene";
	  game.state.start(next); 
  },
  
  Exit: function(){
	  next = "MainMenuScene";
	  game.state.start(next); 
  },
};
