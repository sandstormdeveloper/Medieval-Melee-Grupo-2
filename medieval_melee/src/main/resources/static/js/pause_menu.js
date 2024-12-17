var returnToMenu;
// Clase PauseMenuScene que representa el menú de pausa del juego
class PauseMenuScene extends Phaser.Scene {
    // Constructor de la escena, define la clave de la escena
    constructor() {
        super({ key: 'PauseMenuScene' });
    }

    // Método preload: carga los recursos necesarios para esta escena
    preload() {
        this.load.image('fondo_pausa', 'assets/pausa.png');               // Fondo del menú
        this.load.image('play', 'assets/play.png');               // Botón de "Jugar"
        this.load.image('play_hover', 'assets/play_hover.png');   // Botón de "Jugar" en hover
        this.load.image('exit', 'assets/exit.png');         // Botón de "Salir"
        this.load.image('exit_hover', 'assets/exit_hover.png'); // Botón de "Salir" en hover

        this.load.audio('menu_music', 'assets/menu.mp3');
    }

    // Método create: configura la escena y sus elementos
    create() {
        returnToMenu = false;
        // Agrega la imagen de fondo y el título en posiciones específicas
        this.add.image(640, 360, 'fondo_pausa');  // Imagen del fondo

        // Botón de "Jugar"
        var start_button = this.add.image(640, 390, 'play')
            .setInteractive() // Hace el botón interactivo
            .on('pointerover', () => {
                // Cambia a la textura de hover cuando el mouse pasa sobre el botón
                start_button.setTexture('play_hover');
            })
            .on('pointerout', () => {
                // Vuelve a la textura normal cuando el mouse sale del botón
                start_button.setTexture('play');
            })
            .on('pointerdown', () => {
                this.scene.stop(); // Detiene la escena de pausa
                this.scene.resume('GameScene'); // Reanuda la escena principal
            });

        // Botón de "Créditos"
        var exit_button = this.add.image(640, 450, 'exit')
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
                    this.scene.stop('GameScene');
                    this.scene.start('MainMenuScene'); // Vuelve al menú principal
                    this.game.music.stop();
                    this.game.music = this.sound.add('menu_music', { loop: true });
                    this.game.music.play();
                });
            });

        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.escapeKey.on('down', () => {
            if (this.scene.isActive('PauseMenuScene')) {
                this.scene.stop(); 
                this.scene.resume('GameScene'); 
            }
        });

        this.updateStatus();
        this.time.addEvent({
            delay: 1000, 
            callback: this.updateStatus,
            callbackScope: this,
            loop: true
        });
    }

    // Método update: se ejecuta en cada frame, puede usarse para lógica del juego (vacío aquí)
    update(time, delta) {
        
    }

    async fetchServerStatus() {
        try {
            var response = await fetch('/api/status');
            if (!response.ok) throw new Error('No se puede conectar al servidor');
            var data = await response.json();
            if (!isConnected) {
                this.incrementUsers();
                isConnected = true;
            }
            return {
                status: data.status,
                connectedUsers: data.connectedUsers
            };
        } catch (error) {
            isConnected = false;
            return {
                status: 'Desconectado',
                connectedUsers: 0
            };
        }
    }

    async updateStatus() {
        await this.fetchServerStatus();
        if(!isConnected && !returnToMenu) {
            alert("No se encuentra el servidor :(")
            returnToMenu = true;
            this.cameras.main.fadeOut(500, 0, 0, 0);

            // Espera a que el fade-out termine antes de iniciar la nueva escena
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop('GameScene');
                this.scene.start('MainMenuScene'); // Vuelve al menú principal
                this.game.music.stop();
                this.game.music = this.sound.add('menu_music', { loop: true });
                this.game.music.play();
            });
        }
    }

    async incrementUsers() {
        try {
            var response = await fetch('/api/status/increment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('No se ha podido incrementar el número de usuarios');
        } catch (error) {
            console.error('Error incrementando el número de usuarios:', error);
        }
    }
}