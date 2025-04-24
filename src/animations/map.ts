function createMapAnimations(scene: Phaser.Scene) {
    if (!scene.anims.exists('waterAnimTop')) {
        scene.anims.create({  
            key: 'waterAnimTop',
            frames: scene.anims.generateFrameNumbers('waterAnimTop', { start: 0, end: 10 }), // <- CORRIGÉ
            frameRate: 10,
            repeat: -1
        });
    } else {
        console.log("Animation 'waterAnimTop' already exists.");
    }

    if (!scene.anims.exists('waterAnimBot')) {
        scene.anims.create({ 
            key: 'waterAnimBot',
            frames: scene.anims.generateFrameNumbers('waterAnimBot', { start: 0, end: 10 }), // <- CORRIGÉ
            frameRate: 10,
            repeat: -1
        });
    } else {
        console.log("Animation 'waterAnimBot' already exists.");
    }
}

export { createMapAnimations };
