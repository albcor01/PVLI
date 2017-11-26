'use strict';
//VEHICULOS

var coche=require('./Vehiculo.js');

var land;
var cursors;
var jugador;
var relentizar;
var PlayScene=
{

preload: function() {
    this.game.load.image('road', '../images/carreteras.jpg');
    this.game.load.image('car', '../images/coche.png');
    this.game.load.image('charco','images/charco.png');
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
  this.sprite.body.setSize(700,100);
  this.sprite.body.x=300; 
  this.sprite.anchor.set(0,0);
 // sprite.body.Position=new Phaser.Point(10000,300);
  
  

  this.game.world.setBounds(0,0, 1600, 1700);

  

  //creamos al jugador
  jugador= new coche.player(this.game);

  //inicializamos en cursors la deteccion de cursores
  cursors = this.game.input.keyboard.createCursorKeys();

  this.game.camera.follow(jugador.image,Phaser.Camera,any.FOLLOW_LOCKON, 0.1, 0.1);
},

update: function() {
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
 jugador.update(cursors,this.game);
 this.game.debug.body(this.sprite);
 this.game.debug.body(jugador.spriteCoche);
},

render: function() {
}

};

module.exports= PlayScene;