import Phaser from 'phaser';

type ArcadeCallback = Phaser.Types.Physics.Arcade.ArcadePhysicsCallback;
type ProcessCallback = Phaser.Types.Physics.Arcade.ArcadePhysicsCallback;
type GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;

function safeCollider(
  scene: Phaser.Scene,
  obj1: GameObjectWithBody | undefined,
  obj2: GameObjectWithBody | undefined,
  callback?: ArcadeCallback,
  processCallback?: ProcessCallback,
  context: any = null
): Phaser.Physics.Arcade.Collider | null {
  if (!obj1 || !obj2) {
    console.warn('⚠️ safeCollider - Un des objets est invalide :', { obj1, obj2 });
    return null;
  }

  try {
    return scene.physics.add.collider(obj1, obj2, callback, processCallback, context);
  } catch (err) {
    console.error('❌ Erreur lors du collider :', err);
    return null;
  }
}

function safeOverlap(
  scene: Phaser.Scene,
  obj1: GameObjectWithBody | undefined,
  obj2: GameObjectWithBody | undefined,
  callback?: ArcadeCallback,
  processCallback?: ProcessCallback,
  context: any = null
): Phaser.Physics.Arcade.Collider | null {
  if (!obj1 || !obj2) {
    console.warn('⚠️ safeOverlap - Un des objets est invalide :', { obj1, obj2 });
    return null;
  }

  try {
    return scene.physics.add.overlap(obj1, obj2, callback, processCallback, context);
  } catch (err) {
    console.error('❌ Erreur lors de l’overlap :', err);
    return null;
  }
}

export { safeCollider, safeOverlap };
