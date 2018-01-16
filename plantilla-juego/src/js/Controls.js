'use strict';
var audio = require('./AudioSrc.js')
var Controls = 
{
    create: function(){

        this.fondo = this.game.add.sprite(0, 0, 'fondoControls');  

        this.button = this.game.add.button(400, 415, 'BackToMenuButton', function startGame()
        {
           // audio.playMenuSong.Stop();
            audio.playClickSound(this.game);
            this.game.state.start('Menu');
            audio.playMenuSong.Stop()
        },
         this, 2, 1, 0);    
    },
}

module.exports = Controls;