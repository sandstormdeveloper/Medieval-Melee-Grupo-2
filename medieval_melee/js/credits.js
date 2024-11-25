class CreditsScene extends Phaser.Scene {
    constructor() {
        super({key: 'CreditsScene'});
    }

    preload() {
        this.load.image('creditos', 'assets/menu2.png');
        this.load.image('exit', 'assets/exit.png');
        this.load.image('exit_hover', 'assets/exit_hover.png');
    }

    create() {
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.add.image(640, 360, 'creditos');

        var exit_button = this.add.image(96, 64, 'exit')
            .setInteractive()
            .on('pointerover', () => {
                exit_button.setTexture('exit_hover');
            })
            .on('pointerout', () => {
                exit_button.setTexture('exit');
            })
            .on('pointerdown', () => {
                this.cameras.main.fadeOut(500, 0, 0, 0);

                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('MainMenuScene');
                });
        });    
    }

    update(time, delta) {
        
    }
}