'use strict';

var mainMenu = 
{
    create: function(){
        this.button = this.game.add.button(300, 315, 'playButton', function startGame()
        {
            this.game.state.start('play');
        },
         this, 2, 1, 0);

        this.fondo = this.game.add.sprite(0, 0, 'menu');     
    },
}

module.exports = mainMenu;