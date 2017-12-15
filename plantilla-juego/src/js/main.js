  'use strict';

  var PlayScene = require('./play_scene.js');
  var vehicle=require('./Vehiculo.js');

  var BootScene = {
    preload: function () {
      // load here assets required for the loading screen
      this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    },

    create: function () {
      this.game.state.start('preloader');
    }
  };


  var PreloaderScene = {  
    preload: function () { 
      this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
      this.loadingBar.anchor.setTo(0, 0.5);
      this.load.setPreloadSprite(this.loadingBar);

      // TODO: load here the assets for the game
      this.game.load.image('logo', 'images/phaser.png');
      this.game.load.tilemap('level1', '../images/levels/Mapa2.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.text('level', '../images/levels/Mapa2.json');
      this.game.load.image('Caminos', '../images/levels/spritesheet.png');
      this.game.load.image('road', '../images/carreteras.jpg');
      this.game.load.image('car', '../images/vehiculos/truck.png');
      this.game.load.image('charco','images/charco.png');
      this.game.load.image('bandera','images/banderita.png');
      this.game.load.image('agujero','images/AGUJERO.png');
    },

    create: function () {
      this.game.state.start('play');
    }
  };


  window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

    game.state.add('boot', BootScene);
    game.state.add('preloader', PreloaderScene);
    game.state.add('play', PlayScene);
    game.state.start('boot');
  };
