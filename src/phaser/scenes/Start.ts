import Phaser from 'phaser';
import Player from  '@/class/player/Player';
import Camera from '@/class/Camera';
import Baril from '@/class/objects/Baril';
import Box from '@/class/objects/Box';
import Coin from '@/class/objects/Coin';
import MovingPlatform from '@/platforms/MovingPlatforms';
import { createPlayerAnimations } from '@/animations/player'; 
import { createLayerWithHandling } from '@/utils/tilemap-helper';
import {createCoinsAnimation, createCanonsAnimation, createBarilsAnimation, createBoxsAnimation, createJumperAnimation} from '@/animations/objects';
import {createMapAnimations} from '@/animations/map';
import createEnemysAnimations from '@/animations/enemies';

import KeyManager from '@/class/KeysManager';
import { PhaserKeyBindings } from '@/types/keysManager';
import RestoreBall from '@/class/objects/RestoreBall';
import Canon from '@/class/traps/Canon';
import Slime from '@/class/enemies/Slimes';
import Ghost from '@/class/enemies/Ghost';
import KingSlime from '@/class/enemies/KingSlime';
import Jumper from '@/class/objects/Jumper';

export class Start extends Phaser.Scene {
  private backgroundMusic!: Phaser.Sound.BaseSound;
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
  spikeZones!: Phaser.Physics.Arcade.Group;
  slimes!: Phaser.Physics.Arcade.Group;
  ghosts!: Phaser.Physics.Arcade.Group;
  enemiesProjectile!: Phaser.Physics.Arcade.Group;
  kingSlime!: Phaser.Physics.Arcade.Sprite | null;
  bossActivated!: boolean;
  restart!: boolean;
  
  constructor() {
    super('Start');
  }

  preload() {
    this.load.tilemapTiledJSON('start', '/assets/map/Start.tmj');

    this.load.image('ground', '/assets/tilesets/ground.png');
    this.load.image('barils-sheet-Sheet', '/assets/tilesets/barils-sheet.png');
    this.load.image('box', '/assets/tilesets/box-sheet.png');
    this.load.image('coin-sheet', 'assets/tilesets/coin-sheet.png');

    this.load.image('manaBall', 'assets/tilesets/manaBall.png');
    this.load.image('lifeBall', 'assets/tilesets/lifeBall.png');

    this.load.spritesheet('waterAnimBot','assets/tilesets/water-sheet-bot.png',{ frameWidth: 18, frameHeight: 18 });
    this.load.spritesheet('waterAnimTop','assets/tilesets/water-sheet-top.png',{ frameWidth: 18, frameHeight: 18 });

    this.load.spritesheet('destroyBaril', 'assets/tilesets/barils-sheet.png', {frameWidth: 16, frameHeight:22});
    this.load.spritesheet('destroyBox', 'assets/tilesets/box-sheet.png', {frameWidth: 18, frameHeight:18});
    this.load.spritesheet('coin', 'assets/tilesets/coin-sheet.png', { frameWidth: 18, frameHeight: 18 });
    this.load.spritesheet('canonSheet','assets/tilesets/canon-sheet.png',{ frameWidth: 18, frameHeight: 18 });
    this.load.spritesheet('diskSheet','assets/tilesets/disk-sheet.png',{ frameWidth: 18, frameHeight: 18 });
    this.load.spritesheet('player', 'assets/player/sprite-idle-sheet.png', { frameWidth: 18, frameHeight: 32 });
    this.load.spritesheet('playerRun', 'assets/player/sprite-run-sheet.png', { frameWidth: 18, frameHeight: 32 });
    this.load.spritesheet('slashAttack', 'assets/player/attacks/slash-sheet.png', {frameWidth: 31, frameHeight:23});
    this.load.spritesheet('fireball', 'assets/player/attacks/fireball-sheet.png', {frameWidth: 16, frameHeight:16});
    this.load.spritesheet('slimes', 'assets/enemies/slime-sheet.png', { frameWidth: 15, frameHeight: 13 });
    this.load.spritesheet('ghosts', 'assets/enemies/ghost-sheet.png', { frameWidth: 16, frameHeight: 15 });
    this.load.spritesheet('kingSlime', 'assets/enemies/kingSlime-sheet.png', { frameWidth: 56, frameHeight: 61 });
    this.load.spritesheet('ghostBall', 'assets/enemies/attacks/ghostBall-sheet.png', {frameWidth: 16, frameHeight:16});
    this.load.spritesheet('kingWave', 'assets/enemies/attacks/kingWave-sheet.png', {frameWidth: 18, frameHeight:16});
    this.load.spritesheet('movingPlatform','assets/tilesets/movingPlatform.png',{ frameWidth: 54, frameHeight: 18 });
    this.load.spritesheet('kingJumper','assets/tilesets/kingJumper-sheet.png',{ frameWidth: 11, frameHeight: 18 });

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
  }

  create() {
    this.keyManager = new KeyManager(this);
    this.keys = this.keyManager.getKeys();
    const map = this.make.tilemap({ key: 'start' });
    
    this.backgroundMusic = this.sound.add('backgroundMusic', {
      volume: 0.6,
      loop: true
    });
    this.backgroundMusic.play();

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

    // GROUND LAYER && BACKGROUND LAYER && EXIT LAYER
    if (validGroundTileset) {
      this.groundLayer = createLayerWithHandling(map, 'ground', [validGroundTileset], -9);
      createLayerWithHandling(map, 'background', [validGroundTileset], -10);
      this.waterLayer = createLayerWithHandling(map, 'water', [validGroundTileset], 11);
      createLayerWithHandling(map, 'exit', [validGroundTileset], 5);
      createLayerWithHandling(map, 'vine', [validGroundTileset], 4);
      createLayerWithHandling(map, 'grass', [validGroundTileset], 3);
      this.spikeLayer = createLayerWithHandling(map, 'spike', [validGroundTileset], 0);
    }

    // FRONT OF PLAYER LAYER
    const tilesetsToUse = [validGroundTileset, validBarilsTileset, validBoxTileset].filter(
      (tileset): tileset is Phaser.Tilemaps.Tileset => tileset !== null
    );

    createBarilsAnimation(this);
    createBoxsAnimation(this);
    createCoinsAnimation(this);
    createMapAnimations(this);
    createCanonsAnimation(this);
    createEnemysAnimations(this);
    createJumperAnimation(this);

    this.barils = this.physics.add.group({
      runChildUpdate: true,
    });
    this.boxs = this.physics.add.group({
      runChildUpdate: true,
    });
    this.projectiles = this.physics.add.group({
      runChildUpdate: true 
    });
    this.canons = this.physics.add.group()
    this.coins = this.physics.add.group();
    this.restoreBalls = this.physics.add.group();
    this.waterTilesGroup = this.physics.add.staticGroup();
    this.spikeZones = this.physics.add.group();
    this.slimes = this.physics.add.group();
    this.ghosts = this.physics.add.group({
      runChildUpdate: true 
    });
    this.enemiesProjectile = this.physics.add.group({
      runChildUpdate: true 
    });
    this.kingSlime = null
    this.bossActivated = false;
    this.restart = false;

    if (tilesetsToUse.length > 0) {
      this.frontOfPlayerLayer = createLayerWithHandling(map, 'frontOfPlayer', tilesetsToUse, 5);
    }
    
    // COINS LAYER
    if (validCoinsTileset) {
      this.coinsLayer = createLayerWithHandling(map, 'coin', [validCoinsTileset], 6);
    }

    // PLAYER
    createPlayerAnimations(this);
    this.keyManager = new KeyManager(this);
    this.player = new Player(this, 70, 938, this.keyManager);


    //CAMERA
    if (this.groundLayer) {

        this.camera = new Camera(this, this.player, this.groundLayer)
    }

     // ADD SPRITE SPIKE REMOVE TILE
     try {
      if (!this.spikeLayer) return;
    
      // SPIKES TOP
      this.spikeLayer.forEachTile(tile => {
        if (tile.index === 37 && this.spikeLayer) {
          const hitbox = this.add.zone(tile.getCenterX(), tile.getCenterY(), tile.width, tile.height);
          this.physics.add.existing(hitbox);
    
          const offsetX = 3;
          const offsetY = 6;
    
          if (hitbox.body) {
            const body = hitbox.body as Phaser.Physics.Arcade.Body;
            body.setSize(tile.width - offsetX * 2, tile.height - offsetY);
            body.setOffset(offsetX, 0);
          }
    
          hitbox.setData('spikeDirection', 'top');
          this.spikeZones.add(hitbox);
        }
      });
    
      // SPIKES BOTTOM
      const spikesBot = this.spikeLayer.getTilesWithin().filter(tile => tile.index === 52);
      spikesBot.forEach(tile => {
        const hitbox = this.add.zone(tile.getCenterX(), tile.getCenterY(), tile.width, tile.height);
        this.physics.add.existing(hitbox);
    
        const offsetX = 3;
        const offsetY = 6;
    
        if (hitbox.body) {
          const body = hitbox.body as Phaser.Physics.Arcade.Body;
          body.setSize(tile.width - offsetX * 2, tile.height - offsetY);
          body.setOffset(offsetX, offsetY);
        }
    
        hitbox.setData('spikeDirection', 'bottom');
        this.spikeZones.add(hitbox);
      });
    
        // SPIKES LEFT
        const spikesLeft = this.spikeLayer.getTilesWithin().filter(tile => tile.index === 38);
        spikesLeft.forEach(tile => {
          const reducedWidth = 12;
          const reducedHeight = tile.height - 3;
        
          const hitboxX = tile.getCenterX() - (tile.width - reducedWidth) / 2;
          const hitboxY = tile.getCenterY();
        
          const hitbox = this.add.zone(hitboxX, hitboxY, reducedWidth, reducedHeight);
          this.physics.add.existing(hitbox);
        
          const body = hitbox.body as Phaser.Physics.Arcade.Body;
          body.setAllowGravity(false);
          body.setImmovable(true);
          body.setSize(reducedWidth, reducedHeight);
          body.setOffset(0, 0); 
        
          hitbox.setData('spikeDirection', 'left');
          this.spikeZones.add(hitbox);
        });

        // SPIKES RIGHT
        const spikesRight = this.spikeLayer.getTilesWithin().filter(tile => tile.index === 53);
        spikesRight.forEach(tile => {
          const reducedWidth = 12;
          const reducedHeight = tile.height - 3;
        
          const hitboxX = tile.getCenterX() + (tile.width - reducedWidth) / 2;
          const hitboxY = tile.getCenterY();
        
          const hitbox = this.add.zone(hitboxX, hitboxY, reducedWidth, reducedHeight);
          this.physics.add.existing(hitbox);
        
          const body = hitbox.body as Phaser.Physics.Arcade.Body;
          body.setAllowGravity(false);
          body.setImmovable(true);
          body.setSize(reducedWidth, reducedHeight);
          body.setOffset(0, 0);
        
          hitbox.setData('spikeDirection', 'right');
          this.spikeZones.add(hitbox);
        });
    
    } catch (err) {
      console.log(err);
    }
    

    this.spikeZones.getChildren().forEach((spike) => {
      const body = spike.body;
      if (body && body instanceof Phaser.Physics.Arcade.Body && body.setImmovable) {
        body.setImmovable(true);
      }
    });
    
     // ADD SPRITE BOXS AND BARILS REMOVE TILE
    try 
    {
      if(!this.frontOfPlayerLayer) return;
      this.frontOfPlayerLayer.forEachTile(tile=> {
        if (tile.index === 57 && this.frontOfPlayerLayer) {
            //barils
            const x = tile.pixelX + 9;
            const y = tile.pixelY;
            const baril = new Baril(this, x, y + 8);
            this.barils.add(baril);
            this.frontOfPlayerLayer.removeTileAt(tile.x, tile.y);
        }
  
      if(tile.index === 59 && this.frontOfPlayerLayer)
      {
          const x = tile.pixelX + 9;
          const y = tile.pixelY;
          const box = new Box(this, x, y + 8);
          this.boxs.add(box);
          this.frontOfPlayerLayer.removeTileAt(tile.x, tile.y);
      }
    });
    } 
    catch (err)
    {
      console.log(err);
    }
    
 // ADD SPRITE COINS REMOVE TILE
    try
    {
     if(!this.coinsLayer) return;
     this.coinsLayer.forEachTile(tile => {
      if (tile.index === 61 && this.coinsLayer) 
      { 
          //coins
          const x = tile.pixelX + 9;
          const y = tile.pixelY;
          const coin = new Coin(this, x, y + 8);
          this.coins.add(coin);
          this.coinsLayer.removeTileAt(tile.x, tile.y);
      }
      this.coins.setDepth(8)
      });
    }
    catch (err)
    {
      console.log(err)
    }
    

   // ADD SPRITE wATER REMOVE TILE
     try 
     {
       if(!this.waterLayer) return;
       this.waterLayer.forEachTile(tile=> {
         if (tile.index === 36 && this.waterLayer) {
             //TOP
             const x = tile.getCenterX();
             const y = tile.getCenterY();
             this.waterLayer.removeTileAt(tile.x, tile.y);
             const waterTile = this.add.sprite(x, y, 'waterAnimTop');
             waterTile.play('waterAnimTop', true);
             this.waterTilesGroup.add(waterTile);
             waterTile.setDepth(3)
             waterTile.setAlpha(0.65)
         }
   
       if(tile.index === 51 && this.waterLayer)
       {
        //BOT
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        this.waterLayer.removeTileAt(tile.x, tile.y);
        const waterTile = this.add.sprite(x, y, 'waterAnimBot');
        waterTile.play('waterAnimBot', true);
        this.waterTilesGroup.add(waterTile);
        waterTile.setDepth(3)
        waterTile.setAlpha(0.65)
       }
     });
     } 
     catch (err)
     {
       console.log(err);
     }

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

    this.physics.add.collider(this.player, this.spikeZones, (player, hitbox) => {
      const p = player as Player;
      const zone = hitbox as Phaser.GameObjects.Zone;
    
      const knockbackForce = 300;
    
      const rawDir = zone.getData('spikeDirection');
      const isValidDirection = ['top', 'bottom', 'left', 'right'].includes(rawDir);
    
      if (isValidDirection) {
        p.knockBack(knockbackForce, rawDir as 'top' | 'bottom' | 'left' | 'right', 3);
      }
    });

    const platform = new MovingPlatform(this, 725, 150, 'movingPlatform', 200, 200, false )
    this.physics.add.collider(this.player, platform);
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

    const jumper = new Jumper(this, 250, 200, this.player);

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

    if (this.player) {
      this.player.update();
      const wasTouchingWater = this.isTouchingWater;
      this.isTouchingWater = false;
      // Vérifie s'il touche l'eau
      this.physics.world.overlap(this.player, this.waterTilesGroup, () => {
        this.isTouchingWater = true;
      });

      // Joue le son si le joueur vient d'entrer dans l'eau
      if (!wasTouchingWater && this.isTouchingWater) {
        this.sound.play('splashWaterSound', {
          volume: 0.5,
          rate: 1
        });
      }

      // Mets à jour l’état de l’eau
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
