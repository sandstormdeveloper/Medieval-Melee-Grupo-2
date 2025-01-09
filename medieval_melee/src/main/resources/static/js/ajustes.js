var returnToMenu;
var button;
// Clase AjustesScene que representa la escena de ajustes
class AjustesScene extends Phaser.Scene {
    // Constructor de la escena, define la clave de la escena
    constructor() {
        super({ key: 'AjustesScene' });
        this.alertGroup = null; // Contenedor para alertas personalizadas
    }

    // Método preload: carga los recursos necesarios para esta escena
    preload() {
        this.load.image('ajustes_menu', 'assets/ajustes_menu.png');          // Imagen de fondo de los créditos
        this.load.image('exit', 'assets/exit.png');  
        this.load.image('exit_hover', 'assets/exit_hover.png');   
        this.load.html('delete', 'delete.html');      
    }

    // Método create: configura la escena y sus elementos
    create() {
        returnToMenu = false;
        // Efecto de fade-in al entrar en la escena
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Crear sistema de alertas
        this.createAlertSystem();

        // Agrega la imagen de fondo de los créditos
        this.add.image(640, 360, 'ajustes_menu');  // Imagen de fondo de los créditos

        button = this.add.dom(650, 420).createFromCache('delete').setOrigin(0.5);
        button.setAlpha(0);

        button.scene.tweens.add({
            targets: button, alpha: 1, duration: 500, ease: 'Power3',
        });

        button.addListener('click');

        button.on('click', (event) => { 
            if (isConnected) {
                if (event.target.name === 'deleteButton') {
                    this.deleteUser(userPlaying);
                }
            }
        });

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

                button.scene.tweens.add({
                    targets: button, alpha: 0, duration: 500, ease: 'Power3',
                });

                // Espera a que el fade-out termine antes de iniciar la nueva escena
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('MainMenuScene'); // Cambia a la escena del menú principal
                });
            });
        //SLIDER DE VOLUMEN
        this.sliderBar = this.add.rectangle(650, 360, 300, 10, 0x888888);
        this.sliderBar.setOrigin(0.5, 0.5);

        // Crear el deslizador 
        this.sliderHandle = this.add.circle(posSlider, 360, 15, 0xffffff);
        this.sliderHandle.setInteractive({ draggable: true });

        // Rango del slider (mínimo y máximo)
        this.minX = this.sliderBar.x - this.sliderBar.width / 2; // Posición mínima (izquierda)
        this.maxX = this.sliderBar.x + this.sliderBar.width / 2; // Posición máxima (derecha)
        this.currentVolume = (posSlider - this.minX) / (this.maxX - this.minX);
        this.updateSliderPosition();

        // Evento de arrastre para el deslizador
        this.input.setDraggable(this.sliderHandle);
        this.sliderHandle.on('drag', (pointer, dragX, dragY) => {
            // Limitar el deslizador dentro de la barra
            if (dragX < this.minX) dragX = this.minX;
            if (dragX > this.maxX) dragX = this.maxX;

            // Mover el deslizador
            this.sliderHandle.x = dragX;
            posSlider = dragX;

            // Actualizar el volumen
            this.updateVolume();
        });

        this.updateStatus();
        this.time.addEvent({
            delay: 1000, 
            callback: this.updateStatus,
            callbackScope: this,
            loop: true
        });
    }

    updateVolume() {
        // Calcular el porcentaje de volumen
        const position = (this.sliderHandle.x - this.minX) / (this.maxX - this.minX);
        this.currentVolume = position;

        // Aplicar el volumen (en este caso, para todos los sonidos globalmente)
        this.sound.volume = this.currentVolume;
    }

    // Actualizar la posición del deslizador según el volumen actual
    updateSliderPosition() {
        const positionX = this.minX + this.currentVolume * (this.maxX - this.minX);
        this.sliderHandle.x = positionX;
    }
    // Método update: se ejecuta en cada frame, puede usarse para lógica del juego (vacío aquí)
    update(time, delta) {
        // Sin implementación adicional en este ejemplo
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

// Método para mostrar la alerta con el mensaje proporcionado
showAlert(message, type) {
    const colors = { error: 0xff0000, success: 0xff0000 };
    this.alertGroup.getAt(0).setFillStyle(colors[type] || 0xff0000, 0.8);
    this.alertGroup.alertText.setText(message);
    this.alertGroup.setVisible(true);

    
    const confirmButton = this.alertGroup.getAt(2); // El botón de confirmar
    confirmButton.setInteractive(true); // Botón interactivo

    // Llamada al evento de clic
    confirmButton.on('pointerdown', this.handleConfirmButtonClick, this);
}

// Función que maneja el clic en el botón "Aceptar"
handleConfirmButtonClick() {
    // Ocultar la alerta
    this.hideAlert();

    // Cambiar la escena a LoginScene después de la alerta
    this.cameras.main.fadeOut(500, 0, 0, 0);
    
    // Esperar el fade-out antes de cambiar la escena
    this.cameras.main.once('camerafadeoutcomplete', () => {
        this.game.music.stop(); // Detener música si es necesario
        this.scene.start('LoginScene'); // Cambiar a la escena de login
    });
}

// Método para ocultar la alerta
hideAlert() {
    this.alertGroup.setVisible(false);

   
    const confirmButton = this.alertGroup.getAt(2); // El botón de confirmar
    confirmButton.removeListener('pointerdown', this.handleConfirmButtonClick, this);
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

 // Actualización del estado del servidor
async updateStatus() {
    await this.fetchServerStatus();
    if (!isConnected && !returnToMenu) {
            this.showAlert('No se encuentra el servidor :(', 'error');
            returnToMenu = true;
            this.cameras.main.fadeOut(500, 0, 0, 0);

            // Espera a que el fade-out termine antes de iniciar la nueva escena
        this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('MainMenuScene'); // Vuelve al menú principal
        });
    }
}

    // Función de eliminación de usuario
deleteUser(username) {
        fetch(`/api/users/delete?username=${username}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response.json();
        })
        .then(success => {
            if (success) {
                
                this.showAlert(`El usuario "${username}" se ha borrado.`, 'success');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            this.showAlert('Hubo un problema al intentar borrar el usuario.', 'error');
        });
}
    
}