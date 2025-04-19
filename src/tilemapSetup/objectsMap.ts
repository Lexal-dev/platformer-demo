import { Start } from "@/phaser/scenes/Start"; // Assure-toi que Start est bien importé
import Baril from "@/class/objects/Baril";
import Box from "@/class/objects/Box";

// Typage correct des paramètres de la fonction
export default function frontOfPlayerLayerInit(
  frontOfPlayerLayer: Phaser.Tilemaps.TilemapLayer,
  scene: Start // Assure-toi de bien passer la scène de type Start
): void { // Ajouter la signature de retour 'void'
  try {
    if (!frontOfPlayerLayer) return;

    frontOfPlayerLayer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
      const x = tile.pixelX + 9;
      const y = tile.pixelY + 8;

      if (tile.index === 57) {
        // Créer un baril
        const baril = new Baril(scene, x, y);
        scene.barils.add(baril);
        frontOfPlayerLayer.removeTileAt(tile.x, tile.y); // Suppression du tile du layer
      }

      if (tile.index === 59) {
        // Créer une caisse
        const box = new Box(scene, x, y);
        scene.boxs.add(box);
        frontOfPlayerLayer.removeTileAt(tile.x, tile.y); // Suppression du tile du layer
      }
    });
  } catch (err) {
    console.error("Erreur dans frontOfPlayerLayerInit:", err);
  }
}