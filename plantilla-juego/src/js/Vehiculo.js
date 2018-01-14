
var audio = require('./AudioSrc.js');

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
var vehicle = function(game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY,checkA)
{
  this.morir=true;
  this.restar=true;
  this.checkA=checkA;
  this.contador=-1;
  this.able=true;
  this.numVueltas=0;
  this.game = game
  this.velocity = 0;
  this.acceleration = 5;
  this.currentMaxVelocity = 600;
  this.MaxVelocity = 600;
  this.MinVelocity =-200;  
  this.alive = true;
  this.CanMove = false;

  gameObject.call(this, game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY,checkA);
};
vehicle.prototype = Object.create(gameObject.prototype);
vehicle.prototype.constructor = vehicle;

//CONSTRUCTORA DE PLAYER
var player=function(game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY,cursors,firebutton,weapon,checkA)
{
  this.newR=this.rotation;
  this.newPx=posX;
  this.newPy=posY;
  this.perdido=false;
  this.posicion=3;
  this.game = game;
  this.cursors=cursors;
  this.firebutton=firebutton;
  this.weapon=weapon;
  vehicle.call(this, game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY,checkA);
};
player.prototype = Object.create(vehicle.prototype);
player.prototype.constructor = player;

//CONSTRUCTORA DE ENEMIGO
var enemigo=function(game, turnRate, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY, road,checkA)
{
  
  this.currentFlag = 0;
  this.turnRate = turnRate;
  this.game = game;
  this.aimOnFlag = false;
  vehicle.call(this, game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY,checkA);
  this.road = road;
};
enemigo.prototype = Object.create(vehicle.prototype);
enemigo.prototype.constructor = enemigo;



//UPDATE ENEMIGO, SIGUE BANDERAS

enemigo.prototype.update = function()
{
  if(this.CanMove){
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
vehicle.prototype.checks=function(game,chekG,contador,enemies,jugador,agujero)
{
  game.physics.arcade.overlap(this,chekG,
    function(chekG,sprite)
    {
    if(sprite===this.checkA.children[this.contador+1]) 
    { 
      this.contador++;
      if(this===jugador)
      {
         this.newR=this.rotation;
         this.newPx=this.x;
         this.newPy=this.y;
      }
    }
    else if(sprite!=this.checkA.children[this.contador+1]&&this===jugador&&sprite!=this.checkA.children
      [this.contador]&&this===jugador&&this.morir)
    {
     if(this.contador>=0&&this===jugador)
     {
        this.reset(this.newPx,this.newPy);
        this.rotation=this.newR;
     }
     
    }
    if(sprite===this.checkA.children[1]) this.restar=true;
    if(this===jugador) jugador.pos(enemies);
    
    }
    ,null,this);
}

vehicle.prototype.activateMovement=function()
{
  this.CanMove = true;
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

player.prototype.pos=function(enemies)
{
  this.posicion=3;
    for(var i=0;i<enemies.length;i++)
    {
    if(this.contador>enemies.children[i].contador&&this.numVueltas===enemies.children[i].numVueltas) this.posicion--; 
    else if(this.numVueltas>enemies.children[i].numVueltas)this.posicion--;
    }
}
player.prototype.update = function()
{
  
  if(this.CanMove){
  if(this.velocity!=0)
  {
  if(this.cursors.left.isDown){ this.angle -= 2; }

  else if(this.cursors.right.isDown){ this.angle += 2; }
  }

   if(this.cursors.up.isDown)
  { 
    if(!audio.isPlaying){
    audio.playEngineSound(this.game);
    }
    this.velocity += this.acceleration; 

    if(this.velocity > this.MaxVelocity)
    this.velocity = this.MaxVelocity;
  }
  else if(this.cursors.down.isDown)
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

  if(this.firebutton.downDuration(1)&&this.disparar)
  {
    this.weapon.fire();
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
}
};

vehicle.prototype.detectaCharco = function(group,game)
{
  
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
      this.MaxVelocity = 150;
      this.MinVelocity = -60;
    },
     null, this);
}

vehicle.prototype.muro=function(group,game)
{
  game.physics.arcade.collide(this,group,
    
    function()
    {
      if(this.velocity > 150)
      audio.playCollisionSound(game);
      this.velocity = 100;
    }
    
    ,null,this);
}


vehicle.prototype.detectaCoche=function(sprite,game,group)
{
  game.physics.arcade.collide(sprite,group,
    
    function()
    {
      if(this.velocity > 400)
      audio.playCollisionSound(game);
      this.velocity = 350;
    }
    
    ,null,this);
}

vehicle.prototype.muerte=function(game,agujero,checkG)
{
game.physics.arcade.collide(this,agujero,

  function()
  {
    this.velocity = 0;
    this.kill();
    game.time.events.add(Phaser.Timer.SECOND*1.5,
    
    function()
    {
      if(this.contador-1>=0)
     this.reset(checkG.children[this.contador-1].x,checkG.children[this.contador-1].y);
     else this.reset(checkG.children[0].x,checkG.children[0].y);
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
