// Clase MainMenuScene que representa el menú principal del juego
class MainMenuScene extends Phaser.Scene {
    // Constructor de la escena, define la clave de la escena
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    // Método preload: carga los recursos necesarios para esta escena
    preload() {
        this.load.image('menu', 'assets/castillo.png');               // Fondo del menú
        this.load.image('titulo', 'assets/titulo.png');           // Imagen del título
        this.load.image('play', 'assets/play.png');               // Botón de "Jugar"
        this.load.image('play_hover', 'assets/play_hover.png');   // Botón de "Jugar" en hover
        this.load.image('credits', 'assets/credits.png');         // Botón de "Créditos"
        this.load.image('credits_hover', 'assets/credits_hover.png'); // Botón de "Créditos" en hover
        this.load.image('ajustes', 'assets/ajustes.png');         // Botón de "Créditos"
        this.load.image('ajustes_hover', 'assets/ajustes_hover.png'); // Botón de "Créditos" en hover

        this.load.audio('menu_music', 'assets/menu.mp3');
        this.load.audio('game_music', 'assets/juego.mp3');
    }

    // Método create: configura la escena y sus elementos
    create() {
        // Efecto de fade-in al entrar en la escena
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Agrega la imagen de fondo y el título en posiciones específicas
        this.add.image(640, 360, 'menu');  // Imagen del fondo
        this.add.image(640, 250, 'titulo'); // Imagen del título

        document.fonts.ready.then(() => {
            this.statusText = this.add.text(15, 15, 'Estado: Desconectado', {
                fontFamily: 'font',
                fontSize: '32px',
                fill: '#fff'
            });
    
            this.userCountText = this.add.text(15, 55, 'Usuarios: 0', {
                fontFamily: 'font',
                fontSize: '32px',
                fill: '#fff'
            });

            this.userText = this.add.text(15, 635, '', {
                fontFamily: 'font',
                fontSize: '32px',
                fill: '#fff'
            });

            this.gameText = this.add.text(15, 675, '', {
                fontFamily: 'font',
                fontSize: '32px',
                fill: '#fff'
            });
        });

        // Reproducir la música
        if(!this.game.music) {
            this.game.music = this.sound.add('menu_music', { loop: true });
            this.game.music.play();
        }

        // Botón de "Jugar"
        var start_button = this.add.image(640, 400, 'play')
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
                if(isConnected) {
                    // Al hacer clic, inicia un fade-out y cambia a la escena del juego
                    this.cameras.main.fadeOut(500, 0, 0, 0);

                    // Espera a que el fade-out termine antes de iniciar la nueva escena
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('GameScene'); // Cambia a la escena del juego
                        this.game.music.stop();
                        this.game.music = this.sound.add('game_music', { loop: true });
                        this.game.music.play();
                    });
                } else {
                    alert('No se encuentra el servidor :(');
                }
            });

        // Botón de "Créditos"
        var credits_button = this.add.image(640, 475, 'credits')
            .setInteractive() // Hace el botón interactivo
            .on('pointerover', () => {
                // Cambia a la textura de hover cuando el mouse pasa sobre el botón
                credits_button.setTexture('credits_hover');
            })
            .on('pointerout', () => {
                // Vuelve a la textura normal cuando el mouse sale del botón
                credits_button.setTexture('credits');
            })
            .on('pointerdown', () => {
                if(isConnected) {
                    // Al hacer clic, inicia un fade-out y cambia a la escena de créditos
                    this.cameras.main.fadeOut(500, 0, 0, 0);

                    // Espera a que el fade-out termine antes de iniciar la nueva escena
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('CreditsScene'); // Cambia a la escena de créditos
                    });
                } else {
                    alert('No se encuentra el servidor :(');
                }
            });
        
        var ajustes_button = this.add.image(640, 575, 'ajustes')
            .setInteractive() // Hace el botón interactivo
            .on('pointerover', () => {
                // Cambia a la textura de hover cuando el mouse pasa sobre el botón
                ajustes_button.setTexture('ajustes_hover');
            })
            .on('pointerout', () => {
                // Vuelve a la textura normal cuando el mouse sale del botón
                ajustes_button.setTexture('ajustes');
            })
            .on('pointerdown', () => {
                if(isConnected) {
                    // Al hacer clic, inicia un fade-out y cambia a la escena de créditos
                    this.cameras.main.fadeOut(500, 0, 0, 0);

                    // Espera a que el fade-out termine antes de iniciar la nueva escena
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('AjustesScene'); // Cambia a la escena de créditos
                    });
                } else {
                    alert('No se encuentra el servidor :(');
                }
            });
        
        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.escapeKey.on('down', () => {
            if (!this.scene.isActive('ChatScene') && isConnected) {
                this.scene.pause();
                this.scene.launch('ChatScene');
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
        var { status, connectedUsers } = await this.fetchServerStatus();
        this.statusText.setText(`Estado: ${status}`);
        this.userCountText.setText(`Usuarios: ${connectedUsers}`);
        if (isConnected) {
            this.userText.setText('Registrado como ' + userPlaying);
            if(gamesPlayedByUser != 1) {
                this.gameText.setText('Has jugado ' + gamesPlayedByUser + ' partidas');
            } else {
                this.gameText.setText('Has jugado ' + gamesPlayedByUser + ' partida');
            }
        } else {
            this.userText.setText('');
            this.gameText.setText('');
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