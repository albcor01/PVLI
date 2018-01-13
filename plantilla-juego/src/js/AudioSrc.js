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
};

var playPitidoSound = function(game){
    pitido = game.add.audio('wait');
    pitido.play();
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