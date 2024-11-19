var platforms;
var player1, player2;
var cursors;
var keyA, keyS, keyD, keyW;

class GameScene extends Phaser.Scene {
    constructor() {
        super({key: 'GameScene'});
    }

    preload() {
        this.load.image('fondo', 'assets/fondo.png');
        this.load.image('escenario', 'assets/escenario.png')
        this.load.image('plataforma', 'assets/plataforma.png');
        this.load.spritesheet('dude',
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }
    
    create() {
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

        player1 = this.physics.add.sprite(600, 300, 'dude');
        this.physics.add.collider(player1, platforms);

        player2 = this.physics.add.sprite(680, 300, 'dude');
        this.physics.add.collider(player2, platforms);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (cursors.left.isDown)
        {
            player1.setVelocityX(-160);

            player1.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player1.setVelocityX(160);

            player1.anims.play('right', true);
        }
        else
        {
            player1.setVelocityX(0);

            player1.anims.play('turn');
        }

        if (cursors.up.isDown && player1.body.touching.down)
        {
            player1.setVelocityY(-600);
        }

        if (keyA.isDown)
        {
            player2.setVelocityX(-160);
    
            player2.anims.play('left', true);
            }
        else if (keyD.isDown)
        {
            player2.setVelocityX(160);
    
            player2.anims.play('right', true);
        }
        else
        {
            player2.setVelocityX(0);
    
            player2.anims.play('turn');
        }
    
        if (keyW.isDown && player2.body.touching.down)
        {
            player2.setVelocityY(-600);
        }       
    }
}