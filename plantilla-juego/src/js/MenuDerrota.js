'use strict';
var audio = require('./AudioSrc.js')
var Derrota = 
{
    create: function(){
      
        audio.playMenuSong(this.game);

        this.fondo = this.game.add.sprite(0, 0, 'MenuDerrota');     

        this.PlayAgainButton = this.game.add.button(115, 225, 'PlayAgainButton', function startGame()
        {
            audio.playMenuSong.Stop();
            audio.playClickSound(this.game);
            this.game.state.start('play');
        },
         this, 2, 1, 0);

         this.buttonBackToMenu = this.game.add.button(450, 225, 'BackToMenuButton', function startGame()
        {
            audio.playMenuSong.Stop();
            audio.playClickSound(this.game);
            this.game.state.start('Menu');
        },
         this, 2, 1, 0);

       
    },
}

module.exports = Derrota;