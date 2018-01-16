'use strict';
var audio = require('./AudioSrc.js')
var Victoria = 
{
    create: function(){
      
        audio.playMenuSong(this.game);

        this.fondo = this.game.add.sprite(0, 0, 'MenuVictoria');     

        this.PlayAgainButton = this.game.add.button(40, 225, 'PlayAgainButton', function startGame()
        {
            audio.playMenuSong.Stop();
            audio.playClickSound(this.game);
            this.game.state.start('play');
        },
         this, 2, 1, 0);

         this.buttonBackToMenu = this.game.add.button(520, 225, 'BackToMenuButton', function startGame()
        {
            audio.playMenuSong.Stop();
            audio.playClickSound(this.game);
            this.game.state.start('Menu');
        },
         this, 2, 1, 0);

       
    },
}

module.exports = Victoria;