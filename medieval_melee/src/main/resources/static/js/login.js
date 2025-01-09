var form;

class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoginScene' });
        this.alertGroup = null; // Contenedor para alertas personalizadas
    }

    preload() {
        this.load.image('fondo_login', 'assets/castillo.png');
        this.load.html('login', 'login.html');
    }

    create() {
        const storedConnection = localStorage.getItem('isConnected');
        isConnected = storedConnection === 'true';

        if (!isConnected) {
            this.incrementUsers();
            isConnected = true;
            localStorage.setItem('isConnected', 'true');
        } else {
            this.updateStatus();
        }

        // Efecto de fade-in al entrar en la escena
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.add.image(640, 360, 'fondo_login');

        form = this.add.dom(640, 360).createFromCache('login').setOrigin(0.5);

        form.addListener('click');

        document.fonts.ready.then(() => {
            this.statusText = this.add.text(15, 15, '', {
                fontFamily: 'font',
                fontSize: '32px',
                fill: '#fff'
            });

            this.userCountText = this.add.text(15, 55, '', {
                fontFamily: 'font',
                fontSize: '32px',
                fill: '#fff'
            });
        });

        // Crear sistema de alertas
        this.createAlertSystem();

        form.on('click', (event) => {
            if (isConnected) {
                if (event.target.name === 'loginButton') {
                    const inputUsername = form.getChildByName('username');
                    const inputPassword = form.getChildByName('password');

                    if (inputUsername.value !== '' && inputPassword.value !== '') {
                        fetch('/api/users/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            body: `username=${inputUsername.value}&password=${inputPassword.value}`
                        })
                            .then(response => response.json())
                            .then(success => {
                                this.getUser(inputUsername.value);
                                if (success) this.nextScene();
                                else this.showAlert('Ese usuario no existe :(', 'error');
                            });
                    }
                } else if (event.target.name === 'registerButton') {
                    const inputUsername = form.getChildByName('username');
                    const inputPassword = form.getChildByName('password');

                    if (inputUsername.value !== '' && inputPassword.value !== '') {
                        fetch('/api/users/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: inputUsername.value, password: inputPassword.value, gamesPlayed: 0 })
                        })
                            .then(response => response.json())
                            .then(success => {
                                this.getUser(inputUsername.value);
                                if (success) this.nextScene();
                                else this.showAlert('No se ha podido registrar el usuario :(', 'error');
                            });
                    }
                }
            } else {
                if (event.target.name === 'loginButton' || event.target.name === 'registerButton') {
                    this.showAlert('No se encuentra el servidor :(', 'error');
                }
            }
        });

        this.time.addEvent({
            delay: 1000,
            callback: this.updateStatus,
            callbackScope: this,
            loop: true
        });

        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    }

    nextScene() {
        form.removeListener('click');
        form.scene.tweens.add({
            targets: form,
            alpha: 0,
            duration: 1000,
            ease: 'Power3',
        });

        this.cameras.main.fadeOut(1000, 0, 0, 0);

        // Espera a que el fade-out termine antes de iniciar la nueva escena
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MainMenuScene');
        });
    }

    async updateStatus() {
        var { status, connectedUsers } = await this.fetchServerStatus();
        this.statusText.setText(`Estado: ${status}`);
        this.userCountText.setText(`Usuarios: ${connectedUsers}`);
    }

    getUser(usernameInput) {
        fetch(`/api/users/getUser?username=${usernameInput}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
                return response.json();
            })
            .then(user => {
                userPlaying = user.username;
                gamesPlayedByUser = user.gamesPlayed;
            })
            .catch(error => {
                console.error('Error:', error);
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

    decrementUsers() {
        if (!isConnected) return;

        isConnected = false;
        localStorage.setItem('isConnected', 'false');

        const url = '/api/status/decrement';
        const data = JSON.stringify({ action: 'decrement' });

        navigator.sendBeacon(url, data);
    }

    handleBeforeUnload(event) {
        this.decrementUsers();
        localStorage.setItem('isConnected', 'false');
    }
}
