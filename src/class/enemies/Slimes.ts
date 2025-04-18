import Player from "../player/Player";

export default class Slime extends Phaser.Physics.Arcade.Sprite {
  private speed: number;
  private right: boolean;
  private left: boolean;
  private followPlayer: boolean;
  private bouncedOn: boolean;
  private onCollision: boolean;
  private timerOn: boolean;
  private timer: number;
  private entitie: Player;
  private lifePoint: number;
  private isNpc: boolean;
  private ground: Phaser.Tilemaps.TilemapLayer;


  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    speed: number = 20,
    isDirectionRight: boolean = true,
    entitie: Player,
    name: string = "Michel",
    timer: number = 2000,
    ground:Phaser.Tilemaps.TilemapLayer
  ) {
    super(scene, x, y, "slimes");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = speed;
    this.entitie = entitie;
    this.name = name;
    this.timer = timer;

    this.lifePoint = 5;
    this.isNpc = true;
    this.right = isDirectionRight;
    this.left = !isDirectionRight;
    this.followPlayer = false;
    this.bouncedOn = false;
    this.onCollision = false;
    this.timerOn = false;

    this.ground = ground;

    this.setDepth(1);
    this.play("slimeRun", true);

    scene.physics.add.collider(this, this.entitie, () => {
      const body = this.body as Phaser.Physics.Arcade.Body;
      const bodyPlayer = this.entitie.body as Phaser.Physics.Arcade.Body;

      if(bodyPlayer.touching.down && body.touching.up) {
        this.entitie.setVelocityY(-300);
        this.scene.sound.play('hitSlimeSound', {
          volume: 0.3,
          rate: 1
      });
        this.destroy();
      }

      if(bodyPlayer.touching.up && body.touching.down) {
        this.bounceOn()
        this.entitie.setVelocityY(200);
        this.entitie.takeDamage = 2;
        this.entitie.setTinted(200);
      }
      if (bodyPlayer.touching.left && body.touching.right) {
        this.entitie.knockBack(300, "left", 4);
      }
      if (bodyPlayer.touching.right && body.touching.left) {
        this.entitie.knockBack(300, "right", 4);
      }
    })
  }
  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.update();
  }

  update(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (body.gravity.y === 0) {
      this.setGravityY(800);
    }

    this.flipX = body.velocity.x < 0;

    if (body.blocked.left) {
      this.setVelocityX(this.speed);
      this.right = true;
      this.left = false;
      return;
    }

    if (body.blocked.right) {
      this.setVelocityX(-this.speed);
      this.right = false;
      this.left = true;
      return;
    }

    const direction = this.right ? 1 : -1;
    const detectionDistance = 2;
    const nextX = this.x + direction * (this.width / 2 + 1) * detectionDistance;
    const nextY = this.y + this.height / 2 + 12;

    const tile = this.ground.getTileAtWorldXY(nextX, nextY);

    if (!tile) {
      if (this.name === "Alain-4" || this.name === "Alain-5") {
      }

      this.followPlayer = false;
      this.setVelocityX(-direction * this.speed);
      this.right = !this.right;
      this.left = !this.left;
      return;
    }

    this.moveSystem();
    this.followingPlayer();
  }

  private moveSystem(): void {
    if (this.followPlayer || this.bouncedOn || this.timerOn) return;

    if (this.right) {
      this.setVelocityX(this.speed);
      this.timerOn = true;

      this.scene.time.delayedCall(this.timer, () => {
        this.timerOn = false;
        this.right = false;
        this.left = true;
      });

      return;
    }

    if (this.left) {
      this.setVelocityX(-this.speed);
      this.timerOn = true;

    this.scene.time.delayedCall(this.timer, () => {
      this.timerOn = false;
      this.right = true;
      this.left = false;
    });

      return;
    }
  }

  private followingPlayer(): void {
    if (this.bouncedOn) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    const targetBody = this.entitie.body as Phaser.Physics.Arcade.Body;

    const distanceX = Math.abs(targetBody.x - body.x);
    const distanceY = Math.abs(targetBody.y - body.y);
    const direction = targetBody.x > body.x ? 1 : -1;

    if (distanceX <= 75 && distanceY <= 20) {
      this.followPlayer = true;
      this.setVelocityX(direction * this.speed);
    } else {
      this.followPlayer = false;
    }
  }

  public bounceOn(): void {
    if (this.bouncedOn) return;

    this.bouncedOn = true;
    const direction = this.flipX ? 1 : -1;
    this.scene.time.delayedCall(10, () => {
    this.setVelocity(100 * direction, -150);
    });
    this.scene.time.delayedCall(500, () => {
        if (this && this.body) {
          this.setVelocityY(0);
        }
        this.bouncedOn = false;
      });
  }

  public takeDamage(damage: number): void {
      this.lifePoint -= damage;

      if (this.lifePoint <= 0) {
        this.scene.sound.play('hitSlimeSound', {
          volume: 0.3,
          rate: 1
      });
      this.destroy();
    }
  }
}
