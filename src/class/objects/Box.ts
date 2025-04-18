import { Start } from '@/phaser/scenes/Start';
export default class Box extends Phaser.Physics.Arcade.Sprite {
    private boxBroken: boolean;
    
    constructor(scene: Phaser.Scene, x:number, y:number) {
        super(scene, x, y, 'destroyBox', 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene; 
        this.boxBroken = false;
        this.setDepth(9)
        this.setImmovable(true);

        
    }


    setBrokenBox() {
        if (!this.boxBroken) {
            this.setFrame(1);
            this.boxBroken = true;
            const type = Phaser.Math.Between(0, 1) === 0 ? 'life' : 'mana';
            const texture = type === 'life' ? 'lifeBall' : 'manaBall';
            this.scene.sound.play('crackWoodSound', {
                volume: 0.3,
                rate: 1
              });
            // Appel de spawnRestoreBalls avec le bon groupe (this.scene.restoreBalls)
            (this.scene as Start).spawnRestoreBalls(
                { x: this.x, y: this.y },
                (this.scene as Start).restoreBalls,
                texture,
                type,
                3
            );
            
        } else {
            const type = Phaser.Math.Between(0, 1) === 0 ? 'life' : 'mana';
            const texture = type === 'life' ? 'lifeBall' : 'manaBall';
            this.scene.sound.play('crackWoodSound', {
                volume: 0.3,
                rate: 1
              });
            // Appel de spawnRestoreBalls avec le bon groupe (this.scene.restoreBalls)
            (this.scene as Start).spawnRestoreBalls(
                { x: this.x, y: this.y },
                (this.scene as Start).restoreBalls,  // Passage du bon groupe ici
                texture,
                type,
                4
            );
            this.destroy();
        }
    }
}
