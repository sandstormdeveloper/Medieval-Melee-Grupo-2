var platforms;
var espada;
var player1, player2;
var cursors;
var keyA, keyS, keyD, keyW;
var attackTimer1, attackTimer2, attackCooldown;
var jumpHeight, moveSpeed;
var spawnItemTimer;
var spawnItemInterval;
var isFirstSpawn;
class GameScene extends Phaser.Scene 
{
    constructor() 
    {
        super({key: 'GameScene'});
    }

    preload() 
    {
        this.load.image('fondo', 'assets/fondo.png');
        this.load.image('escenario', 'assets/escenario.png')
        this.load.image('plataforma', 'assets/plataforma.png');
        this.load.image('espada', 'assets/swordItem.png');


        this.load.spritesheet('caballero1_run', 'assets/p1_caballero/run.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('caballero1_idle', 'assets/p1_caballero/idle.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('caballero1_attack', 'assets/p1_caballero/attack.png', { frameWidth: 192, frameHeight: 128 });

        this.load.spritesheet('caballero2_run', 'assets/p2_caballero/run.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('caballero2_idle', 'assets/p2_caballero/idle.png', { frameWidth: 192, frameHeight: 128 });
        this.load.spritesheet('caballero2_attack', 'assets/p2_caballero/attack.png', { frameWidth: 192, frameHeight: 128 });
    }
    
    create() 
    {
        attackTimer1 = attackTimer2 = 0;
        attackCooldown = 1;

        jumpHeight = 600;
        moveSpeed = 250;
        spawnItemTimer=5000;
        spawnItemInterval = 20000;
        isFirstSpawn = true;

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        this.add.image(640, 360, 'fondo');

        platforms = this.physics.add.staticGroup();

        espada = this.physics.add.group();
        this.physics.add.collider(espada, platforms);
        
        platforms.create(640, 500, 'escenario');
        platforms.create(640, 250, 'plataforma');
        platforms.create(440, 350, 'plataforma');
        platforms.create(840, 350, 'plataforma');

        player1 = this.physics.add.sprite(440, 300, 'caballero1_idle');
        player1.setBodySize(32, 64);
        this.physics.add.collider(player1, platforms);

        player2 = this.physics.add.sprite(840, 300, 'caballero2_idle');
        player2.setBodySize(32, 64);
        player2.flipX = true;
        this.physics.add.collider(player2, platforms);

    //COLLIDER PARA COGER ITEMS
        this.physics.add.overlap(player1, espada, this.collectItem1, null, this);
        this.physics.add.overlap(player2, espada, this.collectItem2, null, this);

        this.anims.create
        ({
            key: 'caballero1_run',
            frames: this.anims.generateFrameNumbers('caballero1_run', { start: 0, end: 6 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create
        ({
            key: 'caballero1_attack',
            frames: this.anims.generateFrameNumbers('caballero1_attack', { start: 0, end: 5 }),
            frameRate: 12,
        });

        this.anims.create
        ({
            key: 'caballero1_idle',
            frames: this.anims.generateFrameNumbers('caballero1_idle', { start: 0, end: 10 }),
            frameRate: 6,
            repeat: -1
        });

        this.anims.create
        ({
            key: 'caballero2_run',
            frames: this.anims.generateFrameNumbers('caballero2_run', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create
        ({
            key: 'caballero2_attack',
            frames: this.anims.generateFrameNumbers('caballero2_attack', { start: 0, end: 5 }),
            frameRate: 12,
        });

        this.anims.create
        ({
            key: 'caballero2_idle',
            frames: this.anims.generateFrameNumbers('caballero2_idle', { start: 0, end: 14 }),
            frameRate: 12,
            repeat: -1
        });

        player1.on('animationcomplete', (animation) => 
        {
            if (animation.key === 'caballero1_attack') 
            {
                this.attack(1)
            }
        });
    
        player2.on('animationcomplete', (animation) => 
        {
            if (animation.key === 'caballero2_attack') 
            {
                this.attack(2)
            }
        });

        //Si es el primer spawn, tarda solo 5s. Si no es el primer spawn, tarda 20s. 
            this.time.addEvent({    
                delay: spawnItemTimer, 
                callback: this.spawnItems, 
                callbackScope: this,
                loop: false,
                
            });
            

            this.time.addEvent({
                delay: spawnItemInterval, 
                callback: this.spawnItems,
                callbackScope: this,
                loop: true, 
            });
            
        cursors = this.input.keyboard.createCursorKeys();
    }

    update(time, delta) 
    {
        if (cursors.left.isDown)
        {
            player1.setVelocityX(-moveSpeed);

            if(attackTimer1 <= attackCooldown - 0.5) 
            {
                player1.anims.play('caballero1_run', true);
            } 
            player1.flipX = true;
        }
        else if (cursors.right.isDown)
        {
            player1.setVelocityX(moveSpeed);

            if(attackTimer1 <= attackCooldown - 0.5) 
            {
                player1.anims.play('caballero1_run', true);
            } 
            player1.flipX = false;
        }
        else
        {
            player1.setVelocityX(0);

            if(attackTimer1 <= attackCooldown - 0.5) 
            {
                player1.anims.play('caballero1_idle', true);
            }   
        }

        if (cursors.up.isDown && player1.body.touching.down)
        {
            player1.setVelocityY(-jumpHeight);
        }

        if (attackTimer1 > 0)
        {
            attackTimer1 -= delta / 1000;
        }

        if (cursors.down.isDown)
        {
            if (attackTimer1 <= 0)
            {
                player1.anims.play('caballero1_attack');
                attackTimer1 = attackCooldown;
            }
        }

        if (keyA.isDown)
        {
            player2.setVelocityX(-moveSpeed);
    
            player2.anims.play('caballero2_run', true);
            player2.flipX = true;
        }
        else if (keyD.isDown)
        {
            player2.setVelocityX(moveSpeed);
    
            player2.anims.play('caballero2_run', true);
            player2.flipX = false;
        }
        else
        {
            player2.setVelocityX(0);

            if(attackTimer2 <= attackCooldown - 0.5) 
            {
                player2.anims.play('caballero2_idle', true);
            }
        }
    
        if (keyW.isDown && player2.body.touching.down)
        {
            player2.setVelocityY(-jumpHeight);
        }       

        if (attackTimer2 > 0)
        {
            attackTimer2 -= delta / 1000;
        }

        if (keyS.isDown)
        {
            if (attackTimer2 <= 0)
            {
                player2.anims.play('caballero2_attack');
                attackTimer2 = attackCooldown;
            }
        }
    }

    attack(playerAttacking)
    {
        if (playerAttacking == 1)
        {
            console.log("Player 1 attacked");
        }
        else
        {
            console.log("Player 2 attacked");
        }
    }

    spawnItems()
    {
        for (let i = 0; i < 2; i++) // Crean dos objetos
        {
            const x = Phaser.Math.Between(400, 800); 
            const y = Phaser.Math.Between(50, 200); 

            espada.create(x, y, 'espada'); 
            
        }
        
        console.log("Items spawned");
        
        
    }
    collectItem1(player, espada)
    {
        espada.destroy(); 
        
        console.log("Item picked");  
    }
    collectItem2(player, espada)
    {
        espada.destroy(); 
        
        console.log("Item picked");
    }
}