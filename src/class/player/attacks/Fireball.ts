import Ghost from "@/class/enemies/Ghost";
import KingSlime from "@/class/enemies/KingSlime";
import Slime from "@/class/enemies/Slimes";
import Baril from "@/class/objects/Baril";
import Box from "@/class/objects/Box";
import { Start } from "@/phaser/scenes/Start";

export default class Fireball extends Phaser.Physics.Arcade.Sprite {
    private direction: number;
    private charged: boolean;
    private fireballDamage: number;
    private alreadyHit = new Set<Phaser.GameObjects.GameObject>();

    constructor(scene: Start, x: number, y: number, speed: number, direction: number, charged: boolean) 
    {
        super(scene, x, y, 'fireball');

        this.scene = scene;
        this.direction = direction;
        this.charged = charged;
        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.body as Phaser.Physics.Arcade.Body;

        this.setScale(this.charged ? 3 : 1.5);
        this.setX(x + 20 * direction);
        body.setSize(16, 9);
        this.setDepth(3)

        if (this.charged) 
        {
            this.setTint(0xff0000);
        }

        this.setVelocityX(this.charged ? (speed * direction) / 1.7 : speed * direction);
        this.fireballDamage = this.charged ? 15 : 5;
        this.flipX = direction !== 1;

        this.setCollideWorldBounds(true);
        this.setImmovable(false);

        this.play('fireball');
        this.scene.sound.play('fireballSound', { volume: 0.3 });

        scene.time.delayedCall(3000, () => this.destroy());

        const groundLayer = (scene as any).groundLayer as Phaser.Tilemaps.TilemapLayer | undefined;
        if (groundLayer) 
        {
            scene.physics.add.collider(this, groundLayer, () => this.destroy());
        }

        // Overlap logic for each enemy type
        this.addOverlap(scene.slimes, (slime) => 
        {
            (slime as Slime).setTint(0xff4500);
            (slime as Slime).takeDamage(this.fireballDamage);
            this.scene.time.delayedCall(200, () => (slime as Slime).clearTint());
        });

        this.addOverlap(scene.ghosts, (ghost) => 
        {
            (ghost as Ghost).setTint(0xff4500);
            (ghost as Ghost).takeDamage(this.fireballDamage);
            this.scene.time.delayedCall(200, () => (ghost as Ghost).clearTint());
        });

        this.addOverlap(scene.barils, (baril) => 
        {
            (baril as Baril).setBrokenBaril();
        });

        this.addOverlap(scene.boxs, (box) => 
        {
            (box as Box).setBrokenBox();
        });

        if (scene.kingSlime) 
            {
            this.addOverlap(scene.kingSlime, (king) => 
            {
                (king as KingSlime).setTint(0xff4500);
                (king as KingSlime).takeDamage(this.fireballDamage);
                this.scene.time.delayedCall(200, () => (king as KingSlime).clearTint());
            });
        }

        body.onWorldBounds = true;
        this.scene.physics.world.on('worldbounds', () => this.destroy(), this);
    }

    private addOverlap(group: Phaser.GameObjects.Group | Phaser.GameObjects.GameObject, callback: (target: Phaser.GameObjects.GameObject) => void)
    {
        this.scene.physics.add.overlap(this, group, (ball, target) => 
        {
            const obj = target as Phaser.GameObjects.GameObject;

            if (this.alreadyHit.has(obj)) return;
            this.alreadyHit.add(obj);
            callback(obj);

            if (!this.charged) {
                this.scene.time.delayedCall(50, () => 
                {
                    this.destroy();
                });
            }
        });
    }

    preUpdate(time: number, delta: number) 
    {
        super.preUpdate(time, delta);

        if (this.body?.blocked.left || this.body?.blocked.right || this.body?.blocked.up || this.body?.blocked.down) 
        {
            this.scene.time.delayedCall(500, () => {
                this.destroy();
            });
        }
    }

    update() {
        if (this.body && (this.body.blocked.left || this.body.blocked.right || this.body.blocked.up || this.body.blocked.down)) 
        {
            this.destroy();
        }
    }
}
