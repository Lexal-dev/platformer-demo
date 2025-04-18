import { Start } from '@/phaser/scenes/Start';
import Player from '../player/Player';

export default class Coin extends Phaser.Physics.Arcade.Sprite {
    private coinSound: Phaser.Sound.BaseSound;

    constructor(scene: Start, x: number, y: number) {
        super(scene, x, y, 'coin', 0);
    
        scene.add.existing(this);
        scene.physics.add.existing(this);
    
        this.setImmovable(true);
        this.play('coins', true);
    
        this.coinSound = scene.sound.add('coinSound');
    
        this.scene.physics.add.overlap(this, scene.player, (coin, player) => {
            const castedPlayer = player as Player;
    
            if (this.coinSound.isPlaying) {
                this.coinSound.stop();
            }
    
            this.coinSound.play({
                volume: 0.2,
                rate: 1.2,
            });
    
            castedPlayer.addCoins = 1;
            coin.destroy();
        });
    }
    
}
