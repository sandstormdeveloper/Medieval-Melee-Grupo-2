var returnToMenu = false;
var isConnected = false; // Asegúrate de que esto esté definido

class ChatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ChatScene' });
        this.latestMessageTimestamp = 0; 
        this.messages = [];
        this.alertGroup = null; 
    }

    preload() {
        this.load.html("chat", "chat.html");
    }

    create() {
        returnToMenu = false;
        this.textInput = this.add.dom(640, 690).createFromCache("chat").setOrigin(0.5);
        this.chat = this.add.text(10, 10, this.messages.join("\n"), {
            lineSpacing: 16,
            backgroundColor: "#21313c",
            color: "#fff",
            padding: 20,
            fontFamily: 'font',
            fontSize: '32px',
        });
        this.chat.setFixedSize(1260, 645);

        // Crear sistema de alertas
        this.createAlertSystem();

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.enterKey.on('down', () => this.sendMessage());

        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.escapeKey.on('down', () => {
            if (this.scene.isActive('ChatScene')) {
                this.scene.stop();
                this.scene.resume('MainMenuScene');
            }
        });

        this.fetchMessages();
        this.time.addEvent({
            delay: 1000, 
            callback: this.fetchMessages,
            callbackScope: this,
            loop: true
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
    
        this.children.bringToTop(this.alertGroup);
    }

    showAlert(message, type) {
        const colors = { error: 0xff0000, success: 0x00ff00 };
        this.alertGroup.getAt(0).setFillStyle(colors[type] || 0xff0000, 0.8);
        this.alertGroup.alertText.setText(message);
        this.alertGroup.setVisible(true);

        this.alertGroup.setDepth(100);
        this.children.bringToTop(this.alertGroup);
    }

    hideAlert() {
        this.alertGroup.setVisible(false);
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
            if (error.name === 'AbortError') {
                console.error('Request timed out');
            } else {
                console.error('Request failed:', error.message);
            }
            throw error; // Asegúrate de propagar el error
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

            // Mostrar la alerta personalizada en vez de la alerta del navegador
            this.showAlert('No se encuentra el servidor :(', 'error'); 

            // Asegúrate de que la escena cambie correctamente
            if (!returnToMenu) {
                returnToMenu = true;
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.scene.stop();
                this.scene.resume('MainMenuScene');
            }

            return {
                status: 'Desconectado',
                connectedUsers: 0
            };
        }
    }

    appendMessages(messages) {
        this.messages.push(...messages);
        const maxVisibleLines = 12;
    
        while (this.messages.length > maxVisibleLines) {
            this.messages.shift();
        }
        
        this.chat.setText(this.messages.join("\n"));
    }
    
    async updateStatus() {
        await this.fetchServerStatus();
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

    async sendMessage() {
        if (isConnected) {
            const inputField = this.textInput.getChildByName("chat");
            if (!inputField || !inputField.value.trim()) {
                return; 
            }
    
            const messageContent = inputField.value.trim();
            const fullMessage = `[${userPlaying}]: ${messageContent}`; // Asegúrate de definir `userPlaying` antes
    
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({ message: fullMessage }) 
                });
    
                if (!response.ok) {
                    console.error("No se ha podido enviar el mensaje:", response.status);
                    return;
                }
    
                inputField.value = ""; 
                this.fetchMessages(); 
            } catch (error) {
                console.error("Error enviando mensaje al chat:", error);
            }
        }
    }

    async fetchMessages() {
        if (isConnected) {
            try {
                const response = await fetch(`/api/chat?since=${this.latestMessageTimestamp}`);
                if (!response.ok) {
                    console.error("No se ha podido recuperar los mensajes:", response.status);
                    return;
                }
                const data = await response.json();
                const { messages, timestamp } = data;
                if (messages.length > 0) {
                    this.latestMessageTimestamp = timestamp;
                    this.appendMessages(messages);
                }
            } catch (error) {
                console.error("Error recuperando mensajes:", error);
            }
        }
    }
}
