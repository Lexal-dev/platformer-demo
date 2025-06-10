export default class MovingPlatform extends Phaser.Physics.Arcade.Sprite {
    private isHorizontalDirection: boolean;
    private startX: number;
    private startY: number;
    private range: number;
    private speed: number;
    private validRange: boolean;
    private isPaused: boolean;
    private elapsedTime: number;
    private otherDirection: boolean;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, speed: number = 50, range: number = 50, isHorizontalDirection: boolean = true) 
    {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 0);
        this.setImmovable(true);

        if (this.body instanceof Phaser.Physics.Arcade.Body) 
        {
            this.body.setAllowGravity(false); 
        }

        this.setCollideWorldBounds(true);

        this.isHorizontalDirection = isHorizontalDirection;
        this.startX = x;
        this.startY = y;
        this.range = range;
        this.speed = speed;

        this.validRange = this.range >= 0;

        this.isPaused = false;
        this.elapsedTime = 0;
        this.otherDirection = false;
    }

    preUpdate(time: number, delta: number): void 
    {
        if (!this.validRange) 
        {
            console.warn("MovingPlatform: Invalid range");
            return;
        }

        super.preUpdate(time, delta);

        if (!this.isPaused) 
        {
            this.elapsedTime += delta;
            this.moving(delta);
        }
    }

    private moving(delta: number): void 
    {
        const isHorizontal = this.isHorizontalDirection;
        const body = this.body as Phaser.Physics.Arcade.Body;

        const currentPos = isHorizontal ? body.x : body.y;
        const start = isHorizontal ? this.startX : this.startY;
        const progress = (currentPos - start) / this.range;

        const direction = this.otherDirection ? 1 : -1;
        const distanceFromEdge = direction > 0 ? 1 - progress : progress;

        // Soft deceleration near edges
        let speedMultiplier = 1;
        if (distanceFromEdge < 0.3) 
        {
            speedMultiplier = Phaser.Math.Linear(0.3, 1, distanceFromEdge / 0.3);
        }

        // Acceleration on turning
        const accelerationDuration = 500; // ms
        const accelerationFactor = Phaser.Math.Easing.Sine.Out(Math.min(this.elapsedTime / accelerationDuration, 1));

        const velocity = this.speed * speedMultiplier * accelerationFactor * direction;

        if (isHorizontal) 
        {
            body.setVelocityX(velocity);
        } 
        else 
        {
            body.setVelocityY(velocity);
        }

        const max = start + this.range;
        const min = start;

        if (currentPos >= max && this.otherDirection) 
        {
            this.pauseMovement();
            this.otherDirection = false;
            this.elapsedTime = 0;
        } 
        else if (currentPos <= min && !this.otherDirection) 
        {
            this.pauseMovement();
            this.otherDirection = true;
            this.elapsedTime = 0;
        }
    }

    private pauseMovement(): void 
    {
        this.isPaused = true;
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setVelocity(0, 0);

        this.scene.time.delayedCall(1000, () => 
        {
            this.isPaused = false;
            this.elapsedTime = 0;
        });
    }
}
