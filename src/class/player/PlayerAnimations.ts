import Player from "@/class/player/Player";
import { Start } from "@/phaser/scenes/Start";
import PlayerAttacks from "./playerAttacks";

export default class PlayerAnimations {
    private player: Player;
    private scene: Start;
    private attacks: PlayerAttacks;
    private lastWalkSoundTime: number = 0;
    private walkSoundInterval: number = 250;
    private hasJumped: boolean = false;
    private chargedFireball: boolean = false;

    constructor(player: Player, scene: Start, attacks: PlayerAttacks) {
        this.player = player;
        this.scene = scene;
        this.attacks = attacks;
    }

    update() {
        const currentTime = this.scene.time.now;
        const isMoving = this.player.playerBody.velocity.x !== 0;
        const isGrounded = this.player.playerBody.blocked.down;
        const isJumping = this.player.playerBody.velocity.y !== 0 && !isGrounded;
        const isCrouch = this.player.onCrouch;
        const isCharging = this.attacks.isChargingFireball;
        const isFullyCharged = this.attacks.isFireballCharged;

        const currentMana = this.player.manaPoint;
        const costFireballMana = this.attacks.chargedFireballCost;

        // Petite delay pour valider un "charged" après 150ms
        if (isCharging && !this.chargedFireball) {
            this.scene.time.delayedCall(150, () => {
                this.chargedFireball = true;
            });
        } else if (!isCharging && this.chargedFireball) {
            this.chargedFireball = false;
        }

        // === JUMP ===
        if (isJumping) {
            if (isCharging && currentMana >= costFireballMana && this.chargedFireball) {
                this.player.play(isFullyCharged ? "endJumpOnCharged" : "endJumpOnCharging", true);
            } else {
                this.player.play("endJump", true);
            }

            if (!this.hasJumped) {
                this.scene.sound.play('jumpSound', { volume: 0.6 });
                this.hasJumped = true;
            }
            return;
        }

        // Reset jump flag when grounded
        if (isGrounded) {
            this.hasJumped = false;
        }

        // === CROUCH ===
        if (isGrounded && isCrouch && this.player.touchActive && this.player.playerBody.velocity.y >= 0) {
            let anim = "crouch";

            if (isCharging && currentMana >= costFireballMana && this.chargedFireball) {
                anim = isFullyCharged ? "crouchWalkOnCharged" : "crouchWalkOnCharging";
            } else if (isMoving) {
                anim = "crouchWalk";
            }

            this.player.play(anim, true);
            this.player.playerBody.setSize(18, 22);
            this.player.playerBody.setOffset(0, 10);
            return;
        }

        // === RUN ===
        if (isGrounded && isMoving && !isCrouch) {
            if (isCharging && currentMana >= costFireballMana && this.chargedFireball) {
                this.player.play(isFullyCharged ? "runCharged" : "runOnCharging", true);
            } else {
                this.player.play("run", true);
            }

            if (currentTime - this.lastWalkSoundTime > this.walkSoundInterval) {
                this.scene.sound.play('walkSound', { volume: 0.1 });
                this.lastWalkSoundTime = currentTime;
            }
            return;
        }

        // === IDLE ===
        if (isGrounded && !isMoving && !isCrouch) {
            if (isCharging && currentMana >= costFireballMana && this.chargedFireball) {
                this.player.play(isFullyCharged ? "idleOnCharged" : "idleOnCharging", true);
            } else {
                this.player.play("idle", true);
            }
            return;
        }
    }
}
