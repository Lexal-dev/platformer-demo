import Player from "@/class/player/Player";
import { Start } from "@/phaser/scenes/Start";

export default function spikesInit(
  spikeLayer: Phaser.Tilemaps.TilemapLayer,
  player: Player,
  scene: Start
) {
  try 
  {
    if (!spikeLayer) return;

    // === SPIKES TOP ===
    spikeLayer.forEachTile(tile => {
        if (tile.index === 37) {
            const wall = scene.add.zone(tile.getCenterX(), tile.getCenterY() - 6, tile.width - 5.5, tile.height - 5);
            const spikeBox = scene.add.zone( tile.getCenterX(), tile.pixelY + tile.height * 0.70, tile.width * 0.70, tile.height * 0.30);

            scene.physics.add.existing(wall, true);
            scene.physics.add.existing(spikeBox, true);

            scene.physics.add.collider(wall, player);
            scene.physics.add.overlap(spikeBox, player, () => {
              if (!player.hasHit) {
                player.knockBack(300, "top", 5);
              }
            });
        }
    });

    // === SPIKES BOTTOM ===
    spikeLayer.forEachTile(tile => {
        if (tile.index === 52) {
            const wall = scene.add.zone( tile.getCenterX(), tile.getCenterY() + 6, tile.width - 5.5, tile.height - 5);
            const spikeBox = scene.add.zone(tile.getCenterX(),tile.pixelY + tile.height * 0.3, tile.width * 0.70, tile.height * 0.30);
  
            scene.physics.add.existing(wall, true);
            scene.physics.add.existing(spikeBox, true);
  
            scene.physics.add.collider(wall, player);
            scene.physics.add.overlap(spikeBox, player, () => {
                if (!player.hasHit) {
                    player.knockBack(300, "bottom", 5);
                }
            });
        }
    });

    // === SPIKES LEFT ===
    spikeLayer.forEachTile(tile => {
        if (tile.index === 38) {
            const wall = scene.add.zone(tile.getCenterX() - 6, tile.getCenterY(), tile.width - 5, tile.height - 5.5);
            const spikeBox = scene.add.zone( tile.pixelX + tile.width * 0.70, tile.getCenterY(), tile.width * 0.30, tile.height * 0.70);
  
            scene.physics.add.existing(wall, true);
            scene.physics.add.existing(spikeBox, true);
  
            scene.physics.add.collider(wall, player);
            scene.physics.add.overlap(spikeBox, player, () => {
                if (!player.hasHit) {
                    player.knockBack(300, "left", 5);
                }
            });
        }
    });

    // === SPIKES RIGHT ===
    spikeLayer.forEachTile(tile => {
        if (tile.index === 53) {

            const wall = scene.add.zone(tile.getCenterX() + 6, tile.getCenterY(), tile.width - 5, tile.height - 5.5);
            const spikeBox = scene.add.zone(tile.pixelX + tile.width * 0.3, tile.getCenterY(), tile.width * 0.30, tile.height * 0.70);
        
            scene.physics.add.existing(wall, true);
            scene.physics.add.existing(spikeBox, true);
        
            scene.physics.add.collider(wall, player);
            scene.physics.add.overlap(spikeBox, player, () => {
                if (!player.hasHit) {
                  player.knockBack(300, "right", 5);
                }
            });
        }
    });
  } catch (err) {
    console.error("Erreur lors de l'init des spikes :", err);
  }
}