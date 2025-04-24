import Player from "./player/Player";

export default class Camera {

    private ground: Phaser.Tilemaps.TilemapLayer;

    constructor(scene:Phaser.Scene, player: Player, ground: Phaser.Tilemaps.TilemapLayer) 
    {
        this.ground = ground;

        const map = this.ground.tilemap;
        const mapWidth = map.widthInPixels;
        const mapHeight = map.heightInPixels;

        scene.cameras.main.startFollow(player, true, 0.1, 0.1);
        scene.cameras.main.setFollowOffset(0, 0);
        scene.cameras.main.setLerp(0.1, 0.1); 
        scene.cameras.main.setZoom(4);

        scene.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    }
}
