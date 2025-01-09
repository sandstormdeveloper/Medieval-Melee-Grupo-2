var returnToMenu;

// Clase CreditsScene que representa la escena de créditos
class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' });
    }

    preload() {
        this.load.image('creditos', 'assets/menu2.png');
        this.load.image('exit', 'assets/exit.png');
        this.load.image('exit_hover', 'assets/exit_hover.png');
    }

    create() {
        returnToMenu = false;
        this.isAlertVisible = false;

        this.add.image(640, 360, 'creditos');

        var exit_button = this.add.image(104, 64, 'exit')
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

        this.createAlertSystem();

        this.updateStatus();
        this.time.addEvent({
            delay: 1000,
            callback: this.updateStatus,
            callbackScope: this,
            loop: true
        });
    }

    createAlertSystem() {
        this.alertGroup = this.add.container(640, 100).setVisible(false).setDepth(100);

        const alertBg = this.add.rectangle(0, 0, 600, 100, 0xff0000, 0.8)
            .setStrokeStyle(4, 0xffffff)
            .setOrigin(0.5);

        const alertText = this.add.text(0, -10, '', {
            fontFamily: 'font',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 550 }
        }).setOrigin(0.5);

        const confirmButton = this.add.rectangle(0, 50, 150, 50, 0xffffff, 1)
            .setStrokeStyle(2, 0xff0000)
            .setInteractive()
            .on('pointerdown', this.returnToMenu, this); // Llama a returnToMenu al aceptar
        const confirmText = this.add.text(0, 50, 'Aceptar', {
            fontFamily: 'font',
            fontSize: '20px',
            color: '#ff0000'
        }).setOrigin(0.5);

        this.alertGroup.add([alertBg, alertText, confirmButton, confirmText]);
        this.alertGroup.alertText = alertText;
    }

    showAlert(message) {
        this.alertGroup.alertText.setText(message);
        this.alertGroup.setVisible(true);
        this.isAlertVisible = true;
    }

    hideAlert() {
        this.alertGroup.setVisible(false);
        this.isAlertVisible = false;
    }

    returnToMenu() {
        this.hideAlert(); // Oculta la alerta
        this.cameras.main.fadeOut(500, 0, 0, 0); // Inicia la transición al menú principal
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MainMenuScene');
        });
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
        if (!this.isAlertVisible) {
            const { status, connectedUsers } = await this.fetchServerStatus();
            if (!isConnected && !returnToMenu) {
                this.showAlert('No se encuentra el servidor :(');
                returnToMenu = true;
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
