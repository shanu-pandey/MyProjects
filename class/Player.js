var Player = function () {};

Player.prototype = {
  _x:0,
  _y:0,
  _imgKey:'player',
  _img:null,
  _stretching:false,
  _stretchDuration:0.1,
  _scaleAmount:1,
  _baseScale:0.01,
  _targetScale:0.3,
  _spritesheetBaseScale:0.07,
  _spritesheetTargetScale:2.13,
  _audiowaveSprite:null,
  _audiowaveSpriteName:'player_audio_spritesheet',
  _earSprite:null,
  _earSpriteName:'player_ear_spritesheet',
  _deathSprite:null,
  _deathSpriteName:'player_death',
  
  init: function (x,y) {
    this._x = x;
    this._y = y;
    this._img = game.make.sprite(this._x, this._y, this._imgKey);

    // animation
    this._audiowaveSprite = game.make.sprite(this._x, this._y, this._audiowaveSpriteName);
    this.waveAnim = this._audiowaveSprite.animations.add('WavePulse'); // when hit enemy

    this._earSprite = game.make.sprite(this._x, this._y, this._earSpriteName);
    this.earAnim = this._earSprite.animations.add('EarPulse'); // when catch the circle (bass)

    this._deathSprite = game.make.sprite(this._x, this._y, this._deathSpriteName);
    this.deathAnim = this._deathSprite.animations.add('Death'); 

    utils.zeroAlpha([this._deathSprite]);
    utils.centerGameObjects([this._audiowaveSprite, this._earSprite, this._deathSprite, this._img]);
    utils.addExistingMultiple([this._audiowaveSprite, this._img, this._earSprite, this._deathSprite]);
  },

  preload: function () {

  },

  create: function() {
    // utils.addExistingMultiple([this._img]);
  },

  update:function(){

  },

  PlayDeathAnim:function(){
    this._img.alpha = 0;
    this._earSprite.alpha = 0;
    this._audiowaveSprite.alpha = 0;
    this._deathSprite.alpha = 1;
    game.add.tween(this._deathSprite.scale).to({x:2, y:2 }, 1500,Phaser.Easing.Exponential.Out, true);
    this.deathAnim.play(60, false);
  },

  PlayEarAnim:function(){
    this.earAnim.play(60, false);
  },

  PlayWaveAnim:function(){
    this.waveAnim.play(60, false);
  },


  // Destroy:function(){
  //   this._img.destroy();
  // }
  Rotate:function(p1 , p2){
    this._img.rotation = game.math.angleBetween(p1.x,p1.y,p2.x,p2.y)
    this._audiowaveSprite.rotation = game.math.angleBetween(p1.x,p1.y,p2.x,p2.y)
    this._earSprite.rotation = game.math.angleBetween(p1.x,p1.y,p2.x,p2.y)
    this._deathSprite.rotation = game.math.angleBetween(p1.x,p1.y,p2.x,p2.y)
  },

  Respawn:function(){
    this._img = game.make.sprite(this._x, this._y, this._imgKey);
  },

  CheckStretching:function(){
    if(this._stretching){
      var speed = 0.05;
      var magnitude = 0.08;
      this._img.scale.setTo(
        this._targetScale + magnitude * Math.sin(game.time.now * speed),
        this._targetScale + magnitude * Math.cos(game.time.now * speed)
      );
      this._audiowaveSprite.scale.setTo(
        this._spritesheetTargetScale + magnitude * Math.sin(game.time.now * speed),
        this._spritesheetTargetScale + magnitude * Math.cos(game.time.now * speed)
      );
      this._earSprite.scale.setTo(
        this._spritesheetTargetScale + magnitude * Math.sin(game.time.now * speed),
        this._spritesheetTargetScale + magnitude * Math.cos(game.time.now * speed)
      );

    }
  },

  TurnOffStretch:function(){
    this._stretching = false;
    this.SetSpriteScale(this._targetScale);
    this._audiowaveSprite.scale.setTo(this._spritesheetTargetScale);
    this._earSprite.scale.setTo(this._spritesheetTargetScale);
    // this._img.scale.setTo(this._scaleAmount);
  },
  
  Move:function(set, ind){
    this._x = set[ind].end.x;
    this._y = set[ind].end.y;
    this._img.x = set[ind].end.x;
    this._img.y = set[ind].end.y;
    this._audiowaveSprite.x = set[ind].end.x;
    this._audiowaveSprite.y = set[ind].end.y;
    this._earSprite.x = set[ind].end.x;
    this._earSprite.y = set[ind].end.y;
    this._deathSprite.x = set[ind].end.x;
    this._deathSprite.y = set[ind].end.y;
  },

  SetSpriteScale:function(per){
    this._img.scale.setTo(per);
  }
};
