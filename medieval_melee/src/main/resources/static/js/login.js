var form;

class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoginScene' });
    }

    preload() {
        this.load.image('fondo_login', 'assets/castillo.png');
        this.load.html('login', 'login.html');
    }

    create() {
        if(!isConnected) {
            this.incrementUsers();
            isConnected = true;
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
                            else alert('Ese usuario no existe :(');
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
                            else alert('No se ha podido registrar el usuario :(');
                        });
                    }
                }
            }
            else {
                if (event.target.name === 'loginButton' || event.target.name === 'registerButton') {
                    alert('No se encuentra el servidor :(');
                }
            }

        });

        this.time.addEvent({
            delay: 100, 
            callback: this.updateStatus,
            callbackScope: this,
            loop: true
        });

        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        
    }

    nextScene() {
        form.removeListener('click');
        form.scene.tweens.add({
            targets: form, alpha: 0, duration: 1000, ease: 'Power3',
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
        if(!isConnected) {
            return;
        }

        isConnected = false;
        var url = '/api/status/decrement';
        var data = JSON.stringify({ action: 'decrement' });
    
        navigator.sendBeacon(url, data);
    }
    
    handleBeforeUnload(event) {
        this.decrementUsers();
    }
}