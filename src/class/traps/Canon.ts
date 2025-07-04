import Disk from '@/class/projectiles/Disk';
import { Start } from '@/phaser/scenes/Start';
import Player from '../player/Player';

export default class Canon extends Phaser.Physics.Arcade.Sprite 
{
    private isSide: boolean;
    private direction: boolean;
    private shootingDelay: number;
    private player: Player;
    private _onFire: boolean;

    constructor(scene: Start, x: number, y: number, direction: boolean, isSide: boolean, shootingDelay: number, player: Player) 
    {
        super(scene, x, y, 'canonSheet');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.player = player;
        this.isSide = isSide;
        this.scene = scene;
        this.direction = direction;
        this.shootingDelay = shootingDelay;
        this._onFire = false;
        this.setImmovable(true);
        this.setDepth(2);
        this.isSide ? this.setFlipX(direction) : this.setFlipY(!direction);

        this.scene.time.addEvent(
        {
            delay: this.shootingDelay,
            callback: this.fire,
            callbackScope: this,
            loop: true
        });
    }

    fire() 
    {
        if(!this._onFire) return;
        const dir = this.direction ? 1 : -1;
        const offSetX = dir * 20;
        const offSetY = dir * 20;
    
        this.isSide ? this.play('canonShootSide', true) : this.play('canonTopDown', true);
    
        const startScene = this.scene as Start;
    
        const shoot = new Disk( startScene, this.isSide ? this.x + offSetX : this.x, this.isSide ? this.y : this.y + offSetY, dir, this.isSide, 500, this.player
        );
    
        startScene.projectiles.add(shoot);
    
        this.scene.sound.play('canonSound', {
            volume: 0.2,
            rate: 1
        });
    
        if (this.scene.physics.world.overlap(this, this.player)) 
        {
            let knockBackDir: "left" | "right" | "bottom" | "top";


            if (this.isSide) 
            {
                knockBackDir = dir === 1 ? "left" : "right"; 
            } 
            else 
            {
                knockBackDir = dir === 1 ? "bottom" : "top";  
            }
        
            // Appliquer le knockback
            this.player.knockBack(300, knockBackDir, 5, 150);
        }
    }

    get onFire():boolean
    {
        return this._onFire;
    }

    set onFire(boolean:boolean)
    {
        this._onFire = boolean;
    }
}
