var Ring = function (game, x, y) {
};

Ring.prototype = {
  _center:{x:0,y:0},
  _x:0,
  _y:0,
  _pathInd:0,
  _pathPercent: 0,
  _moveSpeed: 0.005,
  _type:'Ring',
  _img:null,
  _currentPercentage:0,
  _targetScale:1.85,
  _calledDeath: false,
  _caught: false,
  _missed: false,
  _deathTime:0.01,
  _enable: false,
  _enablePerc: 0.95,
  _recycle: false,
  _deathTolerate:0.05,
  _center:{x:null,y:null},
  _tween:{
    method:{
      linear:Phaser.Easing.Linear.None,
      exp:{
        out:Phaser.Easing.Exponential.out,
        in:Phaser.Easing.Exponential.in,
      }
    },
    disappearSpeed: 200,
  },

  init: function (paths, x, y) {
    this._moveSpeed = ENEMY_SPEED;
    this._center.x = x;
    this._center.y = y;
    this._x = x;
    this._y = y;
    this._paths = paths;
    // ices = vertices;
    this._img = game.make.sprite(this._x, this._y, this._type);

    this.ringAnim = this._img.animations.add('RingPulse');

    utils.centerGameObjects([this._img]);
    utils.addExistingMultiple([this._img]);
    this.SetSpriteScale(0.01);

    this.ringAnim.play(30, true);
  },

  preload: function () {

  },

  create: function() {
    // utils.addExistingMultiple([this._img]);
  },

  update:function(){
    // this._pathPercent += this._moveSpeed;
    // this.UpdateImg();
    // this.UpdateScale();
  },

  Move:function(){
    if(this._pathPercent < (1 + this._deathTolerate) && !this._caught){
      if(!this._enable && this._pathPercent > this._enablePerc){
        this._enable = true;
      }
      this._pathPercent += this._moveSpeed;

      if(this._pathPercent < 1){
        this._x = (WIDTH/2 - this._center.x) * this._pathPercent + this._center.x;
        this._y = (HEIGHT/2 - this._center.y) * this._pathPercent + this._center.y;
      }else{
        this._x = (WIDTH/2 - this._center.x) * 1 + this._center.x;
        this._y = (HEIGHT/2 - this._center.y) * 1 + this._center.y;
      }
      this.UpdateImg();
      
      this.UpdateScale();
    }else if(!this._caught && !this._calledDeath){
      game.time.events.add(Phaser.Timer.SECOND * this._deathTime, this.SelfDestruct, this);
      this._calledDeath = true;
    }
  },

  Caught:function(){
    this._caught = true;
    this._enable = false;
    var caughtTween = game.add.tween(this._img.scale).to({ x:5, y:5}, this._tween.disappearSpeed, this._tween.method.exp.out, true);
    game.add.tween(this._img).to({ alpha:0 }, this._tween.disappearSpeed, this._tween.method.exp.out, true);
    caughtTween.onComplete.add(this.SetRecycle, this);
    // play caught animation
  },

  SelfDestruct:function(){
    if(this){
      this._enable = false;
      this.SetMiss();
      // var tweenDisappear1 = game.add.tween(this._img.scale).to({ x:5, y:5}, this._tween.disappearSpeed, this._tween.method.exp.out, true);
      var tweenDisappear2 = game.add.tween(this._img).to({alpha: 0}, this._tween.disappearSpeed, this._tween.method.exp.out, true);
      tweenDisappear2.onComplete.add(this.SetRecycle, this);
    }
  },

  SetMiss:function(){
    this._missed = true;
  }, 

  SetRecycle:function(){
    this._recycle = true;
  },

  SetPath:function(paths){
    this._paths = paths;

    this._img._alpha = 0.5;
    // set alpha
  },
  UpdateImg:function(){
    this._img.x = this._x;
    this._img.y = this._y;
  },

  UpdateScale:function(){
    this.SetSpriteScale(this._targetScale * this._pathPercent);
  },

  SetSpriteScale:function(per){
    this._img.scale.setTo(per);
  },
};
