
//CONSTRUCTORA DE ELEMENTOS DEL MAPA
var gameObject = function(game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY)
{
  this.disparar=true;
  this.sprite = game.add.sprite(posX, posY, sprite);
  this.sprite.anchor.set(anchorX, anchorY);
  this.sprite.scale.setTo(scaleX, sacaleY);
  game.physics.enable(this.sprite,Phaser.Physics.ARCADE);
  
  this.sprite.body.immovable = false;
  this.sprite.body.mass=100;
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
  this.currentMaxVelocity = 600;
  this.MaxVelocity = 600;
  this.MinVelocity =-200;  
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
  this.aimOnFlag = false;
  vehicle.call(this, game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY);
};
enemigo.prototype = Object.create(vehicle.prototype);
enemigo.prototype.constructor = enemigo;

//UPDATE ENEMIGO, SIGUE BANDERAS
enemigo.prototype.update = function(game, point)
{
  //game.debug.body(point[this.currentFlag]); //CON ESTO VEO LA POSICION A LA QUE ME MUEVO COMO ENENMIGO
  //factor conversor de radianes a grados
  var radianToDegreesFactor = 180 / Math.PI;
  //PARA EVITAR QUE EL VEHICULO VIBRE POR LAS PEQUEÑAS DIFERENCIAS DE ÁNGULO
  //HACEMOS QUE SOLO CALCULE EL ANGULO PARA GIRAR CUANDO EL VEHICULO
  //NO ESTÉ ENFILANDO LA BANDERA, EN CUYO CASO ESTE SE MOVERÁ HACIA ADELANTE
  //PARA ALCANZARLA
  
  if(!this.aimOnFlag){
   // this.temp = this.MaxVelocity
    this.MaxVelocity = this.MaxVelocity/3;
//calculo angulo entre coche y bandera
  var targetAngle = game.physics.arcade.angleBetween(this.sprite, point[this.currentFlag]);
 
//comprobamos angulo para aplicar el giro

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

  if(delta * radianToDegreesFactor < 2 && delta * radianToDegreesFactor > -2){
  this.aimOnFlag = true;
 
 }

}
else
{
  this.MaxVelocity = this.currentMaxVelocity;
}

if(this.velocity < this.MaxVelocity){
  this.velocity += this.acceleration;
  } else { this.velocity -= this.acceleration-1; }
  

{
  game.physics.arcade.velocityFromRotation(this.sprite.rotation, this.velocity, this.sprite.body.velocity); 
}
//al llegar a una bandera se pasará a la siguiente
this.game.physics.arcade.overlap(this.sprite, point[this.currentFlag],
  function()
  {
    if(this.currentFlag >= point.length-1)
    this.currentFlag = 0;
    else
    this.currentFlag++;
    
    this.aimOnFlag = false;
  }
  ,null,this);
}

enemigo.prototype.congelado=function(weapon,congelado)
{
 
  this.game.physics.arcade.collide(this.sprite,weapon.bullets,
    function(sprite,bullet)
    { 
     bullet.kill();
     this.velocity=0;
     this.acceleration=0;
      this.game.time.events.add(Phaser.Timer.SECOND*1.5,
        function()
        { 
        this.acceleration=5;
        }
        ,this)
    }
    ,null,this);
}

player.prototype.update = function(cursors,game,firebutton,weapon)
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

  if(firebutton.downDuration(1)&&this.disparar)
  {
    weapon.fire();
    this.disparar=false;
    game.time.events.add(Phaser.Timer.SECOND*5,
      
      function()
      {
       this.disparar=true;
      },
    this)
  }
  if(!this.deslizar)
    game.physics.arcade.velocityFromRotation(this.sprite.rotation, this.velocity, this.sprite.body.velocity); 
  else game.physics.arcade.accelerationFromRotation(this.sprite.rotation, this.velocity, this.sprite.body.acceleration);

  game.world.wrap(this.sprite, 16);
};

vehicle.prototype.detectaCharco = function(group,game)
{
  
  //game.debug.body(charco);
  //game.debug.body(this.sprite);
  this.relentizar=false;
  if(!this.relentizar)
  {
    this.MaxVelocity=600;
    this.MinVelocity=-200;
  }
  game.physics.arcade.overlap(this.sprite,group,
    function()
    {
      this.relentizar = true;
      this.MaxVelocity = 60;
      this.MinVelocity = -60;
    },
     null, this);
}

vehicle.prototype.detectaCoche=function(sprite,game,group)
{
  game.physics.arcade.collide(sprite,group,
    
    function()
    {
      
    }
    
    ,null,this);
}

vehicle.prototype.muerte=function(game,agujero, x, y)
{
game.physics.arcade.collide(this.sprite,agujero,

  function()
  {
    this.velocity = 0;
    this.sprite.kill();
    game.time.events.add(Phaser.Timer.SECOND*1.5,
    
    function()
    {
      this.sprite.reset(x, y);
    },
  this)
  },
null,this);
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
