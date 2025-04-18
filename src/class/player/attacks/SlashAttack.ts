import Ghost from '@/class/enemies/Ghost';
import KingSlime from '@/class/enemies/KingSlime';
import Slime from '@/class/enemies/Slimes';
import Baril from '@/class/objects/Baril';
import Box from '@/class/objects/Box';
import {Start} from '@/phaser/scenes/Start';
import Player from '../Player';

export default class SlashAttack extends Phaser.Physics.Arcade.Sprite {
    private direction: number;
    private touchedEnemies: Set<Phaser.GameObjects.Sprite>;
    private touchedObjects: Set<Phaser.GameObjects.Sprite>; 
    private player: Phaser.Physics.Arcade.Sprite;
    private damageOnHit: number;


    constructor(scene:Start, x:number, y:number, direction:number) {
        super(scene, x, y, 'slashAttack');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.player = scene.player;
        
        this.direction = direction || 1;
        this.x = this.player.x + (30 * this.direction);
        this.flipX = this.direction === 1 ? false : true;
        this.touchedEnemies = new Set();
        this.touchedObjects = new Set();
        this.damageOnHit = 3;
        
        this.setScale(1.5);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 0.5);

        if(this.body)
        {
            this.body.setSize(31, 23); 
            this.body.setOffset(0, 0);            
        }

        this.anims.play('slashAttack', true);
        this.scene.sound.play('slashSound', {
            volume: 0.3,
            rate: 1
        });
        this.scene.events.on('update', this.update, this);

        this.on('animationcomplete', this.onAnimationComplete, this);

        this.scene.physics.add.overlap(this, scene.barils, (slashAttack, baril) => {
            const sprite = baril as Baril;
            if (!this.touchedObjects.has(sprite) && sprite.body) 
                {
                    sprite.setBrokenBaril();
                    this.touchedObjects.add(sprite); 
                }
        });

        this.scene.physics.add.overlap(this, scene.boxs, (slashAttack, box) => {
            const sprite = box as Box;
            if (!this.touchedObjects.has(sprite) && sprite.body) 
                {
                    sprite.setBrokenBox();
                    this.touchedObjects.add(sprite); 
                }
        });
        this.scene.physics.add.overlap(this, scene.slimes, (slashAttack, slime) => {
            const sprite = slime as Slime;
            const player = this.player as Player;
            if (!this.touchedEnemies.has(sprite) && sprite.body) {
                player.gainMana = 2;
                console.log(player.gainMana + 2)
                sprite.setTint(0xff0000);  
                sprite.takeDamage(this.damageOnHit);  
                this.touchedEnemies.add(sprite);
                this.scene.time.delayedCall(200, () => {
                    sprite.clearTint();  
                }, [], this);
            }
        });
        this.scene.physics.add.overlap(this, scene.ghosts, (slashAttack, ghost) => {
            const sprite = ghost as Ghost; 
            const player = this.player as Player;
            if (!this.touchedEnemies.has(sprite) && sprite.body) {
                player.gainMana = 2;
                sprite.setTint(0xff0000);  
                sprite.takeDamage(this.damageOnHit);  
                this.touchedEnemies.add(sprite);
                this.scene.time.delayedCall(200, () => {
                    sprite.clearTint();  
                }, [], this);
            }
        });
        if(scene.kingSlime)
            {
                this.scene.physics.add.overlap(this, scene.kingSlime, (ball, king) => {
                    const sprite = king as KingSlime;
                    const player = this.player as Player;
                    
                    if (!this.touchedEnemies.has(sprite) && sprite.body) {
                        player.gainMana = 2;
                        sprite.setTint(0xff0000);
                        sprite.takeDamage(this.damageOnHit);
                        this.touchedEnemies.add(sprite);
                        this.scene.time.delayedCall(200, () => {
                            sprite.clearTint();  
                        }, [], this);
                    }
                });            
            }

    }


    update() {
        this.x = this.player.x + (35 * this.direction);
        this.y = this.player.y
    }

    onAnimationComplete(animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame): void {
        if (animation.key === 'slashAttack') {
            this.scene.events.off('update', this.update, this);
            this.touchedEnemies.clear();
            this.touchedObjects.clear();
            this.destroy();
        }
    }
}
