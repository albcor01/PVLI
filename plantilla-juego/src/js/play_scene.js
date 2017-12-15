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
    this.game.load.baseURL = 'https://raw.githubusercontent.com/albcor01/PVLI/ElementsMapa/plantilla-juego/src/';
    this.game.load.crossOrigin = 'anonymous';
  
  
      this.game.load.tilemap('level1', 'images/levels/Mapa2.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.text('level', 'images/levels/Mapa2.json');
      this.game.load.image('Caminos', 'images/levels/spritesheet.png');
      this.game.load.image('road', 'images/carreteras.jpg');
      this.game.load.image('car', 'images/vehiculos/truck.png');
      this.game.load.image('charco','images/charco.png');
      this.game.load.image('bandera','images/banderita.png');
  },

create: function() {

  this.levelData = JSON.parse(this.game.cache.getText('level'));
  console.log(this.levelData.layers[1].objects[0].x);
  
  //Iniciamos las fisicas de arcade
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  //colocamos el fondo
  //this.game.add.tileSprite(0,0, 5000, 5000, 'road');

  this.map = this.game.add.tilemap('level1');
  this.map.addTilesetImage('Caminos');
  this.layer = this.map.createLayer('Suelo');
  this.layer2 = this.map.createLayer('puntos');
  this.layer.resizeWorld();
  
  
 //Pongo una banderita para hacer una prueba de movimiento (ESTO SE QUITARÁ)
  this.puntos = this.levelData.layers[1].objects.length;
  this.banderas = [];
  console.log(this.puntos);
  
  for(var i = 0; i < this.puntos; i++)
  {
    this.banderas.push(this.game.add.sprite(this.levelData.layers[1].objects[i].x, this.levelData.layers[1].objects[i].y));
    this.game.physics.enable(this.banderas[i],Phaser.Physics.ARCADE);
    this.banderas[i].scale.setTo(0.1, 0.1);
  }
  console.log(this.banderas.length);

  //creamos obstaculos
  charco = new GO.gameObject(this.game, 'charco', 100, 100, 0, 0, 0.15, 0.6);

  //creamos al personajes
  jugador = new GO.player(this.game, 'car', 5500, 5000, 0.5, 0.5, 0.5, 0.5);
  enemy = new GO.enemigo(this.game, 4, 'car', 5500, 5000, 0.5, 0.5, 0.5, 0.5);

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

},

render: function() {
}

};

module.exports = PlayScene;