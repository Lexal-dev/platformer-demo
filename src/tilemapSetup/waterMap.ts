import { Start } from "@/phaser/scenes/Start";

export default function waterInit(waterLayer: Phaser.Tilemaps.TilemapLayer, scene: Start, waterTilesGroup: Phaser.GameObjects.Group) {
    try {
        if (!waterLayer) return;

        waterLayer.forEachTile(tile => {
            const x = tile.getCenterX();
            const y = tile.getCenterY();

            // Eau en haut
            if (tile.index === 36) {
                waterLayer.removeTileAt(tile.x, tile.y);
                const waterTile = scene.add.sprite(x, y, 'waterAnimTop');
                waterTile.play('waterAnimTop', true);
                waterTile.setDepth(3);
                waterTile.setAlpha(0.65);
                waterTilesGroup.add(waterTile);
            }

            // Eau en bas
            if (tile.index === 51) {
                waterLayer.removeTileAt(tile.x, tile.y);
                const waterTile = scene.add.sprite(x, y, 'waterAnimBot');
                waterTile.play('waterAnimBot', true);
                waterTile.setDepth(4);
                waterTile.setAlpha(0.65);
                waterTilesGroup.add(waterTile);
            }
        });
    } catch (err) {
        console.error('Erreur lors de l\'initialisation de l\'eau :', err);
    }
}
