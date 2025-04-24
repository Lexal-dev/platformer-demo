import Player from "../player/Player";

export default class Enemy extends Phaser.Physics.Arcade.Sprite 
{
    private _lifepoint: number = 100;
    private _maxLifepoint: number = 100;
    protected direction: "right" | "left";
    protected speedX: number;
    protected speedY: number;
    protected ground: Phaser.Tilemaps.TilemapLayer;
    protected player: Player;
    protected isHit: boolean = false;
    private hitTimer?: Phaser.Time.TimerEvent;
    protected enemiesCollider: Phaser.Physics.Arcade.Collider;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, animation: string, speedX: number = 0, speedY: number = 0, ground: Phaser.Tilemaps.TilemapLayer, player: Player, direction: "right" | "left" = "right") 
    {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.lifepoint = 100;
        this.maxLifepoint = 100;
        this.direction = direction;
        this.speedX = speedX;
        this.speedY = speedY;
        this.ground = ground;   
        this.scene = scene;
        this.player = player;
        this.isHit = false;

        this.scene.physics.add.collider(this, this.ground, (enemy, ground) => 
        {
            this.handleGroundCollision(ground as Phaser.Tilemaps.TilemapLayer);
        });
        this.enemiesCollider = this.scene.physics.add.overlap(this, this.player, (enemy, player) => 
        {
            this.handlePlayerCollision(player as Player);
        });

        this.play(animation, true);
        this.scene.events.on("update", this.update, this);
    }

    update() 
    {
        if (!this.enemyBody) return;

        if (this.enemyBody.velocity.y !== 800) 
        {
            this.setGravityY(800);
        }
        if (this.isHit) 
        {
            if (!this.hitTimer) 
            {
                this.hitTimer = this.scene.time.addEvent(
                {
                    delay: 100, 
                    callback: () => 
                    {
                        this.isHit = false;
                        this.hitTimer = undefined; 
                    }
                });
            }
        }
    }

    protected handlePlayerCollision(player: Player): void {}

    protected handleGroundCollision(ground: Phaser.Tilemaps.TilemapLayer): void {}

    get enemyBody(): Phaser.Physics.Arcade.Body 
    {
        return this.body as Phaser.Physics.Arcade.Body;
    }

    get lifepoint(): number 
    {
        return this._lifepoint;
    }

    set lifepoint(value: number) 
    {
        this._lifepoint = value;
    }

    get maxLifepoint(): number 
    {
        return this._maxLifepoint;
    }

    set maxLifepoint(value: number) 
    {
        this._maxLifepoint = value;
    }
}
