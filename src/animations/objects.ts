function createCanonsAnimation(scene: Phaser.Scene) {
    if (!scene.anims.exists('canonShootSide')) {
        scene.anims.create({
            key: 'canonShootSide',
            frames: scene.anims.generateFrameNumbers('canonSheet', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: 0
        });
    } else {
        console.log("Animation 'canonShootSide' already exists.");
    }

    if (!scene.anims.exists('canonTopDown')) {
        scene.anims.create({
            key: 'canonTopDown',
            frames: scene.anims.generateFrameNumbers('canonSheet', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
    } else {
        console.log("Animation 'canonTopDown' already exists.");
    }

    if (!scene.anims.exists('diskSheet')) {
        scene.anims.create({
            key: 'diskSheet',
            frames: scene.anims.generateFrameNumbers('diskSheet', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: 0
        });
    } else {
        console.log("Animation 'diskSheet' already exists.");
    }
}

function createCoinsAnimation(scene: Phaser.Scene) {
    if (!scene.anims.exists('coins')) {
        scene.anims.create({
            key: 'coins',
            frames: scene.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });
    } else {
        console.log("Animation 'coins' already exists.");
    }
}

function createBarilsAnimation(scene: Phaser.Scene) {
    if (!scene.anims.exists('destroyBaril')) {
        scene.anims.create({
            key: 'destroyBaril',
            frames: scene.anims.generateFrameNumbers('destroyBaril', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: 0
        });
    } else {
        console.log("Animation 'destroyBaril' already exists.");
    }
}

function createBoxsAnimation(scene: Phaser.Scene) {
    if (!scene.anims.exists('destroyBox')) {
        scene.anims.create({
            key: 'destroyBox',
            frames: scene.anims.generateFrameNumbers('destroyBox', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: 0
        });
    } else {
        console.log("Animation 'destroyBox' already exists.");
    }
}

function createJumperAnimation(scene: Phaser.Scene) {
    if (!scene.anims.exists('jumperFull')) {
        scene.anims.create({
            key: 'jumperFull',
            frames: scene.anims.generateFrameNumbers('jumper', { start: 0, end: 17 }),
            frameRate: 30,
            repeat: 0
        });
    } else {
        console.log("Animation 'jumperFull' already exists.");
    }

    if (!scene.anims.exists('jumperOnCrouch')) {
        scene.anims.create({
            key: 'jumperOnCrouch',
            frames: scene.anims.generateFrameNumbers('jumper', { start: 0, end: 6 }),
            frameRate: 30,
            repeat: 0
        });
    } else {
        console.log("Animation 'jumperOnCrouch' already exists.");
    }
}

function createJumperKingAnimation(scene: Phaser.Scene) {
    if (!scene.anims.exists('kingJumper')) {
        scene.anims.create({
            key: 'kingJumper',
            frames: scene.anims.generateFrameNumbers('kingJumper', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
    } else {
        console.log("Animation 'kingJumper' already exists.");
    }
}

export { createCanonsAnimation, createCoinsAnimation, createBarilsAnimation, createBoxsAnimation, createJumperAnimation, createJumperKingAnimation };