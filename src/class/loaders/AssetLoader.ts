export default class AssetLoader 
{
  constructor(scene: Phaser.Scene) 
  {
      // --- Tilemap & Layers ------------------------
      this.loadTilemap(scene);
      this.loadTileImages(scene);

      // --- Sprites & Map Elements -------------------
      this.loadMapElements(scene);
      this.loadDestructibleObjects(scene);

      // --- Player Sprites & Animations --------------
      this.loadPlayerSprites(scene);

      // --- Enemy Sprites & Animations ---------------
      this.loadEnemySprites(scene);

      // --- Sounds -----------------------------------
      this.loadSounds(scene);

      // --- Music ------------------------------------
      this.loadMusic(scene);
  }

  // --- Load Tilemap & Layers ------------------------
  private loadTilemap(scene: Phaser.Scene) 
  {
      scene.load.tilemapTiledJSON('start', '/assets/map/Start.tmj');
  }

  private loadTileImages(scene: Phaser.Scene) 
  {
      scene.load.image('ground', '/assets/tilesets/ground.png');
      scene.load.image('barils-sheet-Sheet', '/assets/tilesets/barils-sheet.png');
      scene.load.image('box', '/assets/tilesets/box-sheet.png');
      scene.load.image('coin-sheet', 'assets/tilesets/coin-sheet.png');
      scene.load.image('manaBall', 'assets/tilesets/manaBall.png');
      scene.load.image('lifeBall', 'assets/tilesets/lifeBall.png');
  }

  // --- Load Map Elements (Non-Destructible) ----------------
  private loadMapElements(scene: Phaser.Scene) 
  {
      scene.load.spritesheet('waterAnimBot', 'assets/tilesets/water-sheet-bot.png', { frameWidth: 18, frameHeight: 18 });
      scene.load.spritesheet('waterAnimTop', 'assets/tilesets/water-sheet-top.png', { frameWidth: 18, frameHeight: 18 });
      scene.load.spritesheet('canonSheet', 'assets/tilesets/canon-sheet.png', { frameWidth: 18, frameHeight: 18 });
      scene.load.spritesheet('diskSheet', 'assets/tilesets/disk-sheet.png', { frameWidth: 18, frameHeight: 18 });
  }

  // --- Load Destructible Objects and Collectibles ---------------
  private loadDestructibleObjects(scene: Phaser.Scene) 
  {
      scene.load.spritesheet('destroyBaril', 'assets/tilesets/barils-sheet.png', { frameWidth: 16, frameHeight: 22 });
      scene.load.spritesheet('destroyBox', 'assets/tilesets/box-sheet.png', { frameWidth: 18, frameHeight: 18 });
      scene.load.spritesheet('coin', 'assets/tilesets/coin-sheet.png', { frameWidth: 18, frameHeight: 18 });
      scene.load.spritesheet('movingPlatform', 'assets/tilesets/movingPlatform.png', { frameWidth: 54, frameHeight: 18 });
  }

  // --- Load Player Sprites & Animations ----------------------
  private loadPlayerSprites(scene: Phaser.Scene) 
  {
      scene.load.spritesheet('player', 'assets/player/sprite-idle-sheet.png', { frameWidth: 18, frameHeight: 32 });
      scene.load.spritesheet('playerRun', 'assets/player/sprite-run-sheet.png', { frameWidth: 18, frameHeight: 32 });
      scene.load.spritesheet('playerCrouch', 'assets/player/sprite-crouch-sheet.png', { frameWidth: 18, frameHeight: 32 });
      scene.load.spritesheet('playerJump', 'assets/player/sprite-jump-sheet.png', { frameWidth: 18, frameHeight: 32 });
      scene.load.spritesheet('slashAttack', 'assets/player/attacks/slash-sheet.png', { frameWidth: 31, frameHeight: 23 });
      scene.load.spritesheet('fireball', 'assets/player/attacks/fireball-sheet.png', { frameWidth: 16, frameHeight: 16 });
  }

  // --- Load Enemy Sprites & Animations ----------------------
  private loadEnemySprites(scene: Phaser.Scene) 
  {
      scene.load.spritesheet('slimes', 'assets/enemies/slime-sheet.png', { frameWidth: 15, frameHeight: 13 });
      scene.load.spritesheet('ghosts', 'assets/enemies/ghost-sheet.png', { frameWidth: 16, frameHeight: 15 });
      scene.load.spritesheet('ghostBall', 'assets/enemies/attacks/ghostBall-sheet.png', { frameWidth: 16, frameHeight: 16 });
      scene.load.spritesheet('kingSlime', 'assets/enemies/kingSlime-sheet.png', { frameWidth: 56, frameHeight: 61 });
      scene.load.spritesheet('kingWave', 'assets/enemies/attacks/kingWave-sheet.png', { frameWidth: 18, frameHeight: 16 });
      scene.load.spritesheet('kingJumper', 'assets/tilesets/kingJumper-sheet.png', { frameWidth: 11, frameHeight: 18 });
      scene.load.spritesheet('jumper', 'assets/tilesets/jumper-sheet.png', { frameWidth: 11, frameHeight: 10 });
  }

  // --- Load Sounds ----------------------------------------
  private loadSounds(scene: Phaser.Scene) 
  {
      scene.load.audio('coinSound', 'assets/sounds/coin.wav');
      scene.load.audio('ghostBallSound', 'assets/sounds/ghostball.wav');
      scene.load.audio('waveSound', 'assets/sounds/wave.wav');
      scene.load.audio('slashSound', 'assets/sounds/slash.wav');
      scene.load.audio('fireballSound', 'assets/sounds/fireball.ogg');
      scene.load.audio('jumpSound', 'assets/sounds/jump.wav');
      scene.load.audio('walkSound', 'assets/sounds/walk.ogg');
      scene.load.audio('playerHitSound', 'assets/sounds/playerHit.wav');
      scene.load.audio('hitSlimeSound', 'assets/sounds/hitSlime.wav');
      scene.load.audio('crackWoodSound', 'assets/sounds/crackWood.wav');
      scene.load.audio('dashSound', 'assets/sounds/dash.wav');
      scene.load.audio('healSound', 'assets/sounds/heal.wav');
      scene.load.audio('manaSound', 'assets/sounds/mana.wav');
      scene.load.audio('splashWaterSound', 'assets/sounds/splashWater.wav');
      scene.load.audio('jumperSound', 'assets/sounds/jumper.wav');
      scene.load.audio('victorySound', 'assets/sounds/victory.mp3');
      scene.load.audio('canonSound', 'assets/sounds/explosion.wav');
      scene.load.audio('whooshSound', 'assets/sounds/whoosh.wav');
  }

  // --- Load Music ----------------------------------------
  private loadMusic(scene: Phaser.Scene) 
  {
      scene.load.audio('backgroundMusic', 'assets/musics/spooky-Island.mp3');
      scene.load.audio('bossMusic', 'assets/musics/funky-and-jazzy-gang.mp3');
  }
}
