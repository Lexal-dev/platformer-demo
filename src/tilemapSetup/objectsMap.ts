import { Start } from "@/phaser/scenes/Start"; 
import Baril from "@/class/objects/Baril";
import Box from "@/class/objects/Box";
import Coin from "@/class/objects/Coin";

function frontOfPlayerLayerInit(
    frontOfPlayerLayer: Phaser.Tilemaps.TilemapLayer,
    scene: Start
): void { 
    try {
        if (!frontOfPlayerLayer) return;

        frontOfPlayerLayer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
            const x = tile.pixelX + 9;
            const y = tile.pixelY + 8;

            if (tile.index === 57) 
            {
                const baril = new Baril(scene, x, y);
                scene.barils.add(baril);
                frontOfPlayerLayer.removeTileAt(tile.x, tile.y); 
            }
            scene.barils.setDepth(3);

            if (tile.index === 59) 
            {
                const box = new Box(scene, x, y - 5);
                scene.boxs.add(box);
                box.setGravityY(800);
                frontOfPlayerLayer.removeTileAt(tile.x, tile.y);
            }
            scene.boxs.setDepth(3);
        });
    } catch (err) 
    {
        console.error("Erreur dans frontOfPlayerLayerInit:", err);
    }
}

function coinsInit(
    coinsLayer: Phaser.Tilemaps.TilemapLayer,
    scene: Start
): void {
    try {
        if (!coinsLayer) return;

        coinsLayer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
            const x = tile.pixelX + 9;
            const y = tile.pixelY;

            if (tile.index === 61) 
            {
                const coin = new Coin(scene, x, y + 8);
                scene.coins.add(coin); 
                coinsLayer.removeTileAt(tile.x, tile.y); 
            }
        });

        scene.coins.setDepth(3);
    } catch (err) 
    {
        console.error("Erreur dans coinsInit:", err);
    }
}

export { frontOfPlayerLayerInit, coinsInit };
