var game = new Phaser.Game(2048, 2048, Phaser.AUTO, 'MainBody'), 
Main = function(){},
WIDTH = 2048,
HEIGHT = 2048,
total_score = 0,
settingsJSON,
musicJSON,
tracksJSON,
musicPlayer = [], // an array, for tracks
menuPlayer,
gameOptions = {
    playSound: true,
    playMusic: true
},
VOPlayer= null,
FPS = 60,
ENEMY_SPEED  = null,
ENEMY_SPEED_AS_BEATS = 4,
choseLevelInd = 1,
lives = 10,
Juicy;

Main.prototype = {
    preload:function(){
        // set to show_all since 1920 * 1080 is too large

        // game.scale.width = "50";
        // game.scale.height = "50";
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.windowConstraints.bottom = "visual";
        game.scale.setShowAll();
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        window.addEventListener('resize', function () { 
            game.scale.refresh();
        });
        game.scale.refresh();

        //
        this.LoadImgs();
        this.LoadScripts(); 
        
        // LoadFonts
        this.LoadFonts();

        // load JSON file
        game.load.json('settings_json','settings.json');
        game.load.json('music_json','music.json');

        this.LoadTracksJson();
    },

    LoadTracksJson:function(){
        game.load.json('lunar_json','tracks_json/lunar.json');
    },

    LoadFonts: function () {
        WebFontConfig = {
          custom: {
            families: ['vector_battleregular'],
            urls: ['index.css']
          }
        }
    },

    create:function(){
        // JSON
        this.AddGameStates();

        this.SetJson();
        game.state.start('Splash');
        // Juicy = game.plugins.add(new Phaser.Plugin.Juicy(this));
    },

    SetJson:function(){
        settingsJSON = game.cache.getJSON('settings_json');
        musicJSON = game.cache.getJSON('music_json'); 

        // json for tracks
        tracksJSON = [game.cache.getJSON('lunar_json')];

    },

    AddGameStates:function(){
        game.state.add('Splash', Splash);
        game.state.add('Loading', Loading);
        game.state.add('LevelChooseScene',LevelChooseScene);
        game.state.add('MainMenuScene',MainMenuScene);
		game.state.add('GameOver',GameOver);
    },

    LoadImgs:function(){
        game.load.image('EaeLogo','assets/images/splash/EaeLogo.png');
        game.load.image('player_white','assets/images/players/ShipWhite.png');
    },

    LoadScripts:function(){
        game.load.script('Loading', 'states/Loading.js');
        game.load.script('LevelChooseScene','states/LevelChooseScene.js');
        game.load.script('MainMenuScene', 'states/MainMenuScene.js');
        game.load.script('MainGameScene', 'states/MainGameScene.js');
		game.load.script('GameOver', 'states/GameOver.js')

        // game.load.script('Juicy','phaser/plugins/Juicy.js')

        this.LoadClasses();

        game.load.script('Splash', 'states/Splash.js');
        game.load.script('juice','lib/juice.js')
        game.load.script('utils', 'lib/utils.js');
        // game.load.script('polyfill','lib/polyfill.js');
        game.load.script('WebFont', 'vendor/webfontloader.js');
    },

    LoadClasses:function(){
        game.load.script('Square','class/Square.js');
        game.load.script('Player','class/Player.js');
        game.load.script('PlayerBullet','class/PlayerBullet.js');
        game.load.script('Enemy','class/Enemy.js');
        game.load.script('Ring','class/Ring.js');
        game.load.script('EnemyBullet','class/EnemyBullet.js');
    }
};

game.state.add('Main',Main);
game.state.start('Main');