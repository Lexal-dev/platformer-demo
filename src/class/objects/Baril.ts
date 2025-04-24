import RestoreBall from '@/class/objects/RestoreBall'
import { Start } from '@/phaser/scenes/Start';

export default class Baril extends Phaser.Physics.Arcade.Sprite 
{
    private barilBroken: boolean;
    
    constructor(scene: Phaser.Scene, x:number, y:number) 
    {
        super(scene, x, y, 'destroyBaril', 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.barilBroken = false;
        this.setDepth(9)
        this.setImmovable(true);
    }

    setBrokenBaril() {
        const type = Phaser.Math.Between(0, 1) === 0 ? 'life' : 'mana';
        const texture = type === 'life' ? 'lifeBall' : 'manaBall';
    
        this.scene.sound.play('crackWoodSound', 
        {
            volume: 0.3,
            rate: 1
        });
    
        const startScene = this.scene as Start;
    
        const ballCount = this.barilBroken ? 4 : 3;
        RestoreBall.spawnRestoreBalls(
            this.scene,
            { x: this.x, y: this.y },
            startScene.restoreBalls,
            texture,
            type,
            ballCount,
            startScene.player
        );
    
        if (!this.barilBroken) 
        {
            this.setFrame(1);
            this.barilBroken = true;
        } 
        else 
        {
            this.destroy();
        }
    }   
}
