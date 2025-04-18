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

    constructor(scene:Start, x:number, y:number, speed:number, direction:number, charged:boolean) {
        super(scene, x, y, 'fireball');

        this.scene = scene;
        this.direction = direction;
        this.charged = charged;
        
        // Ajouter le sprite à la scène et activer la physique
        scene.add.existing(this);
        scene.physics.add.existing(this);
        const body = this.body as Phaser.Physics.Arcade.Body;
        // Configurer la taille et position
        this.setScale(this.charged ? 3 : 1.5);
        this.setX(x + 20 * direction);
        body.setSize(16, 9);
        
        if (this.charged) {
        // plus étroit en hauteur
            this.setTint(0xff0000);
        }

        this.charged ? this.setVelocityX((speed * direction) / 1.7) : this.setVelocityX(speed * direction);
        this.fireballDamage = this.charged ? 7 : 5;
        // Orientation du sprite
        this.flipX = direction === 1 ? false : true;

        // Permet à la fireball de sortir des limites et de se détruire
        this.setCollideWorldBounds(true);
        this.setImmovable(false);

        // Joue l'animation
        this.play('fireball');
        this.scene.sound.play('fireballSound', {
            volume: 0.3,
            rate: 1
        });
        
        scene.time.delayedCall(3000, () => {
            this.destroy();
        });

        const groundLayer = (scene as any).groundLayer as Phaser.Tilemaps.TilemapLayer | undefined;
        if (groundLayer) {
          scene.physics.add.collider(this, groundLayer, () => this.destroy());
        }
        
        // Ajouter les collisions avec les ennemis
        this.scene.physics.add.overlap(this, scene.slimes, (ball, slime) => {
                const spriteSlime = slime as Slime;
                spriteSlime.setTint(0xff4500)
                spriteSlime.takeDamage(this.fireballDamage);
                this.scene.time.delayedCall(200, () => {
                    spriteSlime.clearTint();  
                }, [], this);
                ball.destroy();
    
        });

        this.scene.physics.add.overlap(this, scene.ghosts,(ball, ghost) => {
            const spriteGhost = ghost as Ghost;
            spriteGhost.setTint(0xff4500)
            spriteGhost.takeDamage(this.fireballDamage);
            this.scene.time.delayedCall(200, () => {
                spriteGhost.clearTint();  
            }, [], this);
            ball.destroy();
        });

        this.scene.physics.add.overlap(this, scene.barils, (ball, baril) => {
            const sprite = baril as Baril;
            sprite.setBrokenBaril();
        });

        this.scene.physics.add.overlap(this, scene.boxs, (ball, box) => {
            const sprite = box as Box;
            sprite.setBrokenBox();
   
        });

        if(scene.kingSlime)
        {
            this.scene.physics.add.overlap(this, scene.kingSlime, (ball, king) => {
                const sprite = king as KingSlime;
                sprite.setTint(0xff4500)
                sprite.takeDamage(this.fireballDamage);
                this.scene.time.delayedCall(200, () => {
                    sprite.clearTint();  
                }, [], this);
                ball.destroy();
            });            
        }

        

        body.onWorldBounds = true;
        this.scene.physics.world.on('worldbounds',() => {this.destroy()}, this);
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);
    
        if (
            this.body?.blocked.left ||
            this.body?.blocked.right ||
            this.body?.blocked.up ||
            this.body?.blocked.down
        ) {
            this.scene.time.delayedCall(500, () => {
                this.destroy();
            });
        }
    }


    // Détecter si la fireball touche un mur ou un obstacle et la détruire
    update() {
        if (this.body && (
            this.body.blocked.left || 
            this.body.blocked.right || 
            this.body.blocked.up || 
            this.body.blocked.down)
        ) {
            this.destroy();
        }
    }
}
