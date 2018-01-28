var MainMenuScene = function() {};

MainMenuScene.prototype = {
  _nextScene: 'LevelChooseScene',
  _var:null,
  _logo:{
    position:{x: 1024,y:1224},
    tween:{
      speed: 2000,
    }
  },
  _button:{
    buttonImage: "menu_start",
    position:{x: 1024,y:1550}
  },
  _tween:{
    speed: 1000,
    method:{
      linear:Phaser.Easing.Linear.None,
      exp:{
        out:Phaser.Easing.Exponential.Out,
        in:Phaser.Easing.Exponential.In,
        inout:Phaser.Easing.Exponential.InOut
      }
    }
  },
  _bgVidName:"vid_menu",
  _nextScene:"MainGameScene",
   _keyPress_1:false,
  _keyPress_0:false,
  _keyPress_p:false,
  _keyPress_e:false,
  _keyPress_s:false,
  _keyPress_t:false,
  _activated:false,

  init: function () {
    // set param to Json setting
    this.loadJson();

    this._bgVid = game.add.video(this._bgVidName);
    this._bgVid.play(true);
    this._bgVid.addToWorld(WIDTH/2, HEIGHT/2, 0.5, 0.5, 1, 1);

    // alpha no need to be 0
    // this.logo = game.make.sprite(this._logo.position.x, this._logo.position.y, 'menu_title');
    this.logo = game.make.sprite(this._logo.position.x, this._logo.position.y, "menu_title_spritesheet");
    this.logo.scale.setTo(0.001);
    this.titleAnim = this.logo.animations.add('Blink'); 

    this.startButton = game.make.button(this._button.position.x, this._button.position.y, this._button.buttonImage, this.buttonOnClick, this, 0, 0);
    this.startButton.scale.setTo(0.5);

    this.galaxyBG = game.make.sprite(WIDTH/2, HEIGHT/2, "galaxy_bg");

    this._danceCheat = game.add.sprite(1024,1094, 'dance_cheat');
    this._danceCheatAnim = this._danceCheat.animations.add('dance_cheat');
    // set anchor and alpha
    utils.centerGameObjects([this.logo, this.startButton, this.galaxyBG]);
    utils.zeroAlpha([this.startButton, this.galaxyBG, this._danceCheat]);

    this._dance = game.add.sprite(1024, 984, 'dance_spritesheet');
    utils.centerGameObjects([this._dance, this._danceCheat]);
  },

  preload: function () {
    utils.addExistingMultiple([this.logo, this.startButton]);

    this.titleAnim.play(60, true);

    // make tweens
    this.makeStartTween();
    this.makeEndTween();
    utils.addExistingMultiple([this.galaxyBG, this._danceCheat]);
  },


  create: function () {
  	var danceAnim = this._dance.animations.add('dance');
	
  	utils.addExistingMultiple([this._dance]);
    this.disableButton();

    menuPlayer = game.add.audio('music_1');
    menuPlayer.loop = true;
    menuPlayer.fadeIn(1000);
    // musicPlayer = game.add.audio('castle');
    // musicPlayer.loop = true;
    // musicPlayer.play();
    // if (musicPlayer.name !== "castle" && gameOptions.playMusic) {
    //   musicPlayer.stop();
    //   musicPlayer = game.add.audio('castle');
    //   musicPlayer.loop = true;
    //   musicPlayer.play();
    // }
  	danceAnim.play(30, true);
  	this._keyPress_1 = false;
    this._keyPress_0 = false;
    this._keyPress_p = false;
    this._keyPress_e = false;
    this._keyPress_s = false;
    this._keyPress_t = false;

    VOPlayer = game.add.audio("vo_dont");
    VOPlayer.volume = 2;
    VOPlayer.loop = false;
  },

  update:function() {
	  if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || game.input.keyboard.isDown(Phaser.Keyboard.B))
      {
        if(this.startButton.inputEnabled){
          this.buttonOnClick();
        }
      }
	  
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
	  
	  if (this._keyPress_1 && this._keyPress_0 && this._keyPress_p && this._keyPress_e && this._keyPress_s && this._keyPress_t && !this._activated){
      this.ActivateCheat();
    }

  },
 
  ActivateCheat:function(){
    lives = 100;
    this._activated = true;
    this._danceOut.start();
    this._danceCheatIn.start();
    this._danceCheatAnim.play(30,true);
    VOPlayer.fadeIn(100);
  },
 makeStartTween:function(){
    this._danceOut = game.add.tween(this._dance).to({alpha: 0}, 500, this._tween.method.exp.in, false);
    this._danceCheatIn = game.add.tween(this._danceCheat).to({alpha: 1}, 500, this._tween.method.exp.in, false);

    // tween in all bunch of stuff
    this.logoIn = game.add.tween(this.logo.scale).to({x:1, y:1}, this._logo.tween.speed, this._tween.method.exp.inout, true);
    this.logoIn.onComplete.add(this.StartButtonBlink, this);

    this.buttonIn = game.add.tween(this.startButton).to({alpha:1}, this._tween.speed, this._tween.method.linear, false);
    this.buttonOut = game.add.tween(this.startButton).to({alpha:0}, this._tween.speed, this._tween.method.linear, false);
    this.buttonIn.chain(this.buttonOut);
    this.buttonOut.chain(this.buttonIn);

    this.videoSpeedUp = game.add.tween(this._bgVid).to({playbackRate: 200}, 2000, this._tween.method.exp.in, false);
    this.videoSpeedUp.onComplete.add(this.startBlackBG,this);

    // game.add.tween(this.mother_son).to({x:1070, alpha:1}, this.tween.speed, this.tween.method, true, this.tween.delay);
    // game.add.tween(this.old_lady).to({x:1474, alpha:1}, this.tween.speed, this.tween.method, true, this.tween.delay * 2);
    // this.girlIn = game.add.tween(this.girl2).to({x:469, alpha:1}, this.tween.speed, this.tween.method, true, this.tween.delay * 2);
  },

  makeEndTween:function(){
    this.galaxyIn = game.add.tween(this.galaxyBG).to({alpha: 1}, this._tween.speed * 2, this._tween.method.exp.in, false);
    this.galaxyIn.onComplete.add(this.StartNextScene, this);

    this.logoOut = game.add.tween(this.logo).to({alpha:0}, this._logo.tween.speed, this._tween.method.exp.inout, false);
    this.buttonOut2 = game.add.tween(this.startButton).to({alpha:0}, this._tween.speed, this._tween.method.linear, false);
  },

  StartButtonBlink:function(){
    this.buttonIn.start();
    this.enableButton();
  },

  enableButton:function(){
    this.startButton.inputEnabled = true; 
  },

  disableButton:function(){
    this.startButton.inputEnabled = false; 
  },

  buttonOnClick:function(){
    this.disableButton();

    this.tweenOutEverything();

    menuPlayer.fadeOut(2000);
    this.videoSpeedUp.start();

  },

  startBlackBG:function(){
    this.galaxyIn.start();
  },

  tweenOutEverything:function(){
    this.logoOut.start();
    this.buttonIn.stop();
    this.buttonOut.stop();
    this.buttonOut2.start();
  },

  StartNextScene: function(){
    choseLevelInd = 3;
    game.state.start(this._nextScene); 
  },

  loadJson:function(){

  }
};
