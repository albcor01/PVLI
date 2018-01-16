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


         this.buttonControls = this.game.add.button(400, 500, 'controls', function startGame()
         {
             //audio.playMenuSong.Stop();
             audio.playClickSound(this.game);
             this.game.state.start('PanelControles');
         },
          this, 2, 1, 0);

        this.fondo = this.game.add.sprite(0, 0, 'PanelControles');     
    },
}

module.exports = mainMenu;