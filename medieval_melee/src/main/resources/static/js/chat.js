class ChatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ChatScene' });
    }

    preload() {
        // Load assets if needed, e.g., background images, fonts
    }

    create() {
        // Background for the chat scene
        this.add.rectangle(640, 360, 1280, 720, 0x333333);

        // Add a title
        this.add.text(640, 50, 'Chat', { font: '32px Arial', fill: '#ffffff' }).setOrigin(0.5);

        // Chat messages container
        this.chatMessages = this.add.text(50, 100, '', {
            font: '20px Arial',
            fill: '#ffffff',
            wordWrap: { width: 1180 }
        });

        // Input field
        this.inputElement = this.add.dom(640, 650).createFromHTML(`
            <input type="text" id="chatInput" placeholder="Type your message..." style="width: 800px; height: 40px; font-size: 16px;">
        `);

        // Submit button
        const submitButton = this.add.dom(1100, 650).createFromHTML(`
            <button id="chatSubmit" style="width: 100px; height: 40px; font-size: 16px;">Send</button>
        `);

        // Capture button click or Enter key
        this.input.keyboard.on('keydown-ENTER', this.sendMessage, this);
        submitButton.addListener('click').on('click', () => this.sendMessage());

        // Simulate fetching chat history from the server
        this.chatHistory = []; // Will hold messages
        this.refreshChat();
    }

    sendMessage() {
        const inputElement = document.getElementById('chatInput');
        const message = inputElement.value.trim();
        if (message) {
            // Simulate sending the message to a server
            this.chatHistory.push({ id: Date.now(), text: message });
            this.refreshChat();
            inputElement.value = ''; // Clear input
        }
    }

    refreshChat() {
        // Update the chat messages displayed
        const chatText = this.chatHistory.map(msg => `> ${msg.text}`).join('\n');
        this.chatMessages.setText(chatText);
    }

    update() {
        // Periodically fetch new messages from the server (if needed)
        // Example: Simulate new messages every 5 seconds
        if (Date.now() % 5000 < 50) {
            this.chatHistory.push({ id: Date.now(), text: "New message from server" });
            this.refreshChat();
        }
    }
}

