'use strict';
//VEHICULOS
var vehicle = function(velocity, acceleration, tipo)//tipo indica si es el jugador o es un enemigo enemigo
{
  this.velocity = 0;
  this.acceleration = acceleration;
  this.MaxVelocity = velocity;
  this.alive = true;
  this.tipo = tipo //booleano que indica true (para player) false (para enemigo)
  
  this.image = game.add.sprite(300, 300, 'car');
  this.image.anchor.set(0.5,0.5);
  this.image.scale.setTo(0.1, 0.1);
  game.physics.enable(this.image, Phaser.Physics.ARCADE);
  this.image.body.immovable = false;
  this.image.body.colliderWorldBounds = true;
  this.image.body.bounce.setTo(1, 1);

};

vehicle.prototype.update = function(cursors)
{
  if(cursors.left.isDown && this.velocity > 0){ this.image.angle -= 2; }

  else if(cursors.right.isDown && this.velocity > 0){ this.image.angle += 2; }

  if(cursors.up.isDown)
  { 
    this.velocity += this.acceleration; 

    if(this.velocity > this.MaxVelocity)
    this.velocity = this.MaxVelocity;
  }
  else
  {
    if(this.velocity >= 0)
    {
      this.velocity -= this.acceleration;
    }
    else this.velocity = 0;
  }

  if(this.velocity > 0)
  { game.physics.arcade.velocityFromRotation(this.image.rotation, this.velocity, this.image.body.velocity); }
}




var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('road', '../images/carreteras.jpg');
    game.load.image('car', '../images/coche.png');
}

var player;
var land;
var cursors;

function create() {
  //colocamos el fondo
  game.add.tileSprite(0,0, 1600, 1700, 'road');
  game.world.setBounds(0,0, 1600, 1700);

  //Iniciamos las fisicas de arcade
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //creamos al jugador
  player = new vehicle(500, 4, true);

  //inicializamos en cursors la deteccion de cursores
  cursors = game.input.keyboard.createCursorKeys();

  game.camera.follow(player.image, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
}

function update() {
 player.update(cursors);
}

function render() {
}
