export function createLayerWithHandling(
  map: Phaser.Tilemaps.Tilemap,
  layerName: string,
  tilesets: Phaser.Tilemaps.Tileset[], 
  depth: number = 0
): Phaser.Tilemaps.TilemapLayer | null {
  try 
  {
      // Create the layer
      const layer = map.createLayer(layerName, tilesets, 0, 0);

      if (layer) 
      {
          // Apply collision if the property is defined on the layer
          if (layer.setCollisionByProperty) 
          {
              layer.setCollisionByProperty({ isGrounded: true });
          }
          // Set the layer's depth
          layer.setDepth(depth);

          // Return the created layer
          return layer;
      }

      // Return null if the layer cannot be created
      return null;
  } 
  catch (error) 
  {
      console.error(`Error while creating the layer '${layerName}':`, error);
      return null; // Return null in case of an error
  }
}
