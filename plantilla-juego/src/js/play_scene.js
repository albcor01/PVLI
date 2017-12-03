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
  this.sprite.body.setSize(700, 100,50,50);
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
  this.game.debug.body(this.sprite);

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