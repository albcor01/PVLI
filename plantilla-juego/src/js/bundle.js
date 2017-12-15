(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

//CONSTRUCTORA DE ELEMENTOS DEL MAPA
var gameObject = function(game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY)
{
  
  this.sprite = game.add.sprite(posX, posY, sprite);
  this.sprite.anchor.set(anchorX, anchorY);
  this.sprite.scale.setTo(scaleX, sacaleY);
  game.physics.enable(this.sprite,Phaser.Physics.ARCADE);
  
  this.sprite.body.immovable = true;
  this.sprite.body.colliderWorldBounds = true;
  this.sprite.body.bounce.setTo(1, 1);
  this.sprite.allowRotation = true;
}

//CONSTRUCOTRA DE VEHICULOS
var vehicle = function(game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY)
{
  this.game = game
  this.velocity = 0;
  this.acceleration = 5;
  this.MaxVelocity = 100;
  this.MinVelocity =-100;  
  this.alive = true;
 
  gameObject.call(this, game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY);
};
vehicle.prototype = Object.create(gameObject.prototype);
vehicle.prototype.constructor = vehicle;

//CONSTRUCTORA DE PLAYER
var player=function(game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY)
{
  this.game=game;
  vehicle.call(this, game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY);
};
player.prototype = Object.create(vehicle.prototype);
player.prototype.constructor = player;

//CONSTRUCTORA DE ENEMIGO
var enemigo=function(game, turnRate, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY)
{
  this.currentFlag = 0;
  this.turnRate = turnRate;
  this.game = game;
  vehicle.call(this, game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY);
};
enemigo.prototype = Object.create(vehicle.prototype);
enemigo.prototype.constructor = enemigo;

//UPDATE ENEMIGO, SIGUE BANDERAS
enemigo.prototype.update = function(game, point)
{
  var targetAngle = game.physics.arcade.angleBetween(this.sprite, point[this.currentFlag]);

  if(this.sprite.rotation !== targetAngle)
  {
    var delta = targetAngle - this.sprite.rotation;

    if(delta > Math.PI) delta -= Math.PI * 2;
    if(delta < -Math.PI) delta += Math.PI * 2;

    if(delta > 0)
    {
      this.sprite.angle += this.turnRate;
    }
    else
    {
      this.sprite.angle -= this.turnRate;
    }

    if(Math.abs(delta) < game.math.degToRad(this.turnRate))
    {
      this.rotation = targetAngle;
    }
  }

  if(this.velocity < this.MaxVelocity)
  this.velocity += this.acceleration;

{
  game.physics.arcade.velocityFromRotation(this.sprite.rotation, this.velocity, this.sprite.body.velocity); 
}

//console.log(this.sprite.body.x);
//console.log(point[this.currentFlag].x);
/*if((this.sprite.body.x <= point[this.currentFlag].x + 1 && this.sprite.body.x <= point[this.currentFlag].x - 1)
    && (this.sprite.body.y <= point[this.currentFlag].y + 1 && this.sprite.body.y <= point[this.currentFlag].y - 1))
{
  console.log(this.currentFlag);
  if(this.currentFlag >= point.length-1)
  this.currentFlag = 0;
  else
  this.currentFlag++;
}*/


this.game.physics.arcade.overlap(this.sprite, point[this.currentFlag],
  function()
  {
    if(this.currentFlag >= point.length-1)
    this.currentFlag = 0;
    else
    this.currentFlag++;
    
  }
  ,null,this);
}

//UPDATE PLAYER, DETECTA IMPUTS
 player.prototype.update = function(cursors,game)
{

  if(this.velocity!=0)
  {
  if(cursors.left.isDown){ this.sprite.angle -= 2; }

  else if(cursors.right.isDown){ this.sprite.angle += 2; }
  }

   if(cursors.up.isDown)
  { 
    this.velocity += this.acceleration; 

    if(this.velocity > this.MaxVelocity)
    this.velocity = this.MaxVelocity;
  }
  else if(cursors.down.isDown)
  { 
    this.velocity -= this.acceleration*3; 

    if(this.velocity < this.MinVelocity)
    this.velocity = this.MinVelocity;
  }
  else if(this.velocity>0)
  {
    this.velocity-=this.acceleration;
  }

  else if(this.velocity<0)
  {
    this.velocity+=this.acceleration;
  } 

  { 
    game.physics.arcade.velocityFromRotation(this.sprite.rotation, this.velocity, this.sprite.body.velocity); 
  }
};

vehicle.prototype.detectaCharco = function(game, charco)
{
  
  //game.debug.body(charco);
  //game.debug.body(this.sprite);
  this.relentizar=false;
  if(!this.relentizar)
  {
    this.MaxVelocity=900;
    this.MinVelocity=-200;
  }
  game.physics.arcade.overlap(this.sprite, charco,
    function()
    {
      this.relentizar = true;
      this.MaxVelocity = 60;
      this.MinVelocity = -60;
    },
     null, this);
}

  module.exports=
  {
    gameObject,
    vehicle,
    player,
    enemigo,
  }

},{}],2:[function(require,module,exports){
  'use strict';

  var PlayScene = require('./play_scene.js');
  var vehicle=require('./Vehiculo.js');

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
     
      // TODO: load here the assets for the game
      this.game.load.image('logo', 'images/phaser.png');
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

},{"./Vehiculo.js":1,"./play_scene.js":3}],3:[function(require,module,exports){
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
},{"./Vehiculo.js":1}]},{},[2]);
