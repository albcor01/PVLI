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
  this.map.addTilesetImage('Carreteras');
  this.layer = this.map.createLayer('Capa de Patrones 1');
  this.layer.resizeWorld();
  this.Numbalas=30;

//creamos obstaculos
  /****************************************************************************/
  //Creamos un array de objetos que son obstaculos como elementos colisionables, agujeros
  //o charcos que relentizan o resbalan 
  this.contador=2;
  this.numHoles = this.levelData.layers[4].objects.length;
  this.numCharcos = this.levelData.layers[6].objects.length;
  this.numResbala = this.levelData.layers[8].objects.length;
  this.numColliders = this.levelData.layers[5].objects.length;
  this.mapColliders = [];
  this.charcos = [];
  this.holes = [];
  this.resbala = [];
  this.holesGroup=this.game.add.physicsGroup();
  this.charcosGroup=this.game.add.physicsGroup();
  this.resbalaGroups=this.game.add.physicsGroup();
  this.mapCollidersGroup = this.game.add.physicsGroup();
  

  for(var i = 0; i < this.numHoles; i++)
  {
    this.holes.push(this.game.add.sprite(this.levelData.layers[4].objects[i].x, this.levelData.layers[4].objects[i].y));
    this.game.physics.enable(this.holes[i],Phaser.Physics.ARCADE);
    this.holes[i].body.setSize(this.levelData.layers[4].objects[i].width, this.levelData.layers[4].objects[i].height, 0, 0);
    this.holes[i].body.immovable=true;
    this.holesGroup.add(this.holes[i]);
  }

  for(var i = 0; i < this.numCharcos; i++)
  {
    this.charcos.push(this.game.add.sprite(this.levelData.layers[6].objects[i].x, this.levelData.layers[6].objects[i].y));
    this.game.physics.enable(this.charcos[i],Phaser.Physics.ARCADE);
    this.charcos[i].body.setSize(this.levelData.layers[6].objects[i].width, this.levelData.layers[6].objects[i].height, 0, 0);
    this.charcos[i].body.immovable=true;
    this.charcosGroup.add(this.charcos[i]);
  }

  for(var i = 0; i < this.numResbala; i++)
  {
    this.resbala.push(this.game.add.sprite(this.levelData.layers[8].objects[i].x, this.levelData.layers[8].objects[i].y));
    this.game.physics.enable(this.resbala[i],Phaser.Physics.ARCADE);
    this.resbala[i].body.setSize(this.levelData.layers[8].objects[i].width, this.levelData.layers[8].objects[i].height, 0, 0);
    this.resbala[i].body.immovable=true;
    this.resbalaGroups.add(this.resbala[i]);
  }

  for(var i = 0; i < this.numColliders; i++)
  {
    this.mapColliders.push(this.game.add.sprite(this.levelData.layers[5].objects[i].x, this.levelData.layers[5].objects[i].y));
    this.game.physics.enable(this.mapColliders[i],Phaser.Physics.ARCADE);
    this.mapColliders[i].body.setSize(this.levelData.layers[5].objects[i].width, this.levelData.layers[5].objects[i].height, 0, 0);
    this.mapColliders[i].body.immovable=true;
    //this.mapColliders[i].body.moves=false;
    this.mapCollidersGroup.add(this.mapColliders[i]);
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
  this.puntos2 = this.levelData.layers[3].objects.length;
  this.puntos3 = this.levelData.layers[7].objects.length;
  this.banderas = [];
  this.banderas2 = [];
  this.banderas3 = [];
  
  for(var i = 0; i < this.puntos; i++)
  {
    this.banderas.push(this.game.add.sprite(this.levelData.layers[1].objects[i].x, this.levelData.layers[1].objects[i].y));
    this.game.physics.enable(this.banderas[i],Phaser.Physics.ARCADE);
    this.banderas[i].body.setSize(140, 140, -50, -50);
  }

  for(var i = 0; i < this.puntos2; i++)
  {
    this.banderas2.push(this.game.add.sprite(this.levelData.layers[3].objects[i].x, this.levelData.layers[3].objects[i].y));
    this.game.physics.enable(this.banderas2[i],Phaser.Physics.ARCADE);
    this.banderas2[i].body.setSize(140, 140, -50, -50);
  }

  for(var i = 0; i < this.puntos3; i++)
  {
    this.banderas3.push(this.game.add.sprite(this.levelData.layers[7].objects[i].x, this.levelData.layers[7].objects[i].y));
    this.game.physics.enable(this.banderas3[i],Phaser.Physics.ARCADE);
    this.banderas3[i].body.setSize(140, 140, -50, -50);
  }
  //console.log(this.banderas.length);
  //AQUÍ TERMINA LA INTRODUCCION DE LAS BANDERAS
  //EN SUS RESPECTIVOS ARRAYS
 /****************************************************************************/
  //creamos al personajes
  this.cursors = this.game.input.keyboard.createCursorKeys();
  this.weapon=this.game.add.weapon(this.Numbalas,'bullet');
  this.fireButton=this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  this.jugador = new GO.player(this.game, 'car', this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y, 
  0.5, 0.5, 0.5, 0.5,this.cursors,this.fireButton,this.weapon);
  this.game.world.addChild(this.jugador);
  //CREAMOS A LOS ENEMIGOS, SERÍA MEJOR COMO UN ARRAY PERO PARA ESO ANTES TENDRÍA QUE ENTENDER MEJOR LOS JSON
  this.enemy = new GO.enemigo(this.game, 2, 'carEnemy', this.levelData.layers[1].objects[0].x, this.levelData.layers[1].objects[0].y, 0.5, 0.5, 0.5, 0.5, this.banderas);
  this.enemy2 = new GO.enemigo(this.game, 2, 'carEnemy', this.levelData.layers[3].objects[0].x, this.levelData.layers[3].objects[0].y, 0.5, 0.5, 0.5, 0.5, this.banderas2);
  this.enemy3 = new GO.enemigo(this.game, 2, 'carEnemy', this.levelData.layers[7].objects[0].x, this.levelData.layers[7].objects[0].y, 0.5, 0.5, 0.5, 0.5, this.banderas3);
  this.lapsCounter=this.game.add.sprite( this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y,'lapss',3);
  this.lapsCounter.scale.setTo(0.8,0.8);
  this.lapsCounter.fixedToCamera=true;
  this.lapsCounter.cameraOffset.setTo(165, 30);
 
  this.laps=this.game.add.sprite( this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y,'laps');
  this.laps.scale.setTo(0.7,0.7);
  this.laps.fixedToCamera=true;
  this.laps.cameraOffset.setTo(30, 30);
  
  //CHECKPOINTS
  this.checkpoint1=this.game.add.sprite(this.levelData.layers[2].objects[0].x+1000,this.levelData.layers[2].objects[0].y-500,'check');
  this.checkpoint1.scale.setTo(0.5,0.5);
  this.checkpoint2=this.game.add.sprite(this.levelData.layers[2].objects[0].x+400,this.levelData.layers[2].objects[0].y-1100,'check');
  this.checkpoint2.scale.setTo(0.5,0.5);
  this.checkpoint3=this.game.add.sprite(this.levelData.layers[2].objects[0].x-100,this.levelData.layers[2].objects[0].y-1600,'check');
  this.checkpoint3.scale.setTo(0.5,0.5);
  this.checkpoint4=this.game.add.sprite(this.levelData.layers[2].objects[0].x+400,this.levelData.layers[2].objects[0].y-100,'check');
  this.checkpoint4.scale.setTo(0.5,0.5);
  
  this.game.physics.enable([ this.checkpoint1,this.checkpoint2,this.checkpoint3,this.checkpoint4 ], Phaser.Physics.ARCADE);
  this.checkpoint4.body.setSize(100,300);
  this.checkpoint3.body.setSize(300,100);
  this.checkpoint2.body.setSize(100,300);
  this.checkpoint1.body.setSize(300,100);
  //CASCO
  this.casco=this.game.add.sprite(this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y,'casco',2);
  this.casco.scale.setTo(0.5,0.5);
  this.casco.fixedToCamera=true;
  this.casco.cameraOffset.setTo(30,85);
  this.walk=this.casco.animations.add('walk');
  this.casco.animations.play('walk',1,true); 
  //POSICIONES
  this.pos=this.game.add.sprite(this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y,'posiciones',4);
  this.pos.fixedToCamera=true;
  this.pos.scale.setTo(0.7,0.7);
  this.pos.cameraOffset.setTo(80,95);
  
  //inicializamos en cursors la deteccion de cursores
  
  this.enemies=this.game.add.group();
  this.enemies.add(this.enemy);
  this.enemies.add(this.enemy2);
  this.enemies.add(this.enemy3);
  //Creamos un arma
 
  this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  this.weapon.fireRate=1000;
  this.weapon.trackSprite(this.jugador,30,0,true);
//Creamos un boton para el disparo
  
  //this.game.camera.follow(jugador.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
  console.log(this.jugador);
  console.log(this.enemy);
},

update: function() {
  //UPDATE DE MOVIMIENTO
  this.weapon.bulletSpeed =500+this.jugador.velocity;
  this.game.debug.body(this.checkpoint4);
  this.game.debug.body(this.checkpoint3);
  this.game.debug.body(this.checkpoint2);
  this.game.debug.body(this.checkpoint1);
  this.pos.frame=this.jugador.posicion;
  this.lapsCounter.frame=this.contador;
   
  //UPDATE DE DETECCIÓN DE ELEMENTOS DEL MAPA

  //JUGADOR
  // this.jugador.update(this.cursors,this.fireButton,this.weapon);
  
   this.jugador.checks(this.game,this.checkpoint1,this.checkpoint2,this.checkpoint3,this.checkpoint4,this.contador);
   this.jugador.muerte(this.game, this.holesGroup, this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y,this.checkpoint1,
   this.checkpoint1,this.checkpoint3,this.checkpoint4);
   this.jugador.detectaCharco(this.charcosGroup,this.game);
   this.jugador.Patinar(this.game,this.resbalaGroups);
   this.jugador.muro(this.mapCollidersGroup,this.game);
   this.jugador.detectaCoche(this.jugador,this.game,this.enemies,this.enemy,this.jugador);
   
   //ENEMIGOS

   this.enemy.congelado(this.weapon,this.congelado);
   this.enemy2.congelado(this.weapon,this.congelado);
   this.enemy3.congelado(this.weapon,this.congelado,'enemyCongelado' , 'carEnemy');
   this.enemy.sumarvuelta(this.game,this.checkpoint4);
   this.enemy2.sumarvuelta(this.game,this.checkpoint4);
   this.enemy3.sumarvuelta(this.game,this.checkpoint4);
   this.enemy.checks(this.game,this.checkpoint1,this.checkpoint2,this.checkpoint3,this.checkpoint4);
   this.enemy2.checks(this.game,this.checkpoint1,this.checkpoint2,this.checkpoint3,this.checkpoint4);
   this.enemy3.checks(this.game,this.checkpoint1,this.checkpoint2,this.checkpoint3,this.checkpoint4);
   //LOGS
  // console.log(this.contador);
   
    if(this.jugador.contador==4)
    {
      this.jugador.contador=0;
      this.contador--;
      this.jugador.numVueltas++;
    }
   

  // for(var i = 0; i < this.puntos; i++)
  //{
    // this.game.debug.body(this.banderas[i]);
  //}
   
  /*****************/
  //ESTA PARTE DEL CÓDIGO DEFINE A QUIEN SIGUE LA CÁMARA EN FUNCIÓN DE SI EL JUGADOR HA CAIDO EN UN AGUJERO O NO
  this.game.debug.body(this.jugador);
   if(this.jugador.alive)
   this.game.camera.follow(this.jugador, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
   else this.game.camera.follow(this.enemy, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
  },

render: function() {
}

};

module.exports = PlayScene;