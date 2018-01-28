var MainGameScene = function () {};
var spacePress;

MainGameScene.prototype = {
  _nextScene: 'GameOver',
  _scoreBase:100,
  _scoreShaking: false,
  _multiplier:1,
  _multiplierSprite:null,
  _multTargetScale: 2.8,
  _multInitScale:6, 
  _multDelay:600,
  _multiplierOffset:-50,
  _multiplierInd: 0,
  _multiplierSprite:[],
  _multiplierThresh:[
    {combo: 10, mult: 10},
    {combo: 25, mult: 25},
    {combo: 45, mult: 50},
    {combo: 450, mult: 1000},
  ],
  _bassStart:8000,
  _bassInd:{
    ind_00:0,
    ind_75:0
  },
  _comboStreak:0,
  _ui:{
    levelCompletePos:{x: 1024, y:650},
    highscorePos:{x: 1024, y: 1500},
    good:null,
    great:null,
    excellent:null,
    miss:null,
    excellentIn:[],
    excellentScaleIn:[],
    missIn:[],
    missScaleIn:[],
    baseScale:0.1,
    targetScale:1.1,
    tween:{
      speed:200
    },
    score:{
      sprite:null,
      x: WIDTH/2 - 200,
      y: 75
    },
    digitsNum:7,
    digitScale:1.85,
    digitPos:[
      {x:WIDTH/2 -300, y:75},
      {x:WIDTH/2 -200, y:75},
      {x:WIDTH/2 -100, y:75},
      {x:WIDTH/2 , y:75},
      {x:WIDTH/2 + 100, y:75},
      {x:WIDTH/2 + 200, y:75},
      {x:WIDTH/2 + 300, y:75},
    ], 
    digitPosAfter:[
      {x:WIDTH/2 -450, y:HEIGHT/2 + 90},
      {x:WIDTH/2 -300, y:HEIGHT/2 + 90},
      {x:WIDTH/2 -150, y:HEIGHT/2 + 90},
      {x:WIDTH/2 , y:HEIGHT/2 + 90},
      {x:WIDTH/2 + 150, y:HEIGHT/2 + 90},
      {x:WIDTH/2 + 300, y:HEIGHT/2 + 90},
      {x:WIDTH/2 + 450, y:HEIGHT/2 + 90},
    ], 
    scoreArray:[]
  },
  _level:{
    bitMap:null,
    bitMapBG:null,
    bg:[],
    size:null,
    totalPieces: null,
    ind:1,
    loop:null,
  	backgroundPieces:null,
    center:{x:0,y:0},
    img:null,
  	imgArray: null,
    tweenIn:null,
    startShakingBeats:16,
    shaking:false,
    tween:{
      speed:1000,
      method:Phaser.Easing.Back.Out
    },
    info:{
      vertices:null,
      paths:null
    }
  },
  _tween:{
    method:{
      linear:Phaser.Easing.Linear.None,
      exp:{
        out:Phaser.Easing.Exponential.Out,
        in:Phaser.Easing.Exponential.In,
      },
      back:{
        out:Phaser.Easing.Back.Out
      }
    }
  },
  _timer:{
    timeStamp:0,
    startTime:null,
    now:null,
    secondsPerBeat:null,
    beatsPast:0,
    previousBeat: -1,
    secondsPast: 0,
    minutesPast: 0
  },
  _timeToChange:null,
  _activeSpritesList:null,
  _music:{
    "key":null,
    "ind":0,
    "length":null,
    "bpm":null,
    "fourBeatsTime":null,
    "track_num":null,
    "track_spawn_list":null,
    "track_spawn_list_length":null,
    "track_spawn_list_ind":0,
    "prepare_beats":4,
    "startDelay":1,
  },
  _imgName:null,
  _lives:null,
  //_bgColor:'#2b2d30',
  _bgColor:'#000000',
  _player:null,
  _playerClone:null,
  _playerAlive: true,
  _playerPreviousInd:-1,
  _playerInd: 7,
  _cloneInd: 7,
  _playerScale:0.2,
  _playerBullets:null,
  _playerBulletSpeed:500,
  _playerMoveSpeed:3,
  _playerMoveCount:0,
  _ringList:[],
  _enemyList:[],
  _enemyRecycleList:[],
  _enemyGroup:null,
  _enemySpritesGroup:null,
  _enemy:null, // only one for testing now
  _bgVid:null,
  _bgVidName:'vid_BG',
  // _bgVidName:'vid_ex',
  _lineColor:'0xffd900',
  _graphic:null,
  _scoreCount: 0,
  _beatsMiss: 1,
  // _beatsMiss: 10,
  _livesDigit:2,
  _livesDigitPos:[
    {x:60, y:75},
    {x:160, y:75},
    {x:260, y:75}
  ], 
  _livesArray:[],
  _scoreDisplay:null,
  _keypressCounter: 0,
  _controller: null,
  _triggerPress: true,

  init: function () {
    this.blackOverlay = game.make.sprite(WIDTH/2, HEIGHT/2, "ui_black_overlay");

    this.galaxyBG = game.make.sprite(WIDTH/2, HEIGHT/2, "galaxy_bg");

    this._graphic = game.add.graphics(0, 0);
    this._level.ind = choseLevelInd;
    this.LoadJson();
    this.CalNormEnemySpeed();

    this.MakeLevelImage();
    this.SetLevelInfo();

    utils.centerGameObjects([this.galaxyBG, this.blackOverlay]);
    utils.zeroAlpha([this.blackOverlay]);
  	this._beatsMiss = lives;
    if(lives == 100){
      this._livesDigit = 3;
    }
  },

  preload: function () {
    this._beatsOffset = -(this._music.prepare_beats * this._timer.secondsPerBeat * 1000);
  },

  create: function() {
    this.SpawnDummyRingsBeats(); // for fixing delay

    this.FixSpawnTime();
    game.stage.backgroundColor = this._bgColor;

    this.AddBGVid();

    // utils.addExistingMultiple([this._level.img]);
    //utils.addExistingMultiple([this._level.img]);
  	this.DrawBackground();
	
    this.CreatePlayer();
  	//this.CreateClone();
    this.MakeTween();
    this.PlayStartingTweens();

    // utils.addExistingMultiple([enemy]);
    // this.EnablePhysics();

  	this._scoreDisplay = game.add.text(120, 75, ".", {
        font: "normal 1px vector_battleregular",
        fill: "#FFFFFF",
        align: "center"
    });

    // controls	
  	right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    right.onDown.add(this.RightPress, this);
    left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    left.onDown.add(this.LeftPress, this);

  	down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    down.onDown.add(this.UpDownPress, this);
  	up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    up.onDown.add(this.UpDownPress, this);

    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.RIGHT);
    game.input.keyboard.removeKeyCapture(Phaser.Keyboard.LEFT);
  	game.input.keyboard.removeKeyCapture(Phaser.Keyboard.DOWN);
  	game.input.keyboard.removeKeyCapture(Phaser.Keyboard.UP);
  	
  	game.input.gamepad.start();
	
  	this._controller = game.input.gamepad.pad1;
    // this._timer.startTime = game.time.now;

    utils.addExistingMultiple([this.blackOverlay]);
    this.MakeDigitsArray();
    this.AddMultiplierSprites();

    utils.addExistingMultiple([this._ui.good, this._ui.great, this._ui.excellent, this._ui.miss]); //, this._ui.score.sprite]);
    utils.addExistingMultiple([this.galaxyBG, this.levelComplete, this.highscore]);

    game.time.events.add(Phaser.Timer.SECOND * this._music.startDelay, this.StartMusic, this);
    // this.StartMusic();
  },

  shutdown: function() {
     game.world.removeAll();
  },

  update:function(){
    // this.CheckMusicTime();

    this.CheckEnemyRecycle();
    // this.SelfDestroyPlayerBullets();

    // this.DrawLine();  // disable draw line for now
    
  	// this.LoadScore(); // put score indicator

    if(this._playerAlive){
      this.CheckLives();
      this.CheckLevelShaking();
      this.UpdatePlayer();
  	  // this.UpdatePlayerAndClone();
      this.UpdateEnemies();
      // this.CheckCollisions();

  	  if (!(this._controller.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)) && !(this._controller.isDown(Phaser.Gamepad.XBOX360_LEFT_TRIGGER)))
		  this._triggerPress = true;
	  
	  
      if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || game.input.keyboard.isDown(Phaser.Keyboard.B))
      {
        this.CatchRing();
      }
  	  else if (this._controller.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER) || this._controller.isDown(Phaser.Gamepad.XBOX360_LEFT_TRIGGER))
  	  {
  		  if (this._triggerPress){
  			  this.CatchRing();
        }
  	  }
  
      // according to beats
      // this.SpawnEnemies();
      // this.SpawnEnemy();

      if(musicPlayer[0]){
        // spawn rings
        var t_now = musicPlayer[0].currentTime ;

        // if(t_now > musicPlayer[0].totalDuration * 1000){
        if( this._music.track_spawn_list_ind == this._music.track_spawn_list_length){
        // if( this._music.track_spawn_list_ind == 2){
          game.time.events.add(Phaser.Timer.SECOND * 4, this.GameClear, this);
          
        }

        if(t_now > this._bassStart + this._beatsOffset && t_now < 95000){
          if (t_now > this._bassStart + (2 * this._bassInd.ind_00 * 1000) + this._beatsOffset){
            this.SpawnRings();
            this._bassInd.ind_00++; 
          }else if (t_now > this._bassStart + (2 * this._bassInd.ind_75 * 1000 + 750) + this._beatsOffset){
            this.SpawnRings();
            this._bassInd.ind_75++;
          }
        }

        // spawn beats
        this.SpawnBeats(t_now);
      }
      this.Catch(); 

      this.LeftControllerMove();
      this.RightControllerMove();

      if (this._beatsMiss < 1){
        for(i = 0; i < this._music.track_num; i++){
          musicPlayer[i].stop();
        }
        VOPlayer = game.add.audio("scratch");
        VOPlayer.volume = 2;
        VOPlayer.loop = false;
        VOPlayer.fadeIn(100);
        this._playerAlive = false;
        this._player.PlayDeathAnim();
        game.time.events.add(Phaser.Timer.SECOND * 2, this.GameOver , this);
      }
    }
  	// console.log("X: "+this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)+" Y: "+this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y));
  	// if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)
    // {
        // this.RightMove(this._player, true);
    // }
  	// if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > -0.1)
    // {
        // this.LeftMove(this._player, true);
    // }
  	// if ((game.time.now)%37 ==0)			//timimg of enemy bullets
  	// {
  	// 	this.EnemyFire();
  	// }
  },

  StartMusic:function(){
    this.bgOut.start(); 
    for(i = 0; i < this._music.track_num; i++){
    // for(i = 0; i < ; i++){
      musicPlayer.push(game.add.audio(this._music.key + "_" + i));
      // musicPlayer = game.add.audio(this._music.key);
      musicPlayer[i].loop = true;

      // musicPlayer[i].play();
      musicPlayer[i].fadeIn(1000);

      // if (musicPlayer.name !== this._music.key && gameOptions.playMusic) {
      //   musicPlayer.stop();
      //   musicPlayer = game.add.audio(this._music.key);
      //   musicPlayer.loop = true;
      //   musicPlayer.play();
      // }
    }
  },

/*
Enemy Player and Update functions
*/
  
  DrawLine(){
    if(this._playerInd != this._playerPreviousInd){
      this._graphic.clear();
      this._graphic = game.add.graphics(0, 0);
      this._graphic.lineStyle(2, this._lineColor, 1);
      this._graphic.moveTo(this._level.info.vertices[this._playerInd].out.x ,this._level.info.vertices[this._playerInd].out.y);
      this._graphic.lineTo(this._level.info.vertices[this._playerInd].in.x ,this._level.info.vertices[this._playerInd].in.y);
      if(this._playerInd + 1 > this._level.info.vertices.length - 1){
        if (this._level.loop){ // it must be looped
          this._graphic.lineTo(this._level.info.vertices[0].in.x ,this._level.info.vertices[0].in.y);
          this._graphic.lineTo(this._level.info.vertices[0].out.x ,this._level.info.vertices[0].out.y);
          this._graphic.lineTo(this._level.info.vertices[this._playerInd].out.x ,this._level.info.vertices[this._playerInd].out.y);
        }
      }else{
        this._graphic.lineTo(this._level.info.vertices[this._playerInd + 1].in.x ,this._level.info.vertices[this._playerInd + 1].in.y);
        this._graphic.lineTo(this._level.info.vertices[this._playerInd + 1].out.x ,this._level.info.vertices[this._playerInd + 1].out.y);
        this._graphic.lineTo(this._level.info.vertices[this._playerInd].out.x ,this._level.info.vertices[this._playerInd].out.y);
      }

      this._playerPreviousInd = this._playerInd;
    }
  },

  CheckEnemyRecycle:function(){
    for (var i = this._enemyList.length - 1; i >= 0; i--) {
      if(this._enemyList[i]._recycle){
        if(this._enemyList[i]._missed){
		      this._beatsMiss--;
        }
        this._enemyList[i]._img.destroy();
        this._enemyList.splice(i,1);
        // miss!?
      }
    }
    
    // check rings 
    for (var i = this._ringList.length - 1; i >= 0; i--) {
      if(this._ringList[i]._recycle){
        if(this._ringList[i]._missed && this._comboStreak > 10){

          // this._ui.miss.scale.setTo(this._ui.baseScale);
          // this.missIn.start();
          // this.missScaleIn.start();

          // this._ui.miss.scale.setTo(this._ui.baseScale);
          // this.missIn.start();
          // this.missScaleIn.start();

          this.ResetCombo(); 
          VOPlayer = game.add.audio("vo_losemojo");
          VOPlayer.volume = 2;
          VOPlayer.loop = false;
          VOPlayer.fadeIn(100);
        }
        this._ringList[i]._img.destroy();
        this._ringList.splice(i,1);
        // miss!?
      }
    }
  },

  // SelfDestroyPlayerBullets:function(){
  //   this._playerBullets.forEach(function(pBullet) {
  //     if(pBullet.scale.x == 0 || pBullet.scale.y == 0){
  //       this._playerBullets.remove(pBullet, true); // remove and destroy
  //     }}, this);
  // },
  SpawnDummyRingsBeats:function(){
    var ring = this.CreateRing();
    var enemy = this.CreateEnemy("enemy_full_02", 0);
  },

  SpawnRings:function(){
    var ring = this.CreateRing();
    this._ringList.push(ring);
  },

  SpawnBeats:function(curTime){
    if(this._music.track_spawn_list_ind < this._music.track_spawn_list_length && curTime > this._music.track_spawn_list[this._music.track_spawn_list_ind].time){
      // this._music.track_spawn_list[this._music.track_spawn_list_ind].icon;

      // var type = this._music.track_spawn_list[this._music.track_spawn_list_ind].icon;
      var type ="enemy_full_02"; 

      var enemyInd = this._music.track_spawn_list[this._music.track_spawn_list_ind].piece;
      var enemy = this.CreateEnemy(type, enemyInd);
      // this._enemySpritesGroup.add(enemy._img);
      // this._enemyGroup.add(enemy);
      this._enemyList.push(enemy);

      // spawn rings

      this._music.track_spawn_list_ind++;
    }

    // if(this._timer.beatsPast != this._timer.previousBeat && this._timer.beatsPast > this._level.startShakingBeats - this._music.prepare_beats){
    //   this._timer.previousBeat = this._timer.beatsPast;
    //   var type = utils.GetRandomEnemyType();
    //   // var enemyInd = utils.getRandomInt(this._level.info.paths.length);
    //   var enemyInd = this._activeSpritesList[this._timer.timeStamp][utils.getRandomInt(this._activeSpritesList[this._timer.timeStamp].length)]
    //   var enemy = this.CreateEnemy(type, enemyInd);
    //   this._enemySpritesGroup.add(enemy._img);
    //   // this._enemyGroup.add(enemy);
    //   this._enemyList.push(enemy);
    //   this._enemySpawnCount = 0;
    // }
  },

  // SpawnEnemy:function(){
  //   if(this._timer.beatsPast != this._timer.previousBeat && this._timer.beatsPast > this._level.startShakingBeats - 4){
  //     this._timer.previousBeat = this._timer.beatsPast;
  //     var type = utils.GetRandomEnemyType();
  //     // var enemyInd = utils.getRandomInt(this._level.info.paths.length);
  //     var enemyInd = this._activeSpritesList[this._timer.timeStamp][utils.getRandomInt(this._activeSpritesList[this._timer.timeStamp].length)]
  //     var enemy = this.CreateEnemy(type, enemyInd);
  //     // this._enemySpritesGroup.add(enemy._img);
  //     // this._enemyGroup.add(enemy);
  //     this._enemyList.push(enemy);

  //     // spawn rings

  //   }
  // },

  // SpawnEnemies:function(){
  //   if(this._enemySpawnCount > this._enemySpawnTime){
  //     var type = utils.GetRandomEnemyType();
  //     var enemy = this.CreateEnemy(type, utils.getRandomInt(this._level.info.paths.length));
  //     this._enemySpritesGroup.add(enemy._img);
  //     // this._enemyGroup.add(enemy);
  //     this._enemyList.push(enemy);
  //     this._enemySpawnCount = 0;
  //     // this.EnemyFire(enemy._img);

  //     game.physics.enable(enemy._img, Phaser.Physics.ARCADE);
  //   };
  //   this._enemySpawnCount++;
  // },

  CreatePlayer:function(){
    this._player = utils.MakePlayer(this._level.info.paths[this._playerInd].end.x, this._level.info.paths[this._playerInd].end.y);
    this._player.SetSpriteScale(this._player._baseScale);     

    var nInd = this._playerInd+1;
    if(nInd > this._level.info.vertices.length - 1){nInd = 0}
    this._player.Rotate(this._level.info.vertices[this._playerInd].out, this._level.info.vertices[nInd].out);
  },
  
  CreateClone:function(){
    this._playerClone = utils.MakeClone(this._level.info.paths[this._cloneInd].end.x, this._level.info.paths[this._cloneInd].end.y);
    this._playerClone.SetSpriteScale(this._playerClone._baseScale);     

    var nInd = this._cloneInd+1;
    if(nInd > this._level.info.vertices.length - 1){nInd = 0}
    this._playerClone.Rotate(this._level.info.vertices[this._cloneInd].out, this._level.info.vertices[nInd].out);
  },

  CreateEnemy:function(type, pathInd){
    var enemy = utils.MakeEnemy(type, this._level.info.paths, this._level.info.vertices, pathInd, this._level.center.x, this._level.center.y);
    enemy.SetPath(this._level.info.paths, pathInd);
    return enemy;
  },

  CreateRing:function(){
    var ring = utils.MakeRing(this._level.info.paths,  this._level.center.x, this._level.center.y);
    // var ring = utils.MakeRing(this._level.info.paths,  WIDTH/2, HEIGHT/2);
    ring.SetPath(this._level.info.paths);
    return ring;
  },

  UpdateEnemies:function(){
    for (var i = 0; i < this._enemyList.length ; i++) {
      this._enemyList[i].Move();
    }
    // this._enemyGroup.callAll('Move');
    // this._enemyGroup.Move();
    // this._enemy.Move();

    for (var i = 0; i < this._ringList.length ; i++) {
      this._ringList[i].Move();
    }
  },

  UpdatePlayer:function(){
	  this._keypressCounter++;
	  if (this._keypressCounter % 10 == 0 && this._keypressCounter >0)
	  {
		 // alert(this._keypressCounter);
		  this._keypressCounter = 0;
	  
    if(this._playerMoveCount > this._playerMoveSpeed){
      if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
      {
        if(!this._player._stretching){
          this._player._stretching = true;
          game.time.events.add(Phaser.Timer.SECOND * this._player._stretchDuration, this._player.TurnOffStretch , this._player);
        }
        this._playerInd --;
        if(this._playerInd < 0){
          if(this._level.loop){
            this._playerInd = this._level.info.paths.length - 1;
          }else{
            this._playerInd = 0;
          }
        }
        this._player.Move(this._level.info.paths, this._playerInd);

        var nInd = this._playerInd+1;
        if(nInd > this._level.info.vertices.length - 1){nInd = 0}
        this._player.Rotate(this._level.info.vertices[this._playerInd].out, this._level.info.vertices[nInd].out);
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
      {
        if(!this._player._stretching){
          this._player._stretching = true;
          game.time.events.add(Phaser.Timer.SECOND * this._player._stretchDuration, this._player.TurnOffStretch , this._player);
        }
        this._playerInd ++;
        if(this._playerInd > this._level.info.paths.length - 1){
          if(this._level.loop){
            this._playerInd = 0;
          }else{
            this._playerInd = this._level.info.paths.length - 1;
          }
        }
        this._player.Move(this._level.info.paths, this._playerInd);

        var nInd = this._playerInd + 1;
        if(nInd > this._level.info.vertices.length - 1){nInd = 0}
        this._player.Rotate(this._level.info.vertices[this._playerInd].out, this._level.info.vertices[nInd].out);
      } 
      this._playerMoveCount = 0;
    }
	  }
    this._playerMoveCount ++;
    this._player.CheckStretching();
  },

  
   UpdatePlayerAndClone:function(){
	  this._keypressCounter++;
	  if (this._keypressCounter % 10 == 0 && this._keypressCounter >0)
	  {
		 // alert(this._keypressCounter);
		  this._keypressCounter = 0;
	  
    if(this._playerMoveCount > this._playerMoveSpeed){
      if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
      {
        this.LeftMove(this._player, true);
	    this.LeftMove(this._playerClone, false);
      }
      else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
      {
        this.RightMove(this._player, true);
	    this.RightMove(this._playerClone, false);
      } 
      this._playerMoveCount = 0;
    }
	  }
    this._playerMoveCount ++;
    this._player.CheckStretching();
  },
  
  // for debug purpose
  // render:function(){ 
  // },

/*
Level functions
*/ 

  MakeLevelImage:function(){
    // this._level.img = game.make.sprite(game.world.centerX, game.world.centerY, "level_" + this._level.ind);
    // this._level.img.scale.setTo(0.05);
    // this._level.img.tint = Math.random() * 0xffffff;
    this.MakePlayerImage();
    this.MakeUIImage();
  },

  MakeUIImage:function(){
    this._multiplierSprite.push(game.make.sprite(this._level.center.x, this._level.center.y + this._multiplierOffset, 'mult_1'));
    this._multiplierSprite.push(game.make.sprite(this._level.center.x, this._level.center.y + this._multiplierOffset, 'mult_10'));
    this._multiplierSprite.push(game.make.sprite(this._level.center.x, this._level.center.y + this._multiplierOffset, 'mult_25'));
    this._multiplierSprite.push(game.make.sprite(this._level.center.x, this._level.center.y + this._multiplierOffset, 'mult_50'));
    this._multiplierSprite[0].scale.setTo(this._multTargetScale);
    for (var i = 1; i < 4; i++) {
      this._multiplierSprite[i].scale.setTo(this._multInitScale);
    }

    utils.centerGameObjects([this._multiplierSprite[0], this._multiplierSprite[1],this._multiplierSprite[2],this._multiplierSprite[3]]);
    utils.zeroAlpha([this._multiplierSprite[1],this._multiplierSprite[2],this._multiplierSprite[3]]);

    this._ui.good = game.make.sprite(this._level.center.x, this._level.center.y, 'encourage_good');
    this._ui.great = game.make.sprite(this._level.center.x, this._level.center.y, 'encourage_great');
    this._ui.excellent = game.make.sprite(this._level.center.x, this._level.center.y, 'encourage_excellent');
    this._ui.miss = game.make.sprite(this._level.center.x, this._level.center.y, 'encourage_miss');

    this.goodIn = game.add.tween(this._ui.good).to({ alpha:1}, this._ui.tween.speed, this._tween.method.linear, false);
    this.goodScaleIn = game.add.tween(this._ui.good.scale).to({ x:this._ui.targetScale, y:this._ui.targetScale}, this._ui.tween.speed, this._tween.method.linear, false);
    this.goodOut = game.add.tween(this._ui.good).to({ alpha:0}, this._ui.tween.speed, this._tween.method.linear, false);
    this.goodIn.chain(this.goodOut);

    this.greatIn = game.add.tween(this._ui.great).to({ alpha:1}, this._ui.tween.speed, this._tween.method.linear, false);
    this.greatScaleIn = game.add.tween(this._ui.great.scale).to({ x:this._ui.targetScale, y:this._ui.targetScale}, this._ui.tween.speed, this._tween.method.linear, false);
    this.greatOut = game.add.tween(this._ui.great).to({ alpha:0}, this._ui.tween.speed, this._tween.method.linear, false);
    this.greatIn.chain(this.greatOut);

    this.excellentIn = game.add.tween(this._ui.excellent).to({ alpha:1}, this._ui.tween.speed, this._tween.method.linear, false);
    this.excellentScaleIn = game.add.tween(this._ui.excellent.scale).to({ x:this._ui.targetScale, y:this._ui.targetScale}, this._ui.tween.speed, this._tween.method.linear, false);
    this.excellentOut = game.add.tween(this._ui.excellent).to({ alpha:0}, this._ui.tween.speed, this._tween.method.linear, false);
    this.excellentIn.chain(this.excellentOut);

    this.missIn = game.add.tween(this._ui.miss).to({ alpha:1}, this._ui.tween.speed, this._tween.method.linear, false);
    this.missScaleIn = game.add.tween(this._ui.miss.scale).to({ x:this._ui.targetScale, y:this._ui.targetScale}, this._ui.tween.speed, this._tween.method.linear, false);
    this.missOut = game.add.tween(this._ui.miss).to({ alpha:0}, this._ui.tween.speed, this._tween.method.linear, false);
    this.missIn.chain(this.missOut);

    // this._ui.score.sprite = game.make.sprite(this._ui.score.x, this._ui.score.y, 'ui_score');
    // this._ui.score.sprite.scale.setTo(0.25);

    // this.levelComplete = game.make.sprite(this._ui.levelCompletePos.x, this._ui.levelCompletePos.y, 'ui_level_complete');
    this.levelComplete = game.make.sprite(this._ui.levelCompletePos.x - 2200, this._ui.levelCompletePos.y, 'ui_level_complete');
    this.levelComplete.scale.setTo(0.95);
    this.highscore = game.make.sprite(this._ui.highscorePos.x, this._ui.highscorePos.y, 'ui_highscore');
    this.highscore.scale.setTo(0.7);

    utils.centerGameObjects([this._ui.good, this._ui.great, this._ui.excellent, this._ui.miss, this.levelComplete, this.highscore]);
    // utils.zeroAlpha([this._ui.good, this._ui.great, this._ui.excellent, this._ui.miss]);
    utils.zeroAlpha([this._ui.good, this._ui.great, this._ui.excellent, this._ui.miss, this.highscore]);
  },

  MakePlayerImage:function(){

  },

  LoadImages:function(){
    // loading Scene
  },

/*
Tween functions
*/

  PlayStartingTweens:function(){
    // this._level.tweenIn.start();
    this._playerTweenIn.start();
    this._playerWaveTweenIn.start();
    this._playerEarTweenIn.start();
  },

  PlayerDeathTweens:function(){

  },

  MakeTween:function(){
    this.bgOut = game.add.tween(this.galaxyBG).to({ alpha: 0 }, this._ui.tween.speed * 2, this._tween.method.linear, false);


    // this.fadeLogoIn = game.add.tween(this.logo).to({ alpha: 1 }, this._splashSpeed, Phaser.Easing.Linear.None);
    // this._level.tweenIn = game.add.tween(this._level.img.scale).to({ x:1, y:1}, this._level.tween.speed, this._level.tween.method);

    // this._playerTweenIn = game.add.tween(this._player._img.scale).to({ x:1, y:1}, this._level.tween.speed, this._level.tween.method);
    this._playerTweenIn = game.add.tween(this._player._img.scale).to({ x:this._player._targetScale, y:this._player._targetScale}, this._level.tween.speed, this._level.tween.method);
    this._playerWaveTweenIn = game.add.tween(this._player._audiowaveSprite.scale).to({ x:this._player._spritesheetTargetScale, y:this._player._spritesheetTargetScale}, this._level.tween.speed, this._level.tween.method);
    this._playerEarTweenIn = game.add.tween(this._player._earSprite.scale).to({ x:this._player._spritesheetTargetScale, y:this._player._spritesheetTargetScale}, this._level.tween.speed, this._level.tween.method);

    this._overlayIn = game.add.tween(this.blackOverlay).to({ alpha: 1}, this._ui.tween.speed * 5, this._tween.method.linear, false);
    this._overlayIn.onComplete.add(this.tweenScoreArray, this);
    this._levelCompleteIn = game.add.tween(this.levelComplete).to({ x:this._ui.levelCompletePos.x}, this._ui.tween.speed * 5, this._tween.method.back.out, false);
    this._highscoreIn = game.add.tween(this.highscore).to({ alpha: 1}, this._ui.tween.speed * 5, this._tween.method.linear, false); 
    this._overlayIn.chain(this._levelCompleteIn);
    this._levelCompleteIn.chain(this._highscoreIn);
  },

  tweenScoreArray:function(){
    for(var i = 0; i < this._ui.digitsNum; i++){
      for(var j = 0; j < 10; j++){
        if(this._ui.scoreArray[i][j].alpha != 0){ 
          game.add.tween(this._ui.scoreArray[i][j]).to({x: this._ui.digitPosAfter[i].x, y: this._ui.digitPosAfter[i].y}, this._ui.tween.speed * 5, this._tween.method.back.out, true); 
          game.add.tween(this._ui.scoreArray[i][j].scale).to({x: 3.75, y: 3.75}, this._ui.tween.speed * 5, this._tween.method.back.out, true); 
          break;
        }
      } 
    }
    this._multiplierSprite[0].alpha = 0;
    this._multiplierSprite[1].alpha = 0;
    this._multiplierSprite[2].alpha = 0;
    this._multiplierSprite[3].alpha = 0;
  },

  TweenOutEverything:function(){
    // tween out level image, enemies, player. 
    // erase graphics
    this._graphic.clear();
    game.add.tween(this._player._img.scale).to({ x:0.01, y:0.01}, this._level.tween.speed, this._tween.method.exp.out, true);
    game.add.tween(this._player._img).to({ x:this._level.center.x, y:this._level.center.y}, this._level.tween.speed, this._tween.method.exp.out, true);
    // game.add.tween(this._level.img.scale).to({ x:0.01, y:0.01}, this._level.tween.speed, this._tween.method.exp.out, true);
    // game.add.tween(this._level.img).to({ x:this._level.center.x, y:this._level.center.y}, this._level.tween.speed, this._tween.method.exp.out, true);
    game.add.tween(this._level.bitMapBG.scale).to({ x:0.01, y:0.01}, this._level.tween.speed, this._tween.method.exp.out, true);
    game.add.tween(this._level.bitMapBG).to({ x:this._level.center.x, y:this._level.center.y}, this._level.tween.speed, this._tween.method.exp.out, true);
    for (var i = 0; i < this._enemyList.length ; i++) {
      game.add.tween(this._enemyList[i]._img.scale).to({ x:0.01, y:0.01}, this._level.tween.speed, this._tween.method.exp.out, true);
      game.add.tween(this._enemyList[i]._img).to({ x:this._level.center.x, y:this._level.center.y}, this._level.tween.speed, this._tween.method.exp.out, true);
    }
    for (var i = 0; i < this._ringList.length ; i++) {
      game.add.tween(this._ringList[i].scale).to({ x:0.01, y:0.01}, this._level.tween.speed, this._tween.method.exp.out, true);
      game.add.tween(this._ringList[i]).to({ x:this._level.center.x, y:this._level.center.y}, this._level.tween.speed, this._tween.method.exp.out, true);
    }
    this._enemyList = [];
  },

/*
Collide functions
*/

  EnablePhysics:function(){
    // utils.addExistingMultiple([playerBullet]);
    // this._enemySpritesGroup.setAll('outOfBoundsKill', true);

    //bullets
    // this._playerBullets = game.add.group();
    // this._playerBullets.enableBody = true;
    // this._playerBullets.physicsBodyType = Phaser.Physics.ARCADE;    
    // this._playerBullets.createMultiple(500, 'player_bullet');
    // this._playerBullets.setAll('checkWorldBounds', true);
    // this._playerBullets.setAll('outOfBoundsKill', true);
  
    //enemy bullets
    // this._enemyBullets = game.add.group();
    // this._enemyBullets.enableBody = true;
    // this._enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    // this._enemyBullets.createMultiple(50, 'enemy_bullet');
    // this._enemyBullets.setAll('checkWorldBounds', true);
    // this._enemyBullets.setAll('outOfBoundsKill', true);
  },

  CheckCollisions:function(){
    //Collisions
    // this.CheckHitEnemy();
    // this.CheckEnemyShotPlayer();
    // this.CheckPlayerOverlapEnemy();
    // game.physics.arcade.collide(this._playerBullets, this._enemyBullets, this.BulletsHit, null, this);
  },

  // PlayerDied:function(){
  //   // this._player._img.destroy();
  //   this._playerAlive = false;
  //   // this._player.destroy();
  //   // check lives
  //   // set timer -> tween out enemies and clear list, tween out level, player
  //   game.time.events.add(Phaser.Timer.SECOND * 1, this.TweenOutEverything, this);
  //   // set timer -> tween back level, player, start again (_playerAlive = true)
  //   // game.time.events.add(Phaser.Timer.SECOND * 1, this.initDialogue, this);
  // },

  CatchRing:function(){
    for (var i = 0; i < this._ringList.length; i++) {
      if(this._ringList[i]._enable){
        this._ringList[i].Caught();

        this._comboStreak ++;
        this.CheckCombo();
        // this._scoreCount += this._scoreBase * this._multiplier * ( 1 + game.rnd.frac() / 4);
        // this._scoreCount++;
        // this._scoreDisplay.setText(this._scoreCount);

        this._player.PlayEarAnim();
        this.LevelShake();
		this._triggerPress = false;
        break;
      }
    }
  },
  
  Catch:function(){
    for (var i = 0; i < this._enemyList.length; i++) {
      if(this._enemyList[i]._enable && this._enemyList[i]._pathInd == this._playerInd){
        this._enemyList[i].Caught();
    		this._scoreCount += this._scoreBase * this._multiplier * ( 1 + game.rnd.frac() / 4);
        // this._scoreCount++;
        // this._scoreDisplay.setText(this._scoreCount);
        this.UpdateScore();
        this.ShakeScore();
        this.DisplayWords(this._enemyList[i]._pathPercent);
        this._player.PlayWaveAnim();

        this.
        break;
      }
    }
  },

  CheckCombo:function(){
    // display words, play sounds
    this.CheckMultiplier();
  },

  Encourage:function(){
    // game.load.audio('vo_losemojo','assets/sounds/VO/ILostMyMojo.wav');

    if(this._multiplierInd == 1){
      // this._ui.good.scale.setTo(this._ui.baseScale);
      // this.goodIn.start();
      // this.goodScaleIn.start();

      VOPlayer = game.add.audio("vo_groovy");
      VOPlayer.volume = 1.2;
      VOPlayer.loop = false;
      VOPlayer.fadeIn(100);
    }else if (this._multiplierInd == 2){
      // this._ui.great.scale.setTo(this._ui.baseScale);
      // this.greatIn.start();
      // this.greatScaleIn.start();

      VOPlayer = game.add.audio("vo_shagadelic");
      VOPlayer.volume = 1.2;
      VOPlayer.loop = false;
      VOPlayer.fadeIn(100);
    }else if(this._multiplierInd == 3){
      // this._ui.great.scale.setTo(this._ui.baseScale);
      // this.excellentIn.start();
      // this.excellentScaleIn.start();

      VOPlayer = game.add.audio("vo_yeahbaby");
      VOPlayer.volume = 1.6;
      VOPlayer.loop = false;
      VOPlayer.fadeIn(100);
    }
  },

  DisplayWords:function(percent){
    if(percent < 1.02 && percent > 0.98){
      // console.log(percent);

      // this._ui.great.scale.setTo(this._ui.baseScale);
      // this.greatIn.start();
      // this.greatScaleIn.start();

    }else{
      // console.log(percent);

      // this._ui.good.scale.setTo(this._ui.baseScale);
      // this.goodIn.start();
      // this.goodScaleIn.start();
    }
  },

  EnemyFire:function(enemy){
    if (game.time.now > nextFire && this._enemyBullets.countDead() > 0)
    {
      nextFire = game.time.now + fireRate;
      var enemyBullet = this._enemyBullets.getFirstExists(false);
      enemyBullet.scale.setTo(0.3);
      enemyBullet.reset(enemy.x, enemy.y);// - enemy.height);
      // move enemy bullets
      // game.physics.arcade.moveToObject(enemyBullet, this._player._img, 30, 1000);
      // game.add.tween(enemyBullet).to({ x:this._level.info.paths[this._playerInd].end.x, y:this._level.info.paths[this._playerInd].end.y}, this._playerBulletSpeed ,this._tween.method.linear, true);
      // var bulletTween = game.add.tween(enemyBullet.scale).to({ x:1, y:1}, this._playerBulletSpeed ,this._tween.method.linear, true);
      // bulletTween.onComplete.add(this.DestroyEnemyBullet, this);
    }
  },

/*
Helper functions
*/
  
  CheckLevelShaking:function(){
    var mag = 7;
    var speed = 10;
    if(this._scoreShaking){
      for(var i = 0; i < this._ui.digitsNum; i++){
        for(var j = 0; j < 10; j++){
          if(this._ui.scoreArray[i][j].alpha != 0){ 
            this._ui.scoreArray[i][j].position.setTo(
              this._ui.digitPos[i].x + mag * Math.sin(game.time.now * speed),
              this._ui.digitPos[i].y + mag * Math.sin(game.time.now * speed)
            ); 
            break;
          }
        } 
      }
    }
    // if(this._level.shaking){
      // this._level.bitMapBG.position.setTo(
      //     mag * Math.sin(game.time.now * speed),// * game.rnd.integerInRange(-1, 1),
      //     mag * Math.cos(game.time.now * speed) //* game.rnd.integerInRange(-1, 1)
      //   );

      // // shake the multiplier sprite
      // this._multiplierSprite[this._multiplierInd].position.setTo(
      //     this._level.center.x + mag * Math.sin(game.time.now * speed),
      //     this._level.center.y + mag * Math.cos(game.time.now * speed)
      // );

      // // for (var i = 0; i < this._level.size; i++) {
      // //   this._level.backgroundPieces[i].position.setTo(
      // //     0 + mag * Math.sin(game.time.now * speed),// * game.rnd.integerInRange(-1, 1),
      // //     0 + mag * Math.cos(game.time.now * speed) //* game.rnd.integerInRange(-1, 1)
      // //   );
      // // }
      // // // this._level.img.position.setTo(
      // // //     this._level.img.position.x + mag * Math.sin(game.time.now * speed),// * game.rnd.integerInRange(-1, 1),
      // // //     this._level.img.position.y + mag * Math.cos(game.time.now * speed) //* game.rnd.integerInRange(-1, 1)
      // // //   );

      // // player
      // this._player._img.position.setTo(
      //     this._player._x + mag * Math.sin(game.time.now * speed),// * game.rnd.integerInRange(-1, 1),
      //     this._player._y + mag * Math.cos(game.time.now * speed) //* game.rnd.integerInRange(-1, 1)
      //   );
      // // enemy
      // for (var i =0; i < this._enemyList.length; i++) {
      //   this._enemyList[i]._img.position.setTo(
      //       this._enemyList[i]._x + mag * Math.sin(game.time.now * speed),// * game.rnd.integerInRange(-1, 1),
      //       this._enemyList[i]._y + mag * Math.cos(game.time.now * speed) //* game.rnd.integerInRange(-1, 1)
      //     );
      // }

      // for (var i =0; i < this._ringList.length; i++) {
      //   this._ringList[i]._img.position.setTo(
      //       this._ringList[i]._x + mag * Math.sin(game.time.now * speed),// * game.rnd.integerInRange(-1, 1),
      //       this._ringList[i]._y + mag * Math.cos(game.time.now * speed) //* game.rnd.integerInRange(-1, 1)
      //     );
      // }
    // }
  },

  LevelShake:function(){
    var shakeDuration = 0.15;
    // this._level.shaking = true;
    this._player.PlayEarAnim(); // shake with bass
    // game.time.events.add(Phaser.Timer.SECOND * shakeDuration, this.LevelShakeOff, this);

    game.camera.shake(0.0125, shakeDuration * 1000);
  },

  ShakeScore:function(){
    var shakeDuration = 0.1;
    this._scoreShaking = true;
    // this._player.PlayEarAnim(); // temp!!! TODO To delete
    game.time.events.add(Phaser.Timer.SECOND * shakeDuration, this.ScoreShakeOff, this);
  },

  LevelShakeOff(){
    // this._level.shaking = false;
    // // this._level.img.position.setTo(WIDTH/2, HEIGHT/2);

    // // for (var i = 0; i < this._level.size; i++) {
    // //     this._level.backgroundPieces[i].position.setTo( 0, 0);
    // //}

    // this._level.bitMapBG.position.setTo(0,0);

    // this._multiplierSprite[this._multiplierInd].position.setTo(this._level.center.x, this._level.center.y);

    // // reset player pos
    // this._player._img.position.setTo(this._player._x, this._player._y);
    // // reset enemy pos
    // for (var i =0; i < this._enemyList.length; i++) {
    //   this._enemyList[i]._img.position.setTo(this._enemyList[i]._x,this._enemyList[i]._y);
    // }
  },

  ScoreShakeOff(){
    this._scoreShaking = false;
     
    for(var i = 0; i < this._ui.digitsNum; i++){
      for(var j = 0; j < 10; j++){
        if(this._ui.scoreArray[i][j].alpha != 0){
          this._ui.scoreArray[i][j].position.setTo(this._ui.digitPos[i].x,this._ui.digitPos[i].y);
          break;
        }
      }
    }
  },

  CheckActivePieces:function(){
    if(this._timer.beatsPast > this._timeToChange[this._timer.timeStamp + 1]){ // actually using beats
      this._timer.timeStamp ++; 
      this.ShowHideSprites(this._timer.timeStamp);
    }
  },

  CheckMusicTime:function(){
    if(musicPlayer[0]){
      if(musicPlayer[0].currentTime > 1000 * this._timer.secondsPerBeat * this._timer.beatsPast){
        this._timer.beatsPast ++;

        if(this._timer.beatsPast > this._level.startShakingBeats && this._timer.beatsPast % 2 == 0){
          // this.LevelShake();
          this.SpawnRings(); // spawn rings
        }
        // this._timer.secondsPast ++;
        // if(this._timer.secondsPast % 60  == 0){
        //   this._timer.minutesPast ++;
        // }
      }
    }
  },

  TimeToBeats:function(i_Time){
    return i_Time * this._timer.secondsPerBeat;
  },

  // RemoveEnemy:function(i_index){
  //   this._enemyList[i]._recycle = true;
  //   // this._enemyRecycleList.push(this._enemyList[i]);  // remove and return an array contains the removed object
  //   // this._enemyList.splice(i,1); // remove and return an array contains the removed object
  // },

/*
Helper functions
*/
  FixSpawnTime:function(){
    for(var i = 0; i < this._music.track_spawn_list_length; i++){
      this._music.track_spawn_list[i].time = this._music.track_spawn_list[i].time - this._music.prepare_beats * this._timer.secondsPerBeat * 1000;
    }
  },

  RestoreSpawnTime:function(){
    for(var i = 0; i < this._music.track_spawn_list_length; i++){
      this._music.track_spawn_list[i].time = this._music.track_spawn_list[i].time + this._music.prepare_beats * this._timer.secondsPerBeat * 1000;
      if(i == 0){
        console.log(this._music.track_spawn_list[i].time);
      }
    }
  },

  MakeDigitsArray:function(){
    for (var i = 0; i < this._ui.digitsNum; i++) {
      var newDigitArray = [];
      for(var j = 0; j < 10; j++) {
        digit = game.make.sprite(this._ui.digitPos[i].x, this._ui.digitPos[i].y, 'score_' + j);
        digit.scale.setTo(this._ui.digitScale);
        utils.centerGameObjects([digit]);
        if(j != 0){
          utils.zeroAlpha([digit]);
        }
        newDigitArray.push(digit);
        utils.addExistingMultiple([digit]);
      }
      this._ui.scoreArray.push(newDigitArray); 
    }
    
    for (var i = 0; i < this._livesDigit; i++) {
      var newDigitArray = [];
      for(var j = 0; j < 10; j++) {
        digit = game.make.sprite(this._livesDigitPos[i].x, this._livesDigitPos[i].y, 'score_' + j);
        digit.scale.setTo(this._ui.digitScale);
        utils.centerGameObjects([digit]);
        if(i == 0){
          if(j != 1){
            utils.zeroAlpha([digit]);
          }
        }else{
          if(j != 0){
            utils.zeroAlpha([digit]);
          }
        }
        newDigitArray.push(digit);
        utils.addExistingMultiple([digit]);
      }
      this._livesArray.push(newDigitArray); 
    }
    // game.make.sprite(0, 0, 'level_1_back')

    // digitsNum:3,
    // digitScale:
    // digitPos:[
    //   {x:WIDTH/2 + digitDistance * 1, y:75},
    //   {x:WIDTH/2 + digitDistance * 2, y:75},
    //   {x:WIDTH/2 + digitDistance * 3, y:75}
    // ], 
    // scoreArray:[],
    // digitsArray:[],
  },

  AddBGVid:function(){
    this._bgVid = game.add.video(this._bgVidName);
    this._bgVid.play(true, 0.85);
    this._bgVid.addToWorld(WIDTH/2, HEIGHT/2, 0.5, 0.5, 1.02, 1.02);
    // this._bgVid.addToWorld(WIDTH/2, HEIGHT/2, 0.5, 0.5, 1, 1); 
  },

  SetLevelInfo:function(){
    var len = this._level.info.vertices.length;
    if(this._level.loop){
      for (var i = 0; i < len; i++) {
        if (i == len - 1){ j = 0; }
        else{ j = i + 1; };
        utils.GetMidPoint(this._level.info.paths[i].start,this._level.info.vertices[i].in, this._level.info.vertices[j].in);
        utils.GetMidPoint(this._level.info.paths[i].end, this._level.info.vertices[i].out, this._level.info.vertices[j].out);
      }
    }else{
      for (var i = 0; i < len - 1; i++) {
        j = i + 1;
        utils.GetMidPoint(this._level.info.paths[i].start,this._level.info.vertices[i].in, this._level.info.vertices[j].in);
        utils.GetMidPoint(this._level.info.paths[i].end, this._level.info.vertices[i].out, this._level.info.vertices[j].out);
      } 
    }
  },

  StartNextScene: function(){
    // game.state.start(nextScene); 
    game.state.start(MainGameScene); 
  },

  CalNormEnemySpeed:function(){
    this._timer.secondsPerBeat; // 0.5 
    ENEMY_SPEED = 1 /(FPS * this._timer.secondsPerBeat * ENEMY_SPEED_AS_BEATS);

  },

  
  // Fire:function(){
  //   if (game.time.now > nextFire && this._playerBullets.countDead() > 0)
  //   {
  //     nextFire = game.time.now + fireRate;
  //     var bullet = this._playerBullets.getFirstDead();
  //     bullet.scale.setTo(0.3);
  //     bullet.reset(this._player._x, this._player._y);
  //     // move the player bullets
  //     // game.physics.arcade.moveToXY(bullet, this._level.center.x, this._level.center.y, 30, 300)
  //     game.add.tween(bullet).to({ x:this._level.center.x, y:this._level.center.y}, this._playerBulletSpeed ,this._tween.method.linear, true);
  //     game.add.tween(bullet.scale).to({ x:0, y:0}, this._playerBulletSpeed ,this._tween.method.linear, true);
  //   }
  // },   

  // EnemyFire:function(enemy){
  //   if (game.time.now > nextFire && this._enemyBullets.countDead() > 0)
  //   {
  //     nextFire = game.time.now + fireRate;
  //     var enemyBullet = this._enemyBullets.getFirstExists(false);
  //     enemyBullet.scale.setTo(0.3);
  //     enemyBullet.reset(enemy.x, enemy.y);// - enemy.height);
  //     // move enemy bullets
  //     // game.physics.arcade.moveToObject(enemyBullet, this._player._img, 30, 1000);
  //     // game.add.tween(enemyBullet).to({ x:this._level.info.paths[this._playerInd].end.x, y:this._level.info.paths[this._playerInd].end.y}, this._playerBulletSpeed ,this._tween.method.linear, true);
  //     // var bulletTween = game.add.tween(enemyBullet.scale).to({ x:1, y:1}, this._playerBulletSpeed ,this._tween.method.linear, true);
  //     // bulletTween.onComplete.add(this.DestroyEnemyBullet, this);
  //   }
  // },
  
  ShowHideSprites:function(time){	  
	  // for (var i = 0; i < this._level.size; i++)
	  // {
		 //  if (this._activeSpritesList[time].includes(i)){
			//   this._level.imgArray[i].visible = true;
   //    }else{
   //      this._level.imgArray[i].visible = false;
   //    }
	  // }
  },
  
  DrawBackground: function(){
    this._level.bg.push(game.make.sprite(0, 0, 'level_1_back'));
    this._level.bg.push(game.make.sprite(0, 0, 'level_3'));
    // this._level.bg.push(game.make.sprite(0, 0, 'level_1_ring_1'));
    // this._level.bg.push(game.make.sprite(0, 0, 'level_1_ring_2'));
    // this._level.bg.push(game.make.sprite(0, 0, 'level_1_ring_3'));
    // this._level.bg.push(game.make.sprite(0, 0, 'level_1_ring_4'));

    this._level.bitMap = game.make.bitmapData(WIDTH, HEIGHT);
    // game.make.sprite(game.world.centerX, 320, bmd).anchor.set(0.5, 0);

    // for (var i = 1; i < this._level.bg.length ; i++){
    //   this._level.bitMap.alphaMask(this._level.bg[0], this._level.bg[i]);
    // }

    this._level.bitMap.alphaMask(this._level.bg[0], this._level.bg[1]);

    // for (var i = 0; i < this._level.bg.length; i++) {
      // utils.addExistingMultiple([this._level.bg[i]]);
    // }

	  // for (var i=0; i < this._level.totalPieces ; i++)
	  // {
   //    this._level.imgArray[i] = game.make.sprite(0, 0, this._level.backgroundPieces[i].name);
   //    // this._level.imgArray[i] = game.make.sprite(WIDTH/2, HEIGHT/2, this._level.backgroundPieces[i].name);

   //    // this._level.imgArray[i].scale.setTo(0.01);
  	// 	// utils.addExistingMultiple([this._level.imgArray[i]]);  
   //    // game.add.tween(this._level.imgArray[i].scale).to({ x:1, y:1}, this._level.tween.speed, this._level.tween.method, true);
   //    // game.add.tween(this._level.imgArray[i]).to({ x:0, y:0}, this._level.tween.speed, this._level.tween.method, true);

   //    this._level.bitMap.alphaMask(this._level.bg[0], this._level.imgArray[i]);
	  // }	  

    this._level.bitMapBG = game.make.sprite(0, 0, this._level.bitMap);
    utils.addExistingMultiple([this._level.bitMapBG]);
    // utils.addExistingMultiple(this._level.bitMap);
  },

  UpdateScore:function(){
    tempScore = this._scoreCount;
    for (var i = 0; i < this._ui.digitsNum && tempScore >= 1; i++) {
      dig = Math.floor(tempScore % 10);
      for(var j = 0; j < 10; j++){
        if(j == dig){
          this._ui.scoreArray[this._ui.digitsNum - i - 1][j].alpha = 1;
        }else{
          this._ui.scoreArray[this._ui.digitsNum - i - 1][j].alpha = 0;
        }
      }
      tempScore = tempScore/10;
    }  
  },
  
  LoadScore : function(){
  	this._scoreDisplay.destroy();
    this._scoreDisplay = game.add.text(120, 75, this._beatsMiss, {
        // font: "normal 125px vector_battleregular",
        font: "normal 125px vector_battleregular",
        fill: "#FFFFFF",
        align: "center"
    });
    this._scoreDisplay.anchor.setTo(0.5, 0.5);
  },
  
  CheckLives:function(){
    var lives = this._beatsMiss;
    for (var i = this._livesDigit - 1; i >= 0; i--) {
      var res = lives % 10;
      for(var j = 0; j < 10; j++) {
        if(j == res){
          this._livesArray[i][j].alpha = 1;
        }else{
          this._livesArray[i][j].alpha = 0;
        }
      }
      lives = Math.floor(lives / 10);
    }
  }, 
  
  RightPress: function(){
    // <<<<<<< HEAD
    // 	  this._keypressCounter = -10;
    //     if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    //     {

    //       if(!this._player._stretching){
    //         this._player._stretching = true;
    //         game.time.events.add(Phaser.Timer.SECOND * this._player._stretchDuration, this._player.TurnOffStretch , this._player);
    //       }

    //       this._playerInd ++;
    //       if(this._playerInd > this._level.info.paths.length - 1){
    //         if(this._level.loop){
    //             this._playerInd = 0;
    //         }else{
    //           this._playerInd = this._level.info.paths.length - 1;
    //         }
    //       }
    //       this._player.Move(this._level.info.paths, this._playerInd);

    //       var nInd = this._playerInd + 1;
    //       if(nInd > this._level.info.vertices.length - 1){nInd = 0}
    //       this._player.Rotate(this._level.info.vertices[this._playerInd].out, this._level.info.vertices[nInd].out);
    //     } 
    //   },

    //   LeftPress: function(){
    // 	  this._keypressCounter = -10;
    //     if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {

    //       if(!this._player._stretching){
    //         this._player._stretching = true;
    //         game.time.events.add(Phaser.Timer.SECOND * this._player._stretchDuration, this._player.TurnOffStretch , this._player);
    //       }
        
    //       this._playerInd--;
    //       if (this._playerInd < 0) {
    // ======= OLD code


	  // this._keypressCounter = -10;
    // if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    // {

      // if(!this._player._stretching){
        // this._player._stretching = true;
        // game.time.events.add(Phaser.Timer.SECOND * this._player._stretchDuration, this._player.TurnOffStretch , this._player);
      // }

      // this._playerInd ++;
      // if(this._playerInd > this._level.info.paths.length - 1){
        // if(this._level.loop){
            // this._playerInd = 0;
        // }else{
          // this._playerInd = this._level.info.paths.length - 1;
        // }
      // }
      // this._player.Move(this._level.info.paths, this._playerInd);

      // var nInd = this._playerInd + 1;
      // if(nInd > this._level.info.vertices.length - 1){nInd = 0}
      // this._player.Rotate(this._level.info.vertices[this._playerInd].out, this._level.info.vertices[nInd].out);
    // } 
	
  	this.RightMove(this._player, true);
  	// this.RightMove(this._playerClone, false);
  },
  
  RightMove: function(moveObject, isPlayer){
	  this._keypressCounter = -10;
      if(!moveObject._stretching){
        moveObject._stretching = true;
        game.time.events.add(Phaser.Timer.SECOND * moveObject._stretchDuration, moveObject.TurnOffStretch , moveObject);
      }
	  if (isPlayer)
	  {
		  this._playerInd ++;
      if(this._playerInd > this._level.info.paths.length - 1){
        if(this._level.loop){
            this._playerInd = 0;
        }else{
          this._playerInd = this._level.info.paths.length - 1;
        }
      }
      moveObject.Move(this._level.info.paths, this._playerInd);

      var nInd = this._playerInd + 1;
      if(nInd > this._level.info.vertices.length - 1){nInd = 0}
      moveObject.Rotate(this._level.info.vertices[this._playerInd].out, this._level.info.vertices[nInd].out);		  
	  }
	  else
	  {
		  this._cloneInd ++;
      if(this._cloneInd > this._level.info.paths.length - 1){
        if(this._level.loop){
            this._cloneInd = 0;
        }else{
          this._cloneInd = this._level.info.paths.length - 1;
        }
      }
      moveObject.Move(this._level.info.paths, this._cloneInd);

      var nInd = this._cloneInd + 1;
      if(nInd > this._level.info.vertices.length - 1){nInd = 0}
      moveObject.Rotate(this._level.info.vertices[this._cloneInd].out, this._level.info.vertices[nInd].out);
	  }
    
  },

  LeftPress: function(){
	  // this._keypressCounter = -10;
    // if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {

      // if(!this._player._stretching){
        // this._player._stretching = true;
        // game.time.events.add(Phaser.Timer.SECOND * this._player._stretchDuration, this._player.TurnOffStretch , this._player);
      // }
    
      // this._playerInd--;
      // if (this._playerInd < 0) {
          // if (this._level.loop) {
              // this._playerInd = this._level.info.paths.length - 1;
          // } else {
              // this._playerInd = 0;
          // }
      // }
      // this._player.Move(this._level.info.paths, this._playerInd);
	  
	  // var nInd = this._playerInd + 1;
      // if (nInd > this._level.info.vertices.length - 1) { nInd = 0 }
      // this._player.Rotate(this._level.info.vertices[this._playerInd].out, this._level.info.vertices[nInd].out);
    // }
	
  	this.LeftMove(this._player, true);
  	// this.LeftMove(this._playerClone, false);
  },

  LeftMove: function(moveObject, isPlayer){
	  this._keypressCounter = -10;
   
      if(!moveObject._stretching){
        moveObject._stretching = true;
        game.time.events.add(Phaser.Timer.SECOND * moveObject._stretchDuration, moveObject.TurnOffStretch , moveObject);
      }
	  
	  if (isPlayer)
	  {
		  this._playerInd--;
		  if (this._playerInd < 0) {
          if (this._level.loop) {
              this._playerInd = this._level.info.paths.length - 1;
          } else {
              this._playerInd = 0;
          }
      }

      moveObject.Move(this._level.info.paths, this._playerInd);
  	  var nInd = this._playerInd + 1;
      if (nInd > this._level.info.vertices.length - 1) { nInd = 0 }
        moveObject.Rotate(this._level.info.vertices[this._playerInd].out, this._level.info.vertices[nInd].out);
  	  }
  	  else {
  		  this._cloneInd--;
  		  if (this._cloneInd < 0) {
          if (this._level.loop) {
              this._cloneInd = this._level.info.paths.length - 1;
          } else {
              this._cloneInd = 0;
          }
      }
      moveObject.Move(this._level.info.paths, this._cloneInd);
  	  var nInd = this._cloneInd + 1;
      if (nInd > this._level.info.vertices.length - 1) { nInd = 0 }
      moveObject.Rotate(this._level.info.vertices[this._cloneInd].out, this._level.info.vertices[nInd].out);
	  }
  },
  
  UpDownPress: function(){
	  for (var i=0; i<8; i++)
	  {
		  if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || game.input.keyboard.isDown(Phaser.Keyboard.UP)) {

      if(!this._player._stretching){
        this._player._stretching = true;
        game.time.events.add(Phaser.Timer.SECOND * this._player._stretchDuration, this._player.TurnOffStretch , this._player);
      }
    
      this._playerInd--;
      if (this._playerInd < 0) {
          if (this._level.loop) {
              this._playerInd = this._level.info.paths.length - 1;
          } else {
              this._playerInd = 0;
          }
      }
      this._player.Move(this._level.info.paths, this._playerInd);

      var nInd = this._playerInd + 1;
      if (nInd > this._level.info.vertices.length - 1) { nInd = 0 }
      this._player.Rotate(this._level.info.vertices[this._playerInd].out, this._level.info.vertices[nInd].out);
    }
	  }	  
  },
  
  LeftControllerMove: function(){
	  xAxis = this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
	  yAxis = this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
	  
	  if (!xAxis)
		  xAxis = 0;		  
	  
	  if (!yAxis)
		  yAxis = 0;
	  
	 // console.log("X: "+xAxis+" Y: "+yAxis);
	 
	  if (xAxis!=0 || yAxis!=0)
	  {
		 // this.ControllerUpdatePlayer(1);
		  
		
		  /*
		  (x:false  y:1/ x:-1  y:false)--> 10, 11, 0
		  (x:-1  y:false/ x:false  y:-1)--> 9, 8, 7
		  (x:false  y:-1/ x:1  y:false)--> 6, 5, 4
		  (x:1  y:false/ x:false  y:1 )--> 3, 2, 1
		  */
		  
		  
		   if (xAxis ==-1 && yAxis == 0)
			   this.ControllerUpdatePlayer(5);
		   else if (xAxis ==1 && yAxis == 0)
			   this.ControllerUpdatePlayer(1);
		   else if (xAxis == 0 && yAxis >0.92 && yAxis <=1)
			   this.ControllerUpdatePlayer(7);
		   else if (xAxis ==0 && yAxis == -1)
			   this.ControllerUpdatePlayer(3);
		  
		  	  
		  if (yAxis < 0)									 														
		  {
			  if (xAxis > -1 && xAxis < -0.75 )
			  {
				this.ControllerUpdatePlayer(5); 
			  }
			  else if (xAxis >=-0.75 && xAxis <=-0.25)
			  {
				  this.ControllerUpdatePlayer(4);
			  }
			  else if (xAxis >-0.25 && xAxis < 0.25)
			  {
				  this.ControllerUpdatePlayer(3);
			  }
			  else if (xAxis >= 0.25 && xAxis <= 0.75)
			  {
				  this.ControllerUpdatePlayer(2);
			  }
			  else if (xAxis > 0.75 && xAxis <= 1)
			  {
				  this.ControllerUpdatePlayer(1);
			  }
		  }
		  else if (yAxis > 0)
		  {
			if (xAxis > -1 && xAxis < -0.75 )
			  {
				this.ControllerUpdatePlayer(5); 
			  }
			  else if (xAxis >=-0.75 && xAxis <=-0.25)
			  {
				  this.ControllerUpdatePlayer(6);
			  }
			  else if (xAxis >-0.25 && xAxis < 0.25)
			  {
				  this.ControllerUpdatePlayer(7);
			  }
			  else if (xAxis >= 0.25 && xAxis <= 0.75)
			  {
				  this.ControllerUpdatePlayer(0);
			  }
			  else if (xAxis > 0.75 && xAxis <= 1)
			  {
				  this.ControllerUpdatePlayer(1);
			  }  
		  }
		  
		  
		  // if (xAxis ==-1 && yAxis == 0)
			  // this.ControllerUpdatePlayer(8);
		  // else if (xAxis ==1 && yAxis == 0)
			  // this.ControllerUpdatePlayer(2);
		  // else if (xAxis == 0 && yAxis >0.92 && yAxis <0.94)
			  // this.ControllerUpdatePlayer(11);
		  // else if (xAxis ==0 && yAxis == -1)
			  // this.ControllerUpdatePlayer(5);
		  
		  // else if (xAxis>-1 && xAxis<0 && yAxis>0 && yAxis<1)
		  // {			  
			  // if (xAxis > -1 && xAxis <-0.68 && yAxis >0 && yAxis < 0.65)
				  // this.ControllerUpdatePlayer(9);
			  // else if (xAxis < -0.35 && xAxis >-0.68 && yAxis > 0.64 && yAxis < 0.85)
				  // this.ControllerUpdatePlayer(10);
			  // else if (xAxis <= 0 && xAxis >-0.35 && yAxis > 0.85 && yAxis < 1)
				  // this.ControllerUpdatePlayer(11);
			  
			  // // (x:false  y:1/ x:-1  y:false)--> 10, 11, 0			  
		  // }
		  // else if (xAxis>-1 && xAxis<0 && yAxis>=-1 && yAxis<0)
		  // {
			   // if (xAxis > -0.55 && xAxis < 0 && yAxis == -1)// >0 && yAxis < 0.65)
				  // this.ControllerUpdatePlayer(6);
			  // else if (xAxis < -0.55 && xAxis >-0.94 && yAxis >= -.90 && yAxis < -0.40)// > 0.64 && yAxis < 0.85)
				  // this.ControllerUpdatePlayer(7);
			  // else if (xAxis < -0.94 && xAxis >-1 && yAxis > -1 && yAxis < -0.9)
				  // this.ControllerUpdatePlayer(8);
			  // // (x:-1  y:false/ x:false  y:-1)--> 9, 8, 7
		  // }
		  // else if (xAxis>0 && xAxis<1 && yAxis>=-1 && yAxis<0)
		  // {
			   // if (xAxis > 0.68 && xAxis < 1 && yAxis !=-1)//>0 && yAxis < 0.65)
				  // this.ControllerUpdatePlayer(3);
			  // else if (xAxis < 0.68 && xAxis > 0.35 && yAxis == -1)//> 0.64 && yAxis < 0.85)
				  // this.ControllerUpdatePlayer(4);
			  // else if (xAxis < 0.35 && xAxis > 0 && yAxis == -1)// > 0.85 && yAxis < 1)
				  // this.ControllerUpdatePlayer(5);
			  // //  (x:false  y:-1/ x:1  y:false)--> 6, 5, 4
		  // }
		  // else if (xAxis>0 && xAxis<1 && yAxis>0 && yAxis<1)
		  // {
			   // if (xAxis >= 0 && xAxis < 0.65 && yAxis >0.75 && yAxis < 0.95)
				  // this.ControllerUpdatePlayer(0);
			  // else if (xAxis < 0.9 && xAxis > 0.65 && yAxis > 0.4 && yAxis < 0.75)
				  // this.ControllerUpdatePlayer(1);
			  // else if (xAxis < 1 && xAxis >0.90 && yAxis > 0 && yAxis < 0.4)
				  // this.ControllerUpdatePlayer(2);
			  // // (x:1  y:false/ x:false  y:1 )--> 3, 2, 1
		  }
		  
		
		
	  // if (!(this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X)) && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0)
		  // this.ControllerUpdatePlayer(0);
	
	  // else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0 || !(this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y)))
		  // this.ControllerUpdatePlayer(8);
	
	// else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) || this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y))
	  // {
		  // if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < 0)
		  // {
			  // //x - negative and Y - negative - 12, 11, 10, 9, 8
			  // if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > -1  && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.70)// && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0)
				// this.ControllerUpdatePlayer(12);
			
			// else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > -0.70 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.45)
				// this.ControllerUpdatePlayer(11);
			
			// else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > -0.45 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < 0.25)
				// this.ControllerUpdatePlayer(10);
			
			// else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > -0.25 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < 0.13)
				// this.ControllerUpdatePlayer(9);  			 
			
			// else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > -0.139)// && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0.73)
				// this.ControllerUpdatePlayer(8);  			 
			
		  // }			  
		  // else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0)
		  // {
			  // //x - negative and Y - positive. Player indexes to jump:0, 15, 14, 13
			// if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > -0.20)// && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0)
				// this.ControllerUpdatePlayer(0);
			
			// else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > -0.50 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.20)
				// this.ControllerUpdatePlayer(15);
			
			// else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > -0.73 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.50)
				// this.ControllerUpdatePlayer(14);
			
			// else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > -0.99 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.73)
				// this.ControllerUpdatePlayer(13);
			
			// else
				// this.ControllerUpdatePlayer(0);
			
		  // }			  
		  // else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < 0)
		  // {
			  // //x - positive and Y - negative -7, 6, 5
			// if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.2 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0.45)
				// this.ControllerUpdatePlayer(7);
			
			// else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.45 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0.65)
				// this.ControllerUpdatePlayer(6);
			
			// else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.65 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0.89)
				// this.ControllerUpdatePlayer(5);			  
		  // }			  
		  // else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0)
		  // {
			  // //x - positive and Y - positive -4, 3, 2 ,1
			// if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0.2)
				// this.ControllerUpdatePlayer(4);
			
			// else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.8 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0)
				// this.ControllerUpdatePlayer(4);
			
			// else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.5 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0.8)
				// this.ControllerUpdatePlayer(3);
			
			// else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.25 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < 0.5)
				// this.ControllerUpdatePlayer(2);
			
			// else if (this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0 && this._controller.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < .25)
				// this.ControllerUpdatePlayer(1);
		  // }			  
		  
	  // } 
  },
  
  RightControllerMove: function(){
	  xAxis = this._controller.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X);
	  yAxis = this._controller.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_Y);
	  
	  if (!xAxis)
		  xAxis = 0;		  
	  
	  if (!yAxis)
		  yAxis = 0;
	  
	 // console.log("X: "+xAxis+" Y: "+yAxis);
	 
	  if (xAxis!=0 || yAxis!=0)
	  {
		 // this.ControllerUpdatePlayer(1);
		  
		
		  /*
		  (x:false  y:1/ x:-1  y:false)--> 10, 11, 0
		  (x:-1  y:false/ x:false  y:-1)--> 9, 8, 7
		  (x:false  y:-1/ x:1  y:false)--> 6, 5, 4
		  (x:1  y:false/ x:false  y:1 )--> 3, 2, 1
		  */
		  
		 if (xAxis ==-1 && yAxis == 0)
			   this.ControllerUpdatePlayer(5);
		   else if (xAxis ==1 && yAxis == 0)
			   this.ControllerUpdatePlayer(1);
		   else if (xAxis == 0 && yAxis >0.92 && yAxis <=1)
			   this.ControllerUpdatePlayer(7);
		   else if (xAxis ==0 && yAxis == -1)
			   this.ControllerUpdatePlayer(3);
		  
		  	  
		  if (yAxis < 0)									 														
		  {
			  if (xAxis > -1 && xAxis < -0.75 )
			  {
				this.ControllerUpdatePlayer(5); 
			  }
			  else if (xAxis >=-0.75 && xAxis <=-0.25)
			  {
				  this.ControllerUpdatePlayer(4);
			  }
			  else if (xAxis >-0.25 && xAxis < 0.25)
			  {
				  this.ControllerUpdatePlayer(3);
			  }
			  else if (xAxis >= 0.25 && xAxis <= 0.75)
			  {
				  this.ControllerUpdatePlayer(2);
			  }
			  else if (xAxis > 0.75 && xAxis <= 1)
			  {
				  this.ControllerUpdatePlayer(1);
			  }
		  }
		  else if (yAxis > 0)
		  {
			if (xAxis > -1 && xAxis < -0.75 )
			  {
				this.ControllerUpdatePlayer(5); 
			  }
			  else if (xAxis >=-0.75 && xAxis <=-0.25)
			  {
				  this.ControllerUpdatePlayer(6);
			  }
			  else if (xAxis >-0.25 && xAxis < 0.25)
			  {
				  this.ControllerUpdatePlayer(7);
			  }
			  else if (xAxis >= 0.25 && xAxis <= 0.75)
			  {
				  this.ControllerUpdatePlayer(0);
			  }
			  else if (xAxis > 0.75 && xAxis <= 1)
			  {
				  this.ControllerUpdatePlayer(1);
			  }  
		  }
		  
	  }

  },
  
  ControllerUpdatePlayer: function(moveIndex){
	  this._playerInd = moveIndex;
	  this._player.Move(this._level.info.paths, this._playerInd);
    var nInd = this._playerInd + 1;
	  //console.log("nInd: "+nInd)
    if (nInd > this._level.info.vertices.length - 1) { nInd = 0 }
    this._player.Rotate(this._level.info.vertices[this._playerInd].out, this._level.info.vertices[nInd].out);
  },
  
  LoadJson:function(){
    // this._imgName = settingsJSON.levels[this._level.ind].name;
    this._level.center.x = settingsJSON.levels[this._level.ind].center.x;
    this._level.center.y = settingsJSON.levels[this._level.ind].center.y;
    this._level.info.vertices = settingsJSON.levels[this._level.ind].vertices;
    this._level.info.paths = settingsJSON.levels[this._level.ind].paths;
    this._level.size = settingsJSON.levels[this._level.ind].size;
    this._level.loop = settingsJSON.levels[this._level.ind].loop;

    this._level.backgroundPieces = settingsJSON.levels[this._level.ind].backgroundPieces;
    this._level.totalPieces = settingsJSON.levels[this._level.ind].totalPieces;
    this._timeToChange = settingsJSON.levels[this._level.ind].timeToChange;
    this._activeSpritesList = settingsJSON.levels[this._level.ind].activeSpritesList;
    this._level.imgArray = this._level.backgroundPieces;

    // handle from music.json get infos
    this._music.key = musicJSON.music[this._music.ind].key;
    this._music.bpm = musicJSON.music[this._music.ind].bpm;
    this._timer.secondsPerBeat = 60/this._music.bpm; // 0.5
    this._music.track_num = musicJSON.music[this._music.ind].track_num;
    this._music.track_spawn_list = tracksJSON[this._music.ind].beats;
    this._music.track_spawn_list_length = this._music.track_spawn_list.length;
  },
  
  CheckMultiplier:function(){
    if(this._comboStreak > this._multiplierThresh[this._multiplierInd].combo){
      this._multiplier = this._multiplierThresh[this._multiplierInd].mult;
      this._multiplierInd++;
      this.ChangeMultiplier();
      this.Encourage();
    }
    // change multiplier sprite
  },

  ChangeMultiplier:function(){
    this._multiplierSprite[this._multiplierInd - 1].alpha = 0;
    multIn = game.add.tween(this._multiplierSprite[this._multiplierInd]).to({ alpha:1}, this._ui.tween.speed, this._tween.method.linear, true);
    multScaleDown = game.add.tween(this._multiplierSprite[this._multiplierInd].scale).to({x: this._multTargetScale, y:this._multTargetScale}, this._ui.tween.speed, this._tween.method.linear, false, this._multDelay);
    multIn.chain(multScaleDown);
  },

  ResetCombo:function(){
    this._multiplierSprite[this._multiplierInd].alpha = 0;
    this._multiplierSprite[0].scale.setTo(this._multInitScale);
    multIn = game.add.tween(this._multiplierSprite[0]).to({ alpha:1}, this._ui.tween.speed, this._tween.method.linear, true);
    multScaleDown = game.add.tween(this._multiplierSprite[0].scale).to({x: this._multTargetScale, y:this._multTargetScale}, this._ui.tween.speed, this._tween.method.linear, false, this._multDelay);
    multIn.chain(multScaleDown);
    this._multiplierInd = 0;
    this._comboStreak = 0; 
  },

  AddMultiplierSprites:function(){
    utils.addExistingMultiple([this._multiplierSprite[0], this._multiplierSprite[1], this._multiplierSprite[2], this._multiplierSprite[3]]);
  },

  StartNextScene:function(){
	  game.state.start(this._nextScene); 
  },

  GameClear:function(){
    // disable movements
    this._playerAlive = false;

    // this.TweenOutEverything();

    // fade in stuff
    this._overlayIn.start();
    this._highscoreIn.start();
    this._levelCompleteIn.start();

    for(i = 0; i < this._music.track_num; i++){
      musicPlayer[i].volume = 0.6;
    }
  },
  
  GameOver:function() {
	  //this._beatsMiss =7;
	  //alert("gameover..." + this._nextScene);

	  this.ResetVariables();
	  game.state.start(this._nextScene);
	  
	  //game.state.restart();
	  //game.state.start(this._nextScene);//, true, false);
	  //game.state.start(this._nextScene); 
    },
	
  Unpause:function(){		
		//this._gameOver.destroy();
		game.paused = false;
		game.state.restart();
	},
	
  ResetVariables: function(){
    this.RestoreSpawnTime();

    this._scoreShaking = false;
    this._multiplier = 1;
    this._multiplierSprite = null;
    this._multiplierInd = 0;
    this._multiplierSprite = [];
    this._bassStart = 8000;
    this._bassInd = {
      ind_00:0,
      ind_75:0
    };
    this._comboStreak = 0;
    this._timeToChange = null,
    this._timer = {
      timeStamp:0,
      startTime:null,
      now:null,
      secondsPerBeat:null,
      beatsPast:0,
      previousBeat: -1,
      secondsPast: 0,
      minutesPast: 0
    };
    this._music = {
      "key":null,
      "ind":0,
      "length":null,
      "bpm":null,
      "fourBeatsTime":null,
      "track_num":null,
      "track_spawn_list":null,
      "track_spawn_list_length":null,
      "track_spawn_list_ind":0,
      "prepare_beats":4,
      "startDelay":1,
    };
    this._lives = null;
    //_bgColor:'#2b2d30',
    this._playerAlive = true;
    this._playerPreviousInd = -1;
    this._playerInd = 1;
    this._cloneInd = 8;
    this._playerScale = 0.2;
    this._playerMoveSpeed = 3;
    this._playerMoveCount = 0;
    this._ringList = [];
    this._enemyList = [];
    this._enemyRecycleList = [];
    this._bgVid = null;
    this._bgVidName = 'vid_BG';
    // _bgVidName:'vid_ex',
    this._scoreCount = 0,
    this._beatsMiss = 1,
    this._livesDigit = 2;
    this._livesArray = [],
    this._scoreDisplay = null,
    this._keypressCounter = 0,
    this._controller = null,
    this._triggerPress = true,

    this._gameOver= null;
    this._retry= null;
    this._exit= null;

    game.sound.stopAll();
    musicPlayer = [];

	  console.log("Reset!!");
	}
};