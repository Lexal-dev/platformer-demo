import { Start } from '@/phaser/scenes/Start';
import RestoreBall from '@/class/objects/RestoreBall';
export default class Box extends Phaser.Physics.Arcade.Sprite 
{
    public boxBroken: boolean;
    
    constructor(scene: Phaser.Scene, x:number, y:number) 
    {
        super(scene, x, y, 'destroyBox', 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene; 
        this.boxBroken = false;
        this.setDepth(9)
        this.setImmovable(false);
        this.setGravityY(800)
        if(this.body)
        {
            this.body.pushable = false;
        }
    }


    setBrokenBox() 
    {
        const type = Phaser.Math.Between(0, 1) === 0 ? 'life' : 'mana';
        const texture = type === 'life' ? 'lifeBall' : 'manaBall';
        const startScene = this.scene as Start;
    
        this.scene.sound.play('crackWoodSound', 
        {
            volume: 0.3,
            rate: 1
        });
    
        const number = this.boxBroken ? 4 : 3;
        RestoreBall.spawnRestoreBalls(
            this.scene,
            { x: this.x, y: this.y },
            startScene.restoreBalls,
            texture,
            type,
            number,
            startScene.player
        );
    
        if (!this.boxBroken) 
            {
            this.setFrame(1);
            this.boxBroken = true;
        } 
        else 
        {
            this.destroy();
        }
    }
    
}
