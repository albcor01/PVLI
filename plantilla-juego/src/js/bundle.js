(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var vehicle = function(game)//tipo indica si es el jugador o es un enemigo enemigo
{
  this.velocity = 0;
  this.acceleration = 6;
  this.MaxVelocity = 300;
  this.MinVelocity =-150;  
  this.alive = true;
  this.spriteCoche = game.add.sprite(300, 300, 'car');
  this.spriteCoche.anchor.set(0.5,0.5);
  this.spriteCoche.scale.setTo(0.1, 0.1);
  game.physics.enable(this.spriteCoche,Phaser.Physics.ARCADE);
  this.spriteCoche.body.immovable = true;
  this.spriteCoche.body.colliderWorldBounds = true;
  this.spriteCoche.body.bounce.setTo(1, 1);
  this.spriteCoche.allowRotation=true;
};

var player=function(game)
{
  this.game=game;
  vehicle.call(this, game);
};
player.prototype = Object.create(vehicle.prototype);
player.prototype.constructor = player;


var enemigo=function(game, turnRate)
{
  this.currentFlag = 0;
  this.turnRate = turnRate;
  this.game = game;
  vehicle.call(this, game);
};
enemigo.prototype = Object.create(vehicle.prototype);
enemigo.prototype.constructor = enemigo;

enemigo.prototype.update = function(game, point)
{
  
  var targetAngle = game.physics.arcade.angleBetween(this.spriteCoche, point[this.currentFlag]);

  if(this.spriteCoche.rotation !== targetAngle)
  {
    var delta = targetAngle - this.spriteCoche.rotation;

    if(delta > Math.PI) delta -= Math.PI * 2;
    if(delta < -Math.PI) delta += Math.PI * 2;

    if(delta > 0)
    {
      this.spriteCoche.angle += this.turnRate;
    }
    else
    {
      this.spriteCoche.angle -= this.turnRate;
    }

    if(Math.abs(delta) < game.math.degToRad(this.turnRate))
    {
      this.rotation = targetAngle;
    }
  }

  if(this.velocity < this.MaxVelocity)
  this.velocity += this.acceleration;

{
  game.physics.arcade.velocityFromRotation(this.spriteCoche.rotation, this.velocity, this.spriteCoche.body.velocity); 
}

this.game.physics.arcade.overlap(this.spriteCoche, point[this.currentFlag],
  function()
  {
    if(this.currentFlag >= 5)
    this.currentFlag = 0;
    else
    this.currentFlag++;
    
  }
  ,null,this);



}

 player.prototype.update = function(cursors,game)
{

  if(this.velocity!=0)
  {
  if(cursors.left.isDown){ this.spriteCoche.angle -= 2; }

  else if(cursors.right.isDown){ this.spriteCoche.angle += 2; }
  }

   if(cursors.up.isDown)
  { 
    this.velocity += this.acceleration; 

    if(this.velocity > this.MaxVelocity)
    this.velocity = this.MaxVelocity;
  }
  else if(cursors.down.isDown)
  { 
    this.velocity -= this.acceleration; 

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
    game.physics.arcade.velocityFromRotation(this.spriteCoche.rotation, this.velocity, this.spriteCoche.body.velocity); 
  }
  
};

  module.exports=
  {
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

var coche=require('./Vehiculo.js');

var land;
var cursors;
var jugador;
var enemy;
var relentizar;
var banderas = [];
var PlayScene=
{

preload: function() {
    this.game.load.image('road', '../images/carreteras.jpg');
    this.game.load.image('car', '../images/coche.png');
    this.game.load.image('charco','images/charco.png');
    this.game.load.image('bandera','images/banderita.png');
},

create: function() {
  //Iniciamos las fisicas de arcade
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  //colocamos el fondo
  this.game.add.tileSprite(0,0, 1600, 1700, 'road');
  //Creamos el sprite y le damos características
  this.sprite=this.game.add.sprite(100,100,'charco');
  this.game.physics.enable(this.sprite,Phaser.Physics.ARCADE);
  this.sprite.scale.setTo(0.15, 0.6);
  this.sprite.name='charco';
  this.sprite.body.collideWorldBounds = true;
  this.sprite.body.immovable = true;
  this.sprite.body.setSize(700, 100);
  this.sprite.body.x=300; 
  this.sprite.anchor.set(0,0);
  
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
 



  this.game.world.setBounds(0,0, 1600, 1700);

  

  //creamos al jugador
  jugador = new coche.player(this.game)
  enemy = new coche.enemigo(this.game, 2);

  //inicializamos en cursors la deteccion de cursores
  cursors = this.game.input.keyboard.createCursorKeys();

  this.game.camera.follow(jugador.spriteCoche, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
},

update: function() {
  //ESTO DEBE SER UNA FUNCION DE VEHICULO QUE LO LLAME TANTO JUGADOR COMO ENEMY 
  relentizar=false;
  if(!relentizar)
  {
    jugador.MaxVelocity=300;
    jugador.MinVelocity=-150;
  }
  this.game.physics.arcade.overlap(jugador.spriteCoche,this.sprite,
    function()
    {
      relentizar=true;
      jugador.MaxVelocity=60;
      jugador.MinVelocity=-60;
    }
    ,null,this);

 jugador.update(cursors, this.game);
 enemy.update(this.game, banderas);
},

render: function() {
}

};

module.exports = PlayScene;
},{"./Vehiculo.js":1}]},{},[2]);
