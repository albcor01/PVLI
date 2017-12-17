'use strict';
//VEHICULOS

var GO = require('./Vehiculo.js');


var cursors;
var jugador;
var charco;
var enemy;
var relentizar;

var PlayScene=
{

  preload: function() {
    this.game.load.baseURL = 'https://raw.githubusercontent.com/albcor01/PVLI/gh-pages/plantilla-juego/src/';
    this.game.load.crossOrigin = 'anonymous';
  
  
      this.game.load.tilemap('level1', 'images/levels/micromachinesMap.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.text('level', 'images/levels/micromachinesMap.json');
      this.game.load.image('MicroMachines2-GG-TreehouseTiles', 'images/levels/MicroMachines2-GG-TreehouseTiles.png');
      this.game.load.image('road', 'images/carreteras.jpg');
      this.game.load.image('car', 'images/vehiculos/coche.png');
      this.game.load.image('carEnemy', 'images/vehiculos/cocheEnemy.png');
      this.game.load.image('charco','images/charco.png');
      this.game.load.image('bandera','images/banderita.png');
  },

create: function() {

  this.levelData = JSON.parse(this.game.cache.getText('level'));
  console.log(this.levelData.layers[1].objects[0].x);
  console.log(this.levelData.layers[2].objects[0].y);
  
  //Iniciamos las fisicas de arcade
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  //colocamos el fondo
  //this.game.add.tileSprite(0,0, 5000, 5000, 'road');

  this.map = this.game.add.tilemap('level1');
  this.map.addTilesetImage('MicroMachines2-GG-TreehouseTiles');
  this.layer = this.map.createLayer('Floor');
  this.layer.resizeWorld();
  
  
 //Pongo una banderita para hacer una prueba de movimiento (ESTO SE QUITARÁ)
  this.puntos = this.levelData.layers[1].objects.length;
  this.banderas = [];
  console.log(this.puntos);
  
  for(var i = 0; i < this.puntos; i++)
  {
    this.banderas.push(this.game.add.sprite(this.levelData.layers[1].objects[i].x, this.levelData.layers[1].objects[i].y));
    this.game.physics.enable(this.banderas[i],Phaser.Physics.ARCADE);
    this.banderas[i].body.setSize(100, 100, -50, -50);
  }
  console.log(this.banderas.length);

  //creamos obstaculos
  charco = new GO.gameObject(this.game, 'charco', 100, 100, 0, 0, 0.15, 0.6);

  //creamos al personajes
  jugador = new GO.player(this.game, 'car', this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y, 0.5, 0.5, 0.5, 0.5);
  enemy = new GO.enemigo(this.game, 2, 'carEnemy', this.levelData.layers[2].objects[1].x, this.levelData.layers[2].objects[1].y, 0.5, 0.5, 0.5, 0.5);

  //inicializamos en cursors la deteccion de cursores
  cursors = this.game.input.keyboard.createCursorKeys();

  this.game.camera.follow(jugador.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
},

update: function() {
//UPDATE DE MOVIMIENTO
 jugador.update(cursors, this.game);
 enemy.update(this.game, this.banderas);

//UPDATE DE DETECCIÓN DE ELEMENTOS DEL MAPA
 jugador.detectaCharco(this.game, charco.sprite);
 enemy.detectaCharco(this.game, charco.sprite);

 /*for(var i = 0; i < this.puntos; i++)
 {
   this.game.debug.body(this.banderas[i]);
 }*/

},

render: function() {
}

};

module.exports = PlayScene;