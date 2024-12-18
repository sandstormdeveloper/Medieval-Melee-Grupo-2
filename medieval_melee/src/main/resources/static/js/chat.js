var returnToMenu;
class ChatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ChatScene' });
        this.latestMessageTimestamp = 0; 
        this.messages = [];
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
            delay: 500, 
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
            const response = await this.fetchWithTimeout('/api/status', {}, 2000);
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

    appendMessages(messages) {
        this.messages.push(...messages);
        const maxVisibleLines = 12;
    
        while (this.messages.length > maxVisibleLines) {
            this.messages.shift();
        }
        
        this.chat.setText(this.messages.join("\n"));
    }
    

    async sendMessage() {
        if (isConnected) {
            const inputField = this.textInput.getChildByName("chat");
            if (!inputField || !inputField.value.trim()) {
                return; 
            }
    
            const messageContent = inputField.value.trim();
            const fullMessage = `[${userPlaying}]: ${messageContent}`;
    
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

            this.scene.stop();
            this.scene.resume('MainMenuScene');
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
