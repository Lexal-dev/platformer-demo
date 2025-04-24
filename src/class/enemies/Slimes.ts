import Player from '../player/Player';
import Enemy from './Enemy';

export default class Slime extends Enemy 
{
    private durationInSeconds: number;
    private directionTimer?: Phaser.Time.TimerEvent;
    private followPlayer: boolean = false;
    private hasBounceOn: boolean = false;
    private isFlying: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, speedX: number = 0, speedY: number = 0, ground: Phaser.Tilemaps.TilemapLayer, player: Player, direction: "right" | "left", durationInSeconds: number) 
    {
        super(scene, x, y, "slimes", "slimeRun", speedX, speedY, ground, player);
        this.lifepoint = 5;
        this.direction = direction;
        this.durationInSeconds = durationInSeconds * 1000;
        this.startDirectionTimer();
        this.setBodySize(15 , 12)
        this.setDepth(2);
    }

    update() 
    {
        if (!this.enemyBody) return;

        if (this.isFlying && this.enemyBody.blocked.down) 
        {
            this.isFlying = false;
            this.hasBounceOn = false;
        }

        if (this.hasBounceOn) return;

        super.update();

        this.checkForGround();
        this.followingPlayer();

        if (!this.followPlayer) 
        {
            this.handleGroundCollision();
            this.movingSystem(this.direction);
        }

        this.flipX = this.enemyBody.velocity.x < 0;
    }

    private followingPlayer(): void 
    {
        const distanceX = Math.abs(this.player.playerBody.x - this.enemyBody.x);
        const distanceY = Math.abs(this.player.playerBody.y - this.enemyBody.y);
        const direction = this.player.playerBody.x > this.enemyBody.x ? 1 : -1;

        const wasFollowing = this.followPlayer;
        this.followPlayer = distanceX <= 50 && distanceY <= 56;

        if (this.followPlayer) 
        {
            this.setVelocityX(direction * this.speedX);
            this.direction = direction === 1 ? "right" : "left";
            this.stopDirectionTimer();
        } 
        else if (wasFollowing && !this.directionTimer) 
        {
            this.startDirectionTimer();
        }
    }

    private movingSystem(direction: "right" | "left") 
    {
        this.setVelocityX(direction === "right" ? this.speedX : -this.speedX);
    }

    private startDirectionTimer(): void 
    {
        this.stopDirectionTimer();
        this.directionTimer = this.scene.time.addEvent(
        {
            delay: this.durationInSeconds,
            loop: true,
            callback: () => 
            {
                this.direction = this.direction === "right" ? "left" : "right";
            }
        });
    }

    private stopDirectionTimer(): void 
    {
        if (this.directionTimer) 
        {
            this.directionTimer.remove(false);
            this.directionTimer = undefined;
        }
    }

    private checkForGround(): void 
    {
        const direction = this.flipX ? -1 : 1;
        const detectionDistance = 2;
        const nextX = this.x + direction * (this.width / 2 + 1) * detectionDistance;
        const nextY = this.y + this.height / 2 + 12;

        const tile = this.ground.getTileAtWorldXY(nextX, nextY);

        if (!tile) 
        {
            if (this.direction === "right") 
            {
                this.stopDirectionTimer();
                this.direction = "left";
                this.startDirectionTimer();
            } 
            else if (this.direction === "left") 
            {
                this.stopDirectionTimer();
                this.direction = "right";
                this.startDirectionTimer();
            }
        }
    }

    private bounceOn(): void 
    {
        if (this.hasBounceOn) return;

        this.hasBounceOn = true;
        const direction = this.flipX ? 1 : -1;
        const bounceForce = 150;

        this.scene.time.delayedCall(50, () => 
        {
            this.setVelocity(bounceForce * direction, -bounceForce);
        });

        this.scene.time.delayedCall(150, () => {
            if (this && this.body && this.enemyBody.blocked.down) 
            {
                this.setVelocity(0, 0);
                this.hasBounceOn = false;
            } 
            else 
            {
                this.isFlying = true;
            }
        });
    }

    protected handlePlayerCollision(player: Player): void 
    {
        if (player.playerBody.touching.down && this.enemyBody.touching.up) 
          {
            player.forcedJump(-300);
            this.scene.sound.play('hitSlimeSound', 
            {
                volume: 0.3,
                rate: 1
            })
            this.destroy();
        } 
        else if (player.playerBody.touching.right && this.enemyBody.touching.left) 
        {
            player.knockBack(300, "right", 5, 200);
            player.temporarilyDisableCollision(this.enemiesCollider);
            this.bounceOn();
        } 
        else if (player.playerBody.touching.left && this.enemyBody.touching.right) 
        {
            player.temporarilyDisableCollision(this.enemiesCollider);
            player.knockBack(300, "left", 5, 200);
            this.bounceOn();
        } 
        else 
        {
            const knockDirection = Math.random() < 0.05 ? "left" : "right";
            player.knockBack(300, knockDirection, 5, 200);
            player.temporarilyDisableCollision(this.enemiesCollider);
            this.bounceOn();
        }
    }

    protected handleGroundCollision(): void 
    {
        if (this.enemyBody.blocked.right) 
        {
            this.stopDirectionTimer();
            this.direction = "left";
            this.startDirectionTimer();
        }

        if (this.enemyBody.blocked.left) 
        {
            this.stopDirectionTimer();
            this.direction = "right";
            this.startDirectionTimer();
        }
    }

    public takeDamage(value: number) 
    {
        if (!this.isHit) 
          {
            this.lifepoint -= value;
            this.isHit = true;

            if (this.lifepoint <= 0) 
            {
                this.scene.sound.play('hitSlimeSound', 
                {
                    volume: 0.3,
                    rate: 1
                })
                this.destroy();
            }
        }
    }
}
