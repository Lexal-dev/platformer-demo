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
  }
  // Animation 'idle'
  if (!scene.anims.exists('idleOnCharging')) {
    scene.anims.create({
      key: 'idleOnCharging',
      frames: scene.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
      frameRate: 3,
      repeat: -1,
    });
  }

    // Animation 'idle'
    if (!scene.anims.exists('idleOnCharged')) {
      scene.anims.create({
        key: 'idleOnCharged',
        frames: scene.anims.generateFrameNumbers('player', { start: 4, end: 5 }),
        frameRate: 3,
        repeat: -1,
      });
    }

  // Animation 'run'
  if (!scene.anims.exists('run')) {
    scene.anims.create({
      key: 'run',
      frames: scene.anims.generateFrameNumbers('playerRun', { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  // Animation 'run is charging'
  if (!scene.anims.exists('runOnCharging')) {
    scene.anims.create({
      key: 'runOnCharging',
      frames: scene.anims.generateFrameNumbers('playerRun', { start: 7, end: 13 }),
      frameRate: 10,
      repeat: -1,
    });
  }

    // Animation 'run charged'
    if (!scene.anims.exists('runCharged')) {
      scene.anims.create({
        key: 'runCharged',
        frames: scene.anims.generateFrameNumbers('playerRun', { start: 14, end: 20 }),
        frameRate: 10,
        repeat: -1,
      });
    }

  // Animation 'endJump'
  if (!scene.anims.exists('endJump')) {
    scene.anims.create({
      key: 'endJump',
      frames: [{ key: 'playerJump', frame: 0 }],
      frameRate: 0,
      repeat: 0,
    });
  }

    // Animation 'endJump is charging'
    if (!scene.anims.exists('endJumpOnCharging')) {
      scene.anims.create({
        key: 'endJumpOnCharging',
        frames: scene.anims.generateFrameNumbers('playerJump', { start: 1, end: 2 }),
        frameRate: 10,
        repeat: -1,
      });
    }
  
    // Animation 'endJump'
    if (!scene.anims.exists('endJumpOnCharged')) {
      scene.anims.create({
        key: 'endJumpOnCharged',
        frames: [{ key: 'playerJump', frame: 3 }],
        frameRate: 0,
        repeat: 0,
      });
    }

  // Animation 'crouch idle'
  if (!scene.anims.exists('crouch')) {
    scene.anims.create({
      key: 'crouch',
      frames: [{ key: 'playerCrouch', frame: 0 }],
      frameRate: 0,
      repeat: 0,
    });
  }

  // Animation 'crouch walk'
  if (!scene.anims.exists('crouchWalk')) {
    scene.anims.create({
      key: 'crouchWalk',
      frames: scene.anims.generateFrameNumbers('playerCrouch', { start: 1, end: 2 }), 
      frameRate: 5,
      repeat: -1,
    });
  }

    // Animation 'crouch walk On Charging'
    if (!scene.anims.exists('crouchWalkOnCharging')) {
      scene.anims.create({
        key: 'crouchWalkOnCharging',
        frames: scene.anims.generateFrameNumbers('playerCrouch', { start: 3, end: 4 }), 
        frameRate: 10,
        repeat: -1,
      });
    }

      // Animation 'crouch Walk On Charged'
  if (!scene.anims.exists('crouchWalkOnCharged')) {
    scene.anims.create({
      key: 'crouchWalkOnCharged',
      frames: scene.anims.generateFrameNumbers('playerCrouch', { start: 5, end: 6 }), 
      frameRate: 10,
      repeat: -1,
    });
  }



  // Animate Slash
  if(!scene.anims.exists('slashAttack'))
    {
        scene.anims.create({
        key: 'slashAttack',
        frames: scene.anims.generateFrameNumbers('slashAttack', { start: 0, end:  10 }),
        frameRate: 100,
        repeat: 0,
        hideOnComplete: false
    });
  }
  // Animate Fireball
  if (!scene.anims.exists('fireball')) {
    scene.anims.create({
        key: 'fireball',
        frames: scene.anims.generateFrameNumbers('fireball', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
}
}