import Phaser from 'phaser';

export function createPlayerAnimations(scene: Phaser.Scene) {
    // Animation 'idle'
    if (!scene.anims.exists('idle')) {
        scene.anims.create({
            key: 'idle',
            frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1,
        });
    } else {
        console.log("Animation 'idle' already exists.");
    }

    // Animation 'idleOnCharging'
    if (!scene.anims.exists('idleOnCharging')) {
        scene.anims.create({
            key: 'idleOnCharging',
            frames: scene.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
            frameRate: 3,
            repeat: -1,
        });
    } else {
        console.log("Animation 'idleOnCharging' already exists.");
    }

    // Animation 'idleOnCharged'
    if (!scene.anims.exists('idleOnCharged')) {
        scene.anims.create({
            key: 'idleOnCharged',
            frames: scene.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
            frameRate: 3,
            repeat: -1,
        });
    } else {
        console.log("Animation 'idleOnCharged' already exists.");
    }

    // Animation 'run'
    if (!scene.anims.exists('run')) {
        scene.anims.create({
            key: 'run',
            frames: scene.anims.generateFrameNumbers('playerRun', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1,
        });
    } else {
        console.log("Animation 'run' already exists.");
    }

    // Animation 'runOnCharging'
    if (!scene.anims.exists('runOnCharging')) {
        scene.anims.create({
            key: 'runOnCharging',
            frames: scene.anims.generateFrameNumbers('playerRun', { start: 7, end: 13 }),
            frameRate: 10,
            repeat: -1,
        });
    } else {
        console.log("Animation 'runOnCharging' already exists.");
    }

    // Animation 'runCharged'
    if (!scene.anims.exists('runCharged')) {
        scene.anims.create({
            key: 'runCharged',
            frames: scene.anims.generateFrameNumbers('playerRun', { start: 14, end: 20 }),
            frameRate: 10,
            repeat: -1,
        });
    } else {
        console.log("Animation 'runCharged' already exists.");
    }

    // Animation 'endJump'
    if (!scene.anims.exists('endJump')) {
        scene.anims.create({
            key: 'endJump',
            frames: [{ key: 'playerJump', frame: 0 }],
            frameRate: 0,
            repeat: 0,
        });
    } else {
        console.log("Animation 'endJump' already exists.");
    }

    // Animation 'endJumpOnCharging'
    if (!scene.anims.exists('endJumpOnCharging')) {
        scene.anims.create({
            key: 'endJumpOnCharging',
            frames: scene.anims.generateFrameNumbers('playerJump', { start: 1, end: 2 }),
            frameRate: 10,
            repeat: -1,
        });
    } else {
        console.log("Animation 'endJumpOnCharging' already exists.");
    }

    // Animation 'endJumpOnCharged'
    if (!scene.anims.exists('endJumpOnCharged')) {
        scene.anims.create({
            key: 'endJumpOnCharged',
            frames: [{ key: 'playerJump', frame: 3 }],
            frameRate: 0,
            repeat: 0,
        });
    } else {
        console.log("Animation 'endJumpOnCharged' already exists.");
    }

    // Animation 'crouch'
    if (!scene.anims.exists('crouch')) {
        scene.anims.create({
            key: 'crouch',
            frames: [{ key: 'playerCrouch', frame: 0 }],
            frameRate: 0,
            repeat: 0,
        });
    } else {
        console.log("Animation 'crouch' already exists.");
    }

    // Animation 'crouchWalk'
    if (!scene.anims.exists('crouchWalk')) {
        scene.anims.create({
            key: 'crouchWalk',
            frames: scene.anims.generateFrameNumbers('playerCrouch', { start: 1, end: 2 }),
            frameRate: 5,
            repeat: -1,
        });
    } else {
        console.log("Animation 'crouchWalk' already exists.");
    }

    // Animation 'crouchWalkOnCharging'
    if (!scene.anims.exists('crouchWalkOnCharging')) {
        scene.anims.create({
            key: 'crouchWalkOnCharging',
            frames: scene.anims.generateFrameNumbers('playerCrouch', { start: 3, end: 4 }),
            frameRate: 10,
            repeat: -1,
        });
    } else {
        console.log("Animation 'crouchWalkOnCharging' already exists.");
    }

    // Animation 'crouchWalkOnCharged'
    if (!scene.anims.exists('crouchWalkOnCharged')) {
        scene.anims.create({
            key: 'crouchWalkOnCharged',
            frames: scene.anims.generateFrameNumbers('playerCrouch', { start: 5, end: 6 }),
            frameRate: 10,
            repeat: -1,
        });
    } else {
        console.log("Animation 'crouchWalkOnCharged' already exists.");
    }

    // Animate Slash
    if (!scene.anims.exists('slashAttack')) {
        scene.anims.create({
            key: 'slashAttack',
            frames: scene.anims.generateFrameNumbers('slashAttack', { start: 0, end: 10 }),
            frameRate: 120,
            repeat: 0,
            hideOnComplete: false,
        });
    } else {
        console.log("Animation 'slashAttack' already exists.");
    }

    // Animate Fireball
    if (!scene.anims.exists('fireball')) {
        scene.anims.create({
            key: 'fireball',
            frames: scene.anims.generateFrameNumbers('fireball', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });
    } else {
        console.log("Animation 'fireball' already exists.");
    }
}
