
//CONSTRUCTORA DE ELEMENTOS DEL MAPA
var gameObject = function(game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY)
{
  Phaser.Sprite.call(this, game, posX, posY, sprite);
  this.disparar=true;
  //this = game.add.sprite(posX, posY, sprite);
  this.anchor.set(anchorX, anchorY);
  this.scale.setTo(scaleX, sacaleY);
  this.game.physics.enable(this,Phaser.Physics.ARCADE);
  
  this.body.immovable = false;
  this.body.mass=100;
  this.body.colliderWorldBounds = true;
  this.body.bounce.setTo(1, 1);
  this.allowRotation = true;
  
}
gameObject.prototype = Object.create(Phaser.Sprite.prototype);
gameObject.prototype.constructor = gameObject;

//CONSTRUCOTRA DE VEHICULOS
var vehicle = function(game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY)
{
  
  this.contador=0;
  this.able=true;
  this.posicion=0;
  this.numVueltas=0;
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
 
  this.game = game;
  vehicle.call(this, game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY);
};
player.prototype = Object.create(vehicle.prototype);
player.prototype.constructor = player;

//CONSTRUCTORA DE ENEMIGO
var enemigo=function(game, turnRate, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY, road)
{
  
  this.currentFlag = 0;
  this.turnRate = turnRate;
  this.game = game;
  this.aimOnFlag = false;
  vehicle.call(this, game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY);
  this.road = road;
};
enemigo.prototype = Object.create(vehicle.prototype);
enemigo.prototype.constructor = enemigo;

//UPDATE ENEMIGO, SIGUE BANDERAS
enemigo.prototype.update = function()
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
 // console.log(this.road);
  var targetAngle = this.game.physics.arcade.angleBetween(this, this.road[this.currentFlag]);
 
//comprobamos angulo para aplicar el giro

  if(this.rotation !== targetAngle)
  {
    var delta = targetAngle - this.rotation;

  
    if(delta > Math.PI) delta -= Math.PI * 2;
    if(delta < -Math.PI) delta += Math.PI * 2;

    if(delta > 0)
    {
      this.angle += this.turnRate;
    }
    else
    {
      this.angle -= this.turnRate;
    }

    if(Math.abs(delta) < this.game.math.degToRad(this.turnRate))
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
  this.game.physics.arcade.velocityFromRotation(this.rotation, this.velocity, this.body.velocity); 
}
//al llegar a una bandera se pasará a la siguiente
this.game.physics.arcade.overlap(this, this.road[this.currentFlag],
  function()
  {
    if(this.currentFlag >= this.road.length-1)
    this.currentFlag = 0;
    else
    this.currentFlag++;
    
    this.aimOnFlag = false;
  }
  ,null,this);
}

enemigo.prototype.congelado=function(weapon,congelado)
{
 
  this.game.physics.arcade.collide(this,weapon.bullets,
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
vehicle.prototype.checks=function(game,checkpoint1,checkpoint2,checkpoint3,checkpoint4,contador)
{
  game.physics.arcade.overlap(this,checkpoint1,
    
    function()
    {
      if(this.contador==0) this.contador++;
    }
    ,null,this);

  game.physics.arcade.overlap(this,checkpoint2,
      
     function()
     {
      if(this.contador==1) this.contador++;
     }
    ,null,this);

   game.physics.arcade.overlap(this,checkpoint3,
        
     function()
     {
      if(this.contador==2) this.contador++;
     }
    ,null,this);

  game.physics.arcade.overlap(this,checkpoint4,
      
    function()
     {
      if(this.contador==3) this.contador++;
     }
    ,null,this);
    
    

}

vehicle.prototype.sumarvuelta=function(game,checkpoint4)
{
  game.physics.arcade.overlap(this,checkpoint4,
    
    function()
    {
      if(this.able && this.contador==3)
      {
      this.numVueltas++;
      this.able=false;
      game.time.events.add(Phaser.Timer.SECOND*1.5,
        
        function()
        {
          this.able=true;
        },
      this)
      }
    }
    
    ,null,this);
}
player.prototype.update = function(cursors,firebutton,weapon)
{

  if(this.velocity!=0)
  {
  if(cursors.left.isDown){ this.angle -= 2; }

  else if(cursors.right.isDown){ this.angle += 2; }
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
    this.game.time.events.add(Phaser.Timer.SECOND*5,
      
      function()
      {
       this.disparar=true;
      },
    this)
  }
  if(!this.deslizar)
    this.game.physics.arcade.velocityFromRotation(this.rotation, this.velocity, this.body.velocity); 
  else this.game.physics.arcade.accelerationFromRotation(this.rotation, this.velocity, this.body.acceleration);

  this.game.world.wrap(this, 16);
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
  game.physics.arcade.overlap(this,group,
    function()
    {
      this.relentizar = true;
      this.MaxVelocity = 60;
      this.MinVelocity = -60;
    },
     null, this);
}

vehicle.prototype.muro=function(group,game)
{
  game.physics.arcade.collide(this,group,
    
    function()
    {
      
    }
    
    ,null,this);
}


vehicle.prototype.detectaCoche=function(sprite,game,group)
{
  game.physics.arcade.collide(sprite,group,
    
    function()
    {
      
    }
    
    ,null,this);
}

vehicle.prototype.muerte=function(game,agujero,x,y,checkpoint1,checkpoint2,checkpoint3,checkpoint4)
{
game.physics.arcade.collide(this,agujero,

  function()
  {
    this.velocity = 0;
    this.kill();
    game.time.events.add(Phaser.Timer.SECOND*1.5,
    
    function()
    {
      if(this.contador==1) this.reset(checkpoint1.x, checkpoint1.y);
      else if (this.contador==2) this.reset(checkpoint2.x, checkpoint2.y);
      else if (this.contador==3) this.reset(checkpoint3.x, checkpoint3.y);
      else this.reset(x, y);
    },
  this)
  },
null,this);
};


vehicle.prototype.Patinar=function(game,group)
{

this.deslizar=false;
  game.physics.arcade.overlap(this,group   ,

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
