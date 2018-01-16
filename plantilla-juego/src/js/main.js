  'use strict';

  var PlayScene = require('./play_scene.js');
  var vehicle = require('./Vehiculo.js');
  var mainMenu = require('./mainMenu.js');
  var Derrota = require('./MenuDerrota.js');
  var Victoria = require('./MenuVictoria.js');

  var BootScene = {
    preload: function () {
      // load here assets required for the loading screen
     
    },

    create: function () {
      this.game.state.start('preloader');
    }
  };


  var PreloaderScene = {  
    preload: function () { 
      this.game.load.baseURL = 'https://raw.githubusercontent.com/albcor01/PVLI/gh-pages/plantilla-juego/src/';
      this.game.load.crossOrigin = 'anonymous';
    
    //CARGA DEIMAGENES
        this.game.load.tilemap('level1', 'images/levels/Level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.text('level', 'images/levels/Level1.json');
        this.game.load.image('Carreteras', 'images/levels/MicroMachines2-GG-TreehouseTiles.png');
        this.game.load.image('road', 'images/carreteras.jpg');
        this.game.load.image('car', 'images/vehiculos/coche.png');
        this.game.load.image('carEnemy', 'images/vehiculos/cocheEnemy.png');
        this.game.load.image('charco','images/charco.png');
        this.game.load.image('bandera','images/banderita.png');
        this.game.load.image('agujero','images/buhero.png');
        this.game.load.image('aceite','images/aceite.png');
        this.game.load.image('bullet','images/bala.png');
        this.game.load.image('menu', 'images/menu.jpg');
        this.game.load.image('playButton', 'images/play.jpg');
        this.game.load.image('laps','images/Hud/laps.png');
        this.game.load.image('BackToMenuButton','images/backToMenuButon.png');
        this.game.load.image('PlayAgainButton','images/CorrerOtraVez.png');
        this.game.load.image('MenuDerrota','images/MenuDerrota.png');
        this.game.load.image('MenuVictoria','images/Victoria.png');
        this.game.load.spritesheet('lapss','images/Hud/LapsCounter.png',55,55,55);
        this.game.load.image('check','images/checkpoint.png');
        this.game.load.spritesheet('casco','images/Hud/casco.png',87,120,2);
        this.game.load.spritesheet('posiciones','images/Hud/pos.png',56,50);
    //CARGA DE AUDIO
        this.game.load.audio('raceS','music/raceTheme.ogg');
        this.game.load.audio('mainS','music/mainTheme.ogg');
        this.game.load.audio('winS','music/winTheme.ogg');
        
        this.game.load.audio('Bclick','sounds/buttonClick.ogg');
        this.game.load.audio('exit','sounds/SalidaSound.ogg');
        this.game.load.audio('wait','sounds/waitSalidaSound.ogg');
        this.game.load.audio('colision','sounds/Collision.ogg');
        this.game.load.audio('engine','sounds/carEngine.ogg');
        this.game.load.audio('shoot','sounds/ShootSound.ogg');
        this.game.load.audio('hit','sounds/HitSound.ogg');
        
        
    },

    create: function () {
      this.game.state.start('Menu');
    }
  };


  window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

    game.state.add('boot', BootScene);
    game.state.add('preloader', PreloaderScene);
    game.state.add('play', PlayScene);
    game.state.add('Menu', mainMenu);
    game.state.add('PanelDerrota', Derrota);
    game.state.add('PanelVictoria', Victoria);
    game.state.start('boot');
  };
