import Slime from '@/class/enemies/Slimes';
import Player from "@/class/player/Player";
import KingWave from './attacks/KingWave';
import { Start } from '@/phaser/scenes/Start';

export default class KingSlime extends Phaser.Physics.Arcade.Sprite {
    public lifePoint: number;
    private isNpc: boolean;
    private onGround: boolean;
    private hasHit: boolean;
    private onJump: boolean;
    private player: Player;
    private ground: Phaser.Tilemaps.TilemapLayer;

    jumpTimer?: Phaser.Time.TimerEvent | null;
    constructor(scene:Phaser.Scene, x: number, y: number, ground: Phaser.Tilemaps.TilemapLayer, player: Player) {
        super(scene, x, y, 'kingSlime');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.lifePoint = 500;
        this.isNpc = true;
        this.onGround = false;
        this.hasHit = false;
        this.onJump = false; 
        this.player = player;
        this.ground = ground;
        this.setSize(49, 48);
        this.setOffset(4, 13); 
        this.setDepth(1);
        this.play('kingSlimeIdle', true);
        

        
        this.setImmovable(true);

        scene.physics.add.collider(this, this.ground);
        scene.physics.add.collider(this, this.player, () => {

            const body = this.body as Phaser.Physics.Arcade.Body;
            if (body.touching.left) {
                this.player.knockBack(300, "right", 4);
            }
            if (body.touching.right) {
                this.player.knockBack(300, "left", 4);
            }
            if(this.player.body)
            {
                if (this.player.body.blocked.up && !this.hasHit) {
                    this.hasHit = true;
                    const direction = Math.random() < 0.5 ? 'left' : 'right';
                    this.player.knockBack(500, direction, 4);
                    setTimeout(() => { this.hasHit = false }, 300);
                }

                if (this.player.body.blocked.down) {

                    this.player.forcedJump(-300)

                }
            }

        });
    }

    bigHitOnGrounded() {
        for (let i = 0; i < 2; i++) {
            const offset = i === 0 ? -40 : 40;
            const kingWave = new KingWave(this.scene as Start, this.x + offset, this.y + 30, i === 0, this.ground);
            (this.scene as Start).enemiesProjectile.add(kingWave, true);
        }

        this.spawnSlimes();
    }

    jump() {
        if (!this.body) {
            return; 
        }
        this.setVelocityY(-500);
        setTimeout(() => {
            this.onGround = false;
        }, 200);
    }

    scheduleJump() {

        if (this.onJump) return;
        if (!this.body) {

            if (this.jumpTimer) {
                this.scene.time.removeEvent(this.jumpTimer);
                this.jumpTimer = null;
            }
            return; 
        }

        const delay = Phaser.Math.Between(3000, 6000); 
        this.onJump = true; 

        const timer = this.scene.time.delayedCall(delay, () => {
            this.jump();
            this.scheduleJump();
            this.onJump = false; 
        });
    } 

    spawnSlimes() {
        const scene = this.scene as Phaser.Scene & { slimes: Phaser.Physics.Arcade.Group };
    
        if (scene.slimes.getLength() >= 20) return;
    
        for (let i = 0; i < 3; i++) {
            const isDirectionRight = Math.random() < 0.5;
            const direction = isDirectionRight ? 1 : -1;
            const speed = Phaser.Math.Between(50, 100);
    
            const slime = new Slime(scene, this.x, this.y, speed, isDirectionRight, this.player, "Didès-" + i, 20000, this.ground);
    
            scene.slimes.add(slime);
    
            slime.setVelocityX(speed * direction);
            slime.setFlipX(!isDirectionRight); 
        }
    }
    
    takeDamage(damage: number) {
        this.lifePoint -= damage;

        if (this.lifePoint <= 0) {
            this.scene.sound.play('victorySound', {
                volume: 0.8,
                rate: 1
            });
            this.destroy();
        }
    }

    update() {
        if (!this.body) {
            console.warn("Le corps physique du KingSlime n'est pas défini.");
            return; 
        }

        if (!this.onJump && this.body) {
            this.scheduleJump();
        }


        if (this.body.gravity.y === 0) {
            this.setGravityY(800);
        }


        if (this.body.blocked.down && !this.onGround) {
            this.bigHitOnGrounded();
            this.onGround = true;
        }
    }
}
