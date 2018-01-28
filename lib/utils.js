var utils = {
  centerGameObjects: function (objects) {
    objects.forEach(function (object) {
      object.anchor.setTo(0.5);
    })
  },

  SetSpriteScale:function(sprite, percentage){
    sprite.scale.setTo(percentage);
  },

  SetObjectScale:function(object, percentage){
    object.SetSpriteScale(percentage);
  },

  zeroAlpha: function (objects) {
    objects.forEach(function (object) {
      object.alpha = 0;
    })
  },

  addExistingMultiple: function (objects) {
    objects.forEach(function (object) {
      game.add.existing(object);
    })
  },

  chainTween: function(t1, t2){
    t1.chain(t2);
  },

  getRandomFrac:function(){
    return game.rnd.frac();
  },

  getRandomInt:function(max){
    return game.rnd.integerInRange(0, max - 1); //  0 <= return <= max - 1
  },

  GetRandomEnemyType:function(){
    // switch(utils.getRandomInt(4)){
    switch(utils.getRandomInt(1)){
      case 0:
        return 'enemy_eighth_02';
        break;
      case 1:
        return 'green_spiral';
        break;
      case 2:
        return 'pulse';
        break;
      case 3:
        return 'purple_square';
        break;
    }
  },

  GetMidPoint:function(set, set1, set2){ // input {x: 15, y: 20}
    set.x = (set1.x + set2.x)/2;
    set.y = (set1.y + set2.y)/2;
  },

  MakePlayer:function(x ,y){
    var player = new Player();
    player.init(x, y);
    return player;
  },

  MakeEnemy:function(type,paths, vertices, index,x,y){
    var enemy = new Enemy();
    enemy.init(type, paths, vertices, index, x,y);
    // enemy.SetPath(paths, index);
    return enemy; 
  },

  MakeRing:function(paths,x,y){
    var ring = new Ring();
    ring.init(paths, x, y);
    // enemy.SetPath(paths, index);
    return ring; 
  },

  // MakeEnemy:function(x ,y){
  //   var en = new Enemy();
  //   en.init(x, y);
  //   return en;
  // },

  GetLevelScale:function(or, inside, outside){
    return (inside.x - or.x)/(outside.x - or.x);
  } 

};
