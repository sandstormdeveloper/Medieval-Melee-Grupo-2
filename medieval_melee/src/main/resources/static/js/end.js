var returnToMenu;
// Clase MainMenuScene que representa el menú principal del juego
class EndScene extends Phaser.Scene {
    // Constructor de la escena, define la clave de la escena
    constructor() {
        super({ key: 'EndScene' });
        this.decremented = false;
        this.alertGroup = null;
        this.isConnected = false; // Definir la variable isConnected
        this.returnToMenu = false; // Definir la variable returnToMenu
        this.blocker = null;  // Añadimos un blocker para bloquear la interacción
    }

    // Método preload: carga los recursos necesarios para esta escena
    preload() {
        this.load.image('end', 'assets/castillo.png');               // Fondo del menú
        this.load.image('player1wins', 'assets/player1screen.png');           // Imagen del título
        this.load.image('player2wins', 'assets/player2screen.png');           // Imagen del título
        this.load.image('play2', 'assets/play2.png');               // Botón de "Jugar"
        this.load.image('play2_hover', 'assets/play2_hover.png');   // Botón de "Jugar" en hover
        this.load.image('exit', 'assets/exit.png');         // Botón de "Salir"
        this.load.image('exit_hover', 'assets/exit_hover.png'); // Botón de "Salir" en hover

        this.load.image('loss', 'assets/loss.png');
        this.load.image('win', 'assets/win.png');

        this.load.audio('menu_music', 'assets/menu.mp3');
        this.load.audio('game_music', 'assets/juego.mp3');
    }

    // Método create: configura la escena y sus elementos
    create() {
        gamesPlayedByUser += 1;
        this.updateGamesPlayed(userPlaying, gamesPlayedByUser);
        returnToMenu = false;
        // Efecto de fade-in al entrar en la escena
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Agrega la imagen de fondo y el título en posiciones específicas
        this.add.image(640, 360, 'end');  // Imagen del fondo
        
        if (!playingRed) {
            var player = this.registry.get('winner');

            if (player == 1) {
                this.add.image(640, 250, 'player1wins');
            }
            else {
                this.add.image(640, 250, 'player2wins');
            }
        } else {
            if (clientWon) {
                this.add.image(640, 250, 'win');
            }
            else {
                this.add.image(640, 250, 'loss');
            }
        }

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

        // Botón de "Jugar"
        var start_button = this.add.image(640, 400, 'play2')
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
                    if (!playingRed) {
                        this.scene.start('LocalGameScene'); // Cambia a la escena del juego
                    } else {
                        this.scene.start('RedGameScene'); // Cambia a la escena del juego
                    }
                    
                    this.game.music.stop();
                    this.game.music = this.sound.add('game_music', { loop: true });
                    this.game.music.play();
                });
            });

        // Botón de "Salir"
        var exit_button = this.add.image(640, 475, 'exit')
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
        
        this.updateStatus();
        this.time.addEvent({
            delay: 1000, 
            callback: this.updateStatus,
            callbackScope: this,
            loop: true
        });

        this.createAlertSystem();
    }

    // Método update: se ejecuta en cada frame, puede usarse para lógica del juego (vacío aquí)
    update(time, delta) {
        // Sin implementación adicional en este ejemplo
    }

    createAlertSystem() {
        this.alertGroup = this.add.container(640, 100).setVisible(false).setDepth(100); // Posicionamos la alerta más arriba

        const alertBg = this.add.rectangle(0, 0, 600, 100, 0xff0000, 0.8)
            .setStrokeStyle(4, 0xffffff)
            .setOrigin(0.5)
            .setDepth(101);

        const alertText = this.add.text(0, -10, '', {
            fontFamily: 'font',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 550 }
        }).setOrigin(0.5).setDepth(102);

        const confirmButton = this.add.rectangle(0, 50, 150, 50, 0xffffff, 1)
            .setStrokeStyle(2, 0xff0000)
            .setInteractive()
            .on('pointerdown', this.hideAlert, this)  // Cuando se hace click, se oculta la alerta y va al menú
            .setDepth(103);

        const confirmText = this.add.text(0, 50, 'Aceptar', {
            fontFamily: 'font',
            fontSize: '20px',
            color: '#ff0000'
        }).setOrigin(0.5).setDepth(104);

        this.alertGroup.add([alertBg, alertText, confirmButton, confirmText]);
        this.alertGroup.alertText = alertText;

        this.children.bringToTop(this.alertGroup);

        // Bloqueador invisible para deshabilitar interacciones
        this.blocker = this.add.rectangle(0, 0, 1280, 720, 0x000000, 0.5)
            .setOrigin(0, 0)
            .setInteractive()
            .setVisible(false)  // Inicialmente invisible
            .setDepth(99); // Se coloca debajo de la alerta pero encima de otros elementos
    }

    showAlert(message, type) {
        const colors = { error: 0xff0000, success: 0x00ff00 };
        this.alertGroup.getAt(0).setFillStyle(colors[type] || 0xff0000, 0.8);
        this.alertGroup.alertText.setText(message);
        this.alertGroup.setVisible(true);

        // Mostrar el bloqueador que desactiva interacciones en el resto del juego
        this.blocker.setVisible(true);
        this.isAlertActive = true;  // Indicamos que la alerta está activa

        // Deshabilitar entrada de teclado mientras la alerta esté activa
        this.input.keyboard.enabled = false;

        this.alertGroup.setDepth(100);
        this.children.bringToTop(this.alertGroup);
    }

    hideAlert() {
        this.alertGroup.setVisible(false);  // Ocultamos la alerta
        this.blocker.setVisible(false);  // Ocultamos el bloqueador

        // Ahora que el usuario ha dado "Aceptar", volvemos al menú
        this.cameras.main.fadeOut(500, 0, 0, 0);

        // Esperamos a que termine el fade-out antes de iniciar la nueva escena
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MainMenuScene'); // Vuelve al menú principal

            this.scene.get('MainMenuScene').updateStatus(); // Llamamos a updateStatus en MainMenuScene
        });

        // Rehabilitar la entrada del teclado
        this.input.keyboard.enabled = true;
        this.isAlertActive = false;  // Indicamos que la alerta ya no está activa
    }


    async fetchWithTimeout(url, options = {}, timeout = 5000) {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchPromise = fetch(url, { ...options, signal });
    
        const timeoutId = setTimeout(() => controller.abort(), timeout);
    
        try {
            const response = await fetchPromise;
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error; 
        }
    }

    async fetchServerStatus() {
        try {
            const response = await this.fetchWithTimeout('/api/status', {}, 5000);
            if (!response.ok) throw new Error('Server response error');
    
            const data = await response.json();
            if (!isConnected) {
                this.incrementUsers();
                isConnected = true;
            }
            return {
                status: data.status,
                connectedUsers: data.connectedUsers
            };
        } catch (error) {
            console.error('Error fetching server status:', error.message);
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
        if(!isConnected && !returnToMenu) {
            this.showAlert('No se encuentra el servidor :(', 'error'); // Mostrar la alerta personalizada
            returnToMenu = true;
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

    updateGamesPlayed(username, gamesPlayed) {
        fetch(`/api/users/updateGamesPlayed?username=${username}&gamesPlayed=${gamesPlayed}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
        });
    }
}