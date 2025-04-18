import Player from "@/class/player/Player";


export default class GhostBall extends Phaser.Physics.Arcade.Sprite {
    public scene: Phaser.Scene;
    private target: Player;
    private ghostBallSound?: Phaser.Sound.BaseSound;
  
    constructor(scene: Phaser.Scene, x: number, y: number, target: Player) {
      super(scene, x, y, 'ghostBall');
  
      this.scene = scene;
      this.target = target;

      scene.add.existing(this);
      scene.physics.add.existing(this);
  
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setAllowGravity(false);
      this.setCollideWorldBounds(true);
  
      this.play('ghostBall');
  
      scene.time.delayedCall(3000, () => {
        this.destroy();
        this.ghostBallSound?.stop();
      });
  
      scene.physics.add.collider(this, target, this.handleCollision, undefined, this);
  
      const groundLayer = (scene as any).groundLayer as Phaser.Tilemaps.TilemapLayer | undefined;
      if (groundLayer) {
        scene.physics.add.collider(this, groundLayer, () =>{
           this.destroy();
           this.ghostBallSound?.stop();
          });
      }
  
      this.launchTowardsPlayer();
      this.ghostBallSound = this.scene.sound.add('ghostBallSound');
      this.ghostBallSound.play({
        volume: 0.4,
        rate: 1
      });
    }
  
    private launchTowardsPlayer(): void {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const angle = Math.atan2(dy, dx);
      const speed = 200;
  
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
      this.setFlipX(body.velocity.x < 0);
    }
  
    private handleCollision(): void {
      const body = this.body as Phaser.Physics.Arcade.Body;
  
      if (!body || !this.target.playerBody) {
        console.warn('Collision ignorée : corps manquant');
        return;
      }
  
      if (body.touching.right) {
        this.target.takeDamage = 2;
        this.target.knockBack?.(200, 'right');
      } else if (body.touching.left) {
        this.target.takeDamage = 2;
        this.target.knockBack?.(200, 'left');
      } else if (body.touching.up || body.touching.down) {
        this.target.takeDamage = 2;
        this.target.setVelocityY(-200);
      }
      this.destroy();
      this.ghostBallSound?.stop();
    }
  
    public update(): void {
      const body = this.body as Phaser.Physics.Arcade.Body;
      if (body.velocity.x === 0) {
        this.launchTowardsPlayer();
      }
    }
  }
  