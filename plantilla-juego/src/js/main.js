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
        this.game.load.tilemap('level1', 'images/levels/micromachinesMap.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.text('level', 'images/levels/micromachinesMap.json');
        this.game.load.image('MicroMachines2-GG-TreehouseTiles', 'images/levels/MicroMachines2-GG-TreehouseTiles.png');
        this.game.load.image('road', 'images/carreteras.jpg');
        this.game.load.image('car', 'images/vehiculos/coche.png');
        this.game.load.image('carEnemy', 'images/vehiculos/cocheEnemy.png');
        this.game.load.image('charco','images/charco.png');
        this.game.load.image('bandera','images/banderita.png');
        this.game.load.image('agujero','images/buhero.png');
        this.game.load.image('aceite','images/aceite.png');
        this.game.load.image('menu', 'images/menu.jpg');
        this.game.load.image('playButton', 'images/play.jpg');
        
    //CARGA DE AUDIO
        this.game.load.audio('race','music/raceTheme.ogg');
        this.game.load.audio('race','music/mainTheme.ogg');
        this.game.load.audio('race','music/winTheme.ogg');
        
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
