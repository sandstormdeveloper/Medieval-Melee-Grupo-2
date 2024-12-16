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
        // Efecto de fade-in al entrar en la escena
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.add.image(640, 360, 'fondo_login');

        form = this.add.dom(640, 360).createFromCache('login').setOrigin(0.5);

        form.addListener('click');

        form.on('click', (event) => { 
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
                        if (success) this.nextScene();
                        else alert('Usuario o contraseña incorrectos :(');
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
                        if (success) this.nextScene();
                        else alert('No se ha podido registrar el usuario :(');
                    });
                }
            }
        });
        
    }

    nextScene() {
        form.scene.tweens.add({
            targets: form, alpha: 0, duration: 1000, ease: 'Power3',
        });

        this.cameras.main.fadeOut(1000, 0, 0, 0);

        // Espera a que el fade-out termine antes de iniciar la nueva escena
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MainMenuScene');
        });
    }
}