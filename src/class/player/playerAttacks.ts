import Player from "@/class/player/Player";
import { PhaserKeyBindings } from "@/types/keysManager";
import { FireballState } from "@/types/player";
import SlashAttack from "./attacks/SlashAttack";
import Fireball from "./attacks/Fireball";
import {Start} from '@/phaser/scenes/Start';

export default class PlayerAttacks
{
    private player:Player
    private keys: PhaserKeyBindings;
    private fireball: FireballState;
    private scene: Start;

    constructor(player:Player, keys:PhaserKeyBindings, scene: Start)
    {
        this.player = player;
        this.keys = keys;
        this.scene = scene;
        this.fireball = 
        {
            fireCharge: false,
            spellChargeTimer: null,
            fireballCost : 5,
            chargedFireballCost : 10
          };
    }

    update()
    {
        this.attackSystem();
    }


    private attackSystem() 
    {
        if (Phaser.Input.Keyboard.JustDown(this.keys.SPELL1)) 
        {
            this.fireball.fireCharge = false;
            this.fireball.spellChargeTimer = this.player.scene.time.delayedCall(1500, () => {
                this.fireball.fireCharge = true;
            });
        }
    
        if (Phaser.Input.Keyboard.JustUp(this.keys.ATK)) 
        {
            this.slashAttack();
        }
    
        if (Phaser.Input.Keyboard.JustUp(this.keys.SPELL1)) 
        {
            const currentMana = this.player.manaPoint;
        
            if (this.fireball.fireCharge && currentMana >= this.fireball.chargedFireballCost) 
            {
                this.player.useMana = this.fireball.chargedFireballCost; 
                this.fireBallShoot(true);
            }
            else if (currentMana >= this.fireball.fireballCost && !this.fireball.fireCharge) 
            {
                this.player.useMana = this.fireball.fireballCost;
                this.fireBallShoot(false);
                console.log("Mana:", this.player.manaPoint);
            }
        
            if (this.fireball.spellChargeTimer) 
            {
                this.fireball.spellChargeTimer.remove(false);
                this.fireball.spellChargeTimer = null;
            }
        
            this.fireball.fireCharge = false;
        }
}        
    
    private slashAttack() 
    {
        new SlashAttack(this.scene as Start, this.player.x, this.player.y , this.player.flipX ? -1 : 1);
    }

    private fireBallShoot(charged: boolean) 
    {
        new Fireball(this.scene as Start, this.player.x, this.player.y, 500, this.player.flipX ? -1 : 1, charged);
    }

    get isChargingFireball(): boolean 
    {
        return this.keys.SPELL1.isDown;
    }
    
    get isFireballCharged(): boolean 
    {
        return this.fireball.fireCharge;
    }

    get chargedFireballCost():number
    {
        return this.fireball.chargedFireballCost
    }
}