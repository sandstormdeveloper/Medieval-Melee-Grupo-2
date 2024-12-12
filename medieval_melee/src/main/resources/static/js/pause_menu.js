class PauseMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseMenuScene' });
    }

    create() {
        // Texto de Pausa
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'Juego en Pausa', {
            fontSize: '48px',
            color: '#ffffff',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        // Botón para reanudar
        const resumeButton =this.add.image(640, 400, 'play') .setOrigin(0.5).setInteractive()
        .on('pointerover', () => {
            // Cambia a la textura de hover cuando el mouse pasa sobre el botón
            start_button.setTexture('play_hover');
        })
        .on('pointerout', () => {
            // Vuelve a la textura normal cuando el mouse sale del botón
            start_button.setTexture('play');
        });

        resumeButton.on('pointerdown', () => {
            this.scene.stop(); // Detiene la escena de pausa
            this.scene.resume('GameScene'); // Reanuda la escena principal
        });

        // Botón para salir al menú principal
        const mainMenuButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Menú Principal', {
            fontSize: '32px',
            color: '#ff0000',
            fontFamily: 'Arial',
        }).setOrigin(0.5).setInteractive();

        mainMenuButton.on('pointerdown', () => {
            this.scene.stop('GameScene'); // Detiene la escena principal
            this.scene.start('MainMenuScene'); // Vuelve al menú principal
        });
    }
}
