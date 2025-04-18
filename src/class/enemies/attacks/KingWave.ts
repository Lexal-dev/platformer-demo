import { Start } from "@/phaser/scenes/Start";

export default class KingWave extends Phaser.Physics.Arcade.Sprite {
    private direction: number;
    private spriteDirection: boolean;
    private ground: Phaser.Tilemaps.TilemapLayer;
    private waveSound?: Phaser.Sound.BaseSound;

    constructor(scene:Start, x:number, y:number, direction:boolean = true, ground:Phaser.Tilemaps.TilemapLayer) {
        super(scene, x, y, 'kingWave');

        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.ground = ground;
        this.direction = direction ? -1 : 1;
        this.spriteDirection = direction;
        this.setScale(2)
        this.setCollideWorldBounds(true); 
        this.setImmovable(true);
        this.play('kingWave', true);
        this.waveSound = scene.sound.add('waveSound');
        this.waveSound.play({
          volume: 0.5,
          rate: 1
        });  
        
        scene.time.delayedCall(1500, () => {
            this.waveSound?.stop();
            this.waveSound?.destroy();
            this.destroy();
            
        });

        scene.physics.add.collider(this, ground, () => {
            const body = this.body as Phaser.Physics.Arcade.Body;
            if (body.blocked.down && body.velocity.x === 0) {
                this.setVelocityX(200 * this.direction)
            }
        });
                scene.physics.add.collider(this, scene.player, () => {
                    if(this.flipX)
                    {
                        scene.player.knockBack(300, "right", 2)
                    }
                    else
                    {
                        scene.player.knockBack(300, "left", 2)
                    }
                    
        });


    }


    update()
    {

        this.flipX = this.spriteDirection;
        const body = this.body as Phaser.Physics.Arcade.Body;
        if(body.velocity.y === 0 )
        {
            this.setGravityY(600)
        }

        if (body.velocity.x !== 200 && body.velocity.x !== -200) {
            this.setVelocityX(200 * this.direction);
        }

    }

}
