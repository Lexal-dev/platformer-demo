import Player from "@/class/player/Player";
import { Start } from "@/phaser/scenes/Start";
export default class PlayerAnimations
{
    private player: Player;
    private scene: Start;
    private lastWalkSoundTime: number = 0;
    private walkSoundInterval: number = 250;
    private hasJumped: boolean = false;
    
    constructor(player:Player, scene:Start)
    {
        this.player = player;
        this.scene = scene;
        
    }

    update()
    {
        const currentTime = this.scene.time.now;
        if (this.player.playerBody.velocity.x !== 0 && this.player.playerBody.blocked.down && !this.player.onCrouch)
            {
                this.player.play("run", true);
                if (currentTime - this.lastWalkSoundTime > this.walkSoundInterval) {
                    this.scene.sound.play('walkSound', {
                        volume: 0.1,
                    });
                    this.lastWalkSoundTime = currentTime;
                }
            }
            else if (this.player.playerBody.velocity.y !== 0 && !this.player.playerBody.blocked.down && !this.player.playerBody.blocked.left && !this.player.playerBody.blocked.right) 
            {
                this.player.play("endJump", true);

                // ➤ Détection du décollage
                if (!this.hasJumped) {
                    this.scene.sound.play('jumpSound', {
                        volume: 0.6,
                    });
                    this.hasJumped = true;
                }
        
            }
            else if(this.player.playerBody.blocked.down && this.player.onCrouch && this.player.touchActive && this.player.playerBody.velocity.y >= 0)
            {
                if(this.player.playerBody.velocity.x !== 0)
                {
                    this.player.play("crouch" , true);                
                }
                else
                {
                    this.player.play("crouch" , true); 
                    this.player.setFrame(3);
                }

                this.player.playerBody.setSize(18, 22);
                this.player.playerBody.setOffset(0, 10);               
            }
            else
            {
                    this.player.play('idle', true);
            }    

            if(this.player.playerBody.blocked.down)
            {
                this.hasJumped = false;
            }
    }
}
