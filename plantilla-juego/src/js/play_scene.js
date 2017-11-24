'use strict';
//VEHICULOS

var coche=require('./Vehiculo.js');

var land;
var cursors;
var jugador;

var PlayScene=
{

preload: function() {
    this.game.load.image('road', '../images/carreteras.jpg');
    this.game.load.image('car', '../images/coche.png');
},

create: function() {
  //colocamos el fondo
  this.game.add.tileSprite(0,0, 1600, 1700, 'road');
  this.game.world.setBounds(0,0, 1600, 1700);

  //Iniciamos las fisicas de arcade
  this.game.physics.startSystem(Phaser.Physics.ARCADE);

  //creamos al jugador
  jugador= new coche.player(this.game);

  //inicializamos en cursors la deteccion de cursores
  cursors = this.game.input.keyboard.createCursorKeys();

  this.game.camera.follow(jugador.image, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
},

update: function() {
 jugador.update(cursors,this.game);
},


render: function() {
}

};

module.exports= PlayScene;