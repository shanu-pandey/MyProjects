var LevelChooseScene = function () {};

LevelChooseScene.prototype = {
  _nextScene: 'MainGameScene',
  _buttons:{
    "0":{
      button:null,
      buttonImage: "level_1",
      x:624,
      y:1024,
    },
    "1":{
      button:null,
      buttonImage: "level_2",
      x:1424,
      y:1024,
    }
  },
  _bgColor:'#000000',

  init: function () {
    this.logo = game.make.sprite(game.world.centerX, game.world.centerY, 'EaeLogo');
    this.logo.scale.setTo(0.5);
    this.logo.alpha = 0;
    this.logo.anchor.setTo(0.5);

    this._buttons[0].button = game.make.button(this._buttons[0].x, this._buttons[0].y, this._buttons[0].buttonImage, this.button1OnClick, this, 0, 0);
    this._buttons[1].button = game.make.button(this._buttons[1].x, this._buttons[1].y, this._buttons[1].buttonImage, this.button2OnClick, this, 0, 0);
    this._buttons[0].button.scale.setTo(0.75);
    this._buttons[1].button.scale.setTo(0.75);
    this._buttons[0].button.anchor.setTo(0.5);
    this._buttons[1].button.anchor.setTo(0.5);
  },

  button1OnClick:function(){
    choseLevelInd = 1;
    this.StartNextScene();
  },

  button2OnClick:function(){
    choseLevelInd = 2; 
    this.StartNextScene();
  },

  preload: function () {
    // game.add.existing(this.logo);

  },

  create: function() {
    game.stage.backgroundColor = this._bgColor;
    utils.addExistingMultiple([this._buttons[0].button, this._buttons[1].button]);
  },

  StartNextScene: function(){
    game.state.start(this._nextScene); 
  }
};
