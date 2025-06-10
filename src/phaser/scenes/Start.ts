import * as Phaser from 'phaser';

// --- Player and Camera -------------------
import Player from  '@/class/player/Player';  // Import Player Class
import Camera from '@/class/Camera';  // Import Camera Class
import KeyManager from '@/class/KeysManager';  // Import KeyManager Class (Handles player input)

// --- Platforms ---------------------------
import MovingPlatform from '@/class/platforms/MovingPlatforms';  // Import MovingPlatform Class

// --- Tilemap Setup ----------------------
import waterInit from '@/tilemapSetup/waterMap';  // Import Tilemap setup for water
import spikesInit from '@/tilemapSetup/spikesMap';  // Import Tilemap setup for spikes
import { frontOfPlayerLayerInit, coinsInit } from '@/tilemapSetup/objectsMap';  // Object setups for front layers and coins
import { createLayerWithHandling } from '@/utils/tilemap-helper';  // Utility function to create layers with additional handling logic

// --- Object Animations -------------------
import { createPlayerAnimations } from '@/animations/player';  // Create Player Animations
import { createCoinsAnimation, createCanonsAnimation, createBarilsAnimation, createBoxsAnimation, createJumperAnimation, createJumperKingAnimation } from '@/animations/objects';  // Object animations for coins, canons, barrels, boxes, jumpers
import { createMapAnimations } from '@/animations/map';  // Map-specific animations
import createEnemysAnimations from '@/animations/enemies';  // Animations for enemies

// --- Object Classes ----------------------
import JumperKing from '@/class/objects/JumperKing';  // JumperKing Class
import Jumper from '@/class/objects/Jumper';  // Jumper Class
import Box from '@/class/objects/Box';  // Box Class

// --- Enemies ----------------------------
import Slime from '@/class/enemies/Slimes';  // Slime Enemy Class
import Ghost from '@/class/enemies/Ghost';  // Ghost Enemy Class
import KingSlime from '@/class/enemies/KingSlime';  // KingSlime Enemy Class

// --- Traps ------------------------------
import Canon from '@/class/traps/Canon';  // Canon Trap Class

// --- Key Bindings -----------------------
import { PhaserKeyBindings } from '@/types/keysManager';  // Import Key Binding Type Definitions
import AssetLoader from '@/class/loaders/AssetLoader';
import HUD from '@/class/HUD';


export class Start extends Phaser.Scene {
    // --- Sound Variables ------------------------
    private backgroundMusic!: Phaser.Sound.BaseSound;  // Background Music (Music during the game)
    private bossMusic!: Phaser.Sound.BaseSound;  // Boss Fight Music

    // --- Tilemap Layers ------------------------
    private groundLayer: Phaser.Tilemaps.TilemapLayer | null = null;  // Layer for the ground tiles
    private frontOfPlayerLayer: Phaser.Tilemaps.TilemapLayer | null = null;  // Layer in front of the player
    private spikeLayer: Phaser.Tilemaps.TilemapLayer | null = null;  // Layer for spikes
    private waterLayer: Phaser.Tilemaps.TilemapLayer | null = null;  // Layer for water tiles
    private coinsLayer: Phaser.Tilemaps.TilemapLayer | null = null;  // Layer for coins

    // --- Player and Camera ---------------------
    private camera!: Camera;  // Camera object to handle camera controls and follow the player
    public player!: Player;  // The main player object

    // --- Game Management -----------------------
    private keyManager!: KeyManager;  // KeyManager to handle the player's input bindings
    private keys!: PhaserKeyBindings;  // Key bindings for the player actions
    private isTouchingWater = false;  // Boolean flag to check if the player is touching water

    // --- Physics and Groups -------------------
    private waterTilesGroup!: Phaser.Physics.Arcade.StaticGroup;  // Static group for water tiles
    public restoreBalls!: Phaser.Physics.Arcade.Group;  // Group for restoring balls
    public barils!: Phaser.Physics.Arcade.Group;  // Group for barrels
    public boxs!: Phaser.Physics.Arcade.Group;  // Group for boxes
    public coins!: Phaser.Physics.Arcade.Group;  // Group for coins
    private canons!: Phaser.Physics.Arcade.Group;  // Group for canons
    public projectiles!: Phaser.Physics.Arcade.Group;  // Group for projectiles fired in the game
    public slimes!: Phaser.Physics.Arcade.Group;  // Group for slimes (enemy type)
    public ghosts!: Phaser.Physics.Arcade.Group;  // Group for ghosts (enemy type)
    public enemiesProjectile!: Phaser.Physics.Arcade.Group;  // Group for projectiles fired by enemies

    // --- Boss and Restart Management -----------
    public kingSlime!: Phaser.Physics.Arcade.Sprite | null;  // The King Slime boss (nullable until activated)
    private bossActivated!: boolean;  // Flag indicating if the boss fight has been activated
    private kingSlimeDead: boolean = false;  // Flag indicating if King Slime is dead
    private restart!: boolean;  // Flag to handle game restart logic

  
    constructor() 
    {
        super('Start');
    }

    preload() 
    {
        try {
            const assetsLoader = new AssetLoader(this);
            if (!assetsLoader) {
              throw new Error("AssetLoader not initialized.");
            }
            console.log("assets loaded.");
        } 
        catch (err) 
        {
            console.log("assets not loaded");
        }
    }

    create() 
    {
        // create KeyManager and retrieve key mappings
        this.keyManager = new KeyManager(this);
        this.keys = this.keyManager.getKeys();
        const map = this.make.tilemap({ key: 'start' });
    
        // create background music
        if (!this.backgroundMusic || !this.backgroundMusic.isPlaying) 
        {
            if (!this.backgroundMusic) 
            {
                this.backgroundMusic = this.sound.add('backgroundMusic', {
                  volume: 0.6,
                  loop: true,
                });
            }
            this.backgroundMusic.play();
        }
        else 
        {
            console.log("Music is already played.");
        }

        // create boss music
        this.bossMusic = this.sound.add('bossMusic', {
            volume: 0.6,
            loop: true,
        })

        // Loading the tilesets
        const groundTileset = map.addTilesetImage('ground', 'ground');
        const boxTileset = map.addTilesetImage('box', 'box');
        const barilsTileset = map.addTilesetImage('barils-sheet-Sheet', 'barils-sheet-Sheet');
        const coinsTileset = map.addTilesetImage('coin-sheet', 'coin-sheet');

        // Validating the tilesets
        // If the tileset is valid, it's used; otherwise, it is set to null
        const validGroundTileset = groundTileset ? groundTileset : null;
        const validBoxTileset = boxTileset ? boxTileset : null;
        const validBarilsTileset = barilsTileset ? barilsTileset : null;
        const validCoinsTileset = coinsTileset ? coinsTileset : null;

        // Validating and creating map layers with valid tilesets

        // If the ground tileset is valid, create corresponding layers with specific depths
        if (validGroundTileset) 
        {
            // Create the ground layer
            this.groundLayer = createLayerWithHandling(map, 'ground', [validGroundTileset], 0);

            // Create the spike layer
            this.spikeLayer = createLayerWithHandling(map, 'spike', [validGroundTileset], 1);

            // Create the background layer
            createLayerWithHandling(map, 'background', [validGroundTileset], -3);

            // Create the water layer 
            this.waterLayer = createLayerWithHandling(map, 'water', [validGroundTileset], 3);

            // Create the exit layer
            createLayerWithHandling(map, 'exit', [validGroundTileset], 4);

            // Create the vine layer with a depth of 4
            createLayerWithHandling(map, 'vine', [validGroundTileset], 5);

            // Create the grass layer with a depth of 3
            createLayerWithHandling(map, 'grass', [validGroundTileset], 3);
        }

        // Validating the "frontOfPlayer" layer
        // The tilesets to be used for the "frontOfPlayer" layer are filtered to only include valid tilesets
        const tilesetsToUse = [validGroundTileset, validBarilsTileset, validBoxTileset]
            .filter((tileset) => tileset !== null); // Filters out invalid tilesets

        // If any valid tilesets are found, create the "frontOfPlayer" layer with a depth of 5
        if (tilesetsToUse.length > 0) 
        {
            this.frontOfPlayerLayer = createLayerWithHandling(map, 'frontOfPlayer', tilesetsToUse, 3);
        }

        // Validating the coin layer
        // If the coins tileset is valid, create the corresponding layer with a depth of 6
        if (validCoinsTileset) 
        {
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

        // PLAYER
        this.player = new Player(this, 50 , 940, this.keyManager);

        //CAMERA
        if (this.groundLayer) 
        {
            this.camera = new Camera(this, this.player, this.groundLayer)
        }

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
        this.ghosts = this.physics.add.group();
        this.enemiesProjectile = this.physics.add.group({ runChildUpdate: true });
        this.waterTilesGroup = this.physics.add.staticGroup();

        try {
            if (this.spikeLayer && this.frontOfPlayerLayer && this.coinsLayer && this.waterLayer) {
                // Initialize spikes
                spikesInit(this.spikeLayer, this.player, this);
                console.log("Layer Init: Spikes layer successfully initialized.");
        
                // Initialize front of player layer
                frontOfPlayerLayerInit(this.frontOfPlayerLayer, this);
                console.log("Layer Init: Front of Player layer successfully initialized.");
        
                // Initialize coins
                coinsInit(this.coinsLayer, this);
                console.log("Layer Init: Coins layer successfully initialized.");
        
                // Initialize water layer
                waterInit(this.waterLayer, this, this.waterTilesGroup);
                console.log("Layer Init: Water layer successfully initialized.");
            }
        } catch (error) {
            console.error("Error initializing layers:", error);
        }


        // Create traps
        try {
            const canon1 = new Canon(this, 1503, 257, true, true, 3000, this.player);
            this.canons.add(canon1);
            console.log("Trap: Canon1 successfully created at position (1503, 257).");
        
            const canon2 = new Canon(this, 1190, 45, true, false, 3000, this.player);
            canon2.setFrame(3);
            this.canons.add(canon2);
            console.log("Trap: Canon2 successfully created at position (1190, 45).");
        
            for (let i = 0; i < 2; i++) {
                const canonBoucle = new Canon(this, 1300 + (125 * i), 315, false, false, 3000, this.player);
                canonBoucle.setFrame(3);
                this.canons.add(canonBoucle);
                console.log(`Trap: CanonBoucle ${i+1} successfully created at position (1300 + ${125 * i}, 315).`);
            }
        } catch (error) {
            console.error("Error creating canons:", error);
        }

        // Create active zone for canon traps
        try {
            this.createCanonZone(955, 515, 75, 17, true);
            console.log("Trap Zone: Canon Zone 1 created at position (955, 515).");
        
            this.createCanonZone(955, 495, 75, 17, false);
            console.log("Trap Zone: Canon Zone 2 created at position (955, 495).");
        
            this.createCanonZone(1719, 297, 54, 17, true);
            console.log("Trap Zone: Canon Zone 3 created at position (1719, 297).");
        
            this.createCanonZone(1719, 312, 54, 17, false);
            console.log("Trap Zone: Canon Zone 4 created at position (1719, 312).");
        
            this.createCanonZone(1360, 335, 54, 17, true);
            console.log("Trap Zone: Canon Zone 5 created at position (1360, 335).");
        
            this.createCanonZone(1360, 365, 54, 17, false);
            console.log("Trap Zone: Canon Zone 6 created at position (1360, 365).");
        } catch (error) {
            console.error("Error creating canon zones:", error);
        }

        // Create platform and collider

        const platform = new MovingPlatform(this, 725, 150, 'movingPlatform', 200, 200, false);
        const jumper = new Jumper(this, 250, 367, this.player);

        // Create slimes
        if (this.groundLayer) {
            try {
                for (let i = 1; i < 3; i++) {
                    const slime = new Slime(this, 290 + 100 * i, 857, 50, 0, this.groundLayer, this.player, 'right', 5);
                    this.slimes.add(slime);
                    console.log(`Slime ${i} created at position (290 + ${100 * i}, 857).`);
                }
            
                const slime1 = new Slime(this, 920, 785, 50, 0, this.groundLayer, this.player, 'right', 5);
                this.slimes.add(slime1);
                console.log("Slime1 created at position (920, 785).");
            
                const slime2 = new Slime(this, 1010, 650, 75, 0, this.groundLayer, this.player, 'right', 5);
                this.slimes.add(slime2);
                console.log("Slime2 created at position (1010, 650).");
            
                const slime3 = new Slime(this, 1800, 660, 20, 0, this.groundLayer, this.player, 'right', 5);
                this.slimes.add(slime3);
                console.log("Slime3 created at position (1800, 660).");
            
                const slime4 = new Slime(this, 1550, 400, 30, 0, this.groundLayer, this.player, 'right', 5);
                this.slimes.add(slime4);
                console.log("Slime4 created at position (1550, 400).");
            
                const slime5 = new Slime(this, 1600, 500, 40, 0, this.groundLayer, this.player, 'right', 5);
                this.slimes.add(slime5);
                console.log("Slime5 created at position (1600, 500).");
            } catch (error) {
                console.error("Error creating slimes:", error);
            }
        }

        // Create ghosts
        if (this.groundLayer) {
            try {
                const ghost1 = new Ghost(this, 910, 980, 80, 50, this.groundLayer, this.player, "right", "Henry");
                this.ghosts.add(ghost1);
                console.log("Ghost: Ghost1 created at position (910, 980).");
            
                for (let i = 0; i < 2; i++) {
                    const xPosition = (i === 0) ? 50 : 790;
                    const ghost = new Ghost(this, xPosition, 550, 80, 50, this.groundLayer, this.player, "right", "Henry");
                    ghost.name = "Emilien-" + i;
                    this.ghosts.add(ghost);
                    console.log(`Ghost: Ghost Emilien-${i} created at position (${xPosition}, 550).`);
                }
            
                // Set up collision behavior between ghosts
                this.physics.add.collider(this.ghosts, this.ghosts, (g1, g2) => {
                    const ghost1 = g1 as Ghost;
                    const ghost2 = g2 as Ghost;
                
                    if (ghost1.enemyBody.blocked.right || ghost1.enemyBody.blocked.left) {
                        ghost1.performTeleport(150);
                        console.log(`Ghost collision: Ghost ${ghost1.name} teleported.`);
                    }
                });
                console.log("Ghost Collisions: Ghost collision handling set up.");
            } catch (error) {
                console.error("Error creating ghosts or ghost collisions:", error);
            }
        }

        // Create colliders with try-catch
        try {
            if (this.groundLayer) {
                // Player and ground layer collision
                this.physics.add.collider(this.player, this.groundLayer, () => {});
                console.log("Collider: Player and Ground Layer successfully loaded.");
            
                // Box and ground layer collision
                this.physics.add.collider(this.boxs, this.groundLayer);
                console.log("Collider: Box and Ground Layer successfully loaded.");
            
                // Restore balls and ground layer collision
                this.physics.add.collider(this.restoreBalls, this.groundLayer);
                console.log("Collider: Restore Balls and Ground Layer successfully loaded.");
            
                // Projectiles and ground layer collision (destroy projectiles on collision)
                this.physics.add.collider(this.groundLayer, this.projectiles, (projectile) => {
                    projectile.destroy();
                });
                console.log("Collider: Projectiles and Ground Layer successfully loaded.");
            
                // Ghosts and ground layer collision
                this.physics.add.collider(this.ghosts, this.groundLayer);
                console.log("Collider: Ghosts and Ground Layer successfully loaded.");
            
                // Jumper and ground layer collision
                this.physics.add.collider(jumper, this.groundLayer);
                console.log("Collider: Jumper and Ground Layer successfully loaded.");
            }
        } catch (error) {
            console.error("Error loading ground layer collisions: ", error);
        }

        try {
            // Box to Box collision
            this.physics.add.collider(this.boxs, this.boxs, (box1, box2) => {
                if (box1 instanceof Phaser.GameObjects.GameObject && box1.body && box2 instanceof Phaser.GameObjects.GameObject && box2.body) {
                    const box2Typed = box2 as Box;
                    if (box2.body.touching.up && box1.body.touching.down) {
                        if (box2Typed.boxBroken === true) {
                            box2Typed.destroy();
                        }
                    }
                }
            });
            console.log("Collider: Box to Box successfully loaded.");
        } catch (error) {
            console.error("Error loading box-to-box collision: ", error);
        }

        try {
            // Player and platform collision
            this.physics.add.collider(this.player, platform);
            console.log("Collider: Player and Platform successfully loaded.");
        } catch (error) {
            console.error("Error loading player-platform collision: ", error);
        }
        
        // HUD
        this.scene.launch('HUD', { player: this.player, isPause: true});
        // init for methods
        this.kingSlime = null
        this.bossActivated = false;
        this.restart = false;

    }

  
    update() {
        // Check if player life points are zero or less, and restart the scene if true
        if(this.player.lifePoint <= 0) {
            this.restartScene(); 
        }
    
        // If the King Slime is not yet spawned, check for its spawn condition
        if(this.kingSlime === null) {
            this.checkBossSpawn();
        }
    
        // If the King Slime exists and has a valid body, update its state
        if (this.kingSlime !== null && this.kingSlime.body) {
            this.kingSlime.update();
        }
    
        // When the King Slime is dead and not active, stop boss music and start background music, then spawn a JumperKing
        if (this.kingSlime && !this.kingSlime.active && !this.kingSlimeDead && this.groundLayer) {
            this.kingSlimeDead = true; 
            this.bossMusic.stop();
            this.backgroundMusic.play({ volume: 0.6, loop: true }); 
            
            // Create a new JumperKing object at the position of the King Slime
            const jumperKing = new JumperKing(this, this.kingSlime.x, this.kingSlime.y, this.player, this.groundLayer);
            this.physics.add.collider(jumperKing, this.groundLayer);
        }
    
        // If the player exists, update the player's state
        if (this.player) {
            this.player.update(); // Update player
    
            // Track if the player is touching the water
            const wasTouchingWater = this.isTouchingWater;
            this.isTouchingWater = false;
            
            // Check if the player is overlapping with the water zone
            this.physics.world.overlap(this.player, this.waterTilesGroup, () => {
                this.isTouchingWater = true; // Mark player as touching water
            });
    
            // If the player wasn't touching water before and is now, play splash sound
            if (!wasTouchingWater && this.isTouchingWater) {
                this.sound.play('splashWaterSound', {
                    volume: 0.5,
                    rate: 1
                });
            }
    
            // Update player's water state if it has changed
            if (this.isTouchingWater !== wasTouchingWater) {
                this.player.onWater = this.isTouchingWater;
            }
        }
    
        // If the DEBUG key is released, restart the scene
        if (Phaser.Input.Keyboard.JustUp(this.keys.DEBUG)) {
            this.restartScene(); 
        }
    }
    
    // Check if the boss (King Slime) should be spawned based on the ghosts' state
    private checkBossSpawn() {
        // Look for ghosts named Emilien-0 and Emilien-1 in the ghost group
        const emilien0 = this.ghosts.getChildren().find(ghost => ghost.name === 'Emilien-0');
        const emilien1 = this.ghosts.getChildren().find(ghost => ghost.name === 'Emilien-1');
    
        // If both ghosts are not present, and the boss hasn't been activated yet
        if (!emilien0 && !emilien1 && !this.bossActivated && !this.restart) {
            if(this.groundLayer) {
                // Create and spawn the King Slime
                this.kingSlime = new KingSlime(this, 420, 450, this.groundLayer, this.player);
                this.kingSlime.setDepth(1);
                this.backgroundMusic.stop(); 
                this.bossMusic.play(); 
            }
            
            this.bossActivated = true; // Mark boss as activated
            this.scene.launch('HUD', { player: this.player, kingSlime: this.kingSlime, isPause: false});
        }
    }
    
    // Restart the scene
    private restartScene() {
        this.bossMusic.stop();
        this.scene.restart();
    }
    
    // Create an activation zone for the canons
    private createCanonZone(x: number, y: number, width: number, height: number, isActivate: boolean): void {
        // Create a zone at the specified coordinates with the given dimensions
        const zone = this.add.zone(x, y, width, height);
        this.physics.world.enable(zone); // Enable physics on the zone
    
        // Add overlap detection between the player and the zone
        this.physics.add.overlap(this.player, zone, () => {
            // If the player overlaps the zone, iterate through all canons and activate/deactivate them based on the `isActivate` flag
            this.canons.children.each((canon: Phaser.GameObjects.GameObject) => {
                (canon as Canon).onFire = isActivate; // Set the onFire property of the canon to the activation state
                return true; // Return true to continue iterating over all canons
            });
        });
    }
}    