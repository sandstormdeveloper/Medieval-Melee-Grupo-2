// Clase MainMenuScene que representa el menú principal del juego
class EndScene extends Phaser.Scene {
    // Constructor de la escena, define la clave de la escena
    constructor() {
        super({ key: 'EndScene' });
    }

    // Método preload: carga los recursos necesarios para esta escena
    preload() {
        this.load.image('end', 'assets/menu.png');               // Fondo del menú
        this.load.image('player1wins', 'assets/player1screen.png');           // Imagen del título
        this.load.image('player2wins', 'assets/player2screen.png');           // Imagen del título
        this.load.image('play2', 'assets/play2.png');               // Botón de "Jugar"
        this.load.image('play2_hover', 'assets/play2_hover.png');   // Botón de "Jugar" en hover
        this.load.image('exit', 'assets/exit.png');         // Botón de "Salir"
        this.load.image('exit_hover', 'assets/exit_hover.png'); // Botón de "Salir" en hover
    }

    // Método create: configura la escena y sus elementos
    create() {
        // Efecto de fade-in al entrar en la escena
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Agrega la imagen de fondo y el título en posiciones específicas
        this.add.image(640, 360, 'end');  // Imagen del fondo
        
        var player = this.registry.get('winner');

        if (player == 1) {
            this.add.image(640, 200, 'player1wins');
        }
        else {
            this.add.image(640, 200, 'player2wins');
        }

        // Botón de "Jugar"
        var start_button = this.add.image(640, 350, 'play2')
            .setInteractive() // Hace el botón interactivo
            .on('pointerover', () => {
                // Cambia a la textura de hover cuando el mouse pasa sobre el botón
                start_button.setTexture('play2_hover');
            })
            .on('pointerout', () => {
                // Vuelve a la textura normal cuando el mouse sale del botón
                start_button.setTexture('play2');
            })
            .on('pointerdown', () => {
                // Al hacer clic, inicia un fade-out y cambia a la escena del juego
                this.cameras.main.fadeOut(500, 0, 0, 0);

                // Espera a que el fade-out termine antes de iniciar la nueva escena
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('GameScene'); // Cambia a la escena del juego
                });
            });

        // Botón de "Salir"
        var exit_button = this.add.image(640, 425, 'exit')
            .setInteractive() // Hace el botón interactivo
            .on('pointerover', () => {
                // Cambia a la textura de hover cuando el mouse pasa sobre el botón
                exit_button.setTexture('exit_hover');
            })
            .on('pointerout', () => {
                // Vuelve a la textura normal cuando el mouse sale del botón
                exit_button.setTexture('exit');
            })
            .on('pointerdown', () => {
                // Al hacer clic, inicia un fade-out y cambia a la escena de créditos
                this.cameras.main.fadeOut(500, 0, 0, 0);

                // Espera a que el fade-out termine antes de iniciar la nueva escena
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('MainMenuScene'); // Cambia a la escena de créditos
                });
            });
    }

    // Método update: se ejecuta en cada frame, puede usarse para lógica del juego (vacío aquí)
    update(time, delta) {
        // Sin implementación adicional en este ejemplo
    }
}