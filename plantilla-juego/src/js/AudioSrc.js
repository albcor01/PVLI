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

    playRaceSong.Stop = function()
    {
        click.stop();
    };
};

module.exports = 
{
    playMenuSong,
    playRaceSong,
    playClickSound,
}