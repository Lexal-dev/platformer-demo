import { Start } from "@/phaser/scenes/Start";
import Player from "../player/Player";
import Enemy from "./Enemy";
import GhostBall from "./attacks/GhostBall";

export default class Ghost extends Enemy {
    private shootInterval: number = 3000;
    private shootTimer?: Phaser.Time.TimerEvent;
    public canTeleport: boolean = true;
    private teleportCooldownTimer?: Phaser.Time.TimerEvent;

    private spawnX: number;
    private spawnY: number;

    private isDead: boolean = false;
    private isTeleporting: boolean = false; 

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        speedX: number = 0,
        speedY: number = 0,
        ground: Phaser.Tilemaps.TilemapLayer,
        player: Player,
        direction: "right" | "left",
        name: string,
    ) {
        super(scene, x, y, "ghosts", "ghostRun", speedX, speedY, ground, player);
        this.lifepoint = 20;
        this.direction = direction;

        this.spawnX = x;
        this.spawnY = y;

        this.name = name;
        this.enemyBody.setAllowGravity(false);
        this.setDepth(2);
        this.setScale(1.4);
    }

    update() {
        if (!this.enemyBody || this.isDead) return;
        super.update();
        if(this.enemyBody.allowGravity === true)
        {
            this.enemyBody.setAllowGravity(false)
        }
    
        const isPlayerVisible = this.canSeePlayer(this.player, this.ground);

        if (isPlayerVisible) {
            this.handleGhostMovement();
            this.startShooting();
        } else {
            this.setVelocity(0, 0);
            this.stopShooting();
        }

        if (!this.canTeleport && this.teleportCooldownTimer && this.teleportCooldownTimer.getProgress() >= 1) {
            this.canTeleport = true;
        }
    }

    private canSeePlayer(player: Player, groundLayer: Phaser.Tilemaps.TilemapLayer) 
    {
        const start = new Phaser.Geom.Point(this.x, this.y);
        const end = new Phaser.Geom.Point(player.x, player.y);
        const ray = new Phaser.Geom.Line(start.x, start.y, end.x, end.y);

        const tiles = groundLayer.getTilesWithinShape(ray, { isColliding: true });
        return tiles.length === 0;
    }

    private handleGhostMovement(): void 
    {
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;

        this.setFlipX(this.player.x < this.x);

        const direction = this.flipX ? -1 : 1;
        const reverseDirection = this.flipX ? 1 : -1;

        if (this.flipX) 
        {
            if (dx > -50) 
            {
                this.setVelocityX(this.speedX * reverseDirection);
            } 
            else if (dx < -80) 
            {
                this.setVelocityX(this.speedX * direction);
            }
        } 
        else 
        {
            if (dx < 50) 
            {
                this.setVelocityX(this.speedX * reverseDirection);
            } 
            else if (dx > 80) 
            {
                this.setVelocityX(this.speedX * direction);
            }
        }

        if (dy < 10) 
        {
            this.setVelocityY(-this.speedY);
        } 
        else if (dy >= 60) 
        {
            this.setVelocityY(this.speedY);
        }

    }

    private startShooting(): void 
    {
        if (this.shootTimer) return;

        this.shootTimer = this.scene.time.addEvent(
        {
            delay: this.shootInterval,
            callback: this.shootGhostBall,
            callbackScope: this,
            loop: true
        });
    }

    private stopShooting(): void 
    {
        if (this.shootTimer) {
            this.shootTimer.remove();
            this.shootTimer = undefined;
        }
    }

    private shootGhostBall() 
    {
        if (!this.scene || !this.scene.sys) return;

        const ghostBall = new GhostBall(this.scene, this.x, this.y, this.player);
        (this.scene as Start).enemiesProjectile.add(ghostBall, true);
    }

    protected handleGroundCollision(): void 
    {
        if (this.enemyBody.blocked.right || this.enemyBody.blocked.left) 
            {
            const offset = this.enemyBody.blocked.right ? -150 : 150;

            if (this.canTeleport) 
            {
                this.canTeleport = false;

                this.teleportCooldownTimer = this.scene.time.addEvent(
                {
                    delay: 3000,
                    callback: () => {
                        this.canTeleport = true;
                    },
                    callbackScope: this
                });

                this.performTeleport(offset);
            }
        }
    }

    protected handlePlayerCollision(player: Player): void 
    {
        const direction = player.flipX ? "left" : "right";
        player.knockBack(300, direction, 2, 200)
        player.temporarilyDisableCollision(this.enemiesCollider);
    }

    public performTeleport(offset: number): void 
    {
        if (this.isDead || this.isTeleporting) return; 

        this.isTeleporting = true; 

        if (!this.scene || !this.scene.tweens) 
        {
            console.error("Scene or scene.tweens is not defined");
            return;
        }

        this.scene.tweens.add(
        {
            targets: this,
            alpha: 0,
            duration: 1000,
            onComplete: () => 
            {

                if (this.isDead) return;

                this.x += offset;
                this.x = Math.round(this.x);

                const tile = this.ground.getTileAtWorldXY(this.x, this.y, true);
                const isInWall = tile && tile.collides;

                if (isInWall) {
                    this.x = this.spawnX;
                    this.y = this.spawnY;
                }

                if (!this.isDead) {
                    this.scene.tweens.add(
                    {
                        targets: this,
                        alpha: 1,
                        duration: 1000
                    });
                }

                this.isTeleporting = false; 
            }
        });
    }

    public takeDamage(value: number) 
    {
        if (!this.isHit && !this.isDead) 
        {
            this.lifepoint -= value;
            this.isHit = true;

            if (this.lifepoint <= 0) 
            {
                this.isDead = true; 
                this.destroy();
            }
        }
    }
}
