
//CONSTRUCTORA DE ELEMENTOS DEL MAPA
var gameObject = function(game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY)
{
  
  this.sprite = game.add.sprite(posX, posY, sprite);
  this.sprite.anchor.set(anchorX, anchorY);
  this.sprite.scale.setTo(scaleX, sacaleY);
  game.physics.enable(this.sprite,Phaser.Physics.ARCADE);
  
  this.sprite.body.immovable = false;
  this.sprite.body.colliderWorldBounds = true;
  this.sprite.body.bounce.setTo(1, 1);
  this.sprite.allowRotation = true;
}

//CONSTRUCOTRA DE VEHICULOS
var vehicle = function(game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY)
{
  this.deslizar=false;
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

  game.physics.arcade.velocityFromRotation(this.sprite.rotation, this.velocity, this.sprite.body.velocity); 

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
 player.prototype.update = function(cursors,game,charco)
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
  if(!this.deslizar)
    game.physics.arcade.velocityFromRotation(this.sprite.rotation, this.velocity, this.sprite.body.velocity); 
  else game.physics.arcade.accelerationFromRotation(this.sprite.rotation, this.velocity, this.sprite.body.acceleration);
};

vehicle.prototype.detectaCoche=function(sprite,game,enemigoSprite,enemigo,jugador)
{
  game.physics.arcade.collide(sprite,enemigoSprite,
    
    function()
    {
      if(jugador.velocity>700)
      {
      enemigo.deslizar=true;
      enemigo.velocity=60;
      this.game.time.events.add(Phaser.Timer.SECOND,
      function()
      {
        enemigo.deslizar=false;
        jugador.deslizar=false;
      }
      ,this)
     }
  }
    
    ,null,this);
}

vehicle.prototype.detectaCharco = function(game, charco)
{

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
};

vehicle.prototype.muerte=function(game,agujero)
{
game.physics.arcade.collide(this.sprite,agujero,

  function()
  {
    this.velocity = 0;
    this.sprite.kill();
    game.time.events.add(Phaser.Timer.SECOND*1.5,
    
    function()
    {
      this.sprite.reset(5500,5000);
    },
  this)
  },
null,this);
};

vehicle.prototype.crearCollide=function(game)
{
  if((this.sprite.angle>135 && this.sprite.angle<225) || (this.sprite.angle>315 && this.sprite.angle<360) ||(this.sprite.angle>0 && this.sprite.angle<45))
  this.sprite.body.setSize(240,100,5,65); 
  else this.sprite.body.setSize(100,240,80,5);
};

vehicle.prototype.Patinar=function(game,aceite)
{

this.deslizar=false;
  game.physics.arcade.overlap(this.sprite,aceite,

    function()
    {
      this.deslizar=true;
    } 
    ,null,this);

};
  module.exports=
  {
    gameObject,
    vehicle,
    player,
    enemigo,
  }
