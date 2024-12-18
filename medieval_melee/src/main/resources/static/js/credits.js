var returnToMenu;
// Clase CreditsScene que representa la escena de créditos
class CreditsScene extends Phaser.Scene {
    // Constructor de la escena, define la clave de la escena
    constructor() {
        super({ key: 'CreditsScene' });
    }

    // Método preload: carga los recursos necesarios para esta escena
    preload() {
        this.load.image('creditos', 'assets/menu2.png');          // Imagen de fondo de los créditos
        this.load.image('exit', 'assets/exit.png');               // Botón de "Salir"
        this.load.image('exit_hover', 'assets/exit_hover.png');   // Botón de "Salir" en hover
    }

    // Método create: configura la escena y sus elementos
    create() {
        returnToMenu = false;
        // Efecto de fade-in al entrar en la escena
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Agrega la imagen de fondo de los créditos
        this.add.image(640, 360, 'creditos');  // Imagen de fondo de los créditos

        // Botón de "Salir"
        var exit_button = this.add.image(104, 64, 'exit')  // Coloca el botón en las coordenadas (96, 64)
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
                // Al hacer clic, inicia un fade-out y cambia a la escena del menú principal
                this.cameras.main.fadeOut(500, 0, 0, 0);

                // Espera a que el fade-out termine antes de iniciar la nueva escena
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('MainMenuScene'); // Cambia a la escena del menú principal
                });
            });
        
        this.updateStatus();
        this.time.addEvent({
            delay: 100, 
            callback: this.updateStatus,
            callbackScope: this,
            loop: true
        });
    }

    // Método update: se ejecuta en cada frame, puede usarse para lógica del juego (vacío aquí)
    update(time, delta) {
        // Sin implementación adicional en este ejemplo
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
                this.scene.start('MainMenuScene'); // Vuelve al menú principal
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