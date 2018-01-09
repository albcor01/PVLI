'use strict';
//VEHICULOS

var GO = require('./Vehiculo.js');
var audio = require('./AudioSrc.js');

var PlayScene=
{

create: function() {
  audio.playRaceSong(this.game);
  this.levelData = JSON.parse(this.game.cache.getText('level'));
 
  //Iniciamos las fisicas de arcade
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  //colocamos el fondo
  //this.game.add.tileSprite(0,0, 5000, 5000, 'road');
  this.congelado=false;
  this.map = this.game.add.tilemap('level1');
  this.map.addTilesetImage('MicroMachines2-GG-TreehouseTiles');
  this.layer = this.map.createLayer('Capa de Patrones 1');
  this.layer.resizeWorld();
  this.Numbalas=30;

//creamos obstaculos
  /****************************************************************************/
  //Creamos un array de objetos que son obstaculos como elementos colisionables, agujeros
  //o charcos que relentizan o resbalan 
  this.numHoles = this.levelData.layers[3].objects.length;
  this.numCharcos = this.levelData.layers[5].objects.length;
  this.numResbala = this.levelData.layers[7].objects.length;
  this.charcos = [];
  this.holes = [];
  this.resbala = [];

  for(var i = 0; i < this.numHoles; i++)
  {
    this.holes.push(this.game.add.sprite(this.levelData.layers[3].objects[i].x, this.levelData.layers[3].objects[i].y));
    this.game.physics.enable(this.holes[i],Phaser.Physics.ARCADE);
    this.holes[i].body.setSize(this.levelData.layers[3].objects[i].width, this.levelData.layers[3].objects[i].height, 0, 0);
  }

  for(var i = 0; i < this.numCharcos; i++)
  {
    this.charcos.push(this.game.add.sprite(this.levelData.layers[5].objects[i].x, this.levelData.layers[5].objects[i].y));
    this.game.physics.enable(this.charcos[i],Phaser.Physics.ARCADE);
    this.charcos[i].body.setSize(this.levelData.layers[5].objects[i].width, this.levelData.layers[5].objects[i].height, 0, 0);
  }

  for(var i = 0; i < this.numResbala; i++)
  {
    this.resbala.push(this.game.add.sprite(this.levelData.layers[7].objects[i].x, this.levelData.layers[7].objects[i].y));
    this.game.physics.enable(this.resbala[i],Phaser.Physics.ARCADE);
    this.resbala[i].body.setSize(this.levelData.layers[7].objects[i].width, this.levelData.layers[7].objects[i].height, 0, 0);
  }

  //PARA RECORDAR COMO LO HACIA ANTES
  /*this.aceite=new GO.gameObject(this.game,'aceite',this.levelData.layers[2].objects[0].x + 600, this.levelData.layers[2].objects[0].y,0.5,0.5,0.25,0.5);
  this.aceite.sprite.body.setSize(1000,300,-200,200);*/

  //AQUÍ TERMINA LA CREACION DE OBSTACULOS
/******************************************************************************/


/****************************************************************************/
 //Pongo una banderita para hacer una prueba de movimiento (ESTO SE QUITARÁ)
 //CREAMOS LOS ARRAYS QUE CONTENDRÁN EN ORDEN LAS BANDERAS 
 //LOS FOR POSTERIORES INTRODUCEN EN EL ARRAY LA POSICION DE LAS BANDERA
 //LEYENDO EL JSON DEL MAPA
  this.puntos = this.levelData.layers[1].objects.length;
  this.puntos2 = this.levelData.layers[2].objects.length;
  this.puntos3 = this.levelData.layers[6].objects.length;
  this.banderas = [];
  this.banderas2 = [];
  this.banderas3 = [];
  
  for(var i = 0; i < this.puntos; i++)
  {
    this.banderas.push(this.game.add.sprite(this.levelData.layers[1].objects[i].x, this.levelData.layers[1].objects[i].y));
    this.game.physics.enable(this.banderas[i],Phaser.Physics.ARCADE);
    this.banderas[i].body.setSize(100, 100, -50, -50);
  }

  for(var i = 0; i < this.puntos2; i++)
  {
    this.banderas2.push(this.game.add.sprite(this.levelData.layers[2].objects[i].x, this.levelData.layers[2].objects[i].y));
    this.game.physics.enable(this.banderas2[i],Phaser.Physics.ARCADE);
    this.banderas2[i].body.setSize(100, 100, -50, -50);
  }

  for(var i = 0; i < this.puntos3; i++)
  {
    this.banderas3.push(this.game.add.sprite(this.levelData.layers[6].objects[i].x, this.levelData.layers[6].objects[i].y));
    this.game.physics.enable(this.banderas3[i],Phaser.Physics.ARCADE);
    this.banderas3[i].body.setSize(100, 100, -50, -50);
  }
  //console.log(this.banderas.length);
  //AQUÍ TERMINA LA INTRODUCCION DE LAS BANDERAS
  //EN SUS RESPECTIVOS ARRAYS
 /****************************************************************************/
  //creamos al personajes
  this.jugador = new GO.player(this.game, 'car', this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y, 0.5, 0.5, 0.5, 0.5);
  this.enemy = new GO.enemigo(this.game, 2, 'carEnemy', this.levelData.layers[2].objects[1].x, this.levelData.layers[2].objects[1].y, 0.5, 0.5, 0.5, 0.5);
  //inicializamos en cursors la deteccion de cursores
  this.cursors = this.game.input.keyboard.createCursorKeys();

  //Creamos un arma
  this.weapon=this.game.add.weapon(this.Numbalas,'bullet');
  this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  this.weapon.fireRate=1000;
  this.weapon.trackSprite(this.jugador.sprite,30,0,true);
//Creamos un boton para el disparo
  this.fireButton=this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  //this.game.camera.follow(jugador.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
},

update: function() {
  //UPDATE DE MOVIMIENTO
  this.Numbalas--;
  this.weapon.bulletSpeed =500+this.jugador.velocity;
   this.jugador.update(this.cursors, this.game,this.fireButton,this.weapon);
   if(!this.congelado)
   this.enemy.update(this.game, this.banderas);
  
  //UPDATE DE DETECCIÓN DE ELEMENTOS DEL MAPA
  //charco
   //this.jugador.detectaCharco(this.game, this.charco.sprite);
   //this.enemy.detectaCharco(this.game, this.charco.sprite);
  //agujero
   //this.jugador.muerte(this.game, this.agujero.sprite, this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y);
   //this.enemy.muerte(this.game, this.agujero.sprite, this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y);
  //enemigo congelado
   //this.enemy.congelado(this.weapon,this.congelado)

   //console.log(this.congelado);
  //jugador pisa resbala
   //this.jugador.Patinar(this.game,this.aceite.sprite);
   
  //ESTA PARTE DEL CÓDIGO DEFINE A QUIEN SIGUE LA CÁMARA EN FUNCIÓN DE SI EL JUGADOR HA CAIDO EN UN AGUJERO O NO
   if(this.jugador.sprite.alive)
   this.game.camera.follow(this.jugador.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
   else this.game.camera.follow(this.enemy.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
  },

render: function() {
}

};

module.exports = PlayScene;