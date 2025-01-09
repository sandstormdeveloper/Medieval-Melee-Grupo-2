var returnToMenu = false;  // Evita que el mensaje se repita
var alertActive = false;    // Indicador de alerta activa

class PauseMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseMenuScene' });
    }

    preload() {
        this.load.image('fondo_pausa', 'assets/pausa.png');               
        this.load.image('play', 'assets/play.png');               
        this.load.image('play_hover', 'assets/play_hover.png');   
        this.load.image('exit', 'assets/exit.png');         
        this.load.image('exit_hover', 'assets/exit_hover.png'); 

        this.load.audio('menu_music', 'assets/menu.mp3');
    }

    create() {
        this.add.image(640, 360, 'fondo_pausa');  // Imagen del fondo

        // Botón de "Jugar"
        var start_button = this.add.image(640, 390, 'play')
            .setInteractive()
            .on('pointerover', () => start_button.setTexture('play_hover'))
            .on('pointerout', () => start_button.setTexture('play'))
            .on('pointerdown', () => {
                if (!alertActive) {  // Evita que se pueda interactuar mientras la alerta está activa
                    this.scene.stop();
                    this.scene.resume('LocalGameScene'); // Reanuda la escena principal
                }
            });

        // Botón de "Salir"
        var exit_button = this.add.image(640, 450, 'exit')
            .setInteractive()
            .on('pointerover', () => exit_button.setTexture('exit_hover'))
            .on('pointerout', () => exit_button.setTexture('exit'))
            .on('pointerdown', () => {
                if (!alertActive) {  // Evita que se pueda interactuar mientras la alerta está activa
                    this.cameras.main.fadeOut(500, 0, 0, 0);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.stop('LocalGameScene');
                        this.scene.start('MainMenuScene'); // Regresar al menú principal
                        this.game.music.stop();
                        this.game.music = this.sound.add('menu_music', { loop: true });
                        this.game.music.play();
                    });
                }
            });

        // Crear el sistema de alertas (visible en todo momento)
        this.createAlertSystem();

        // Actualiza el estado cada segundo
        this.updateStatus();
        this.time.addEvent({
            delay: 1000,
            callback: this.updateStatus,
            callbackScope: this,
            loop: true
        });
    }

    createAlertSystem() {
        // Crear contenedor de la alerta
        this.alertGroup = this.add.container(640, 100).setVisible(false).setDepth(100);

        // Fondo de la alerta
        const alertBg = this.add.rectangle(0, 0, 600, 100, 0xff0000, 0.8)
            .setStrokeStyle(4, 0xffffff)
            .setOrigin(0.5)
            .setDepth(101);

        // Texto de la alerta
        const alertText = this.add.text(0, -10, '', {
            fontFamily: 'font',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 550 }
        }).setOrigin(0.5).setDepth(102);

        // Botón de Aceptar
        const acceptButton = this.add.rectangle(0, 50, 150, 50, 0xffffff, 1)
            .setStrokeStyle(2, 0xff0000)
            .setInteractive()
            .on('pointerdown', this.hideAlert, this)
            .setDepth(103);

        // Texto del botón Aceptar
        const acceptText = this.add.text(0, 50, 'Aceptar', {
            fontFamily: 'font',
            fontSize: '20px',
            color: '#ff0000'
        }).setOrigin(0.5).setDepth(104);

        this.alertGroup.add([alertBg, alertText, acceptButton, acceptText]);
        this.alertGroup.alertText = alertText;
        this.children.bringToTop(this.alertGroup);
    }

    showAlert(message) {
        // Mostrar la alerta con el mensaje dado
        this.alertGroup.getAt(0).setFillStyle(0xff0000, 0.8); // Fondo rojo para error
        this.alertGroup.alertText.setText(message);
        this.alertGroup.setVisible(true);
        alertActive = true; // La alerta está activa
    }

    hideAlert() {
        // Ocultar la alerta y permitir interacciones nuevamente
        this.alertGroup.setVisible(false);
        alertActive = false; // La alerta ya no está activa

        // Volver al menú principal
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.stop('LocalGameScene');
            this.scene.start('MainMenuScene'); // Regresar al menú principal
            this.game.music.stop();
            this.game.music = this.sound.add('menu_music', { loop: true });
            this.game.music.play();
        });
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
        // Actualiza el estado del servidor
        const { status, connectedUsers } = await this.fetchServerStatus();
        if (!isConnected && !returnToMenu && !alertActive) { // Evitar que se muestre la alerta repetidamente
            this.showAlert('No se encuentra el servidor :(');  // Muestra la alerta de error
            returnToMenu = true; // Bloquea la posibilidad de mostrar otra alerta
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
}
