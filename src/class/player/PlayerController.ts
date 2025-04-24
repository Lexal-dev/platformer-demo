import Player from "@/class/player/Player";
import { Start } from "@/phaser/scenes/Start";
import { PhaserKeyBindings } from "@/types/keysManager";

export default class PlayerController 
{
    private player: Player;
    private keys: PhaserKeyBindings;
    private scene: Start;

    constructor(player: Player, keys: PhaserKeyBindings, scene: Start) 
	{
        this.player = player;
        this.keys = keys;
        this.scene = scene;
    }

    update(): void 
	{
        // Check if player body exists
        if (!this.player.playerBody) return;

        // Update speed based on coins collected
        this.updateSpeedByCoins();

        // Handle player movement when in water
        if (this.player.onWater) 
		{
            this.player.setGravityY(100);
            this.player.onCrouch = false;
            this.player.jumpReady = false;
            this.player.doubleJumpReady = true;
            this.movingWater();
            return;
        } 
		else 
		{
            // Reset gravity to normal if not in water
            if (this.player.playerBody.gravity.y !== 800) {
                this.player.setGravityY(800);
            }
            this.movingSystem();

            // Check if the player can jump again after landing
            if (this.player.playerBody.blocked.down) 
			{
                if (this.player.jumpReady === false) 
				{
                    this.player.scene.time.delayedCall(50, () => 
					{
                        if (this.player.playerBody.blocked.down) 
						{
                            this.player.jumpReady = true;
                            this.player.doubleJumpReady = true;
                        }
                    });
                }
            }

            // Check if dash is possible
            this.toDash();
        }
    }

    // Update player speed based on the number of coins collected
    private updateSpeedByCoins() 
	{
        const coins = this.player.coins;
        const speed = this.player.speed;

        if (this.player.playerBody.blocked.right || this.player.playerBody.blocked.left) 
		{
            this.player.speed = 150;
        } 
		else 
		{
            if (coins >= 20 && coins < 50 && speed !== 175) 
			{
                this.player.speed = 175;
            } 
			else if (coins >= 50 && coins < 100 && speed !== 200) 
			{
                this.player.speed = 200;
            }
			else if (coins >= 100 && speed !== 225) 
			{
                this.player.speed = 225;
            }
        }
    }

    // Handle player movement (left, right, jump, crouch)
    private movingSystem() 
	{
        // Handle right movement
        if (Phaser.Input.Keyboard.JustDown(this.keys.RIGHT)) 
		{
            this.player.lastDirection = 'right';
            this.player.onPushKey = 'right';
        }
		else if (Phaser.Input.Keyboard.JustUp(this.keys.RIGHT) && this.player.lastDirection === 'right') 
		{
            this.player.setVelocityX(0);
            this.player.onPushKey = 'default';
        }

        // Handle left movement
        if (Phaser.Input.Keyboard.JustDown(this.keys.LEFT)) 
		{
            this.player.lastDirection = 'left';
            this.player.onPushKey = 'left';
        }
		else if(Phaser.Input.Keyboard.JustUp(this.keys.LEFT) && this.player.lastDirection === 'left') 
		{
            this.player.setVelocityX(0);
            this.player.onPushKey = 'default';
        }

        // Handle jump and double jump
        if (Phaser.Input.Keyboard.JustDown(this.keys.JUMP) && !this.player.onCrouch) 
		{
            if (this.player.jumpReady && !this.player.onSlide) 
			{
                this.player.jumpReady = false;
                this.player.setVelocityY(-300);
            } 
			else if (!this.player.jumpReady && this.player.doubleJumpReady && !this.player.onSlide) 
			{
                this.player.setVelocityY(-300);
                this.player.doubleJumpReady = false;
            } 
			else if (this.player.onSlide) 
			{
                this.player.onWallJump = true;
                this.player.touchActive = false;

                const direction = this.player.onPushKey === 'right' ? -1 : 1;
                this.player.setVelocityY(-350);
                this.player.playerBody.velocity.x = 150 * direction;

                // Reset touchActive and onWallJump after a short delay
                this.player.scene.time.delayedCall(120, () => {
                    this.player.touchActive = true;
                    this.player.onWallJump = false;
                });
            }
        }

        // Handle jump release and prevent floating in the air
        if (Phaser.Input.Keyboard.JustUp(this.keys.JUMP) && this.player.playerBody.velocity.y <= -10 && !this.player.onSlide) 
		{
            this.player.setVelocityY(0);
        }

        // Handle slide mechanics when hitting a wall
        if (
            (this.player.playerBody.blocked.right || this.player.playerBody.blocked.left) &&
            (this.player.onPushKey === 'left' || this.player.onPushKey === 'right') &&
            !this.player.onWallJump &&
            !this.player.playerBody.blocked.down &&
            this.player.playerBody.velocity.y > 0 &&
            this.player.playerBody.blocked.down === false &&
            this.player.y < this.player.scene.physics.world.bounds.bottom - 10 // 10px from the ground
        ) 
		{
            this.player.setVelocityY(100);
            this.player.onSlide = true;
        } 
		else 
		{
            this.player.onSlide = false;
        }

        // Handle crouch functionality
        if (Phaser.Input.Keyboard.JustDown(this.keys.CROUCH)) 
		{
            if (this.player.onCrouchDisable) return;

            this.player.onPushKey = 'crouch';
            if (!this.player.onSlide && !this.player.onWallJump) 
			{
                this.player.onCrouch = true;
            } 
			else 
			{
                this.player.onCrouch = false;
                this.player.playerBody.setSize(18, 32);
            }
        } 
		else if (Phaser.Input.Keyboard.JustUp(this.keys.CROUCH) && this.player.touchActive) 
		{
            this.player.onCrouch = false;
            this.player.onPushKey = 'default';
            this.player.playerBody.setSize(18, 32);
        }

        // Handle directional movement when not sliding or wall jumping
        if ((this.player.onPushKey === 'right' || this.player.onPushKey === 'left') && !this.player.onWallJump && this.player.touchActive) 
		{
            const direction = this.player.onPushKey === 'right' ? 1 : -1;
            this.player.setVelocityX(this.player.speed * direction);
        }

        // Adjust Y velocity when the player is in the air and not blocked
        if (this.player.playerBody.velocity.y !== 0 && !this.player.playerBody.blocked.down && !this.player.playerBody.blocked.left && !this.player.playerBody.blocked.right) 
		{
            if (this.player.onCrouch && !this.player.playerBody.blocked.down) 
			{
                this.player.setVelocityY(550);
            } else if (this.player.playerBody.blocked.down) 
			{
                this.player.setVelocityY(0);
            }
        }
    }

    // Handle player movement when in water
    private movingWater() 
	{
        if (!this.player.playerBody) return;

        // Water movement: moving left and right
        if (this.keys.RIGHT.isDown) 
		{
            this.player.setVelocityX(80);
            this.player.lastDirection = 'right';
            this.player.onPushKey = 'right';
        } 
		else if (this.keys.LEFT.isDown) 
		{
            this.player.setVelocityX(-80);
            this.player.lastDirection = 'left';
            this.player.onPushKey = 'left';
        } 
		else 
		{
            this.player.setVelocityX(0);
        }

        // Handle jump while in water
        if (Phaser.Input.Keyboard.JustDown(this.keys.JUMP)) 
			{
            this.player.setVelocityY(-180);
        } 
		else if (Phaser.Input.Keyboard.JustUp(this.keys.JUMP)) 
		{
            this.player.setVelocityY(0);
        }
    }

    // Handle dash mechanics
    private toDash() 
	{
        if (!this.player.playerBody) return;

        if (Phaser.Input.Keyboard.JustDown(this.keys.DASH)) 
		{
            const canDashSlide = this.player.onSlide && this.player.dashUp;
            const canDashAir = this.player.dashUp && !this.player.playerBody.blocked.left && !this.player.playerBody.blocked.right;

            if (canDashSlide || canDashAir) 
			{
                this.player.touchActive = false;
                this.player.dashUp = false;
                this.player.isDashing = true;

                const direction = canDashSlide ? (this.player.playerBody.blocked.left ? 1 : -1) : (this.player.flipX ? -1 : 1);
                const initialVelocityY = this.player.playerBody.velocity.y;

                // Set velocity for dash
                this.player.setVelocityX(350 * direction);
                this.player.setVelocityY(0);
                this.player.playerBody.allowGravity = false;

                // Play dash sound
                this.scene.sound.play('dashSound', 
				{
                    volume: 0.3,
                    rate: 1
                });

                // Reset dash after a delay
                this.player.scene.time.delayedCall(250, () => 
				{
                    this.player.setVelocityX(0);
                    this.player.setVelocityY(initialVelocityY < 0 ? 0 : initialVelocityY);
                    this.player.isDashing = false;
                    this.player.touchActive = true;
                    if (canDashSlide) this.player.onSlide = false;

                    // Re-enable gravity after dash
                    this.player.scene.time.delayedCall(100, () => 
					{
                        this.player.playerBody.allowGravity = true;
                    });

                    // Reset dash status
                    this.resetDash();
                });
            } 
			else 
			{
                console.log("Dash not available");
                this.player.touchActive = true;
            }
        }
    }

    // Reset the dash ability after a delay
    private resetDash() 
	{
        this.player.scene.time.delayedCall(800, () => 
		{
            this.player.dashUp = true;
            console.log("Dash reset!");
        });
    }
}
