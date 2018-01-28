var Enemy = function (game, x, y) {
};

Enemy.prototype = {
  center:{x:0,y:0},
  _x:0,
  _y:0,
  _isOnEdge:false,
  _paths: null,
  _pathInd: null,
  _pathPercent: 0,
  _moveSpeed: 0.005,
  _type:'enemy',
  _img:null,
  _currentPercentage:0,
  _targetScale:1,
  _calledDeath: false,
  _caught: false,
  _missed: false,
  _deathTime:0.01,
  _enable: false,
  _enablePerc: 0.90,
  _recycle: false,
  _deathTolerate:0.05,
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

  init: function (enemyType, paths, vertices, pathsInd, x, y) {
    this._moveSpeed = ENEMY_SPEED;
    this._type = enemyType;
    this.center.x = x;
    this.center.y = y;
    this._x = x;
    this._y = y;
    // this._x = paths[pathsInd].end.x;
    // this._y = paths[pathsInd].end.y;
    this._paths = paths;
    this._vertices = vertices;
    this._pathInd = pathsInd;

    this._img = game.make.sprite(this._x, this._y, this._type);
    this._imgAnim = this._img.animations.add('Pulse');


    utils.centerGameObjects([this._img]);
    utils.addExistingMultiple([this._img]);
    this.SetSpriteScale(0.01);
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
        this._x = (this._paths[this._pathInd].end.x - this.center.x) * this._pathPercent + this.center.x;
        this._y = (this._paths[this._pathInd].end.y - this.center.y) * this._pathPercent + this.center.y;
      }else{
        this._x = (this._paths[this._pathInd].end.x - this.center.x) * 1 + this.center.x;
        this._y = (this._paths[this._pathInd].end.y - this.center.y) * 1 + this.center.y;
      }
      this.UpdateImg();
      this.UpdateScale();
    }else if(!this._caught && !this._calledDeath){
      game.time.events.add(Phaser.Timer.SECOND * this._deathTime, this.SelfDestruct, this);
      this._calledDeath = true;
    }
  },

  Caught:function(){
    // play caught animation
    this._explosion = game.make.sprite(this._x, this._y, "beats_explosion")
    this._explosion.scale.setTo(2);
    utils.addExistingMultiple([this._explosion]);
    utils.centerGameObjects([this._explosion]);
    this._exploAnim = this._explosion.animations.add('Explose');
    this._exploAnim.play(60, false);

    this._caught = true;
    this._enable = false;
    // var caughtTween = game.add.tween(this._img.scale).to({ x:10, y:10}, this._tween.disappearSpeed, this._tween.method.exp.out, true);
    var outTween = game.add.tween(this._img).to({ alpha:0 }, this._tween.disappearSpeed, this._tween.method.exp.out, true);
    outTween = game.add.tween(this._explosion).to({ alpha:0 }, this._tween.disappearSpeed * 2, this._tween.method.exp.out, true);
    outTween.onComplete.add(this.SetRecycle, this);
    // caughtTween.onComplete.add(this.SetRecycle, this);

  },

  SelfDestruct:function(){
    if(this){
      this._enable = false;
      this.SetMiss();
      var tweenDisappear1 = game.add.tween(this._img.scale).to({ x:0.01, y:0.01}, this._tween.disappearSpeed, this._tween.method.exp.out, true);
      var tweenDisappear2 = game.add.tween(this._img).to({alpha: 0}, this._tween.disappearSpeed, this._tween.method.exp.out, true);
      tweenDisappear1.onComplete.add(this.SetRecycle, this);
    }
  },

  SetMiss:function(){
    this._missed = true;
  }, 

  SetRecycle:function(){
    this._recycle = true;
    // this._img.destroy();
    // this._parentList.remove(this);
  },

  SetRotation:function(){
    // angleOffset = 3.1415926/2;
    angleOffset = 0;
    var next = this._pathInd + 1;
    if(this._pathInd + 1 > this._vertices.length - 1){
      next = 0;
    }
    this._img.rotation = game.math.angleBetween(this._vertices[this._pathInd].out.x, this._vertices[this._pathInd].out.y, 
      this._vertices[next].out.x, this._vertices[next].out.y) + angleOffset;
    // this._img.rotation = game.math.angleBetween(this._paths[this._pathInd].start.x, this._paths[this._pathInd].start.y, 
    // this._paths[this._pathInd].end.x, this._paths[this._pathInd].end.y) + angleOffset;
  },

  SetPath:function(paths, pathsInd){
    this._imgAnim.play(60, true);
    this._paths = paths;
    this._pathInd = pathsInd;
    this.SetRotation();
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
