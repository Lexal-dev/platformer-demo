export default function createEnemysAnimations(scene: Phaser.Scene) {

    if (!scene.anims.exists('slimeRun')) {
        scene.anims.create({
            key: 'slimeRun',
            frames: scene.anims.generateFrameNumbers('slimes', { start: 0, end: 1 }),  // Frames 0 et 1
            frameRate: 6,
            repeat: -1 
        });
    } else {
        console.log("Animation 'slimeRun' already exists.");
    }

    if (!scene.anims.exists('ghostRun')) {
        scene.anims.create({
            key: 'ghostRun',
            frames: scene.anims.generateFrameNumbers('ghosts', { start: 0, end: 1 }),  // Frames 0 et 1
            frameRate: 6,
            repeat: 0 
        });
    } else {
        console.log("Animation 'ghostRun' already exists.");
    }

    if (!scene.anims.exists('kingSlimeIdle')) {
        scene.anims.create({
            key: 'kingSlimeIdle',
            frames: scene.anims.generateFrameNumbers('kingSlime', { start: 0, end: 1 }),  // Frames 0 et 1
            frameRate: 3,
            repeat: -1 
        });
    } else {
        console.log("Animation 'kingSlimeIdle' already exists.");
    }

    if (!scene.anims.exists('ghostBall')) {
        scene.anims.create({
            key: 'ghostBall',
            frames: scene.anims.generateFrameNumbers('ghostBall', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
    } else {
        console.log("Animation 'ghostBall' already exists.");
    }

    if (!scene.anims.exists('kingWave')) {
        scene.anims.create({
            key: 'kingWave',
            frames: scene.anims.generateFrameNumbers('kingWave', { start: 0, end: 1 }),
            frameRate: 6,
            repeat: -1
        });
    } else {
        console.log("Animation 'kingWave' already exists.");
    }
}
