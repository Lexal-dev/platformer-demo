import Phaser from 'phaser';
import Player from '../player/Player';

type RestoreType = 'life' | 'mana';

export default class RestoreBall extends Phaser.Physics.Arcade.Sprite {
    private restorationType: RestoreType;
    private gravity: number;
    private player: Player;



    constructor(scene: Phaser.Scene, x: number, y: number,texture: string, restorationType: RestoreType, player: Player ) {
        super(scene, x, y, texture);

        this.player = player;
        this.restorationType = restorationType;
        this.gravity = 100;

        // Ajoute le sprite et son corps physique
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(false);
        const body = this.body as Phaser.Physics.Arcade.Body;
        if (body) {
            body.setAllowGravity(true);
            body.setBounce(0.4);
        }

        this.setDepth(10);
        this.setCollideWorldBounds(true);
        this.setScale(0.5);

        scene.time.delayedCall(10000, () => {
            if (this.scene && this.active) {
                this.destroy();
            }
        });

        this.scene.events.on('update', this.update, this);

        this.scene.physics.add.overlap(this, this.player, () => {
            this.restore();
        });
        
    }

    update() {
        const body = this.body as Phaser.Physics.Arcade.Body;
        if (body && (body.gravity.y === 0 || body.bounce.y === 0)) {
            body.setGravityY(this.gravity);
            body.setBounce(0.3);
        }
    }

    restore() {
        if (!this.body) return;
        if (this.restorationType === 'mana' && this.player.manaPoint < this.player.manaPointMax) {
            this.player.gainMana = 2;
            this.scene.sound.play('manaSound', {
                volume: 0.3,
                rate: 1
              });
            this.destroy();
        }

        if (this.restorationType === 'life' && this.player.lifePoint < this.player.lifePointMax) {
            this.player.healing = 1;
            this.scene.sound.play('healSound', {
                volume: 0.3,
                rate: 1
              });
            this.destroy();
        }
    }
}
