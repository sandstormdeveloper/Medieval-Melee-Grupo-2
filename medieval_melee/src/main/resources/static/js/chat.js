class ChatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ChatScene' });
    }

    preload() {
        
    }

    create() {
        this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.escapeKey.on('down', () => {
            if (this.scene.isActive('ChatScene')) {
                this.scene.stop();
                this.scene.resume('MainMenuScene');
            }
        });
    }

    update() {

    }
}


