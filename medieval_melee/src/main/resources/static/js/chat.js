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
        this.textInput = this.add.dom(640, 690).createFromCache("chat").setOrigin(0.5);
        this.chat = this.add.text(10, 10, this.messages.join("\n"), {
            lineSpacing: 15,
            backgroundColor: "#21313CDD",
            color: "#26924F",
            padding: 10,
            fontStyle: "bold",
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
            delay: 1000, 
            callback: this.fetchMessages,
            callbackScope: this,
            loop: true
        });
    }

    async fetchMessages() {
        try {
            const response = await fetch(`/api/chat?since=${this.latestMessageTimestamp}`);
            if (!response.ok) {
                console.error("Failed to fetch messages:", response.status);
                return;
            }

            const data = await response.json();
            const { messages, timestamp } = data;

            if (messages.length > 0) {
                this.latestMessageTimestamp = timestamp;
                this.appendMessages(messages);
                console.log("Mensajes recuperados");
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    appendMessages(messages) {
        // Append new messages
        this.messages.push(...messages);
    
        // Calculate the maximum number of lines that can fit in the chat box
        const lineHeight = this.chat.style.lineSpacing + parseInt(this.chat.style.fontSize || 16); // Approx line height
        const maxVisibleLines = 21;
        console.log(maxVisibleLines);
    
        // Ensure messages do not exceed the maximum visible lines
        while (this.messages.length > maxVisibleLines) {
            this.messages.shift(); // Remove the oldest message
        }
    
        // Update the chat text
        this.chat.setText(this.messages.join("\n"));
    }
    

    async sendMessage() {
        const inputField = this.textInput.getChildByName("chat");
        if (!inputField || !inputField.value.trim()) {
            return; 
        }

        const message = inputField.value.trim();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ message })
            });

            if (!response.ok) {
                console.error("Failed to send message:", response.status);
                return;
            }

            inputField.value = ""; 
            this.fetchMessages(); 
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
}
