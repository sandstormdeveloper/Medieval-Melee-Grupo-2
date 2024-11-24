class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({key: 'MainMenuScene'});
    }

    preload() {
        this.load.image('menu', 'assets/menu.png');
        this.load.image('titulo', 'assets/titulo.png');
        this.load.image('titulo', 'assets/titulo.png');
        this.load.image('play', 'assets/play.png');
        this.load.image('play_hover', 'assets/play_hover.png');
    }

    create() {
        this.add.image(640, 360, 'menu');
        this.add.image(640, 200, 'titulo');

        var start_button = this.add.image(640, 350, 'play')
            .setInteractive()
            .on('pointerover', () => {
                start_button.setTexture("play_hover");
            })
            .on('pointerout', () => {
                start_button.setTexture("play");
            })
            .on('pointerdown', () => {
                this.scene.start('GameScene');
        });    
    }

    update(time, delta) {
        
    }
}