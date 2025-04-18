import { Start } from '@/phaser/scenes/Start';
import Player from '../player/Player';

export default class Disk extends Phaser.Physics.Arcade.Sprite {
    private direction: number;
    private speed: number;
    private isSide: boolean;
    private player:Player

    constructor(scene: Start, x: number, y: number, direction: number = 1, isSide: boolean = true, speed:number, player:Player) {
        super(scene, x, y, 'diskSheet');
      
        this.scene = scene;
        this.direction = direction;
        this.isSide = isSide;
        this.speed = 300 * this.direction;
        this.player = player;
      
        scene.add.existing(this);
        scene.physics.add.existing(this);
      
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.allowGravity = false;
        body.setCollideWorldBounds(true);
        body.setSize(18, 18);
        body.setOffset(0, 0);
      
        if (this.isSide) {
          this.setVelocityX(this.speed);
        } else {
          this.setVelocityY(this.speed);
        }
      
        this.play('diskSheet');
      
        scene.time.delayedCall(5000, () => {
          this.destroy();
        });
      
        scene.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body) => {
          if (body.gameObject === this) {
            this.destroy();
          }
        });

        scene.physics.add.collider(this, this.player, () => {
          if(this.player.playerBody.touching.up)
          {
            this.player.knockBack(300, "top", 4);
          }

          if(this.player.playerBody.touching.down)
          {
              this.player.knockBack(300, "bottom", 4);
          }

          if(this.player.playerBody.touching.left)
          {
              this.player.knockBack(300, "left", 4);
          }

          if(this.player.playerBody.touching.right)
          {
              this.player.knockBack(300, "right", 4);
          }

          this.destroy()
        });

    }

    update() {
        if (this.isSide) {
          this.setVelocityX(this.speed);
        } else {
          this.setVelocityY(this.speed);
        }
    }

}