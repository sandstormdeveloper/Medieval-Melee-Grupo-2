// Clase MainMenuScene que representa el menú principal del juego
class MainMenuScene extends Phaser.Scene {
    // Constructor de la escena, define la clave de la escena
    constructor() {
        super({ key: 'MainMenuScene' });
        this.alertGroup = null; // Contenedor para alertas personalizadas
        this.isAlertActive = false;  // Variable para controlar si la alerta está activa
        this.isConnected = false;    // Variable para controlar la conexión al servidor
        this.alertTriggered = false; // Control para evitar repetición de alerta
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

        this.load.image('chat', 'assets/chat.png');               // Botón de "Chat"
        this.load.image('chat_hover', 'assets/chat_hover.png');   // Botón de "Chat" en hover
    }

    // Método create: configura la escena y sus elementos
    create() {
        // Efecto de fade-in al entrar en la escena
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.createAlertSystem();

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
                        this.scene.start('SelectScene'); // Cambia a la escena de selección
                    });
                } else {
                    this.showAlert('No se encuentra el servidor :(', 'error');
                }
            });

        //Botón de "Chat"
        var chat_button = this.add.image(1200, 675, 'chat')  // Añadir una imagen para el botón de chat
            .setInteractive()  // Hace el botón interactivo
            .on('pointerover', () => {
                // Cambia a la textura de hover cuando el mouse pasa sobre el botón
                chat_button.setTexture('chat_hover');
            })
            .on('pointerout', () => {
                // Vuelve a la textura normal cuando el mouse sale del botón
                chat_button.setTexture('chat');
            })
            .on('pointerdown', () => {
                if (isConnected) {
                    // Al hacer clic, pausa la escena actual y lanza la escena de chat
                    this.scene.pause();
                    this.scene.launch('ChatScene');
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
                    this.showAlert('No se encuentra el servidor :(', 'error');
                }
            });
        
        var ajustes_button = this.add.image(640, 560, 'ajustes')
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
                    this.showAlert('No se encuentra el servidor :(', 'error');
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


    // Sistema de alertas personalizadas
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
            .on('pointerdown', this.hideAlert, this)
            .setDepth(103);
    
        const confirmText = this.add.text(0, 50, 'Aceptar', {
            fontFamily: 'font',
            fontSize: '20px',
            color: '#ff0000'
        }).setOrigin(0.5).setDepth(104);
    
        this.alertGroup.add([alertBg, alertText, confirmButton, confirmText]);
        this.alertGroup.alertText = alertText;
    
        // Asegurarnos de que la alerta esté en el frente
        this.children.bringToTop(this.alertGroup);
    }

      // Mostrar la alerta personalizada
      showAlert(message, type) {
        const colors = { error: 0xff0000, success: 0x00ff00 };
        this.alertGroup.getAt(0).setFillStyle(colors[type] || 0xff0000, 0.8);
        this.alertGroup.alertText.setText(message);
        this.alertGroup.setVisible(true);

        // Bloquear la interacción del usuario
        this.blocker.setVisible(true);  // El bloqueador evita la interacción
        this.isAlertActive = true;  // Indicamos que la alerta está activa
        this.input.keyboard.enabled = false;  // Deshabilitar las teclas
        this.input.mouse.enabled = false;  // Deshabilitar la interacción con el ratón
    }

    // Método para hacer desaparecer la alerta y permitir la interacción
    hideAlert() {
        this.alertGroup.setVisible(false);  // Ocultamos la alerta
        this.blocker.setVisible(false);  // Ocultamos el bloqueador
        this.isAlertActive = false;  // Desactivamos la alerta
        this.alertTriggered = false; // Reseteamos el flag para que la alerta pueda mostrarse nuevamente
        this.input.keyboard.enabled = true;  // Rehabilitamos las teclas
        this.input.mouse.enabled = true;  // Rehabilitamos la interacción con el ratón
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
        // Evitamos que se muestre la alerta si ya está activa
        if (this.isAlertActive || this.alertTriggered) {
            return;  // No actualizamos nada si la alerta está activa o ya fue activada
        }

        var { status, connectedUsers } = await this.fetchServerStatus();
        this.statusText.setText(`Estado: ${status}`);
        this.userCountText.setText(`Usuarios: ${connectedUsers}`);

        if (isConnected) {
            this.userText.setText('Registrado como ' + userPlaying);
            if (gamesPlayedByUser != 1) {
                this.gameText.setText('Has jugado ' + gamesPlayedByUser + ' partidas');
            } else {
                this.gameText.setText('Has jugado ' + gamesPlayedByUser + ' partida');
            }
        } else {
            this.userText.setText('');
            this.gameText.setText('');

            // Si el servidor está desconectado y no hemos mostrado la alerta aún
            if (!this.isAlertActive && !this.alertTriggered) {
                this.showAlert('No se encuentra el servidor :(', 'error');
                this.alertTriggered = true;  // Marcamos que la alerta fue disparada
            }
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