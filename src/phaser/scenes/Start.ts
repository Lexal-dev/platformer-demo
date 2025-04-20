import * as Phaser from 'phaser';
import Player from  '@/class/player/Player';
import Camera from '@/class/Camera';

import MovingPlatform from '@/platforms/MovingPlatforms';
import { createPlayerAnimations } from '@/animations/player'; 
import { createLayerWithHandling } from '@/utils/tilemap-helper';
import {createCoinsAnimation, createCanonsAnimation, createBarilsAnimation, createBoxsAnimation, createJumperAnimation, createJumperKingAnimation} from '@/animations/objects';
import {createMapAnimations} from '@/animations/map';
import createEnemysAnimations from '@/animations/enemies';

import KeyManager from '@/class/KeysManager';
import { PhaserKeyBindings } from '@/types/keysManager';
import RestoreBall from '@/class/objects/RestoreBall';
import Canon from '@/class/traps/Canon';
import Slime from '@/class/enemies/Slimes';
import Ghost from '@/class/enemies/Ghost';
import KingSlime from '@/class/enemies/KingSlime';
import spikesInit from '@/tilemapSetup/spikesMap';
import {frontOfPlayerLayerInit, coinsInit} from '@/tilemapSetup/objectsMap';
import waterInit from '@/tilemapSetup/waterMap';
import JumperKing from '@/class/objects/JumperKing';
import Jumper from '@/class/objects/Jumper';

export class Start extends Phaser.Scene {
  private backgroundMusic!: Phaser.Sound.BaseSound;
  private bossMusic!: Phaser.Sound.BaseSound;
  private groundLayer: Phaser.Tilemaps.TilemapLayer | null = null;
  private frontOfPlayerLayer: Phaser.Tilemaps.TilemapLayer | null = null;
  private spikeLayer :Phaser.Tilemaps.TilemapLayer | null = null; 
  private waterLayer: Phaser.Tilemaps.TilemapLayer | null = null;
  private coinsLayer: Phaser.Tilemaps.TilemapLayer | null = null;
  private camera!: Camera;
  private keyManager!: KeyManager;
  private keys!: PhaserKeyBindings;
  private isTouchingWater = false;
  private waterTilesGroup!: Phaser.Physics.Arcade.StaticGroup;
  restoreBalls!: Phaser.Physics.Arcade.Group;
  player!: Player;
  barils!: Phaser.Physics.Arcade.Group;
  boxs!: Phaser.Physics.Arcade.Group;
  coins!: Phaser.Physics.Arcade.Group;
  canons!: Phaser.Physics.Arcade.Group;
  projectiles!: Phaser.Physics.Arcade.Group;
  slimes!: Phaser.Physics.Arcade.Group;
  ghosts!: Phaser.Physics.Arcade.Group;
  enemiesProjectile!: Phaser.Physics.Arcade.Group;
  kingSlime!: Phaser.Physics.Arcade.Sprite | null;
  bossActivated!: boolean;
  kingSlimeDead: boolean = false;
  restart!: boolean;
  
  constructor() {
    super('Start');
  }

  preload() {
    // Load the map .json file
    this.load.tilemapTiledJSON('start', '/assets/map/Start.tmj');

    // Load the tile images for the map
    this.load.image('ground', '/assets/tilesets/ground.png');
    this.load.image('barils-sheet-Sheet', '/assets/tilesets/barils-sheet.png');
    this.load.image('box', '/assets/tilesets/box-sheet.png');
    this.load.image('coin-sheet', 'assets/tilesets/coin-sheet.png');
    this.load.image('manaBall', 'assets/tilesets/manaBall.png');
    this.load.image('lifeBall', 'assets/tilesets/lifeBall.png');

    // Load map elements (indestructible objects)
    this.load.spritesheet('waterAnimBot','assets/tilesets/water-sheet-bot.png',{ frameWidth: 18, frameHeight: 18 });
    this.load.spritesheet('waterAnimTop','assets/tilesets/water-sheet-top.png',{ frameWidth: 18, frameHeight: 18 });
    this.load.spritesheet('canonSheet','assets/tilesets/canon-sheet.png',{ frameWidth: 18, frameHeight: 18 });
    this.load.spritesheet('diskSheet','assets/tilesets/disk-sheet.png',{ frameWidth: 18, frameHeight: 18 }); 

    // Load map elements (destructible objects and collectibles)
    this.load.spritesheet('destroyBaril', 'assets/tilesets/barils-sheet.png', {frameWidth: 16, frameHeight:22});
    this.load.spritesheet('destroyBox', 'assets/tilesets/box-sheet.png', {frameWidth: 18, frameHeight:18});
    this.load.spritesheet('coin', 'assets/tilesets/coin-sheet.png', { frameWidth: 18, frameHeight: 18 });
    this.load.spritesheet('movingPlatform','assets/tilesets/movingPlatform.png',{ frameWidth: 54, frameHeight: 18 });

    // Load player images and player attack animations
    this.load.spritesheet('player', 'assets/player/sprite-idle-sheet.png', { frameWidth: 18, frameHeight: 32 });
    this.load.spritesheet('playerRun', 'assets/player/sprite-run-sheet.png', { frameWidth: 18, frameHeight: 32 });
    this.load.spritesheet('playerCrouch', 'assets/player/sprite-crouch-sheet.png', { frameWidth: 18, frameHeight: 32 });
    this.load.spritesheet('playerJump', 'assets/player/sprite-jump-sheet.png', { frameWidth: 18, frameHeight: 32 });
    this.load.spritesheet('slashAttack', 'assets/player/attacks/slash-sheet.png', {frameWidth: 31, frameHeight:23});
    this.load.spritesheet('fireball', 'assets/player/attacks/fireball-sheet.png', {frameWidth: 16, frameHeight:16});

    // Load player sprites and attack animations
    this.load.spritesheet('slimes', 'assets/enemies/slime-sheet.png', { frameWidth: 15, frameHeight: 13 });
    this.load.spritesheet('ghosts', 'assets/enemies/ghost-sheet.png', { frameWidth: 16, frameHeight: 15 });
    this.load.spritesheet('ghostBall', 'assets/enemies/attacks/ghostBall-sheet.png', {frameWidth: 16, frameHeight:16});
    this.load.spritesheet('kingSlime', 'assets/enemies/kingSlime-sheet.png', { frameWidth: 56, frameHeight: 61 });
    this.load.spritesheet('kingWave', 'assets/enemies/attacks/kingWave-sheet.png', {frameWidth: 18, frameHeight:16});
    this.load.spritesheet('kingJumper','assets/tilesets/kingJumper-sheet.png',{ frameWidth: 11, frameHeight: 18 });
    this.load.spritesheet('jumper','assets/tilesets/jumper-sheet.png',{ frameWidth: 11, frameHeight: 10 });


    //Sounds
    this.load.audio('coinSound', 'assets/sounds/coin.wav');
    this.load.audio('ghostBallSound', 'assets/sounds/ghostball.wav');
    this.load.audio('waveSound', 'assets/sounds/wave.wav');
    this.load.audio('slashSound', 'assets/sounds/slash.wav');
    this.load.audio('fireballSound', 'assets/sounds/fireball.ogg');
    this.load.audio('jumpSound', 'assets/sounds/jump.wav');
    this.load.audio('walkSound', 'assets/sounds/walk.ogg');
    this.load.audio('playerHitSound', 'assets/sounds/playerHit.wav');
    this.load.audio('hitSlimeSound', 'assets/sounds/hitSlime.wav');
    this.load.audio('crackWoodSound', 'assets/sounds/crackWood.wav');
    this.load.audio('dashSound', 'assets/sounds/dash.wav');
    this.load.audio('healSound', 'assets/sounds/heal.wav');
    this.load.audio('manaSound', 'assets/sounds/mana.wav');
    this.load.audio('splashWaterSound', 'assets/sounds/splashWater.wav');
    this.load.audio('jumperSound', 'assets/sounds/jumper.wav');
    this.load.audio('victorySound', 'assets/sounds/victory.mp3');

    // Music
    this.load.audio('backgroundMusic', 'assets/musics/spooky-Island.mp3');
    this.load.audio('bossMusic', 'assets/musics/funky-and-jazzy-gang.mp3');
  }

  create() {

    // create KeyManager and retrieve key mappings
    this.keyManager = new KeyManager(this);
    this.keys = this.keyManager.getKeys();
    const map = this.make.tilemap({ key: 'start' });
    
    // create background music
    if (!this.backgroundMusic || !this.backgroundMusic.isPlaying) {
      if (!this.backgroundMusic) {
        this.backgroundMusic = this.sound.add('backgroundMusic', {
          volume: 0.6,
          loop: true
        });
      }
      this.backgroundMusic.play();
    } else {
      console.log("La musique est déjà en cours de lecture.");
    }

    this.bossMusic = this.sound.add('bossMusic', {
      volume: 0.6,
      loop: true
    })

    // tilesets loaded
    const groundTileset = map.addTilesetImage('ground', 'ground');
    const boxTileset = map.addTilesetImage('box', 'box');
    const barilsTileset = map.addTilesetImage('barils-sheet-Sheet', 'barils-sheet-Sheet');
    const coinsTileset = map.addTilesetImage('coin-sheet', 'coin-sheet');

    // validation tilesets
    const validGroundTileset = groundTileset ? groundTileset : null;
    const validBoxTileset = boxTileset ? boxTileset : null;
    const validBarilsTileset = barilsTileset ? barilsTileset : null;
    const validCoinsTileset = coinsTileset ? coinsTileset : null;

    // Validate layers and set depth
    if (validGroundTileset) {
      this.groundLayer = createLayerWithHandling(map, 'ground', [validGroundTileset], -9);
      this.spikeLayer = createLayerWithHandling(map, 'spike', [validGroundTileset], 0);
      createLayerWithHandling(map, 'background', [validGroundTileset], -10);
      this.waterLayer = createLayerWithHandling(map, 'water', [validGroundTileset], 11);
      createLayerWithHandling(map, 'exit', [validGroundTileset], 5);
      createLayerWithHandling(map, 'vine', [validGroundTileset], 4);
      createLayerWithHandling(map, 'grass', [validGroundTileset], 3);
      
    }
    // validate for frontOfPlayer layer
    const tilesetsToUse = [validGroundTileset, validBarilsTileset, validBoxTileset].filter(
      (tileset): tileset is Phaser.Tilemaps.Tileset => tileset !== null
    );
    // create front of player
    if (tilesetsToUse.length > 0) {
      this.frontOfPlayerLayer = createLayerWithHandling(map, 'frontOfPlayer', tilesetsToUse, 5);
    }    
    // validate for coinS LAYER
    if (validCoinsTileset) {
      this.coinsLayer = createLayerWithHandling(map, 'coin', [validCoinsTileset], 6);
    }

    // create animations
    createBarilsAnimation(this);
    createBoxsAnimation(this);
    createCoinsAnimation(this);
    createMapAnimations(this);
    createCanonsAnimation(this);
    createEnemysAnimations(this);
    createJumperKingAnimation(this);
    createJumperAnimation(this);
    createPlayerAnimations(this);

    // --- create groups ---
    // objects and consummable
    this.barils = this.physics.add.group({ runChildUpdate: true });
    this.boxs = this.physics.add.group({ runChildUpdate: true });
    this.coins = this.physics.add.group();
    this.restoreBalls = this.physics.add.group();

    //trap
    this.canons = this.physics.add.group()
    this.projectiles = this.physics.add.group({ runChildUpdate: true });
    
    // enemies and enemies projectiles
    this.slimes = this.physics.add.group();
    this.ghosts = this.physics.add.group({ runChildUpdate: true });
    this.enemiesProjectile = this.physics.add.group({ runChildUpdate: true });

    this.kingSlime = null
    this.waterTilesGroup = this.physics.add.staticGroup();
    this.bossActivated = false;
    this.restart = false;

    // PLAYER
    this.player = new Player(this, 50, 938, this.keyManager);

    //CAMERA
    if (this.groundLayer) 
    {
        this.camera = new Camera(this, this.player, this.groundLayer)
    }

    if(this.spikeLayer && this.frontOfPlayerLayer && this.coinsLayer && this.waterLayer)
    {
      spikesInit(this.spikeLayer, this.player, this)
      frontOfPlayerLayerInit(this.frontOfPlayerLayer, this)
      coinsInit(this.coinsLayer, this)
      waterInit(this.waterLayer, this, this.waterTilesGroup)
    }
 
    // create traps
    const canon1 = new Canon(this, 1503, 237, true, true, 3000, this.player);
    this.canons.add(canon1);
    const canon2 = new Canon(this, 1190, 45, true, false, 3000, this.player);
    canon2.setFrame(3)
    this.canons.add(canon2);
    for (let i = 0; i < 2; i++) { 
        const canonBoucle = new Canon(this, 1300 + (125 * i), 315, false, false, 3000, this.player);
        canonBoucle.setFrame(3) 
        this.canons.add(canonBoucle);
    }

    // create platform and collider
    const platform = new MovingPlatform(this, 725, 150, 'movingPlatform', 200, 200, false )
    this.physics.add.collider(this.player, platform);

    // create slimes
    if(this.groundLayer)
    {

      for(let i = 1; i < 3; i++)
        {
            const slime = new Slime(this, 290 + 100 * i, 857, 50 ,true,  this.player, 'Michel', 10000, this.groundLayer)
            slime.name = "michel-" + i;
            this.slimes.add(slime)
            
        }
        const slime1 = new Slime(this, 920, 785, 50 ,true,  this.player, 'Alain-1', 10000, this.groundLayer);
        this.slimes.add(slime1);
        const slime2 = new Slime(this, 1010, 650, 75 ,true,  this.player, 'Alain-2', 10000, this.groundLayer);
        this.slimes.add(slime2);
        const slime3 = new Slime(this, 1800, 660, 20 ,true,  this.player, 'Alain-3', 10000, this.groundLayer);
        this.slimes.add(slime3);
        const slime4 = new Slime(this, 1550, 400, 30 ,true,  this.player, 'Alain-4', 10000, this.groundLayer);
        this.slimes.add(slime4);
        const slime5 = new Slime(this, 1600, 500, 40 ,true,  this.player, 'Alain-5', 10000, this.groundLayer);
        this.slimes.add(slime5);

    }

    // create ghosts
    if(this.groundLayer)
    {
      for (let i = 0; i < 2; i++) {
        const xPosition = (i === 0) ? 50 : 790;
        const ghost = new Ghost(this, xPosition, 550, 100, 'Emilien', this.player, this.groundLayer);
        ghost.name = "Emilien-" + i;
        this.ghosts.add(ghost);
      }
      const ghost1 = new Ghost(this, 910, 980, 100, 'Henry', this.player, this.groundLayer);
      this.ghosts.add(ghost1);
      this.physics.add.collider(this.ghosts, this.ghosts);
    }


    const jumper = new Jumper(this, 250, 367, this.player);
    // create collider
    if(this.groundLayer){      
      this.physics.add.collider(this.player, this.groundLayer, () => {
      });

      this.physics.add.collider(this.restoreBalls, this.groundLayer)

      this.physics.add.collider(this.groundLayer, this.projectiles, (projectile)=> {
        projectile.destroy()
      });
      this.physics.add.collider(this.slimes, this.groundLayer);
      this.physics.add.collider(this.ghosts, this.groundLayer);
      this.physics.add.collider(jumper, this.groundLayer);
    }
      // HUD
      this.scene.launch('HUD', { player: this.player});

      //const zone = this.add.zone(400, 300, 100, 100)
      //this.physics.world.enable(zone);
      //this.physics.add.overlap(this.player, zone, () => {
      //  console.log("le joueur est dans la nezo")
      //})
  }

  update() 
  {
    if(this.player.lifePoint <= 0)
    {
      this.restartScene() 
    }
    if(this.kingSlime === null)
    {
      this.checkBossSpawn();
    }
    if (this.kingSlime !== null && this.kingSlime.body) {
      this.kingSlime.update();
    }
    if (this.kingSlime && !this.kingSlime.active && !this.kingSlimeDead && this.groundLayer) {
      this.kingSlimeDead = true;
      this.bossMusic.stop();
      this.backgroundMusic.play({
          volume: 0.6,
          loop: true
      });
    
      const jumperKing = new JumperKing(this, this.kingSlime.x, this.kingSlime.y, this.player, this.groundLayer);
      this.physics.add.collider(jumperKing, this.groundLayer);
    }
    if (this.player) {
      this.player.update();
      const wasTouchingWater = this.isTouchingWater;
      this.isTouchingWater = false;
      this.physics.world.overlap(this.player, this.waterTilesGroup, () => {
        this.isTouchingWater = true;
      });

      if (!wasTouchingWater && this.isTouchingWater) {
        this.sound.play('splashWaterSound', {
          volume: 0.5,
          rate: 1
        });
      }

      if (this.isTouchingWater !== wasTouchingWater) {
        this.player.onWater = this.isTouchingWater;
}
  
      if (this.isTouchingWater !== wasTouchingWater) {
        this.player.onWater = this.isTouchingWater;
      }
    }
    
    if (Phaser.Input.Keyboard.JustUp(this.keys.DEBUG)) {
      this.restartScene();
    }
  }

  spawnRestoreBalls(object: RestoreBall | { x: number; y: number }, group: Phaser.Physics.Arcade.Group, texture = 'lifeBall', type: 'life' | 'mana' = 'life', number: number = 3) 
  {
    const position = 'x' in object && 'y' in object ? object : object;
    for (let i = 0; i < number; i++) {
        const offsetX = Phaser.Math.Between(-10, 10); 
        const restoreBall = new RestoreBall(this, position.x + offsetX, position.y, texture, type, this.player);
        group.add(restoreBall);

        const velocityX = Phaser.Math.Between(-100, 100);
        const velocityY = Phaser.Math.Between(-50, -75);
        const body = restoreBall.body;

        if (body instanceof Phaser.Physics.Arcade.Body) {
            body.setVelocity(velocityX, velocityY);
        }
    }
  }

  checkBossSpawn() 
  {
    // Vérifie si Emilien-0 et Emilien-1 sont encore en vie
    const emilien0 = this.ghosts.getChildren().find(ghost => ghost.name === 'Emilien-0');
    const emilien1 = this.ghosts.getChildren().find(ghost => ghost.name === 'Emilien-1');

    if (!emilien0 && !emilien1 && !this.bossActivated && !this.restart) {
        // Les deux sont morts et le boss n'a pas encore été activé
        if(this.groundLayer)
          {
            this.kingSlime =  new KingSlime(this, 420, 450, this.groundLayer, this.player);
            this.kingSlime.setDepth(1);
            this.backgroundMusic.stop();

            // Attend 2 secondes avant de lancer la musique de boss

            this.bossMusic.play();
                
     
          }
        
        this.bossActivated = true;
        this.scene.launch('HUD', { player: this.player, kingSlime: this.kingSlime });
    }
  }
  
  restartScene() 
  {
      this.scene.restart()
  } 
}
