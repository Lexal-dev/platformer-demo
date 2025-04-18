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

  // Animation 'run'
  if (!scene.anims.exists('run')) {
    scene.anims.create({
      key: 'run',
      frames: scene.anims.generateFrameNumbers('playerRun', { start: 1, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  // Animation 'jump'
  if (!scene.anims.exists('jump')) {
    scene.anims.create({
      key: 'jump',
      frames: scene.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
      frameRate: 10,
    });
  }

  // Animation 'endJump'
  if (!scene.anims.exists('endJump')) {
    scene.anims.create({
      key: 'endJump',
      frames: [{ key: 'player', frame: 2 }],
      frameRate: 1,
      repeat: 0,
    });
  }

  // Animation 'crouch'
  if (!scene.anims.exists('crouch')) {
    scene.anims.create({
      key: 'crouch',
      frames: scene.anims.generateFrameNumbers('player', { start: 3, end: 5 }), 
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