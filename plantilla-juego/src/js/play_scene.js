'use strict';
//VEHICULOS

var GO = require('./Vehiculo.js');


var cursors;
var jugador;
var charco;
var enemy;
var relentizar;
var banderas = [];
var PlayScene=
{

preload: function() {
    this.game.load.tilemap('level1', '../images/levels/Mapa1.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('Caminos', '../images/levels/spritesheet.png');
    this.game.load.image('road', '../images/carreteras.jpg');
    this.game.load.image('car', '../images/vehiculos/truck.png');
    this.game.load.image('charco','images/charco.png');
    this.game.load.image('bandera','images/banderita.png');
},

create: function() {
  //Iniciamos las fisicas de arcade
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  //colocamos el fondo
  //this.game.add.tileSprite(0,0, 5000, 5000, 'road');

  this.map = this.game.add.tilemap('level1');
  this.map.addTilesetImage('Caminos');
  this.layer = this.map.createLayer('Suelo')
  this.layer.resizeWorld();
  
  
 //Pongo una banderita para hacer una prueba de movimiento (ESTO SE QUITARÁ)
 
  var puntos = 6;
  for(var i = 0; i < puntos; i++)
  {
    if (i < 3)
    banderas.push(this.game.add.sprite(500*(i + 1), 100, 'bandera'));
    else
    banderas.push(this.game.add.sprite(500*(i - 2), 500, 'bandera'));

    banderas[i].scale.setTo(0.1, 0.1);
    this.game.physics.enable(banderas[i],Phaser.Physics.ARCADE);
  }
 
  this.game.world.setBounds(0,0, 6000, 6000);

  //creamos obstaculos
  charco = new GO.gameObject(this.game, 'charco', 100, 100, 0, 0, 0.15, 0.6);

  //creamos al personajes
  jugador = new GO.player(this.game, 'car', 5500, 5000, 0.5, 0.5, 0.5, 0.5);
  enemy = new GO.enemigo(this.game, 2, 'car', 300, 300, 0.5, 0.5, 0.5, 0.5);

  //inicializamos en cursors la deteccion de cursores
  cursors = this.game.input.keyboard.createCursorKeys();

  this.game.camera.follow(jugador.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
},

update: function() {
//UPDATE DE MOVIMIENTO
 jugador.update(cursors, this.game);
 enemy.update(this.game, banderas);

//UPDATE DE DETECCIÓN DE ELEMENTOS DEL MAPA
 jugador.detectaCharco(this.game, charco.sprite);
 enemy.detectaCharco(this.game, charco.sprite);

},

render: function() {
}

};

module.exports = PlayScene;