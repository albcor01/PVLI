var vehicle = function(game)//tipo indica si es el jugador o es un enemigo enemigo
{
  this.velocity = 0;
  this.acceleration = 6;  
  this.MaxVelocity = 300;
  this.MinVelocity =-150;
  this.alive = true;

  this.image = game.add.sprite(300, 300, 'car');
  this.image.anchor.set(0.5,0.5);
  this.image.scale.setTo(0.1, 0.1);
  game.physics.enable(this.image, Phaser.Physics.ARCADE);
  this.image.body.immovable = false;
  this.image.body.colliderWorldBounds = true;
  this.image.body.bounce.setTo(1, 1);
};

var player=function(game  )
{
  this.game=game;
  vehicle.call(this,game);
};
player.prototype=Object.create(vehicle.prototype);
player.prototype.constructor= player;


var enemigo=function()
{
  enemigo=Object.create(vehicle.prototype);
  enemigo.prototype.constructor=enemigo;
};

 player.prototype.update = function(cursors,game)
{

  if(this.velocity!=0)
  {
  if(cursors.left.isDown){ this.image.angle -= 2; }

  else if(cursors.right.isDown){ this.image.angle += 2; }
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


  { game.physics.arcade.velocityFromRotation(this.image.rotation, this.velocity, this.image.body.velocity); }
};

  module.exports=
  {
    vehicle,
    player,
  }

 /* else
  {
    if(this.velocity >= 0)
    {
      this.velocity -= this.acceleration;
    }
    else this.velocity = 0;
  }
  */

  //if(this.velocity > 0)
 
