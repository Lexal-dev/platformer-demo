import { Direction, MovementState, PlayerStats } from '@/types/player';
import PlayerController from '@/class/player/PlayerController';
import KeyManager from '@/class/KeysManager';
import { PhaserKeyBindings } from '@/types/keysManager';
import PlayerAttacks from './playerAttacks';
import { Start } from '@/phaser/scenes/Start';
import PlayerAnimations from './PlayerAnimations';



export default class Player extends Phaser.Physics.Arcade.Sprite {
    private keys: PhaserKeyBindings;
    private playerController: PlayerController;
    private playerAttacks: PlayerAttacks;
    private playerAnimations: PlayerAnimations;
    private hitting: boolean;
    #movement: MovementState;
    #stats: PlayerStats;
  
    constructor(scene: Phaser.Scene, x: number, y: number, keyManager: KeyManager ) {
        super(scene, x, y, 'player');

        scene.add.existing(this);
        scene.physics.add.existing(this);
        

        this.setCollideWorldBounds(true);
        this.setGravityY(800);
        this.keys = keyManager.getKeys();   
        this.playerController = new PlayerController(this, this.keys, scene as Start)
        this.playerAttacks = new PlayerAttacks(this, this.keys, scene as Start)
        this.playerAnimations = new PlayerAnimations(this, scene as Start, this.playerAttacks);
        this.hitting = false;

        this.#movement = {
          speed: 150,
          lastDirection: 'default',
          onPushKey: 'default',
          jumpReady: true,
          doubleJumpReady: true,
          onSlide: false,
          onWallJump: false,
          onCrouch: false,
          onCrouchDisable: false,
          dashUp: true,
          isDashing: false,
          onWater: false,
          touchActive: true,
        };


        this.#stats = {
          coins: 0,
          lifePoint: 50,
          lifePointMax: 50,
          manaPoint: 20,
          manaPointMax: 20,
        };
    }
  
    update():void 
    {
        if (!this.body) return; 
        if (this.body.velocity.x !== 0) {
            this.flipX = this.body.velocity.x < 0;
        }   
        if(!this.touchActive) {
            return;
        }   
        this.playerController.update();
        this.playerAttacks.update();
        this.playerAnimations.update();
    }
  

    public knockBack(knockbackForce: number, knockbackDirection: 'top' | 'bottom' | 'left' | 'right', hitLife: number = 0) 
    {
        this.setTinted(100);

        this.scene.time.delayedCall(10, () => {
            switch (knockbackDirection) {
                case 'top':
                    this.setVelocityY(knockbackForce);
                    break;
                case 'bottom':
                    this.setVelocityY(-knockbackForce);
                    break;
                case 'left':
                    this.setVelocityX(knockbackForce);
                    this.setVelocityY(-200); 
                    break;
                case 'right':
                    this.setVelocityX(-knockbackForce);
                    this.setVelocityY(-200);
                    break;
            }
        });
    
        if (hitLife !== 0) {
            this.takeDamage = hitLife;
        }
    }

    public setTinted(time: number) 
    {
        this.touchActive = false;
        this.hasHit = true;
        this.setTint(0xff0000);
        this.scene.sound.play('playerHitSound', {
            volume: 0.3,
            rate: 1
        });

        this.scene.time.delayedCall(time, () => {
            this.touchActive = true;
            this.hasHit = false;
            this.clearTint();
            this.setVelocityX(0);
        });
    }
    

    public forcedJump(strengh:number)
    {
        this.touchActive = false;

        if(!this.touchActive)
        {
            this.setVelocityY(strengh);
        }
        
        this.scene.time.delayedCall(200, () => {
            this.touchActive = true;
        })
    }

    // HasHit
    get hasHit(): boolean
    {
        return this.hitting;
    }

    set hasHit(boolean: boolean)
    {
        this.hitting = boolean;
    }

    // BODY MANAGEMENT
    get playerBody(): Phaser.Physics.Arcade.Body {
        return this.body as Phaser.Physics.Arcade.Body;
    }


    // LIFE MANAGEMENT
    get lifePoint(): number 
    {
        return this.#stats.lifePoint;
    }

    get lifePointMax(): number {
        return this.#stats.lifePointMax;
    }

    set healing(healing: number) {
        if(healing <= 0 || healing % 1 !== 0) return;
        this.#stats.lifePoint = Math.min(this.#stats.lifePoint + healing, this.#stats.lifePointMax);
    }

    set takeDamage(damage: number) {
        if (damage === 0 || damage % 1 !== 0 && !this.hasHit) return;
        const positiveDamage = Math.abs(damage); 
        this.#stats.lifePoint = Math.max(0, this.#stats.lifePoint - positiveDamage); 
    }


    // MANA MANAGEMENT

    get manaPoint(): number 
    {
        return this.#stats.manaPoint;
    }

    get manaPointMax(): number 
    {
        return this.#stats.manaPointMax;
    }

    set gainMana(mana: number)
    {
        if(mana <= 0  || mana % 1 !== 0) return;
        this.#stats.manaPoint = Math.min(this.#stats.manaPoint + mana, this.#stats.manaPointMax);
    }

    set useMana(amount: number) {
        if (amount === 0 || amount % 1 !== 0) return;
        const positiveAmount = Math.abs(amount); 
    
        if (this.#stats.manaPoint >= positiveAmount) {
            this.#stats.manaPoint -= positiveAmount; 
        }
    }



      
    // COINS MANAGEMENT
    get coins(): number 
    {
        return this.#stats.coins;
    } 

    set addCoins(amount: number)
    {
        if (amount === 0 || amount % 1 !== 0) return;
        const positiveAmount = Math.abs(amount); 
        this.#stats.coins += positiveAmount;
    }

    set removeCoins(amount: number) {
        if (amount === 0 || amount % 1 !== 0) return;
        this.#stats.coins = Math.max(0, this.#stats.coins - amount);  
    }

    // MOVEMENT MANAGEMENT
    get speed(): number 
    {
        return this.#movement.speed;
    }
    set speed(value: number)
    {
        if (value % 1 !== 0) return;
        this.#movement.speed = value;
    }

    get lastDirection(): Direction
    {
        return this.#movement.lastDirection;
    }
    set lastDirection(direction: Direction)
    {
        this.#movement.lastDirection = direction;
    }

    get onPushKey(): string
    {
        return this.#movement.onPushKey;
    }
    set onPushKey(key: string)
    {
        this.#movement.onPushKey = key;
    }

    get jumpReady(): boolean 
    {
        return this.#movement.jumpReady;
    }
    set jumpReady(boolean: boolean)
    {
        this.#movement.jumpReady = boolean;
    }

    get doubleJumpReady(): boolean 
    {
        return this.#movement.doubleJumpReady;
    }
    set doubleJumpReady(boolean: boolean)
    {
        this.#movement.doubleJumpReady = boolean;
    }

    get onSlide(): boolean 
    {
        return this.#movement.onSlide;
    }
    set onSlide(boolean: boolean)
    {
        this.#movement.onSlide = boolean;
    }

    get onWallJump(): boolean       
    {
        return this.#movement.onWallJump;
    }
    set onWallJump(boolean: boolean)
    {
        this.#movement.onWallJump = boolean;
    }

    get onCrouch(): boolean 
    {
        return this.#movement.onCrouch;
    }
    set onCrouch(boolean: boolean)
    {
        this.#movement.onCrouch = boolean;
    }

    get onCrouchDisable(): boolean
    {
        return this.#movement.onCrouchDisable
    }
    set onCrouchDisable(boolean: boolean)
    {
        this.#movement.onCrouchDisable = boolean
    }

    get dashUp(): boolean 
    {
        return this.#movement.dashUp;
    }
    set dashUp(boolean: boolean)
    {
        this.#movement.dashUp = boolean;
    }

    get isDashing(): boolean 
    {
        return this.#movement.isDashing;
    }
    set isDashing(boolean: boolean)
    {
        this.#movement.isDashing = boolean;
    }

    get onWater(): boolean 
    {
        return this.#movement.onWater;
    }
    set onWater(boolean: boolean)
    {
        this.#movement.onWater = boolean;
    }

    get touchActive(): boolean
    {
        return this.#movement.touchActive;
    }
    set touchActive(boolean: boolean)
    {
        this.#movement.touchActive = boolean;
    }
}