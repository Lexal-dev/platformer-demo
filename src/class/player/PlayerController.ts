import Player from "@/class/player/Player";
import { Start } from "@/phaser/scenes/Start";
import { PhaserKeyBindings } from "@/types/keysManager";

export default class PlayerController
{
    private player:Player
    private keys: PhaserKeyBindings;
    private scene: Start;

    constructor(player:Player, keys:PhaserKeyBindings, scene:Start)
    {
        this.player = player;
        this.keys = keys;
        this.scene = scene;
    }

    update():void
    {
        if(!this.player.playerBody) return;

        this.updateSpeedByCoins();

        if(this.player.onWater)
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
            if(this.player.playerBody.gravity.y !== 800)
            {
                this.player.setGravityY(800)
            }
            this.movingSystem();
            if (this.player.playerBody.blocked.down) {
                if (this.player.jumpReady === false) {
                    this.player.scene.time.delayedCall(50, () => {
                        if(this.player.playerBody.blocked.down)
                        {
                            this.player.jumpReady = true;    
                            this.player.doubleJumpReady = true; 
                        }
                    });
                }
              }

              this.toDash() 
        }
    }

    private updateSpeedByCoins()
    {
        const coins = this.player.coins;
        const speed = this.player.speed;

        if(this.player.playerBody.blocked.right || this.player.playerBody.blocked.left)
        {
          this.player.speed = 150;
        }
        else
        {
          if(coins >= 20 && coins < 50 && speed !== 175)
          {
              this.player.speed = 175;
          } 
          else if(coins >= 50 && coins < 100 && speed !== 200) 
          {
              this.player.speed = 200;
          } 
          else if(coins >= 100 && speed !== 225 )
          {
              this.player.speed  = 225;
          }          
        }

    }

    private movingSystem() 
    {
        
      if (Phaser.Input.Keyboard.JustDown(this.keys.RIGHT)) {
        this.player.lastDirection = 'right';
        this.player.onPushKey = 'right';
      } else if (Phaser.Input.Keyboard.JustUp(this.keys.RIGHT) && this.player.lastDirection === 'right') {
        this.player.setVelocityX(0);
        this.player.onPushKey = 'default';
      }
  
      if (Phaser.Input.Keyboard.JustDown(this.keys.LEFT)) {
        this.player.lastDirection = 'left';
        this.player.onPushKey = 'left';
        
        
      } else if (Phaser.Input.Keyboard.JustUp(this.keys.LEFT) && this.player.lastDirection === 'left') {
        this.player.setVelocityX(0);
        this.player.onPushKey = 'default';
      }
  
      if (Phaser.Input.Keyboard.JustDown(this.keys.JUMP) && !this.player.onCrouch) {
        if (this.player.jumpReady && !this.player.onSlide) {
          this.player.jumpReady = false;
          this.player.setVelocityY(-300);
        } else if (!this.player.jumpReady && this.player.doubleJumpReady && !this.player.onSlide) {
          this.player.setVelocityY(-300);
          this.player.doubleJumpReady = false;
        } else if (this.player.onSlide) {
          this.player.onWallJump = true;
          this.player.touchActive = false;
  
          const direction = this.player.onPushKey === 'right' ? -1 : 1;
          this.player.setVelocityY(-300);
          this.player.playerBody.velocity.x = 150 * direction;
          
  
          this.player.scene.time.delayedCall(200, () => {
            this.player.touchActive = true;
            this.player.onWallJump = false;
          });
        }
      }
  
      if (Phaser.Input.Keyboard.JustUp(this.keys.JUMP) && this.player.playerBody.velocity.y <= -10 && !this.player.onSlide) {
        this.player.setVelocityY(0);
      }
  
      if (
        (this.player.playerBody.blocked.right || this.player.playerBody.blocked.left) &&
        (this.player.onPushKey === 'left' || this.player.onPushKey === 'right') &&
        !this.player.onWallJump &&
        !this.player.playerBody.blocked.down &&
        this.player.playerBody.velocity.y > 0 &&
        this.player.playerBody.blocked.down === false &&
        this.player.y < this.player.scene.physics.world.bounds.bottom - 10 // à +10px du sol
      ) {
        this.player.setVelocityY(100);
        this.player.onSlide = true;
      } else {
        this.player.onSlide = false;
      }
  
      if (Phaser.Input.Keyboard.JustDown(this.keys.CROUCH)) {
        if (this.player.onCrouchDisable) return;
      
        this.player.onPushKey = 'crouch';
        if (!this.player.onSlide && !this.player.onWallJump) {
          this.player.onCrouch = true;
        } else {
          this.player.onCrouch = false;
          this.player.playerBody.setSize(18, 32);
        }
      }
      else if (Phaser.Input.Keyboard.JustUp(this.keys.CROUCH) && this.player.touchActive) { // this.player.touchActive to force blocking when above the sprite
        this.player.onCrouch = false;
        this.player.onPushKey = 'default';
        this.player.playerBody.setSize(18, 32);
      }

      if((this.player.onPushKey === "right" || this.player.onPushKey === "left") && !this.player.onWallJump && this.player.touchActive) {
        const direction = this.player.onPushKey === "right" ? 1 : -1;
        this.player.setVelocityX(this.player.speed * direction);
        }

        if (this.player.playerBody.velocity.y !== 0 && !this.player.playerBody.blocked.down && !this.player.playerBody.blocked.left && !this.player.playerBody.blocked.right) 
            {
                if(this.player.onCrouch && !this.player.playerBody.blocked.down)
                {
                    this.player.setVelocityY(550);
                }
                else if(this.player.playerBody.blocked.down)
                {
                    this.player.setVelocityY(0);
                }
            }
    }

    private movingWater() 
    {
        if (!this.player.playerBody) return;

        if (this.keys.RIGHT.isDown) {
            this.player.setVelocityX(80);
            this.player.lastDirection = "right";
            this.player.onPushKey = "right";
        } else if (this.keys.LEFT.isDown) {
            this.player.setVelocityX(-80);
            this.player.lastDirection = "left";
            this.player.onPushKey = "left";
        } else {
            this.player.setVelocityX(0);
        }
    
        if (Phaser.Input.Keyboard.JustDown(this.keys.JUMP)) {
            this.player.setVelocityY(-180);
        } else if (Phaser.Input.Keyboard.JustUp(this.keys.JUMP)) {
            this.player.setVelocityY(0); 
        }
    }

    private toDash() 
    {

        if (!this.player.playerBody) return;
    
        if (Phaser.Input.Keyboard.JustDown(this.keys.DASH)) {
            const canDashSlide = this.player.onSlide && this.player.dashUp;
            const canDashAir = this.player.dashUp && !this.player.playerBody.blocked.left && !this.player.playerBody.blocked.right;

            if (canDashSlide || canDashAir) {
                this.player.touchActive = false;
                this.player.dashUp = false;
                this.player.isDashing = true;
    
                const direction = this.player.flipX ? (canDashSlide ? 1 : -1) : 1;
                const initialVelocityY = this.player.playerBody.velocity.y;
    
                this.player.setVelocityX(350 * direction);
                this.player.setVelocityY(0);
                this.player.playerBody.allowGravity = false;
                this.scene.sound.play('dashSound', {
                  volume: 0.3,
                  rate: 1
                });
                
    
                this.player.scene.time.delayedCall(250, () => {
                    this.player.setVelocityX(0);
                    this.player.setVelocityY(initialVelocityY < 0 ? 0 : initialVelocityY);
                    
                    this.player.isDashing = false;
                    this.player.touchActive = true;
                    if (canDashSlide) this.player.onSlide = false;
                
                    this.player.scene.time.delayedCall(100, () => {
                        this.player.playerBody.allowGravity = true;
                    });
                
                    this.resetDash();
                });
            } else {
                console.log("Dash non disponible");
                this.player.touchActive = true;
            }
        }
    }
    
    private resetDash() 
    {
        this.player.scene.time.delayedCall(2000, () => {
            this.player.dashUp = true;
            console.log("dash reset !")
        });
    }

}