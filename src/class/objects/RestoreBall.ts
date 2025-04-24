import * as Phaser from 'phaser';
import Player from '@/class/player/Player';

type RestoreType = 'life' | 'mana';

export default class RestoreBall extends Phaser.Physics.Arcade.Sprite 
{
    private restorationType: RestoreType;
    private gravity: number;
    private player: Player;
    private hasLanded: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, restorationType: RestoreType, player: Player
    ) 
    {
        super(scene, x, y, texture);

        this.player = player;
        this.restorationType = restorationType;
        this.gravity = 100;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(false);
        const body = this.body as Phaser.Physics.Arcade.Body;
        if (body) 
        {
            body.setAllowGravity(true);
            body.setBounce(0.4);
        }

        this.setDepth(-3);
        this.setCollideWorldBounds(true);
        this.setScale(0.5);

        // Destroy after 10 seconds
        scene.time.delayedCall(10000, () => 
        {
            if (this.scene && this.active) 
            {
                this.destroy();
            }
        });

        this.scene.events.on('update', this.update, this);

        // Trigger restore when overlapping player
        this.scene.physics.add.overlap(this, this.player, () => 
        {
            this.restore();
        });
    }

    update() {
        const body = this.body as Phaser.Physics.Arcade.Body;
        if (!body) return;

        // Ensure gravity and bounce
        if (body.gravity.y === 0 || body.bounce.y === 0) 
        {
            body.setGravityY(this.gravity);
            body.setBounce(0.3);
        }

        // Stop X movement after landing once
        if (!this.hasLanded && body.blocked.down) 
        {
            this.hasLanded = true;
            body.setVelocityX(0);
            body.setDragX(1000); // Optional: helps stop lingering motion
        }

        if (this.hasLanded) 
        {
            body.setVelocityX(0); // Lock X velocity
        }

        // Optional: rotate slightly for visual flair
        this.rotation += 0.05;
    }

    restore() 
    {
        if (!this.body) return;

        if (this.restorationType === 'mana' && this.player.manaPoint < this.player.manaPointMax) 
        {
            this.player.gainMana = 2;
            this.scene.sound.play('manaSound', 
            {
                volume: 0.3,
                rate: 1
            });
            this.destroy();
        }

        if (this.restorationType === 'life' && this.player.lifePoint < this.player.lifePointMax) 
        {
            this.player.healing = 3;
            this.scene.sound.play('healSound', 
            {
                volume: 0.3,
                rate: 1
            });
            this.destroy();
        }
    }

    public static spawnRestoreBalls(scene: Phaser.Scene, object: { x: number; y: number }, group: Phaser.Physics.Arcade.Group, texture: string = 'lifeBall', type: RestoreType = 'life', number: number = 3, player: Player): void 
    {
        for (let i = 0; i < number; i++) 
        {
            const offsetX = Phaser.Math.Between(-10, 10);
            const restoreBall = new RestoreBall(scene, object.x + offsetX, object.y, texture, type, player);
            group.add(restoreBall);

            const velocityX = Phaser.Math.Between(-100, 100);
            const velocityY = Phaser.Math.Between(-50, -75);

            const body = restoreBall.body;
            if (body instanceof Phaser.Physics.Arcade.Body) 
            {
                body.setVelocity(velocityX, velocityY);
            }
        }
    }
}
