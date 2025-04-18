export function createLayerWithHandling(
  map: Phaser.Tilemaps.Tilemap,
  layerName: string,
  tilesets: Phaser.Tilemaps.Tileset[], 
  depth: number = 0
): Phaser.Tilemaps.TilemapLayer | null {
  try {
    // Créer la couche
    const layer = map.createLayer(layerName, tilesets, 0, 0);

    if (layer) {
      // Appliquer la collision si la propriété est définie sur la couche
      if (layer.setCollisionByProperty) {
        layer.setCollisionByProperty({ isGrounded: true });
      }
      // Définir la profondeur de la couche
      layer.setDepth(depth);

      // Retourner la couche créée
      return layer;
    }

    // Retourner null si la couche ne peut pas être créée
    return null;
  } catch (error) {
    console.error(`Erreur lors de la création de la couche '${layerName}':`, error);
    return null; // Retourner null en cas d'erreur
  }
}