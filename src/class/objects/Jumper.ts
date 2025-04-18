import Player from "@/class/player/Player";

export default class Jumper extends Phaser.Physics.Arcade.Sprite {
    private player: Player;

    constructor(scene: Phaser.Scene, x:number, y:number, player:Player) 
    {
        super(scene, x, y, 'kingJumper', 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

     
        this.player = player
        this.setScale(2);
        this.setSize(11, 10);
        this.setOffset(0, 8);

        this.setGravityY(800);
        this.setImmovable(true);


        this.play('kingJumper', true);
        this.scene.events.on('update', this.update, this)

        scene.physics.add.collider(this, this.player);
    }

    update()
    {

        if (this.body)
        {
            if(this.body.touching.up && this.player.playerBody.touching.down && !this.player.onCrouch)
            {
                this.scene.sound.play('jumperSound', {
                    volume: 0.4,
                    rate: 1
                });
                this.player.forcedJump(-500)
            }
        }
    }
}