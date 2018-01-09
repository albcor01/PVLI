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

//MUSIC
var playMenuSong = function(game){
    menu = game.add.audio('mainS');
    menu.play();

    playMenuSong.Stop = function()
    {
        menu.stop();
    };
};


var playRaceSong = function(game){
    carrera1 = game.add.audio('raceS');
    carrera1.play();
    carrera1.volume -= 0.8;
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
    colision = game.add.audio('collision');
    colision.play();

    playCollisionSound.Stop = function()
    {
        colision.stop();
    };
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

    playPitidoSalidaSound.Stop = function()
    {
        pitidoSalida.stop();
    };
};

var playPitidoSound = function(game){
    pitido = game.add.audio('wait');
    pitido.play();

    playPitidoSound.Stop = function()
    {
        pitido.stop();
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
}
},{}],2:[function(require,module,exports){

//CONSTRUCTORA DE ELEMENTOS DEL MAPA
var gameObject = function(game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY)
{
  
  this.sprite = game.add.sprite(posX, posY, sprite);
  this.sprite.anchor.set(anchorX, anchorY);
  this.sprite.scale.setTo(scaleX, sacaleY);
  game.physics.enable(this.sprite,Phaser.Physics.ARCADE);
  
  this.sprite.body.immovable = true;
  this.sprite.body.colliderWorldBounds = true;
  this.sprite.body.bounce.setTo(1, 1);
  this.sprite.allowRotation = true;
  this.sprite.angle += -90;
}

//CONSTRUCOTRA DE VEHICULOS
var vehicle = function(game, sprite, posX, posY, anchorX, anchorY, scaleX, sacaleY)
{
  this.game = game
  this.velocity = 0;
  this.acceleration = 5;
  this.MaxVelocity = 900;
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

  //factor conversor de radianes a grados
  var radianToDegreesFactor = 180 / Math.PI;
  //PARA EVITAR QUE EL VEHICULO VIBRE POR LAS PEQUEÑAS DIFERENCIAS DE ÁNGULO
  //HACEMOS QUE SOLO CALCULE EL ANGULO PARA GIRAR CUANDO EL VEHICULO
  //NO ESTÉ ENFILANDO LA BANDERA, EN CUYO CASO ESTE SE MOVERÁ HACIA ADELANTE
  //PARA ALCANZARLA
  if(!this.aimOnFlag){
    this.temp = this.MaxVelocity
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
  this.MaxVelocity = this.temp;
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

enemigo.prototype.congelado=function(weapon,congelado,enemigoCongelado,enemigo)
{
 
  this.game.physics.arcade.collide(this.sprite,weapon.bullets,
    function(bullet)
    { 
      //bullet.kill();
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

  if(firebutton.downDuration(1))
  {
    weapon.fire();
  }
  if(!this.deslizar)
    game.physics.arcade.velocityFromRotation(this.sprite.rotation, this.velocity, this.sprite.body.velocity); 
  else game.physics.arcade.accelerationFromRotation(this.sprite.rotation, this.velocity, this.sprite.body.acceleration);

  game.world.wrap(this.sprite, 16);
};

vehicle.prototype.detectaCharco = function(game, charco)
{
  
  //game.debug.body(charco);
  //game.debug.body(this.sprite);
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
}

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

},{}],3:[function(require,module,exports){
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
        this.game.load.image('MicroMachines2-GG-TreehouseTiles', 'images/levels/MicroMachines2-GG-TreehouseTiles.png');
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
        
    //CARGA DE AUDIO
        this.game.load.audio('raceS','music/raceTheme.ogg');
        this.game.load.audio('mainS','music/mainTheme.ogg');
        this.game.load.audio('winS','music/winTheme.ogg');
        
        this.game.load.audio('Bclick','sounds/buttonClick.ogg');
        
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
  audio.playRaceSong(this.game);
  this.levelData = JSON.parse(this.game.cache.getText('level'));
 
  //Iniciamos las fisicas de arcade
  this.game.physics.startSystem(Phaser.Physics.ARCADE);
  //colocamos el fondo
  //this.game.add.tileSprite(0,0, 5000, 5000, 'road');
  this.congelado=false;
  this.map = this.game.add.tilemap('level1');
  this.map.addTilesetImage('MicroMachines2-GG-TreehouseTiles');
  this.layer = this.map.createLayer('Capa de Patrones 1');
  this.layer.resizeWorld();
  this.Numbalas=30;

//creamos obstaculos
  /****************************************************************************/
  //Creamos un array de objetos que son obstaculos como elementos colisionables, agujeros
  //o charcos que relentizan o resbalan 
  this.numHoles = this.levelData.layers[3].objects.length;
  this.numCharcos = this.levelData.layers[5].objects.length;
  this.numResbala = this.levelData.layers[7].objects.length;
  this.charcos = [];
  this.holes = [];
  this.resbala = [];

  for(var i = 0; i < this.numHoles; i++)
  {
    this.holes.push(this.game.add.sprite(this.levelData.layers[3].objects[i].x, this.levelData.layers[3].objects[i].y));
    this.game.physics.enable(this.holes[i],Phaser.Physics.ARCADE);
    this.holes[i].body.setSize(this.levelData.layers[3].objects[i].width, this.levelData.layers[3].objects[i].height, 0, 0);
  }

  for(var i = 0; i < this.numCharcos; i++)
  {
    this.charcos.push(this.game.add.sprite(this.levelData.layers[5].objects[i].x, this.levelData.layers[5].objects[i].y));
    this.game.physics.enable(this.charcos[i],Phaser.Physics.ARCADE);
    this.charcos[i].body.setSize(this.levelData.layers[5].objects[i].width, this.levelData.layers[5].objects[i].height, 0, 0);
  }

  for(var i = 0; i < this.numResbala; i++)
  {
    this.resbala.push(this.game.add.sprite(this.levelData.layers[7].objects[i].x, this.levelData.layers[7].objects[i].y));
    this.game.physics.enable(this.resbala[i],Phaser.Physics.ARCADE);
    this.resbala[i].body.setSize(this.levelData.layers[7].objects[i].width, this.levelData.layers[7].objects[i].height, 0, 0);
  }

  //PARA RECORDAR COMO LO HACIA ANTES
  /*this.aceite=new GO.gameObject(this.game,'aceite',this.levelData.layers[2].objects[0].x + 600, this.levelData.layers[2].objects[0].y,0.5,0.5,0.25,0.5);
  this.aceite.sprite.body.setSize(1000,300,-200,200);*/

  //AQUÍ TERMINA LA CREACION DE OBSTACULOS
/******************************************************************************/


/****************************************************************************/
 //Pongo una banderita para hacer una prueba de movimiento (ESTO SE QUITARÁ)
 //CREAMOS LOS ARRAYS QUE CONTENDRÁN EN ORDEN LAS BANDERAS 
 //LOS FOR POSTERIORES INTRODUCEN EN EL ARRAY LA POSICION DE LAS BANDERA
 //LEYENDO EL JSON DEL MAPA
  this.puntos = this.levelData.layers[1].objects.length;
  this.puntos2 = this.levelData.layers[2].objects.length;
  this.puntos3 = this.levelData.layers[6].objects.length;
  this.banderas = [];
  this.banderas2 = [];
  this.banderas3 = [];
  
  for(var i = 0; i < this.puntos; i++)
  {
    this.banderas.push(this.game.add.sprite(this.levelData.layers[1].objects[i].x, this.levelData.layers[1].objects[i].y));
    this.game.physics.enable(this.banderas[i],Phaser.Physics.ARCADE);
    this.banderas[i].body.setSize(100, 100, -50, -50);
  }

  for(var i = 0; i < this.puntos2; i++)
  {
    this.banderas2.push(this.game.add.sprite(this.levelData.layers[2].objects[i].x, this.levelData.layers[2].objects[i].y));
    this.game.physics.enable(this.banderas2[i],Phaser.Physics.ARCADE);
    this.banderas2[i].body.setSize(100, 100, -50, -50);
  }

  for(var i = 0; i < this.puntos3; i++)
  {
    this.banderas3.push(this.game.add.sprite(this.levelData.layers[6].objects[i].x, this.levelData.layers[6].objects[i].y));
    this.game.physics.enable(this.banderas3[i],Phaser.Physics.ARCADE);
    this.banderas3[i].body.setSize(100, 100, -50, -50);
  }
  //console.log(this.banderas.length);
  //AQUÍ TERMINA LA INTRODUCCION DE LAS BANDERAS
  //EN SUS RESPECTIVOS ARRAYS
 /****************************************************************************/
  //creamos al personajes
  this.jugador = new GO.player(this.game, 'car', this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y, 0.5, 0.5, 0.5, 0.5);
  this.enemy = new GO.enemigo(this.game, 2, 'carEnemy', this.levelData.layers[2].objects[1].x, this.levelData.layers[2].objects[1].y, 0.5, 0.5, 0.5, 0.5);
  //inicializamos en cursors la deteccion de cursores
  this.cursors = this.game.input.keyboard.createCursorKeys();

  //Creamos un arma
  this.weapon=this.game.add.weapon(this.Numbalas,'bullet');
  this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
  this.weapon.fireRate=1000;
  this.weapon.trackSprite(this.jugador.sprite,30,0,true);
//Creamos un boton para el disparo
  this.fireButton=this.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
  //this.game.camera.follow(jugador.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
},

update: function() {
  //UPDATE DE MOVIMIENTO
  this.Numbalas--;
  this.weapon.bulletSpeed =500+this.jugador.velocity;
   this.jugador.update(this.cursors, this.game,this.fireButton,this.weapon);
   if(!this.congelado)
   this.enemy.update(this.game, this.banderas);
  
  //UPDATE DE DETECCIÓN DE ELEMENTOS DEL MAPA
  //charco
   //this.jugador.detectaCharco(this.game, this.charco.sprite);
   //this.enemy.detectaCharco(this.game, this.charco.sprite);
  //agujero
   //this.jugador.muerte(this.game, this.agujero.sprite, this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y);
   //this.enemy.muerte(this.game, this.agujero.sprite, this.levelData.layers[2].objects[0].x, this.levelData.layers[2].objects[0].y);
  //enemigo congelado
   //this.enemy.congelado(this.weapon,this.congelado)

   //console.log(this.congelado);
  //jugador pisa resbala
   //this.jugador.Patinar(this.game,this.aceite.sprite);
   
  //ESTA PARTE DEL CÓDIGO DEFINE A QUIEN SIGUE LA CÁMARA EN FUNCIÓN DE SI EL JUGADOR HA CAIDO EN UN AGUJERO O NO
   if(this.jugador.sprite.alive)
   this.game.camera.follow(this.jugador.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
   else this.game.camera.follow(this.enemy.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.8, 0.8);
  },

render: function() {
}

};

module.exports = PlayScene;
},{"./AudioSrc.js":1,"./Vehiculo.js":2}]},{},[3]);
