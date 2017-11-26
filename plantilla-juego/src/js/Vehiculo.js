
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
