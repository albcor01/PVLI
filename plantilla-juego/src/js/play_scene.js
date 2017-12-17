'use strict';
//VEHICULOS

var GO = require('./Vehiculo.js');

var PlayScene=
{

preload: function() {
  
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
  
  //Agujero
  this.agujero=new GO.gameObject(this.game,'agujero',5500,4200,0.5,0.5,0.5,0.5);
  this.agujero.sprite.body.setSize(500,500,100,100);
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
  this.charco = new GO.gameObject(this.game, 'charco', 100, 100, 0, 0, 0.15, 0.6);
  this.aceite=new GO.gameObject(this.game,'aceite',5500,3700,0.5,0.5,0.25,0.5);
  this.aceite.sprite.body.setSize(600,600,150,50);

  //creamos al personajes
  this.jugador = new GO.player(this.game, 'car', 5500, 5000, 0.5, 0.5, 0.5, 0.5);
  this.enemy = new GO.enemigo(this.game, 4, 'car', 5500, 5000, 0.5, 0.5, 0.5, 0.5);

  //inicializamos en this.cursors la deteccion de cursores
  this.cursors = this.game.input.keyboard.createCursorKeys();
  
},

update: function() {
//UPDATE DE MOVIMIENTO
 this.jugador.update(this.cursors, this.game);
 this.enemy.update(this.game, this.banderas);

//UPDATE DE DETECCIÓN DE ELEMENTOS DEL MAPA
 this.jugador.detectaCharco(this.game, this.charco.sprite);
 this.enemy.detectaCharco(this.game, this.charco.sprite);
 this.jugador.muerte(this.game,this.agujero.sprite);
 this.enemy.muerte(this.game,this.agujero.sprite);
 this.jugador.crearCollide(this.game);
 this.jugador.Patinar(this.game,this.aceite.sprite);
 //this.enemy.ASAJI(this.game,this.aceite.sprite);

 if(this.jugador.sprite.alive)
 this.game.camera.follow(this.jugador.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
 else this.game.camera.follow(this.enemy.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);

},

render: function() {
}

};

module.exports = PlayScene;