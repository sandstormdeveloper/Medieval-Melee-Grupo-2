var platforms;
var player1, player2;
var cursors;
var keyA, keyS, keyD, keyW;
var flipped1, flipped2;
var attackTimer1, attackTimer2, attackCooldown;
var jumpHeight, moveSpeed;

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
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }
    
    create() 
    {
        flipped1 = false;
        flipped2 = true;

        attackTimer1 = attackTimer2 = 0;
        attackCooldown = 1;

        jumpHeight = 550;
        moveSpeed = 160;

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        this.add.image(640, 360, 'fondo');

        platforms = this.physics.add.staticGroup();

        platforms.create(640, 500, 'escenario');
        platforms.create(640, 250, 'plataforma');
        platforms.create(440, 350, 'plataforma');
        platforms.create(840, 350, 'plataforma');

        player1 = this.physics.add.sprite(440, 300, 'dude');
        this.physics.add.collider(player1, platforms);

        player2 = this.physics.add.sprite(840, 300, 'dude');
        this.physics.add.collider(player2, platforms);

        this.anims.create
        ({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create
        ({
            key: 'idle-left',
            frames: [ { key: 'dude', frame: 0 } ],
            frameRate: 0
        });

        this.anims.create
        ({
            key: 'idle-right',
            frames: [ { key: 'dude', frame: 5 } ],
            frameRate: 0
        });

        this.anims.create
        ({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        cursors = this.input.keyboard.createCursorKeys();
    }

    update(time, delta) 
    {
        if (cursors.left.isDown)
        {
            player1.setVelocityX(-moveSpeed);

            player1.anims.play('left', true);
            flipped1 = true;
        }
        else if (cursors.right.isDown)
        {
            player1.setVelocityX(moveSpeed);

            player1.anims.play('right', true);
            flipped1 = false;
        }
        else
        {
            player1.setVelocityX(0);

            if (!flipped1) 
            {
                player1.anims.play('idle-right');
            }
            else 
            {
                player1.anims.play('idle-left');
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
                this.attack(player1, player2);
                attackTimer1 = attackCooldown;
            }
        }

        if (keyA.isDown)
        {
            player2.setVelocityX(-moveSpeed);
    
            player2.anims.play('left', true);
            flipped2 = true;
        }
        else if (keyD.isDown)
        {
            player2.setVelocityX(moveSpeed);
    
            player2.anims.play('right', true);
            flipped2 = false;
        }
        else
        {
            player2.setVelocityX(0);
    
            if (!flipped2) 
            {
                player2.anims.play('idle-right');
            }
            else 
            {
                player2.anims.play('idle-left');
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
                this.attack(player2, player1);
                attackTimer2 = attackCooldown;
            }
        }
    }

    attack(playerA, playerB)
    {
        console.log("attack");
    }
}