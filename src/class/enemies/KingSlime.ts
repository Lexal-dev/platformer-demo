import Slime from '@/class/enemies/Slimes';
import Player from "@/class/player/Player";
import KingWave from './attacks/KingWave';
import { Start } from '@/phaser/scenes/Start';

export default class KingSlime extends Phaser.Physics.Arcade.Sprite 
{
    public lifePoint: number;
    public maxLifePoint : number;
    private onGround: boolean;
    private onJump: boolean;
    private player: Player;
    private ground: Phaser.Tilemaps.TilemapLayer;

    jumpTimer?: Phaser.Time.TimerEvent | null;
    constructor(scene:Phaser.Scene, x: number, y: number, ground: Phaser.Tilemaps.TilemapLayer, player: Player) 
    {
        super(scene, x, y, 'kingSlime');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.lifePoint = 500;
        this.maxLifePoint = 500;
        this.onGround = false;
        this.onJump = false; 
        this.player = player;
        this.ground = ground;
        this.setSize(49, 48);
        this.setOffset(4, 13); 
        this.setDepth(1);
        this.play('kingSlimeIdle', true);
        

        
        this.setImmovable(true);

        scene.physics.add.collider(this, this.ground);

        const playerKingSlime = scene.physics.add.collider(this, this.player, () => 
        {

            if(player.isInviscible === true) return;

            if (this.player.playerBody.touching.left && this.body?.touching.right) 
            {
                this.player.knockBack(300, "left", 10, 300);
                player.temporarilyDisableCollision(playerKingSlime);
            }
            if (this.player.playerBody.touching.right && this.body?.touching.left) 
            {
                this.player.knockBack(300, "right", 10, 300);
                player.temporarilyDisableCollision(playerKingSlime);
            }

            if (this.player.playerBody.touching.up && this.body?.touching.down) 
            {
                const direction = Math.random() < 0.5 ? 'left' : 'right';
                this.player.knockBack(300, direction, 10, 300);
                player.temporarilyDisableCollision(playerKingSlime);    
            }

            if (this.player.playerBody.touching.down && this.body?.touching.up) 
            {
                    this.player.forcedJump(-300);
            }        
        });
    }

    bigHitOnGrounded() {
        for (let i = 0; i < 2; i++) 
        {
            const offset = i === 0 ? -40 : 40;
            const kingWave = new KingWave(this.scene as Start, this.x + offset, this.y + 30, i === 0, this.ground);
            (this.scene as Start).enemiesProjectile.add(kingWave, true);
        }

        this.spawnSlimes();
    }

    jump() 
    {
        if (!this.body) 
        {
            return; 
        }
        this.setVelocityY(-500);
        setTimeout(() => 
        {
            this.onGround = false;
        }, 200);
    }

    scheduleJump() 
    {

        if (this.onJump) return;
        if (!this.body) 
        {

            if (this.jumpTimer) 
            {
                this.scene.time.removeEvent(this.jumpTimer);
                this.jumpTimer = null;
            }
            return; 
        }

        let delay: number;
        if(this.lifePoint <= this.lifePoint /2)
        {
            delay = Phaser.Math.Between(2000, 3000); 
        }
        else
        {
            delay = Phaser.Math.Between(3000, 6000);
            
        }
        
        this.onJump = true; 

        const timer = this.scene.time.delayedCall(delay, () => 
        {
            this.jump();
            this.scheduleJump();
            this.onJump = false; 
        });
    } 

    spawnSlimes() 
    {
        const scene = this.scene as Phaser.Scene & { slimes: Phaser.Physics.Arcade.Group };
    
        if (scene.slimes.getLength() >= 20) return;
    
        for (let i = 0; i < 3; i++) 
        {
            const isDirectionRight = Math.random() < 0.5;
            const direction = isDirectionRight ? 'right' : 'left';
            const directionMultiplier = isDirectionRight ? 1 : -1;
            const speed = Phaser.Math.Between(50, 100);
    
            const slime = new Slime(scene, this.x, this.y, speed, 0, this.ground, this.player, direction, 5);
    
            scene.slimes.add(slime);
    
            slime.setVelocityX(speed * directionMultiplier);
            slime.setFlipX(!isDirectionRight); 
        }
    }
    
    takeDamage(damage: number) 
    {
        this.lifePoint -= damage;
        if (this.lifePoint <= 0) 
        {
            this.scene.sound.play('victorySound', 
            {
                volume: 0.8,
                rate: 1
            });
            this.destroy();
        }
    }

    update() {
        if (!this.body) 
        {
            console.warn("Le corps physique du KingSlime n'est pas défini.");
            return; 
        }

        if (!this.onJump && this.body) 
        {
            this.scheduleJump();
        }


        if (this.body.gravity.y === 0) 
        {
            this.setGravityY(800);
        }


        if (this.body.blocked.down && !this.onGround) 
        {
            this.bigHitOnGrounded();
            this.onGround = true;
        }
    }
}
