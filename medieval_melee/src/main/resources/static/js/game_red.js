// Declaración de variables globales
var platforms; // Plataformas estáticas del juego
// var bow; // Ítem
// var hammer; // Ítem 2
var arrow1, arrow2; // Flechas
var player1, player2; // Jugadores 1 y 2
var cursors; // Controles del teclado para el jugador 2
var keyA, keyS, keyD, keyW; // Controles del teclado para el jugador 1
var attackTimer1, attackTimer2, attackCooldown, attackRange; // Variables para manejar ataques
var isKnockedBack1, isKnockedBack2; // Indicadores de retroceso para los jugadores
var percent1, percent2; // Porcentajes de daño para cada jugador
var jumpHeight, moveSpeed; // Configuraciones de movimiento
var spawnItemTimer; // Tiempo inicial para generar ítems
var spawnItemInterval; // Intervalo para generar ítems después del inicial
var isFirstSpawn; // Indicador para saber si es la primera vez que se genera un ítem
var formCheck1, formCheck2, formCooldown, formTimer1, formTimer2; // Indica qué forma tiene el jugador1: 0 base, 1 archer

var dmgMult1; //Multiplicador de daño del p1, para el paladin
var dmgMult2; //Multiplicador de daño del p1, para el paladin
var gameEnded;
var returnToMenu;

var keyStates = {
    w: false,
    a: false,
    s: false,
    d: false,
    arrowup: false,
    arrowdown: false,
    arrowleft: false,
    arrowright: false,
};

const MSG_TYPES = {
    INIT: 'i',    
    POS: 'p',        
    HAMMER: 'h',    
    BOW: 'b',    
    COLLECT_HAMMER: 'j',   
    COLLECT_BOW: 'n',  
    TIME: 't',       
    OVER: 'o',
    CHANGE_FORM: 'f',
    ATTACK: 'a'
};

// Clase principal del juego
class RedGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RedGameScene' }); // Asigna una clave para identificar la escena
        this.decremented = false;
        this.alertGroup = null;
        this.isConnected = false; // Definir la variable isConnected
        this.returnToMenu = false; // Definir la variable returnToMenu
        this.blocker = null;  // Añadimos un blocker para bloquear la interacción

        // Game variables
        /** @type {Phaser.GameObjects.GameObject} Player-controlled circle */
        this.player = null;

        /** @type {Phaser.GameObjects.GameObject} Opponent's circle */
        this.otherPlayer = null;

        /** @type {Phaser.GameObjects.GameObject} Square to be collected */
        this.hammer = null;

        /** @type {Phaser.GameObjects.GameObject} Square to be collected */
        this.bow = null;

        /** @type {WebSocket} WebSocket for server communication */
        this.socket = null;

        /** @type {number} Remaining time in seconds */
        this.timeLeft = 180;

        /** @type {Phaser.GameObjects.Text} Timer display */
        this.timeText = null;

        /** @type {Phaser.GameObjects.Text} Player display */
        this.playerText = null;

        /** @type {Phaser.GameObjects.Text} Waiting display */
        this.waitingDisplay = null;

        /** @type {boolean} Indicates whether the game has started */
        this.gameStarted = false;

        /** @type {number|null} Player ID assigned by the server */
        this.playerId = null;

        // Network optimization variables
        /** @type {{x: number, y: number}} Last sent position */
        this.lastSentPosition = { x: 0, y: 0 };

        /** @type {number} Last update timestamp */
        this.lastUpdateTime = 0;

        /** @type {number} Interval for position updates in milliseconds */
        this.POSITION_UPDATE_INTERVAL = 10;
    }

    // Método para cargar los recursos del juego
    preload() {
        this.load.image('fondo', 'assets/fondo.png'); // Fondo del escenario
        this.load.image('PlayaFondo', 'assets/PlayaFondo.png'); // Fondo del escenario
        this.load.image('MuelleFondo', 'assets/MuelleFondo.png'); // Fondo del escenario
        this.load.image('BosqueFondo', 'assets/BosqueFondo.png'); // Fondo del escenario
        this.load.image('escenario', 'assets/escenario.png'); // Escenario principal
        this.load.image('plataforma', 'assets/plataforma.png'); // Plataformas
        this.load.image('bow', 'assets/bow.png'); // Ítem coleccionable
        this.load.image('hammer', 'assets/hammer.png'); // Ítem coleccionable
        this.load.image('arrow', 'assets/arrow.png'); // Flecha

        this.load.audio('menu_music', 'assets/menu.mp3');
        this.load.audio('game_music', 'assets/juego.mp3');

        //SFX
        this.load.audio('swordSound', 'assets/SFX/swordSound.wav');
        this.load.audio('hammerSound', 'assets/SFX/hammerSound.wav');
        this.load.audio('arrowSound', 'assets/SFX/arrowSound.wav');
        this.load.audio('hitSound', 'assets/SFX/hitSound.wav');
        this.load.audio('jumpSound', 'assets/SFX/jumpSound.wav');

        // Interfaz
        this.load.image('interfaz1', 'assets/interfaz_p1.png');
        this.load.image('interfaz2', 'assets/interfaz_p2.png');

        // Animaciones para el jugador 1
        this.load.spritesheet('caballero1_run', 'assets/p1_caballero/run.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('caballero1_idle', 'assets/p1_caballero/idle.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('caballero1_attack', 'assets/p1_caballero/attack.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('arquero1_run', 'assets/p1_arquero/run.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('arquero1_idle', 'assets/p1_arquero/idle.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('arquero1_attack', 'assets/p1_arquero/attack.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('paladin1_run', 'assets/p1_paladin/run.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('paladin1_idle', 'assets/p1_paladin/idle.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('paladin1_attack', 'assets/p1_paladin/attack.png', { frameWidth: 192, frameHeight: 128 });

        // Animaciones para el jugador 2
        this.load.spritesheet('caballero2_run', 'assets/p2_caballero/run.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('caballero2_idle', 'assets/p2_caballero/idle.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('caballero2_attack', 'assets/p2_caballero/attack.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('arquero2_run', 'assets/p2_arquero/run.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('arquero2_idle', 'assets/p2_arquero/idle.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('arquero2_attack', 'assets/p2_arquero/attack.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('paladin2_run', 'assets/p2_paladin/run.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('paladin2_idle', 'assets/p2_paladin/idle.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('paladin2_attack', 'assets/p2_paladin/attack.png', { frameWidth: 192, frameHeight: 128 });

    }

    // Método para inicializar los elementos de la escena
    create() {
        clientWon = true;
        this.socket = new WebSocket("ws://" + location.host + "/ws");

        returnToMenu = false;
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Inicialización de variables
        attackTimer1 = attackTimer2 = 0; // Temporizadores de ataque
        attackCooldown = 1; // Enfriamiento entre ataques (en segundos)
        attackRange = 96; // Rango de ataque
        isKnockedBack1 = isKnockedBack2 = false; // Estado inicial sin retroceso
        percent1 = percent2 = 1; // Multiplicador de daño inicial
        jumpHeight = 600; // Altura del salto
        moveSpeed = 250; // Velocidad de movimiento
        spawnItemTimer = 5000; // Tiempo inicial para generar ítems
        spawnItemInterval = 20000; // Intervalo entre generación de ítems
        isFirstSpawn = true; // Primera generación de ítems
        formCheck1 = formCheck2 = 0; // Jugadores empiezan en su forma base
        formTimer1 = formTimer2 = 0 // Tiempo restante de la transformación
        formCooldown = 10 // Tiempo que dura una transformación

        dmgMult1=1; //multiplicador de daño, al transformarse en paladín se pone en 2
        dmgMult2=1;
        gameEnded = false;
        
        //crear SFX
        this.swordSound = this.sound.add('swordSound');
        this.hammerSound = this.sound.add('hammerSound');
        this.arrowSound = this.sound.add('arrowSound');
        this.hitSound = this.sound.add('hitSound');
        this.jumpSound = this.sound.add('jumpSound');

        // Handle keydown events
        this.input.keyboard.on('keydown', (event) => {
            const key = event.key.toLowerCase(); // Normalize the key to lowercase
            if (key in keyStates) {
                keyStates[key] = true; // Update the state to true when the key is pressed
            }
        });

        // Handle keyup events
        this.input.keyboard.on('keyup', (event) => {
            const key = event.key.toLowerCase(); // Normalize the key to lowercase
            if (key in keyStates) {
                keyStates[key] = false; // Update the state to false when the key is released
            }
        });

        const fondos = ['fondo', 'PlayaFondo', 'MuelleFondo', 'BosqueFondo'];
        const fondoSeleccionado = Phaser.Math.RND.pick(fondos);

        // Agrega el fondo seleccionado
        this.add.image(640, 360, fondoSeleccionado);

        // Creación de grupos de plataformas y espadas
        platforms = this.physics.add.staticGroup();
        // bow = this.physics.add.group();
        // hammer = this.physics.add.group();
        arrow1 = this.physics.add.group({allowGravity: false});
        arrow2 = this.physics.add.group({allowGravity: false});

        // Colisión entre los objetos y las plataformas
        //this.physics.add.collider(bow, platforms);
        //this.physics.add.collider(hammer, platforms);
        this.physics.add.collider(arrow1, platforms);
        this.physics.add.collider(arrow2, platforms);

        // Creación del escenario y las plataformas
        platforms.create(640, 500, 'escenario'); // Escenario principal
        platforms.create(640, 250, 'plataforma'); // Plataforma superior central
        platforms.create(440, 350, 'plataforma'); // Plataforma izquierda
        platforms.create(840, 350, 'plataforma'); // Plataforma derecha

        // Creación de interfaz
        this.add.image(540, 640, 'interfaz1');
        this.add.image(740, 640, 'interfaz2');

        // // Configuración del jugador 1
        // player1 = this.physics.add.sprite(440, 300, 'caballero1_idle');
        // player1.setBodySize(32, 64); // Tamaño del cuerpo físico
        // this.physics.add.collider(player1, platforms); // Colisión con plataformas
        
        // // Configuración del jugador 2
        // player2 = this.physics.add.sprite(840, 300, 'caballero2_idle');
        // player2.setBodySize(32, 64); // Tamaño del cuerpo físico
        // player2.flipX = true; // Invierte la dirección de la imagen
        // this.physics.add.collider(player2, platforms); // Colisión con plataformas

        // // Detección de superposición con ítems (espadas)
        // this.physics.add.overlap(player1, bow, this.collectBow1, null, this);
        // this.physics.add.overlap(player2, bow, this.collectBow2, null, this);
        // this.physics.add.overlap(player1, hammer, this.collectHammer1, null, this);
        // this.physics.add.overlap(player2, hammer, this.collectHammer2, null, this);

        // Creación de animaciones para ambos jugadores
        this.createAnimations();

        // Crear sistema de alertas
        this.createAlertSystem();

        // Eventos de ataque en animaciones
        // this.player.on('animationupdate', (animation, frame) => {
        //     if (animation.key === 'caballero1_attack' && frame.index === 4) {
        //         this.attack(1); // Ejecuta ataque del jugador 1
        //     }
        // });

        // this.player.on('animationupdate', (animation, frame) => {
        //     if (animation.key === 'paladin1_attack' && frame.index === 5) {
        //         this.attack(1); // Ejecuta ataque del jugador 1
        //     }
        // });

        // this.player.on('animationupdate', (animation, frame) => {
        //     if (animation.key === 'caballero2_attack' && frame.index === 4) {
        //         this.attack(2); // Ejecuta ataque del jugador 2
        //     }
        // });

        // this.player.on('animationupdate', (animation, frame) => {
        //     if (animation.key === 'paladin2_attack' && frame.index === 5) {
        //         this.attack(2); // Ejecuta ataque del jugador 1
        //     }
        // });

        // this.player.on('animationupdate', (animation, frame) => {
        //     if (animation.key === 'arquero1_attack' && frame.index === 6) {
        //         this.shoot(1); // Ejecuta disparo del jugador 1
        //     }
        // });

        // this.player.on('animationupdate', (animation, frame) => {
        //     if (animation.key === 'arquero2_attack' && frame.index === 6) {
        //         this.shoot(2); // Ejecuta disparo del jugador 2
        //     }
        // });

        // Temporizador para generación de ítems
        // this.time.addEvent({
        //     delay: spawnItemTimer,
        //     callback: this.firstSpawnItem,
        //     callbackScope: this,
        //     loop: false, // Sólo una vez
        // });

        // this.time.addEvent({
        //     delay: spawnItemInterval,
        //     callback: this.spawnItem,
        //     callbackScope: this,
        //     loop: true, // Repetición continua
        // });

        //Contador en pantalla para mostrar el porcentaje de cada jugador
        document.fonts.ready.then(() => {
            this.screenPercentage1 = this.add.text(550, 615, '', {
                fontFamily: 'font',
                fontSize: '32px',
                fill: '#fff'
            });

            this.screenPercentage2 = this.add.text(750, 615, '', {
                fontFamily: 'font',
                fontSize: '32px',
                fill: '#fff'
            });

            this.statusText = this.add.text(15, 15, 'Estado: Desconectado', {
                fontFamily: 'font',
                fontSize: '32px',
                fill: '#fff'
            });
    
            this.userCountText = this.add.text(15, 55, 'Usuarios: 0', {
                fontFamily: 'font',
                fontSize: '32px',
                fill: '#fff'
            });

            this.waitingDisplay = this.add.text(640, 400, 'Esperando a otro jugador...', { 
                fontFamily: 'font',
                fontSize: '32px',
                fill: '#fff'
            }).setOrigin(0.5);

            this.timeText = this.add.text(1265, 45, 'Tiempo restante: ' + this.timeLeft, { 
                fontFamily: 'font',
                fontSize: '32px',
                fill: '#fff'
            }).setOrigin(1);
        });

        //Pausa del videojuego
        // Configuración de la entrada de la tecla escape
        // this.escapeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // // Detecta la pulsación de la tecla escape
        // this.escapeKey.on('down', () => {
        //     if (!this.scene.isPaused('PauseMenuScene')) {
        //         this.scene.pause(); // Pausa la escena principal
        //         this.scene.launch('PauseMenuScene'); // Inicia la escena de pausa
        //     }
        // });

        this.updateStatus();
        this.time.addEvent({
            delay: 1000, 
            callback: this.updateStatus,
            callbackScope: this,
            loop: true
        });

        this.setupWebSocket();
    }

    // Método para crear animaciones
    createAnimations() {
        // Animaciones del jugador 1
        this.anims.create({
            key: 'caballero1_run',
            frames: this.anims.generateFrameNumbers('caballero1_run', { start: 0, end: 6 }),
            frameRate: 12,
            repeat: -1, // Repetición infinita
        });

        this.anims.create({
            key: 'caballero1_attack',
            frames: this.anims.generateFrameNumbers('caballero1_attack', { start: 0, end: 5 }),
            frameRate: 12,
        });

        this.anims.create({
            key: 'caballero1_idle',
            frames: this.anims.generateFrameNumbers('caballero1_idle', { start: 0, end: 10 }),
            frameRate: 6,
            repeat: -1,
        });

        this.anims.create({
            key: 'arquero1_run',
            frames: this.anims.generateFrameNumbers('arquero1_run', { start: 0, end: 6 }),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: 'arquero1_attack',
            frames: this.anims.generateFrameNumbers('arquero1_attack', { start: 0, end: 7 }),
            frameRate: 12,
        });

        this.anims.create({
            key: 'arquero1_idle',
            frames: this.anims.generateFrameNumbers('arquero1_idle', { start: 0, end: 6 }),
            frameRate: 6,
            repeat: -1,
        });

        // Animaciones del jugador 2
        this.anims.create({
            key: 'caballero2_run',
            frames: this.anims.generateFrameNumbers('caballero2_run', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: 'caballero2_attack',
            frames: this.anims.generateFrameNumbers('caballero2_attack', { start: 0, end: 5 }),
            frameRate: 12,
        });

        this.anims.create({
            key: 'caballero2_idle',
            frames: this.anims.generateFrameNumbers('caballero2_idle', { start: 0, end: 14 }),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: 'arquero2_run',
            frames: this.anims.generateFrameNumbers('arquero2_run', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: 'arquero2_attack',
            frames: this.anims.generateFrameNumbers('arquero2_attack', { start: 0, end: 7 }),
            frameRate: 12,
        });

        this.anims.create({
            key: 'arquero2_idle',
            frames: this.anims.generateFrameNumbers('arquero2_idle', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1,
        });

        this.anims.create({
            key: 'paladin1_run',
            frames: this.anims.generateFrameNumbers('paladin1_run', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1,
        });
        this.anims.create({
            key: 'paladin1_idle',
            frames: this.anims.generateFrameNumbers('paladin1_idle', { start: 0, end: 26 }),
            frameRate: 12,
            repeat: -1,
        });
        this.anims.create({
            key: 'paladin1_attack',
            frames: this.anims.generateFrameNumbers('paladin1_attack', { start: 0, end: 7 }),
            frameRate: 16,
            repeat: -1,
        });
        this.anims.create({
            key: 'paladin2_run',
            frames: this.anims.generateFrameNumbers('paladin2_run', { start: 0, end: 9 }),
            frameRate: 12,
            repeat: -1,
        });
        this.anims.create({
            key: 'paladin2_idle',
            frames: this.anims.generateFrameNumbers('paladin2_idle', { start: 0, end: 26 }),
            frameRate: 12,
            repeat: -1,
        });
        this.anims.create({
            key: 'paladin2_attack',
            frames: this.anims.generateFrameNumbers('paladin2_attack', { start: 0, end: 7 }),
            frameRate: 16,
            repeat: -1,
        });
    }

    // Se ejecuta en cada frame del juego para actualizar los estados y comportamientos de los jugadores
    update(time, delta) {   
        if (!this.gameStarted || !this.player) return;
        this.timers(delta);
        this.inputs();
        this.handlePositionUpdates();
        this.checkWin();
    }    

    // Maneja el input de los dos jugadores
    inputs() {
        // ** Control del Jugador 1 **
        if (keyStates['a'] && !isKnockedBack1) {
            // Movimiento hacia la izquierda
            this.player.setVelocityX(-moveSpeed); // Velocidad negativa para ir a la izquierda
           
            // Reproduce la animación de correr si no está atacando
            if (attackTimer1 <= attackCooldown - 0.5) {
                if (formCheck1 == 0){
                    this.player.anims.play('caballero1_run', true);
                }
                else if (formCheck1 == 1){
                    this.player.anims.play('arquero1_run', true); 
                }
                else if(formCheck1 == 2){
                    this.player.anims.play('paladin1_run', true); 
                }
            }

            // Invierte el sprite para mirar a la izquierda
            this.player.flipX = true;
    
        } else if (keyStates['d'] && !isKnockedBack1) {
            // Movimiento hacia la derecha
            this.player.setVelocityX(moveSpeed); // Velocidad positiva para ir a la derecha
    
            // Reproduce la animación de correr si no está atacando
            if (attackTimer1 <= attackCooldown - 0.5) {
                if (formCheck1 == 0){
                    this.player.anims.play('caballero1_run', true);
                }
                else if (formCheck1 == 1){
                    this.player.anims.play('arquero1_run', true); 
                }
                else if(formCheck1 == 2){
                    this.player.anims.play('paladin1_run', true); 
                }
            }
    
            // Orienta el sprite hacia la derecha
            this.player.flipX = false;
    
        } else if (!isKnockedBack1) {
            // Si no se mueve y no está retrocediendo, se detiene
            this.player.setVelocityX(0);
    
            // Reproduce la animación de estar quieto
            if (attackTimer1 <= attackCooldown - 0.5) {
                if (formCheck1 == 0){
                    this.player.anims.play('caballero1_idle', true);
                }
                else if (formCheck1 == 1){
                    this.player.anims.play('arquero1_idle', true); 
                }
                else if(formCheck1 == 2){
                    this.player.anims.play('paladin1_idle', true); 
                }
            }
        }
    
        // Salto del Jugador 1
        if (keyStates['w'] && this.player.body.touching.down && !isKnockedBack1) {
            keyStates['w'] = false;
            this.jumpSound.play();
            this.player.setVelocityY(-jumpHeight); // Impulso hacia arriba
        }

        // Ataque del Jugador 1
        if (keyStates['s'] && !isKnockedBack1) {
            keyStates['s'] = false;
            if (attackTimer1 <= 0) {
                // Reproduce la animación de ataque y reinicia el temporizador
                if(formCheck1 == 0) {
                    this.player.anims.play('caballero1_attack');
                    this.swordSound.play();
                }
                else if(formCheck1 == 1) {
                    this.player.anims.play('arquero1_attack');
                    this.arrowSound.play();
                }
                else if(formCheck1 == 2){
                    this.player.anims.play('paladin1_attack'); 
                    this.hammerSound.play();
                }
                attackTimer1 = attackCooldown;
                this.sendMessage(MSG_TYPES.ATTACK);
            }
        }
    }

    handlePositionUpdates() {
        const currentTime = Date.now();
        if (currentTime - this.lastUpdateTime >= this.POSITION_UPDATE_INTERVAL) {
            this.sendPosition();
            this.lastUpdateTime = currentTime;
            this.lastSentPosition = { x: this.player.x, y: this.player.y };
        }
    }

    sendMessage(type, data = null) {
        if (this.socket.readyState === WebSocket.OPEN) {
            if (data) {
                this.socket.send(`${type}${JSON.stringify(data)}`);
            } else {
                this.socket.send(type);
            }
        }
    }

    sendPosition() {
        var temp = 0;

        if (attackTimer1 <= attackCooldown - 0.5) {
            temp = 0
        } else {
            temp = 1
        }

        this.sendMessage(MSG_TYPES.POS, [
            Math.round(this.player.x),
            Math.round(this.player.y),
            Math.round(this.player.body.velocity.x),
            Math.round(temp)
        ]); 
    }

    // Aquí se manejan los temporizadores del juego
    timers(delta) {
        // Reducción del temporizador de ataque para el Jugador 1
        if (attackTimer1 > 0) {
            attackTimer1 -= delta / 1000; // Disminuye según el tiempo transcurrido
        }

        // Temporizador de transformación para el Jugador 1
        if (formTimer1 > 0) {
            formTimer1 -= delta / 1000; // Disminuye según el tiempo transcurrido
        }

        if(formTimer1 <= 0) {
            if (formCheck1 != 0) {
                this.sendMessage(MSG_TYPES.CHANGE_FORM);
                formCheck1 = 0;
            }           
        }
    }

    // Si un jugador se sale de la pantalla, gana el otro
    checkWin() {
        if (!gameEnded) {
            // Comprueba si el jugador 1 se ha salido de la pantalla
            if(this.player.x > 1280 || this.player.x < 0 || this.player.y > 720 || this.player.y < 0) {
                gameEnded = true;
                this.gameStarted = false
                if (this.socket) this.socket.close();
                clientWon = false;
                console.log(clientWon);
                this.cameras.main.fadeOut(500, 0, 0, 0);

                // Espera a que el fade-out termine antes de iniciar la nueva escena
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('EndScene'); // Cambia a la escena del juego
                    this.game.music.stop();
                    this.game.music = this.sound.add('menu_music', { loop: true });
                    this.game.music.play();
                });

            }

            // Comprueba si el jugador 2 se ha salido de la pantalla
            if(this.otherPlayer.x > 1280 || this.otherPlayer.x < 0 || this.otherPlayer.y > 720 || this.otherPlayer.y < 0) {
                gameEnded = true;
                this.gameStarted = false
                if (this.socket) this.socket.close();
                clientWon = true;
                this.cameras.main.fadeOut(500, 0, 0, 0);

                // Espera a que el fade-out termine antes de iniciar la nueva escena
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('EndScene'); // Cambia a la escena del juego
                    this.game.music.stop();
                    this.game.music = this.sound.add('menu_music', { loop: true });
                    this.game.music.play();
                });

                if (this.socket) this.socket.close();
            }
        }
    }

    // Ejecuta el disparo del arquero
    shoot(player) {
        var velocity = 1000;

        if (player == 1) {
            var projectile = arrow1.create(this.player.x, this.player.y - 15, 'arrow');
            projectile.setGravityY(0);
    
            // Programa la destrucción de la flecha después de 5 segundos si no colisiona
            setTimeout(() => {
                if (projectile) {
                    projectile.destroy();
                }
            }, 3000);

            if(!this.player.flipX) {
                projectile.setVelocityX(velocity);
            } else {
                projectile.setVelocityX(-velocity);
                projectile.flipX = true;
            }
        }
        else {
            var projectile = arrow2.create(this.otherPlayer.x, this.otherPlayer.y - 15, 'arrow');
            projectile.setGravityY(0);
    
            // Programa la destrucción de la flecha después de 5 segundos si no colisiona
            setTimeout(() => {
                if (projectile) {
                    projectile.destroy();
                }
            }, 3000);

            if(!this.otherPlayer.flipX) {
                projectile.setVelocityX(velocity);
            } else {
                projectile.setVelocityX(-velocity);
                projectile.flipX = true;
            }
        }
    }

    // Colisión entre el jugador 1 y una flecha
    hit1(player, arrow2) {
        if(arrow2.flipX) {
            this.knockback(1, -1);
        } else {
            this.knockback(1, 1);
        }

        arrow2.destroy();
    }

    // Colisión entre el jugador 2 y una flecha
    hit2(player2, arrow1) {
        if(arrow1.flipX) {
            this.knockback(2, -1);
        } else {
            this.knockback(2, 1);
        }

        arrow1.destroy();
    }
    
    // Ejecuta un ataque entre los jugadores, aplicando retroceso y actualizando porcentajes de daño
    attack(player) {
        // Calcula la distancia entre los dos jugadores
        var distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.otherPlayer.x, this.otherPlayer.y);
    
        // Lógica de ataque para el Jugador 1
        if (player == 1) {
            // Ataque hacia la derecha
            if (!this.player.flipX && distance < attackRange && this.player.x - 8 < this.otherPlayer.x) {
                this.knockback(2, 1);
            }
            // Ataque hacia la izquierda
            else if (this.player.flipX && distance < attackRange && this.player.x + 8 > this.otherPlayer.x) {
                this.knockback(2, -1);
            }
        }
    
        // Lógica de ataque para el Jugador 2
        else if (player == 2) {
            // Ataque hacia la derecha
            if (!this.otherPlayer.flipX && distance < attackRange && this.otherPlayer.x - 8 < this.player.x) {
                this.knockback(1, 1);
            }
            // Ataque hacia la izquierda
            else if (this.otherPlayer.flipX && distance < attackRange && this.otherPlayer.x + 8 > this.player.x) {
                this.knockback(1, -1);
            }
        }
    }

    knockback(player, direction) {
        var knockbackForce = 750;          // Fuerza de retroceso horizontal
        var knockbackDuration = 100;      // Duración del impulso inicial (en ms)
        var verticalKnockback = 350;      // Fuerza de retroceso vertical
        var slowDownDuration = 300;

        if (player == 1) {
            this.hitSound.play();
            // Aplicar knockback inicial con interpolación
            this.tweens.add({
                targets: this.player.body.velocity,
                x: knockbackForce * direction * percent1,
                y: -verticalKnockback,
                ease: 'Quad.easeOut',
                duration: knockbackDuration,
                onComplete: () => {
                    isKnockedBack1 = false;
    
                    // Tween secundario para reducir la velocidad gradualmente
                    this.tweens.add({
                        targets: this.player.body.velocity,
                        x: 10, // La velocidad horizontal se reduce a 0
                        y: 10, // La velocidad vertical también se reduce a 0
                        ease: 'Quad.easeOut', // Curva suave de desaceleración
                        duration: slowDownDuration
                    });
                }
            });
            isKnockedBack1 = true;                          // Marca al jugador 2 como en retroceso

            if(formCheck2==2){
                dmgMult2=1.5;
            }
            else{
                dmgMult2=1;
            }
            percent1 += 0.1*dmgMult2; // Incrementa el daño del jugador 2
            this.screenPercentage1.setText(Math.round((percent1- 1) * 100) + '%'); // Actualiza el porcentaje del jugador en pantalla
            this.time.addEvent({
                delay: knockbackDuration,
                callback: () => { isKnockedBack1 = false; } // Finaliza el estado de retroceso
            });
        } 
        else {   
            this.hitSound.play();
            isKnockedBack2 = true;    
            if(formCheck1==2){
                dmgMult1=1.5;
            }
            else{
                dmgMult1=1;
            }                    // Marca al jugador 2 como en retroceso
            percent2 += 0.1*dmgMult1; // Incrementa el daño del jugador 2
            this.screenPercentage2.setText(Math.round((percent2 - 1) * 100) + '%'); // Actualiza el porcentaje del jugador en pantalla
            this.time.addEvent({
                delay: knockbackDuration,
                callback: () => { isKnockedBack2 = false; } // Finaliza el estado de retroceso
            });
        }
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

    async updateStatus() {
        var { status, connectedUsers } = await this.fetchServerStatus();
        this.statusText.setText(`Estado: ${status}`);
        this.userCountText.setText(`Usuarios: ${connectedUsers}`);

        if(!isConnected && !returnToMenu) {
            this.showAlert('No se encuentra el servidor :(', 'error'); // Mostrar la alerta personalizada
            returnToMenu = true;
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

    setupWebSocket() {
        this.socket.onopen = () => {
            console.log('Conectado al servidor');
        };

        this.socket.onmessage = (event) => {
            const type = event.data.charAt(0);
            const data = event.data.length > 1 ? JSON.parse(event.data.substring(1)) : null;

            switch(type) {
                case MSG_TYPES.INIT:
                    this.handleInit(data);
                    break;
                case MSG_TYPES.POS:
                    this.handlePosition(data);
                    break;
                case MSG_TYPES.HAMMER:
                    this.handleHammerSpawn(data);
                    break;
                case MSG_TYPES.BOW:
                    this.handleBowSpawn(data);
                    break;
                case MSG_TYPES.COLLECT_HAMMER:
                    this.handleHammerCollection(data);
                    break;
                case MSG_TYPES.COLLECT_BOW:
                    this.handleBowCollection(data);
                    break;
                case MSG_TYPES.TIME:
                    this.handleTimeUpdate(data);
                    break;
                case MSG_TYPES.OVER:
                    this.handleGameOver(data);
                    break;
                case MSG_TYPES.CHANGE_FORM:
                    this.handleForm(data);
                    break;
                case MSG_TYPES.ATTACK:
                    this.handleAttack(data);
                    break;
            }
        };

        this.socket.onclose = () => {
            this.gameStarted = false;
        };
    }

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
            .on('pointerdown', this.hideAlert, this)  // Cuando se hace click, se oculta la alerta y va al menú
            .setDepth(103);

        const confirmText = this.add.text(0, 50, 'Aceptar', {
            fontFamily: 'font',
            fontSize: '20px',
            color: '#ff0000'
        }).setOrigin(0.5).setDepth(104);

        this.alertGroup.add([alertBg, alertText, confirmButton, confirmText]);
        this.alertGroup.alertText = alertText;

        this.children.bringToTop(this.alertGroup);

        // Bloqueador invisible para deshabilitar interacciones
        this.blocker = this.add.rectangle(0, 0, 1280, 720, 0x000000, 0.5)
            .setOrigin(0, 0)
            .setInteractive()
            .setVisible(false)  // Inicialmente invisible
            .setDepth(99); // Se coloca debajo de la alerta pero encima de otros elementos
    }

    showAlert(message, type) {
        const colors = { error: 0xff0000, success: 0x00ff00 };
        this.alertGroup.getAt(0).setFillStyle(colors[type] || 0xff0000, 0.8);
        this.alertGroup.alertText.setText(message);
        this.alertGroup.setVisible(true);

        // Mostrar el bloqueador que desactiva interacciones en el resto del juego
        this.blocker.setVisible(true);
        this.isAlertActive = true;  // Indicamos que la alerta está activa

        // Deshabilitar entrada de teclado mientras la alerta esté activa
        this.input.keyboard.enabled = false;

        this.alertGroup.setDepth(100);
        this.children.bringToTop(this.alertGroup);
    }

    hideAlert() {
        this.alertGroup.setVisible(false);  // Ocultamos la alerta
        this.blocker.setVisible(false);  // Ocultamos el bloqueador

        // Ahora que el usuario ha dado "Aceptar", volvemos al menú
        this.cameras.main.fadeOut(500, 0, 0, 0);

        // Esperamos a que termine el fade-out antes de iniciar la nueva escena
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('MainMenuScene'); // Vuelve al menú principal

            this.scene.get('MainMenuScene').updateStatus(); // Llamamos a updateStatus en MainMenuScene

            this.sound.stopAll(); // Detener toda la música
            this.game.music = this.sound.add('menu_music', { loop: true });
            this.game.music.play();
        });

        // Rehabilitar la entrada del teclado
        this.input.keyboard.enabled = true;
        this.isAlertActive = false;  // Indicamos que la alerta ya no está activa
    }

    handleInit(data) {
        if (this.waitingDisplay) {
            this.waitingDisplay.destroy();
        }

        this.playerId = data.id;
        this.initializePlayers(data.p);
        this.gameStarted = true;
    }

    handlePosition(data) {
        if (data[0] !== this.playerId && this.otherPlayer) {
            this.otherPlayer.x = data[1];
            this.otherPlayer.y = data[2];

            console.log(data[4]);

            if (data[3] < 0 && !isKnockedBack2) {
                this.otherPlayer.flipX = true;
                if (data[4] == 0) {
                    if (formCheck2 == 0) {
                        this.otherPlayer.anims.play('caballero2_run', true);
                    } else if (formCheck2 == 1) {
                        this.otherPlayer.anims.play('arquero2_run', true);
                    } else if (formCheck2 == 2) {
                        this.otherPlayer.anims.play('paladin2_run', true);
                    }
                }
            } else if (data[3] > 0 && !isKnockedBack2) {
                this.otherPlayer.flipX = false;
                if (data[4] <= attackCooldown - 0.5) {
                    if (formCheck2 == 0) {
                        this.otherPlayer.anims.play('caballero2_run', true);
                    } else if (formCheck2 == 1) {
                        this.otherPlayer.anims.play('arquero2_run', true);
                    } else if (formCheck2 == 2) {
                        this.otherPlayer.anims.play('paladin2_run', true);
                    }
                }
            } else {
                if (data[4] == 0) {
                    if (formCheck2 == 0) {
                        this.otherPlayer.anims.play('caballero2_idle', true);
                    } else if (formCheck2 == 1) {
                        this.otherPlayer.anims.play('arquero2_idle', true);
                    } else if (formCheck2 == 2) {
                        this.otherPlayer.anims.play('paladin2_idle', true);
                    }
                }
            }
        }
    }

    handleHammerSpawn(data) {
        if (this.hammer) this.hammer.destroy();
        if (this.bow) this.bow.destroy();
        this.hammer = this.physics.add.sprite(data[0], data[1], 'hammer');
        this.physics.add.collider(this.hammer, platforms);
        this.physics.add.overlap(this.player, this.hammer, () => {
            this.sendMessage(MSG_TYPES.COLLECT_HAMMER);
        })
    }

    handleBowSpawn(data) {
        if (this.hammer) this.hammer.destroy();
        if (this.bow) this.bow.destroy();
        this.bow = this.physics.add.sprite(data[0], data[1], 'bow');
        this.physics.add.collider(this.bow, platforms);
        this.physics.add.overlap(this.player, this.bow, () => {
            this.sendMessage(MSG_TYPES.COLLECT_BOW);
        })
    }

    handleHammerCollection(data) {
        if(data[0] == this.playerId) {
            formTimer1 = formCooldown;
            formCheck1 = 2;
        } else {
            formCheck2 = 2;
        }
        if (this.hammer) this.hammer.destroy();
        this.hammer = null;
    }

    handleBowCollection(data) {
        if(data[0] == this.playerId) {
            formTimer1 = formCooldown;
            formCheck1 = 1;
        } else {
            formCheck2 = 1;
        }
        if (this.bow) this.bow.destroy();
        this.bow = null;
    }

    handleForm(data) {
        if(data[0] != this.playerId) {
            formCheck2 = 0;
        }
    }

    handleAttack(data) {
        if(data[0] != this.playerId) {
            if(formCheck2 == 0) {
                this.otherPlayer.anims.play('caballero2_attack');
                this.swordSound.play();
            }
            else if(formCheck2 == 1) {
                this.otherPlayer.anims.play('arquero2_attack');
                this.arrowSound.play();
            }
            else if(formCheck2 == 2){
                this.otherPlayer.anims.play('paladin2_attack'); 
                this.hammerSound.play();
            }
        }
    }

    handleTimeUpdate(data) {
        this.timeLeft = data;
        this.updateTimer();
    }

    updateTimer() {
        this.timeText.setText(`Tiempo restante: ${this.timeLeft}`);
    }

    handleGameOver(scores) {
        this.gameStarted = false;
        if (this.socket) this.socket.close();

        if (percent1 > percent2) {
            clientWon = false;
        } else if (percent1 < percent2) {
            clientWon = true;
        } else {
            clientWon = Math.random() < 0.5;
        }

        this.cameras.main.fadeOut(500, 0, 0, 0);

        // Espera a que el fade-out termine antes de iniciar la nueva escena
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('EndScene'); // Cambia a la escena del juego
            this.game.music.stop();
            this.game.music = this.sound.add('menu_music', { loop: true });
            this.game.music.play();
        });
    }

    initializePlayers(players) {
        players.forEach(p => {
            const spriteKey = p[2] === this.playerId ? 'caballero1_idle' : 'caballero2_idle';
            const player = this.physics.add.sprite(p[0], p[1], spriteKey);
            
            player.setBodySize(32, 64); 
            this.physics.add.collider(player, platforms);
            
            if (p[2] === this.playerId) {
                this.player = player; 

                this.physics.add.overlap(this.player, arrow2, this.hit1, null, this);

                this.player.on('animationupdate', (animation, frame) => {
                    if (animation.key === 'caballero1_attack' && frame.index === 4) {
                        this.attack(1);
                    }

                    if (animation.key === 'paladin1_attack' && frame.index === 5) {
                        this.attack(1);
                    }

                    if (animation.key === 'arquero1_attack' && frame.index === 6) {
                        this.shoot(1);
                    }
                });

                this.lastSentPosition = { x: p[0], y: p[1] };
            } else {
                this.otherPlayer = player;

                this.physics.add.overlap(this.otherPlayer, arrow1, this.hit2, null, this);

                this.otherPlayer.on('animationupdate', (animation, frame) => {
                    if (animation.key === 'caballero2_attack' && frame.index === 4) {
                        this.attack(2);
                    }

                    if (animation.key === 'paladin2_attack' && frame.index === 5) {
                        this.attack(2);
                    }

                    if (animation.key === 'arquero2_attack' && frame.index === 6) {
                        this.shoot(2);
                    }
                });
            }
        });
    }
    
}

