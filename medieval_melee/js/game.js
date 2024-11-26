// Declaración de variables globales
var platforms; // Plataformas estáticas del juego
var bow; // Ítem
var hammer; // Ítem 2
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


// Clase principal del juego
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' }); // Asigna una clave para identificar la escena
    }

    // Método para cargar los recursos del juego
    preload() {
        this.load.image('fondo', 'assets/fondo.png'); // Fondo del escenario
        this.load.image('escenario', 'assets/escenario.png'); // Escenario principal
        this.load.image('plataforma', 'assets/plataforma.png'); // Plataformas
        this.load.image('bow', 'assets/bow.png'); // Ítem coleccionable
        this.load.image('hammer', 'assets/hammer.png'); // Ítem coleccionable
        this.load.image('arrow', 'assets/arrow.png'); // Flecha

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
        
        // Configuración de controles del jugador 1
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        // Agrega el fondo del escenario
        this.add.image(640, 360, 'fondo');

        // Creación de grupos de plataformas y espadas
        platforms = this.physics.add.staticGroup();
        bow = this.physics.add.group();
        hammer = this.physics.add.group();
        arrow1 = this.physics.add.group({allowGravity: false});
        arrow2 = this.physics.add.group({allowGravity: false});

        // Colisión entre los objetos y las plataformas
        this.physics.add.collider(bow, platforms);
        this.physics.add.collider(hammer, platforms);
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

        // Configuración del jugador 1
        player1 = this.physics.add.sprite(440, 300, 'caballero1_idle');
        player1.setBodySize(32, 64); // Tamaño del cuerpo físico
        this.physics.add.collider(player1, platforms); // Colisión con plataformas
        
        // Configuración del jugador 2
        player2 = this.physics.add.sprite(840, 300, 'caballero2_idle');
        player2.setBodySize(32, 64); // Tamaño del cuerpo físico
        player2.flipX = true; // Invierte la dirección de la imagen
        this.physics.add.collider(player2, platforms); // Colisión con plataformas

        // Detección de superposición con ítems (espadas)
        this.physics.add.overlap(player1, bow, this.collectBow1, null, this);
        this.physics.add.overlap(player2, bow, this.collectBow2, null, this);
        this.physics.add.overlap(player1, hammer, this.collectHammer1, null, this);
        this.physics.add.overlap(player2, hammer, this.collectHammer2, null, this);
        this.physics.add.overlap(player1, arrow2, this.hit1, null, this);
        this.physics.add.overlap(player2, arrow1, this.hit2, null, this);

        // Creación de animaciones para ambos jugadores
        this.createAnimations();

        // Eventos de ataque en animaciones
        player1.on('animationupdate', (animation, frame) => {
            if (animation.key === 'caballero1_attack' && frame.index === 4) {
                this.attack(1); // Ejecuta ataque del jugador 1
            }
        });

        player1.on('animationupdate', (animation, frame) => {
            if (animation.key === 'paladin1_attack' && frame.index === 5) {
                this.attack(1); // Ejecuta ataque del jugador 1
            }
        });

        player2.on('animationupdate', (animation, frame) => {
            if (animation.key === 'caballero2_attack' && frame.index === 4) {
                this.attack(2); // Ejecuta ataque del jugador 2
            }
        });

        player2.on('animationupdate', (animation, frame) => {
            if (animation.key === 'paladin2_attack' && frame.index === 5) {
                this.attack(2); // Ejecuta ataque del jugador 1
            }
        });

        player1.on('animationupdate', (animation, frame) => {
            if (animation.key === 'arquero1_attack' && frame.index === 6) {
                this.shoot(1); // Ejecuta disparo del jugador 1
            }
        });

        player2.on('animationupdate', (animation, frame) => {
            if (animation.key === 'arquero2_attack' && frame.index === 6) {
                this.shoot(2); // Ejecuta disparo del jugador 2
            }
        });

        // Temporizador para generación de ítems
        this.time.addEvent({
            delay: spawnItemTimer,
            callback: this.spawnItem,
            callbackScope: this,
            loop: false, // Sólo una vez
        });

        this.time.addEvent({
            delay: spawnItemInterval,
            callback: this.spawnItem,
            callbackScope: this,
            loop: true, // Repetición continua
        });

        // Configuración de controles del jugador 2
        cursors = this.input.keyboard.createCursorKeys();

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
        });
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
        this.timers(delta);
        this.inputs();
        this.checkWin();
    }    

    // Maneja el input de los dos jugadores
    inputs() {
        // ** Control del Jugador 1 **
        if (keyA.isDown && !isKnockedBack1) {
            // Movimiento hacia la izquierda
            player1.setVelocityX(-moveSpeed); // Velocidad negativa para ir a la izquierda
           
            // Reproduce la animación de correr si no está atacando
            if (attackTimer1 <= attackCooldown - 0.5) {
                if (formCheck1 == 0){
                    player1.anims.play('caballero1_run', true);
                }
                else if (formCheck1 == 1){
                    player1.anims.play('arquero1_run', true); 
                }
                else if(formCheck1 == 2){
                    player1.anims.play('paladin1_run', true); 
                }
            }

            // Invierte el sprite para mirar a la izquierda
            player1.flipX = true;
    
        } else if (keyD.isDown && !isKnockedBack1) {
            // Movimiento hacia la derecha
            player1.setVelocityX(moveSpeed); // Velocidad positiva para ir a la derecha
    
            // Reproduce la animación de correr si no está atacando
            if (attackTimer1 <= attackCooldown - 0.5) {
                if (formCheck1 == 0){
                    player1.anims.play('caballero1_run', true);
                }
                else if (formCheck1 == 1){
                    player1.anims.play('arquero1_run', true); 
                }
                else if(formCheck1 == 2){
                    player1.anims.play('paladin1_run', true); 
                }
            }
    
            // Orienta el sprite hacia la derecha
            player1.flipX = false;
    
        } else if (!isKnockedBack1) {
            // Si no se mueve y no está retrocediendo, se detiene
            player1.setVelocityX(0);
    
            // Reproduce la animación de estar quieto
            if (attackTimer1 <= attackCooldown - 0.5) {
                if (formCheck1 == 0){
                    player1.anims.play('caballero1_idle', true);
                }
                else if (formCheck1 == 1){
                    player1.anims.play('arquero1_idle', true); 
                }
                else if(formCheck1 == 2){
                    player1.anims.play('paladin1_idle', true); 
                }
            }
        }
    
        // Salto del Jugador 1
        if (keyW.isDown && player1.body.touching.down && !isKnockedBack1) {
            player1.setVelocityY(-jumpHeight); // Impulso hacia arriba
        }

        // Ataque del Jugador 1
        if (keyS.isDown && !isKnockedBack1) {
            if (attackTimer1 <= 0) {
                // Reproduce la animación de ataque y reinicia el temporizador
                if(formCheck1 == 0) {
                    player1.anims.play('caballero1_attack');
                }
                else if(formCheck1 == 1) {
                    player1.anims.play('arquero1_attack');
                }
                else if(formCheck1 == 2){
                    player1.anims.play('paladin1_attack', true); 
                }
                attackTimer1 = attackCooldown;
            }
        }
    
        // ** Control del Jugador 2 **
        if (cursors.left.isDown && !isKnockedBack2) {
            // Movimiento hacia la izquierda
            player2.setVelocityX(-moveSpeed); // Velocidad negativa para ir a la izquierda
    
            // Reproduce la animación de correr si no está atacando
            if (attackTimer2 <= attackCooldown - 0.5) {
                if (formCheck2 == 0){
                    player2.anims.play('caballero2_run', true);
                }
                else if (formCheck2 == 1){
                    player2.anims.play('arquero2_run', true); 
                }
                else if (formCheck2 == 2){
                    player2.anims.play('paladin2_run', true); 
                }
            }
    
            // Invierte el sprite para mirar a la izquierda
            player2.flipX = true;
    
        } else if (cursors.right.isDown && !isKnockedBack2) {
            // Movimiento hacia la derecha
            player2.setVelocityX(moveSpeed); // Velocidad positiva para ir a la derecha
    
            // Reproduce la animación de correr si no está atacando
            if (attackTimer2 <= attackCooldown - 0.5) {
                if (formCheck2 == 0){
                    player2.anims.play('caballero2_run', true);
                }
                else if (formCheck2 == 1){
                    player2.anims.play('arquero2_run', true); 
                }
                else if (formCheck2 == 2){
                    player2.anims.play('paladin2_run', true); 
                }
            }
    
            // Orienta el sprite hacia la derecha
            player2.flipX = false;
    
        } else if (!isKnockedBack2) {
            // Si no se mueve y no está retrocediendo, se detiene
            player2.setVelocityX(0);
    
            // Reproduce la animación de estar quieto
            if (attackTimer2 <= attackCooldown - 0.5) {
                if (formCheck2 == 0){
                    player2.anims.play('caballero2_idle', true);
                }
                else if (formCheck2 == 1){
                    player2.anims.play('arquero2_idle', true); 
                }
                else if (formCheck2 == 2){
                    player2.anims.play('paladin2_idle', true); 
                }
            }
        }
    
        // Salto del Jugador 2
        if (cursors.up.isDown && player2.body.touching.down && !isKnockedBack2) {
            player2.setVelocityY(-jumpHeight); // Impulso hacia arriba
        }

        // Ataque del Jugador 2
        if (cursors.down.isDown && !isKnockedBack2) {
            if (attackTimer2 <= 0) {
                // Reproduce la animación de ataque y reinicia el temporizador
                if(formCheck2 == 0) {
                    player2.anims.play('caballero2_attack');
                }
                else if(formCheck2==1){
                    player2.anims.play('arquero2_attack');
                }
                else if (formCheck2 == 2){
                    player2.anims.play('paladin2_attack', true); 
                }
                attackTimer2 = attackCooldown;
            }
        }
    }

    // Aquí se manejan los temporizadores del juego
    timers(delta) {
        // Reducción del temporizador de ataque para el Jugador 1
        if (attackTimer1 > 0) {
            attackTimer1 -= delta / 1000; // Disminuye según el tiempo transcurrido
        }
    
        // Reducción del temporizador de ataque para el Jugador 2
        if (attackTimer2 > 0) {
            attackTimer2 -= delta / 1000; // Disminuye según el tiempo transcurrido
        }

        // Temporizador de transformación para el Jugador 1
        if (formTimer1 > 0) {
            formTimer1 -= delta / 1000; // Disminuye según el tiempo transcurrido
        }

        if(formTimer1 <= 0) {
            formCheck1 = 0;
        }
        
        // Temporizador de transformación para el Jugador 2
        if (formTimer2 > 0) {
            formTimer2 -= delta / 1000; // Disminuye según el tiempo transcurrido
        }

        if(formTimer2 <= 0) {
            formCheck2 = 0;
        }
    }

    // Si un jugador se sale de la pantalla, gana el otro
    checkWin() {
        if (!gameEnded) {
            // Comprueba si el jugador 1 se ha salido de la pantalla
            if(player1.x > 1280 || player1.x < 0 || player1.y > 720 || player1.y < 0) {
                gameEnded = true;
                this.registry.set('winner', 2);
                console.log("Player 2 wins!");
                this.cameras.main.fadeOut(500, 0, 0, 0);

                // Espera a que el fade-out termine antes de iniciar la nueva escena
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('EndScene'); // Cambia a la escena del juego
                });
            }

            // Comprueba si el jugador 2 se ha salido de la pantalla
            if(player2.x > 1280 || player2.x < 0 || player2.y > 720 || player2.y < 0) {
                gameEnded = true;
                this.registry.set('winner', 1);
                console.log("Player 1 wins!");
                this.cameras.main.fadeOut(500, 0, 0, 0);

                // Espera a que el fade-out termine antes de iniciar la nueva escena
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('EndScene'); // Cambia a la escena del juego
                });
            }
        }
    }

    // Ejecuta el disparo del arquero
    shoot(player) {
        var velocity = 1000;

        if (player == 1) {
            console.log("Player 1 shot an arrow")
            var projectile = arrow1.create(player1.x, player1.y - 15, 'arrow');
            projectile.setGravityY(0);
    
            // Programa la destrucción de la flecha después de 5 segundos si no colisiona
            setTimeout(() => {
                if (projectile) {
                    projectile.destroy();
                }
            }, 3000);

            if(!player1.flipX) {
                projectile.setVelocityX(velocity);
            } else {
                projectile.setVelocityX(-velocity);
                projectile.flipX = true;
            }
        }
        else {
            console.log("Player 2 shot an arrow")
            var projectile = arrow2.create(player2.x, player2.y - 15, 'arrow');
            projectile.setGravityY(0);
    
            // Programa la destrucción de la flecha después de 5 segundos si no colisiona
            setTimeout(() => {
                if (projectile) {
                    projectile.destroy();
                }
            }, 3000);

            if(!player2.flipX) {
                projectile.setVelocityX(velocity);
            } else {
                projectile.setVelocityX(-velocity);
                projectile.flipX = true;
            }
        }
    }

    // Colisión entre el jugador 1 y una flecha
    hit1(player1, arrow2) {
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
        var distance = Phaser.Math.Distance.Between(player1.x, player1.y, player2.x, player2.y);
    
        // Lógica de ataque para el Jugador 1
        if (player == 1) {
            // Ataque hacia la derecha
            if (!player1.flipX && distance < attackRange && player1.x - 8 < player2.x) {
                this.knockback(2, 1);
            }
            // Ataque hacia la izquierda
            else if (player1.flipX && distance < attackRange && player1.x + 8 > player2.x) {
                this.knockback(2, -1);
            }
        }
    
        // Lógica de ataque para el Jugador 2
        else if (player == 2) {
            // Ataque hacia la derecha
            if (!player2.flipX && distance < attackRange && player2.x - 8 < player1.x) {
                this.knockback(1, 1);
            }
            // Ataque hacia la izquierda
            else if (player2.flipX && distance < attackRange && player2.x + 8 > player1.x) {
                this.knockback(1, -1);
            }
        }
    }

    knockback(player, direction) {
        var knockbackForce = 750;          // Fuerza de retroceso horizontal
        var knockbackDuration = 100;      // Duración del estado de retroceso (en ms)
        var verticalKnockback = 300;      // Fuerza de retroceso vertical

        if (player == 1) {
            player1.setVelocityX(knockbackForce * direction * percent1); // Aplica fuerza hacia la derecha
            player1.setVelocityY(-verticalKnockback);        // Aplica fuerza hacia arriba
            isKnockedBack1 = true;                          // Marca al jugador 2 como en retroceso

            if(formCheck2==2){
                dmgMult2=1.5;
            }
            else{
                dmgMult2=1;
            }
            percent1 += (Math.random() * (0.2 - 0.1) + 0.1)*dmgMult2; // Incrementa el daño del jugador 2
            console.log(dmgMult2);
            this.screenPercentage1.setText(Math.round((percent1- 1) * 100) + '%'); // Actualiza el porcentaje del jugador en pantalla
            this.time.addEvent({
                delay: knockbackDuration,
                callback: () => { isKnockedBack1 = false; } // Finaliza el estado de retroceso
            });
        } 
        else {
            player2.setVelocityX(knockbackForce * direction * percent2); // Aplica fuerza hacia la derecha
            player2.setVelocityY(-verticalKnockback);        // Aplica fuerza hacia arriba
            isKnockedBack2 = true;      
            if(formCheck1==2){
                dmgMult1=1.5;
            }
            else{
                dmgMult1=1;
            }                    // Marca al jugador 2 como en retroceso
            percent2 += (Math.random() * (0.2 - 0.1) + 0.1)*dmgMult1; // Incrementa el daño del jugador 2
            console.log(dmgMult1);
            this.screenPercentage2.setText(Math.round((percent2 - 1) * 100) + '%'); // Actualiza el porcentaje del jugador en pantalla
            this.time.addEvent({
                delay: knockbackDuration,
                callback: () => { isKnockedBack2 = false; } // Finaliza el estado de retroceso
            });
        }
    }

    // Genera un objeto (item) en una posición aleatoria
    spawnItem() {
        // Genera coordenadas aleatorias para la posición del item dentro del rango especificado
        var x = Math.floor(Math.random() * (930 - 350 + 1)) + 350; // Rango horizontal: 350 a 930
        var y = Math.floor(Math.random() * (400 - 150 + 1)); // Rango vertical: 150 a 400
        var item
        var randomizer = Math.random(); //se randomiza el spawn del objeto
        if (randomizer>=0.5){
            item = bow.create(x, y, 'bow');

        }
        if (randomizer<0.5){
            item = hammer.create(x, y, 'hammer');

        }
        // Programa la destrucción del item después de 10 segundos si no se recoge
        setTimeout(() => {
            if (item) {
                item.destroy();
            }
        }, 10000);
    }
    
    // Recoge el item cuando es tocado por el jugador 1
    collectBow1(player, bow) {
        
        bow.destroy(); // Destruye el item al ser recogido por el jugador 1
        formCheck1 = 1; // Transforma al jugador 1
        
        
        formTimer1 = formCooldown;
    }
    
    // Recoge el item cuando es tocado por el jugador 2
    collectBow2(player, bow) {
        bow.destroy(); // Destruye el item al ser recogido por el jugador 1
        formCheck2 = 1; // Transforma al jugador 1
        
        
        formTimer2 = formCooldown;
    }

    collectHammer1(player, hammer) {
        
        hammer.destroy(); // Destruye el item al ser recogido por el jugador 1
        formCheck1 = 2; // Transforma al jugador 1
        
        
        formTimer1 = formCooldown;
    }
    
    // Recoge el item cuando es tocado por el jugador 2
    collectHammer2(player, hammer) {
        hammer.destroy(); // Destruye el item al ser recogido por el jugador 1
        formCheck2 = 2; // Transforma al jugador 1
        
        
        formTimer2 = formCooldown;
    }

    
}

