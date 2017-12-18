'use strict';
//VEHICULOS

var GO = require('./Vehiculo.js');


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
      this.game.load.image('agujero','images/buhero.png');
      this.game.load.image('aceite','images/aceite.png');
  },

create: function() {

  this.levelData = JSON.parse(this.game.cache.getText('level'));
 
  
  //Iniciamos las fisicas de arcade
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  //colocamos el fondo
  //this.game.add.tileSprite(0,0, 5000, 5000, 'road');

  this.map = this.game.add.tilemap('level1');
  this.map.addTilesetImage('MicroMachines2-GG-TreehouseTiles');
  this.layer = this.map.createLayer('Floor');
  this.layer.resizeWorld();

//creamos obstaculos
  //Agujero
  this.agujero=new GO.gameObject(this.game,'agujero',this.levelData.layers[2].objects[0].x + 500, this.levelData.layers[2].objects[0].y+500,0.5,0.5,0.5,0.5);
  this.agujero.sprite.body.setSize(400,400,50,50);
  //aceite
  this.aceite=new GO.gameObject(this.game,'aceite',this.levelData.layers[2].objects[0].x + 600, this.levelData.layers[2].objects[0].y,0.5,0.5,0.25,0.5);
  this.aceite.sprite.body.setSize(1000,300,-200,200);
  //charco
  this.charco = new GO.gameObject(this.game, 'charco', this.levelData.layers[2].objects[0].x + 700, this.levelData.layers[2].objects[0].y-500, 0, 0, 0.15, 0.6);
  this.charco.sprite.body.setSize(420, 170, 200, -170);
 //Pongo una banderita para hacer una prueba de movimiento (ESTO SE QUITARÁ)
  this.puntos = this.levelData.layers[1].objects.length;
  this.banderas = [];

  
  for(var i = 0; i < this.puntos; i++)
  {
    this.banderas.push(this.game.add.sprite(this.levelData.layers[1].objects[i].x, this.levelData.layers[1].objects[i].y));
    this.game.physics.enable(this.banderas[i],Phaser.Physics.ARCADE);
    this.banderas[i].body.setSize(100, 100, -50, -50);
  }
  //console.log(this.banderas.length);

 
  //creamos al personajes
  this.jugador = new GO.player(this.game, 'car', this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y, 0.5, 0.5, 0.5, 0.5);
  this.enemy = new GO.enemigo(this.game, 2, 'carEnemy', this.levelData.layers[2].objects[1].x, this.levelData.layers[2].objects[1].y, 0.5, 0.5, 0.5, 0.5);

  //inicializamos en cursors la deteccion de cursores
  this.cursors = this.game.input.keyboard.createCursorKeys();

  //this.game.camera.follow(jugador.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
},

update: function() {
  //UPDATE DE MOVIMIENTO
   this.jugador.update(this.cursors, this.game);
   this.enemy.update(this.game, this.banderas);
  
  //UPDATE DE DETECCIÓN DE ELEMENTOS DEL MAPA
   this.jugador.detectaCharco(this.game, this.charco.sprite);
   this.enemy.detectaCharco(this.game, this.charco.sprite);
   this.jugador.muerte(this.game,this.agujero.sprite, this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y);
   this.enemy.muerte(this.game,this.agujero.sprite, this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y);
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