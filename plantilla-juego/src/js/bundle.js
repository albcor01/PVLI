(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var menu;
var carrera1;
var victoria;

var click;
var colision;
var pitido;
var pitidoSalida;
var explosion;
var engine;

//MUSIC
var playMenuSong = function(game){
    menu = game.add.audio('mainS');
    menu.play();
    menu.volume -= 0.6;
    playMenuSong.Stop = function()
    {
        menu.stop();
    };
};


var playRaceSong = function(game){
    carrera1 = game.add.audio('raceS');
    carrera1.play();
    carrera1.volume -= 0.9;
    playRaceSong.Stop = function()
    {
        carrera1.stop();
    };
};

var playClickSound = function(game){
    click = game.add.audio('Bclick');
    click.play();

    playClickSound.Stop = function()
    {
        click.stop();
    };
};

var playCollisionSound = function(game){
    colision = game.add.audio('colision');
    colision.play();
};

var playExplosionSound = function(game){
    explosion = game.add.audio('explosion');
    explosion.play();

    playExplosionSound.Stop = function()
    {
        explosion.stop();
    };
};

var playPitidoSalidaSound = function(game){
    pitidoSalida = game.add.audio('exit');
    pitidoSalida.play();
};

var playPitidoSound = function(game){
    pitido = game.add.audio('wait');
    pitido.play();
};

var playEngineSound = function(game){
    engine = game.add.audio('engine');
    engine.volume -= 0.98;
    engine.play();

    playEngineSound.Stop = function()
    {
        engine.stop();
    };
};

module.exports = 
{
    playMenuSong,
    playRaceSong,
    playClickSound,
    playCollisionSound,
    playExplosionSound,
    playPitidoSalidaSound,
    playPitidoSound,
    playEngineSound,
}
},{}],2:[function(require,module,exports){

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
      this.morir=false;
      game.time.events.add(Phaser.Timer.SECOND*2,
        function()
        {
          this.morir=true;
        },
      this)
      }
    }
    else if(sprite!=this.checkA.children[this.contador+1]&&this===jugador&&this.morir)
    {
     if(this.contador>=0)
     {
        this.reset(this.checkA.children[this.contador].x+this.checkA.children[0].width/2,this.checkA.children[this.contador].y);
        this.rotation=this.newR;
     }
     else if (this.contador===-1)
     {
       this.reset(this.checkA.children[0].x+this.checkA.children[0].width/2,this.checkA.children[0].y);
       this.newR=this.rotation;
     }
        this.morir=false;
        game.time.events.add(Phaser.Timer.SECOND*2,
          function()
          {
            this.morir=true;
          },
        this)
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

},{"./AudioSrc.js":1}],3:[function(require,module,exports){
  'use strict';

  var PlayScene = require('./play_scene.js');
  var vehicle = require('./Vehiculo.js');
  var mainMenu = require('./mainMenu.js');

  var BootScene = {
    preload: function () {
      // load here assets required for the loading screen
     
    },

    create: function () {
      this.game.state.start('preloader');
    }
  };


  var PreloaderScene = {  
    preload: function () { 
      this.game.load.baseURL = 'https://raw.githubusercontent.com/albcor01/PVLI/gh-pages/plantilla-juego/src/';
      this.game.load.crossOrigin = 'anonymous';
    
    //CARGA DEIMAGENES
        this.game.load.tilemap('level1', 'images/levels/Level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.text('level', 'images/levels/Level1.json');
        this.game.load.image('Carreteras', 'images/levels/MicroMachines2-GG-TreehouseTiles.png');
        this.game.load.image('road', 'images/carreteras.jpg');
        this.game.load.image('car', 'images/vehiculos/coche.png');
        this.game.load.image('carEnemy', 'images/vehiculos/cocheEnemy.png');
        this.game.load.image('charco','images/charco.png');
        this.game.load.image('bandera','images/banderita.png');
        this.game.load.image('agujero','images/buhero.png');
        this.game.load.image('aceite','images/aceite.png');
        this.game.load.image('bullet','images/bala.png');
        this.game.load.image('menu', 'images/menu.jpg');
        this.game.load.image('playButton', 'images/play.jpg');
        this.game.load.image('laps','images/Hud/laps.png');
        this.game.load.spritesheet('lapss','images/Hud/LapsCounter.png',55,55,55);
        this.game.load.image('check','images/checkpoint.png');
        this.game.load.spritesheet('casco','images/Hud/casco.png',87,120,2);
        this.game.load.spritesheet('posiciones','images/Hud/pos.png',56,50);
    //CARGA DE AUDIO
        this.game.load.audio('raceS','music/raceTheme.ogg');
        this.game.load.audio('mainS','music/mainTheme.ogg');
        this.game.load.audio('winS','music/winTheme.ogg');
        
        this.game.load.audio('Bclick','sounds/buttonClick.ogg');
        this.game.load.audio('exit','sounds/SalidaSound.ogg');
        this.game.load.audio('wait','sounds/waitSalidaSound.ogg');
        this.game.load.audio('colision','sounds/Collision.ogg');
        this.game.load.audio('engine','sounds/carEngine.ogg');
        
        
    },

    create: function () {
      this.game.state.start('Menu');
    }
  };


  window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

    game.state.add('boot', BootScene);
    game.state.add('preloader', PreloaderScene);
    game.state.add('play', PlayScene);
    game.state.add('Menu', mainMenu);
    game.state.start('boot');
  };

},{"./Vehiculo.js":2,"./mainMenu.js":4,"./play_scene.js":5}],4:[function(require,module,exports){
'use strict';
var audio = require('./AudioSrc.js')
var mainMenu = 
{
    create: function(){
      
        audio.playMenuSong(this.game);

        this.button = this.game.add.button(300, 315, 'playButton', function startGame()
        {
            audio.playMenuSong.Stop();
            audio.playClickSound(this.game);
            this.game.state.start('play');
        },
         this, 2, 1, 0);

        this.fondo = this.game.add.sprite(0, 0, 'menu');     
    },
}

module.exports = mainMenu;
},{"./AudioSrc.js":1}],5:[function(require,module,exports){
'use strict';
//VEHICULOS

var GO = require('./Vehiculo.js');
var audio = require('./AudioSrc.js');

var PlayScene=
{

create: function() {

  this.levelData = JSON.parse(this.game.cache.getText('level'));
 
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  this.congelado=false;
  this.map = this.game.add.tilemap('level1');
  this.map.addTilesetImage('Carreteras');
  this.layer = this.map.createLayer('Capa de Patrones 1');
  this.layer.resizeWorld();
  this.Numbalas=30;

//creamos obstaculos
  /****************************************************************************/
  //Creamos un array de objetos que son obstaculos como elementos colisionables, agujeros
  //o charcos que relentizan o resbalan 
  
  this.contador=2;
  this.numHoles = this.levelData.layers[6].objects.length;
  this.numCharcos = this.levelData.layers[8].objects.length;
  this.numResbala = this.levelData.layers[10].objects.length;
  this.numColliders = this.levelData.layers[7].objects.length;
  this.numCheckpoints = this.levelData.layers[3].objects.length;
  this.checkpoints = []
  this.mapColliders = [];
  this.charcos = [];
  this.holes = [];
  this.resbala = [];
  this.checkpointsGroup = this.game.add.physicsGroup();
  this.holesGroup=this.game.add.physicsGroup();
  this.charcosGroup=this.game.add.physicsGroup();
  this.resbalaGroups=this.game.add.physicsGroup();
  this.mapCollidersGroup = this.game.add.physicsGroup();
  

  for(var i = 0; i < this.numHoles; i++)
  {
    this.holes.push(this.game.add.sprite(this.levelData.layers[6].objects[i].x, this.levelData.layers[6].objects[i].y));
    this.game.physics.enable(this.holes[i],Phaser.Physics.ARCADE);
    this.holes[i].body.setSize(this.levelData.layers[6].objects[i].width, this.levelData.layers[6].objects[i].height, 0, 0);
    this.holes[i].body.immovable=true;
    this.holesGroup.add(this.holes[i]);
  }

  for(var i = 0; i < this.numCharcos; i++)
  {
    this.charcos.push(this.game.add.sprite(this.levelData.layers[8].objects[i].x, this.levelData.layers[8].objects[i].y));
    this.game.physics.enable(this.charcos[i],Phaser.Physics.ARCADE);
    this.charcos[i].body.setSize(this.levelData.layers[8].objects[i].width, this.levelData.layers[8].objects[i].height, 0, 0);
    this.charcos[i].body.immovable=true;
    this.charcosGroup.add(this.charcos[i]);
  }

  for(var i = 0; i < this.numResbala; i++)
  {
    this.resbala.push(this.game.add.sprite(this.levelData.layers[10].objects[i].x, this.levelData.layers[10].objects[i].y));
    this.game.physics.enable(this.resbala[i],Phaser.Physics.ARCADE);
    this.resbala[i].body.setSize(this.levelData.layers[10].objects[i].width, this.levelData.layers[10].objects[i].height, 0, 0);
    this.resbala[i].body.immovable=true;
    this.resbalaGroups.add(this.resbala[i]);
  }

  for(var i = 0; i < this.numColliders; i++)
  {
    this.mapColliders.push(this.game.add.sprite(this.levelData.layers[7].objects[i].x, this.levelData.layers[7].objects[i].y));
    this.game.physics.enable(this.mapColliders[i],Phaser.Physics.ARCADE);
    this.mapColliders[i].body.setSize(this.levelData.layers[7].objects[i].width, this.levelData.layers[7].objects[i].height, 0, 0);
    this.mapColliders[i].body.immovable=true;
    //this.mapColliders[i].body.moves=false;
    this.mapCollidersGroup.add(this.mapColliders[i]);
  }

  for(var i = 0; i < this.numCheckpoints; i++)
  {
    this.checkpoints.push(this.game.add.sprite(this.levelData.layers[3].objects[i].x, this.levelData.layers[3].objects[i].y));
    this.game.physics.enable(this.checkpoints[i],Phaser.Physics.ARCADE);
    this.checkpoints[i].body.setSize(this.levelData.layers[3].objects[i].width, this.levelData.layers[3].objects[i].height, 0, 0);
    this.checkpoints[i].body.immovable=true;
    this.checkpointsGroup.add(this.checkpoints[i]);
  }


  //AQUÍ TERMINA LA CREACION DE OBSTACULOS
/******************************************************************************/


/****************************************************************************/
 //Pongo una banderita para hacer una prueba de movimiento (ESTO SE QUITARÁ)
 //CREAMOS LOS ARRAYS QUE CONTENDRÁN EN ORDEN LAS BANDERAS 
 //LOS FOR POSTERIORES INTRODUCEN EN EL ARRAY LA POSICION DE LAS BANDERA
 //LEYENDO EL JSON DEL MAPA
  this.puntos = this.levelData.layers[4].objects.length;
  this.puntos2 = this.levelData.layers[5].objects.length;
  this.puntos3 = this.levelData.layers[9].objects.length;
  this.banderas = [];
  this.banderas2 = [];
  this.banderas3 = [];
  
  for(var i = 0; i < this.puntos; i++)
  {
    this.banderas.push(this.game.add.sprite(this.levelData.layers[4].objects[i].x, this.levelData.layers[4].objects[i].y));
    this.game.physics.enable(this.banderas[i],Phaser.Physics.ARCADE);
    this.banderas[i].body.setSize(140, 140, -50, -50);
  }

  for(var i = 0; i < this.puntos2; i++)
  {
    this.banderas2.push(this.game.add.sprite(this.levelData.layers[5].objects[i].x, this.levelData.layers[5].objects[i].y));
    this.game.physics.enable(this.banderas2[i],Phaser.Physics.ARCADE);
    this.banderas2[i].body.setSize(140, 140, -50, -50);
  }

  for(var i = 0; i < this.puntos3; i++)
  {
    this.banderas3.push(this.game.add.sprite(this.levelData.layers[9].objects[i].x, this.levelData.layers[9].objects[i].y));
    this.game.physics.enable(this.banderas3[i],Phaser.Physics.ARCADE);
    this.banderas3[i].body.setSize(140, 140, -50, -50);
  }

  //AQUÍ TERMINA LA INTRODUCCION DE LAS BANDERAS
  //EN SUS RESPECTIVOS ARRAYS
 /****************************************************************************/
  //creamos al personajes
  this.cursors = this.game.input.keyboard.createCursorKeys();
  this.weapon=this.game.add.weapon(this.Numbalas,'bullet');
  this.fireButton=this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  this.jugador = new GO.player(this.game, 'car', this.levelData.layers[1].objects[0].x, this.levelData.layers[1].objects[0].y, 
  0.5, 0.5, 0.5, 0.5,this.cursors,this.fireButton,this.weapon,this.checkpointsGroup);
  this.game.world.addChild(this.jugador);
  //CREAMOS A LOS ENEMIGOS, SERÍA MEJOR COMO UN ARRAY PERO PARA ESO ANTES TENDRÍA QUE ENTENDER MEJOR LOS JSON
  this.enemy = new GO.enemigo(this.game, 2, 'carEnemy', this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y, 0.5, 0.5, 0.5, 0.5, this.banderas,this.checkpointsGroup);
  this.enemy2 = new GO.enemigo(this.game, 2, 'carEnemy', this.levelData.layers[2].objects[1].x, this.levelData.layers[2].objects[1].y, 0.5, 0.5, 0.5, 0.5, this.banderas2,this.checkpointsGroup);
  this.enemy3 = new GO.enemigo(this.game, 2, 'carEnemy', this.levelData.layers[2].objects[2].x, this.levelData.layers[2].objects[2].y, 0.5, 0.5, 0.5, 0.5, this.banderas3,this.checkpointsGroup);
  this.lapsCounter=this.game.add.sprite( this.levelData.layers[1].objects[0].x, this.levelData.layers[1].objects[0].y,'lapss',3);
  this.lapsCounter.scale.setTo(0.8,0.8);
  this.lapsCounter.fixedToCamera=true;
  this.lapsCounter.cameraOffset.setTo(165, 30);
 
  this.laps=this.game.add.sprite( this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y,'laps');
  this.laps.scale.setTo(0.7,0.7);
  this.laps.fixedToCamera=true;
  this.laps.cameraOffset.setTo(30, 30);
  
  /*CHECKPOINTS
  this.checkpoint1=this.game.add.sprite(this.levelData.layers[2].objects[0].x+1000,this.levelData.layers[2].objects[0].y-500,'check');
  this.checkpoint1.scale.setTo(0.5,0.5);
  this.checkpoint2=this.game.add.sprite(this.levelData.layers[2].objects[0].x+400,this.levelData.layers[2].objects[0].y-1100,'check');
  this.checkpoint2.scale.setTo(0.5,0.5);
  this.checkpoint3=this.game.add.sprite(this.levelData.layers[2].objects[0].x-100,this.levelData.layers[2].objects[0].y-1600,'check');
  this.checkpoint3.scale.setTo(0.5,0.5);
  this.checkpoint4=this.game.add.sprite(this.levelData.layers[2].objects[0].x+400,this.levelData.layers[2].objects[0].y-100,'check');
  this.checkpoint4.scale.setTo(0.5,0.5);
  
  this.game.physics.enable([ this.checkpoint1,this.checkpoint2,this.checkpoint3,this.checkpoint4 ], Phaser.Physics.ARCADE);
  this.checkpoint4.body.setSize(100,300);
  this.checkpoint3.body.setSize(300,100);
  this.checkpoint2.body.setSize(100,300);
  this.checkpoint1.body.setSize(400,100,-100);*/
  //CASCO
  this.casco=this.game.add.sprite(this.levelData.layers[1].objects[0].x, this.levelData.layers[2].objects[0].y,'casco',2);
  this.casco.scale.setTo(0.5,0.5);
  this.casco.fixedToCamera=true;
  this.casco.cameraOffset.setTo(30,85);
  this.walk=this.casco.animations.add('walk');
  this.casco.animations.play('walk',1,true); 
  //POSICIONES
  this.pos=this.game.add.sprite(this.levelData.layers[1].objects[0].x, this.levelData.layers[1].objects[0].y,'posiciones',4);
  this.pos.fixedToCamera=true;
  this.pos.scale.setTo(0.7,0.7);
  this.pos.cameraOffset.setTo(80,95);
  
  //inicializamos en cursors la deteccion de cursores
  
  this.enemies=this.game.add.group();
  this.enemies.add(this.enemy);
  this.enemies.add(this.enemy2);
  this.enemies.add(this.enemy3);
  //Creamos un arma
 
  this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  this.weapon.fireRate=1000;
  this.weapon.trackSprite(this.jugador,30,0,true);
//Creamos un boton para el disparo

  this.timeCounter = 0;
  this.timer = this.game.time.create(false);
  this.timer.loop(1000, 
    function()
    {
      this.timeCounter++;
      if(this.timeCounter >= 4)
      {
        audio.playPitidoSalidaSound(this.game);
        audio.playRaceSong(this.game);
        this.jugador.activateMovement();
        for(var i = 0; i < this.enemies.length; i++)
          { this.enemies.children[i].activateMovement(); }
          this.timer.stop();
      }
      else
      {
        audio.playPitidoSound(this.game);
      }
    },
     this);
  this.timer.start();
  
},
  
update: function() {

  //UPDATE DE MOVIMIENTO

  for(var i=0;i<this.checkpointsGroup.length;i++)
  {
    this.game.debug.body(this.checkpointsGroup.children[i].body);
  }

  this.weapon.bulletSpeed =500+this.jugador.velocity;
 /* this.game.debug.body(this.checkpoint4);
  this.game.debug.body(this.checkpoint3);
  this.game.debug.body(this.checkpoint2);
  this.game.debug.body(this.checkpoint1);*/
  this.pos.frame=this.jugador.posicion;
  this.lapsCounter.frame=this.contador+1;
   
  //UPDATE DE DETECCIÓN DE ELEMENTOS DEL MAPA

  //JUGADOR
  
   this.jugador.checks(this.game,this.checkpointsGroup,this.contador,this.enemies,this.jugador,this.holesGroup);
   this.jugador.muerte(this.game, this.holesGroup,this.checkpointsGroup);
   this.jugador.detectaCharco(this.charcosGroup,this.game);
   this.jugador.Patinar(this.game,this.resbalaGroups);
   this.jugador.muro(this.mapCollidersGroup,this.game);
   this.jugador.detectaCoche(this.jugador,this.game,this.enemies,this.enemy,this.jugador);
   
   //ENEMIGOS

for(var i=0;i<this.enemies.length;i++)
{
  this.enemies.children[i].congelado(this.weapon,this.congelado);
  this.enemies.children[i].checks(this.game,this.checkpointsGroup,this.contador,this.enemies,this.jugador);
  if(this.enemies.children[i].contador===-1&&this.enemies.children[i].restar)
  {
    this.enemies.children[i].restar=false;
    this.enemies.children[i].numVueltas++;
  }
 if(this.enemies.children[i].contador===this.checkpointsGroup.length-1)this.enemies.children[i].contador=-1;
}


if(this.jugador.contador===this.checkpointsGroup.length-1) this.jugador.contador=-1;



if(this.jugador.contador===0&&this.jugador.restar)
    {
      this.jugador.restar=false;
      this.contador--;
      this.jugador.numVueltas++;
    }

    for(var i=0;i<this.checkpointsGroup.length;i++)
    {
      this.game.debug.body(this.checkpoints[i]);
    }
   
  //CONSOLE LOG
  //ESTA PARTE DEL CÓDIGO DEFINE A QUIEN SIGUE LA CÁMARA EN FUNCIÓN DE SI EL JUGADOR HA CAIDO EN UN AGUJERO O NO
  
   if(this.jugador.alive)
   this.game.camera.follow(this.jugador, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
   else this.game.camera.follow(this.enemy, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
  },

render: function() {
}

};



module.exports = PlayScene;
  

},{"./AudioSrc.js":1,"./Vehiculo.js":2}]},{},[3]);
