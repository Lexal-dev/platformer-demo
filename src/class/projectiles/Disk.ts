import { Start } from '@/phaser/scenes/Start';
import Player from '../player/Player';

export default class Disk extends Phaser.Physics.Arcade.Sprite 
{
    private direction: number;
    private speed: number;
    private isSide: boolean;
    private player: Player;
    private whooshSound: Phaser.Sound.BaseSound | null = null;

    constructor(
        scene: Start,
        x: number,
        y: number,
        direction: number = 1,
        isSide: boolean = true,
        speed: number,
        player: Player
    ) 
    {
        super(scene, x, y, 'diskSheet');

        this.scene = scene;
        this.direction = direction;
        this.isSide = isSide;
        this.speed = 300 * this.direction;
        this.player = player;

        // Add the sprite to the scene and set up physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.body as Phaser.Physics.Arcade.Body;
        body.allowGravity = false; // Disable gravity
        body.setCollideWorldBounds(true); // Make it collide with world bounds
        body.setSize(18, 18); // Set the size of the body
        body.setOffset(0, 0); // Set the offset for collision detection

        // Set velocity depending on whether it's side or not
        if (this.isSide) 
        {
            this.setVelocityX(this.speed);
        } 
        else 
        {
            this.setVelocityY(this.speed);
        }

        this.play('diskSheet'); // Play the animation for the disk

        // Set up an event to check sound periodically
        this.scene.time.addEvent(
        {
            delay: 100,
            callback: () => this.checkSound(),
            callbackScope: this,
            loop: true,
        });

        // Destroy the disk after 5 seconds
        scene.time.delayedCall(5000, () => 
        {
            this.destroy();
        });

        // Destroy the disk if it hits world bounds
        scene.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body) => 
        {
            if (body.gameObject === this) 
            {
                this.destroy();
            }
        });

        // Add a collider with the player
        scene.physics.add.collider(this, this.player, () => 
        {
            if (this.player.playerBody.touching.up) 
            {
                this.player.knockBack(300, 'top', 5, 150);
            } 
            else if (this.player.playerBody.touching.down) 
            {
                this.player.knockBack(300, 'bottom', 5, 150);
            } 
            else if (this.player.playerBody.touching.left) 
            {
                this.player.knockBack(300, 'left', 5, 150);
            } 
            else if (this.player.playerBody.touching.right) 
            {
                this.player.knockBack(300, 'right', 5, 150);
            } 
            else 
            {
                const direction = player.flipX ? 'right' : 'left';
                this.player.knockBack(300, direction, 5, 150);
            }

            this.destroy();
        });
    }

    // Update the velocity based on the direction (side or not)
    update() 
    {
        if (this.isSide) 
        {
            this.setVelocityX(this.speed);
        } 
        else 
        {
            this.setVelocityY(this.speed);
        }
    }

    // Check if the disk is in the camera's view and play the sound
    private checkSound() {
        if (this.scene && this.scene.cameras && this.scene.cameras.main) 
        {
            if (this.scene.cameras.main.worldView.contains(this.x, this.y)) 
            {
                if (!this.whooshSound) 
                {
                    this.whooshSound = this.scene.sound.add('whooshSound', {
                        volume: 0.2,
                        rate: 1,
                        loop: true,
                    });
                    this.whooshSound.play();
                }
            }
            else 
            {
                if (this.whooshSound) 
                {
                    this.whooshSound.stop();
                    this.whooshSound = null;
                }
            }
        }
    }

    // Stop the sound and destroy the disk
    destroy(fromScene?: boolean): void 
    {
        if (this.whooshSound) {
            this.whooshSound.stop();
        }
        super.destroy(fromScene);
    }
}
