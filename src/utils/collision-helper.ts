import * as Phaser from 'phaser';

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
): Phaser.Physics.Arcade.Collider | null 
{
    // Check if any of the objects is invalid
    if (!obj1 || !obj2) 
    {
        console.warn('⚠️ safeCollider - One of the objects is invalid:', { obj1, obj2 });
        return null;
    }

    try 
    {
        return scene.physics.add.collider(obj1, obj2, callback, processCallback, context);
    } 
    catch (err) 
    {
        console.error('❌ Error during collider:', err);
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
    // Check if any of the objects is invalid
    if (!obj1 || !obj2) 
    {
        console.warn('⚠️ safeOverlap - One of the objects is invalid:', { obj1, obj2 });
        return null;
    }

    try 
    {
        return scene.physics.add.overlap(obj1, obj2, callback, processCallback, context);
    } catch (err) 
    {
        console.error('❌ Error during overlap:', err);
        return null;
    }
}

export { safeCollider, safeOverlap };
