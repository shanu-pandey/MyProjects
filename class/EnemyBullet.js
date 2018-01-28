var EnemyBullet = function (game, x, y) {
};

EnemyBullet.prototype = {
  _x:0,
  _y:0,
  _imgKey:'EnemyBullet',
  _img:null,

  
  init: function (x,y) {
    this._x = x;
    this._y = y;
    this._img = game.make.sprite(this._x, this._y, this._imgKey);
    utils.centerGameObjects([this._img]);
    utils.addExistingMultiple([this._img]);
  },

  preload: function () {

  },

  create: function() {
    // utils.addExistingMultiple([this._img]);
  },

  update:function(){

  },
  SetSpriteScale:function(per){
    this._img.scale.setTo(per);
  }
};
