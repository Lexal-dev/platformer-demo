import Player from "@/class/player/Player";

export default class Jumper extends Phaser.Physics.Arcade.Sprite {
    private player: Player;
    private startY: number;
    private isLocked: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, player: Player) {
        super(scene, x, y, 'jumper', 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.player = player;
        this.startY = y;
        this.setScale(2);
        this.setGravityY(800);
        this.setImmovable(true);
        
        this.setFrame(0);
        this.scene.events.on('update', this.update, this);
        scene.physics.add.collider(this, this.player);
    }

    update() {
        if (
            this.body &&
            this.player.playerBody &&
            this.player.playerBody.touching.down &&
            this.body.touching.up &&
            !this.isLocked
        ) {
            const newHeight = this.height * 0.35;  
            this.body.setSize(this.width, newHeight); 
            this.body.setOffset(0, this.height - newHeight); 
            this.setFrame(6);
        
            this.isLocked = true;
        
            const checkRelease = () => {
                const isStillTouching = this.player.playerBody.touching.down && this.body?.touching.up;

                if (!isStillTouching ) {
                    this.setFrame(0);
                    this.body?.setSize(this.width, this.height);
                    this.body?.setOffset(0, 0);
                    this.isLocked = false;
                    const spaceKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
                    if (spaceKey?.isDown) {
                        this.player.forcedJump(-600);
                    }
                } else {
                    this.scene.time.delayedCall(100, checkRelease);
                }
            };

            this.scene.time.delayedCall(300, checkRelease);
        }
    }
}
