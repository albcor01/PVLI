'use strict';

//MUSIC
var playMenuSong = function(game){
    console.log("hola");
    this.audio = game.add.audio('mainS');
    this.audio.play();
};
var playRaceSong = function(game){

};

module.exports = 
{
    playMenuSong,
    playRaceSong,
}