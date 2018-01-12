  'use strict';

  var PlayScene = require('./play_scene.js');
  var vehicle = require('./Vehiculo.js');
  var mainMenu = require('./mainMenu.js');

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
        this.game.load.spritesheet('lapss','images/Hud/LapsCounter.png',55,55,55);
        this.game.load.image('check','images/checkpoint.png');
        this.game.load.spritesheet('casco','images/Hud/casco.png',87,120,2);
        this.game.load.spritesheet('posiciones','images/Hud/pos.png',50,50);
    //CARGA DE AUDIO
        this.game.load.audio('raceS','music/raceTheme.ogg');
        this.game.load.audio('mainS','music/mainTheme.ogg');
        this.game.load.audio('winS','music/winTheme.ogg');
        
        this.game.load.audio('Bclick','sounds/buttonClick.ogg');
        
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
    game.state.start('boot');
  };
