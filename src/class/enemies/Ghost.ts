import { Start } from "@/phaser/scenes/Start";
import Player from "../player/Player";
import GhostBall from "./attacks/GhostBall";

export default class Ghost extends Phaser.Physics.Arcade.Sprite {
    private lifePoint: number;
    private isNpc: boolean;
    private speed: number;
    private target: Player;
    private ghostBallOnCasting: boolean;
    private ground: Phaser.Tilemaps.TilemapLayer;

    constructor(
        scene: Start,
        x: number,
        y: number,
        speed: number = 100,
        name: string,
        target: Player,
        ground: Phaser.Tilemaps.TilemapLayer,
    ) {
        // Appel du constructeur parent de Phaser.Sprite
        super(scene, x, y, "ghosts");

        // Ajout à la scène et initialisation des physiques
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Initialisation des propriétés
        this.lifePoint = 10;
        this.isNpc = true;
        this.name = name;
        this.speed = speed;
        this.target = target;
        this.ghostBallOnCasting = false;
        this.ground = ground;

        this.setDepth(1);
        this.setScale(1.3);
        this.setCollideWorldBounds(true);
        this.setImmovable(true);
        if(this.body)
        {
            this.body.pushable = false;
        }
        
 
    }

    update() {
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
    
        const isPlayerVisible = this.canSeePlayer(this.target, this.ground);
        this.setFlipX(this.target.x < this.x);
    
        if (isPlayerVisible) {
            if (dx > 100) {
                this.setVelocityX(this.speed); 
            } else if (dx < -100) {
                this.setVelocityX(-this.speed); 
            } else {

                const desiredOffset = 95;
                const targetX = this.target.flipX 
                    ? this.target.x - desiredOffset
                    : this.target.x + desiredOffset; 
    
                const ghostDx = targetX - this.x;
    
                if (Math.abs(ghostDx) > 5) {
                    this.setVelocityX(ghostDx > 0 ? 200 : -200);
                } else {
                    this.setVelocityX(0); // Assez proche de la position idéale
                }
            }
    
            // --- Mouvement vertical : se place un peu au-dessus du joueur ---
            const targetY = this.target.y - 25;
            const verticalDiff = this.y - targetY;
    
            if (Math.abs(verticalDiff) > 5) {
                this.setVelocityY(verticalDiff < 0 ? 80 : -80);
            } else {
                this.setVelocityY(0);
            }
    
            // --- Tir si pas déjà en casting ---
            if (!this.ghostBallOnCasting) {
                this.ghostBallOnCasting = true;
                this.play('ghostRun', true);
                this.scene.time.delayedCall(3000, () => {
                    if (this.body) {
                        this.shootGhostBall(this.scene as Start);
                        this.ghostBallOnCasting = false;
                    }
                })
            }
    
        } else {
            // Si joueur non visible, on arrête tout mouvement
            this.setVelocityX(0);
            this.setVelocityY(0);
        }
    
    }
    takeDamage(damage:number)
    {
        this.lifePoint -= damage;

        if(this.lifePoint <= 0)
        {
            this.destroy();
        }
    }

    shootGhostBall(scene: Start) {
        const ghostBall = new GhostBall(this.scene, this.x, this.y, this.target);
        scene.enemiesProjectile.add(ghostBall, true)
    }

    canSeePlayer(player: Player, groundLayer: Phaser.Tilemaps.TilemapLayer) {
        const start = new Phaser.Geom.Point(this.x, this.y);
        const end = new Phaser.Geom.Point(player.x, player.y);
        const ray = new Phaser.Geom.Line(start.x, start.y, end.x, end.y);

        // Debug désactivé (à réactiver pour le dev)
        /*
        if (this.debugGraphics) this.debugGraphics.clear();
        else this.debugGraphics = this.scene.add.graphics();

        const tiles = groundLayer.getTilesWithinShape(ray, { isColliding: true });
        if (tiles.length > 0) {
            this.debugGraphics.lineStyle(1, 0xff0000, 0.6); // Rouge = mur détecté
        } else {
            this.debugGraphics.lineStyle(1, 0x00ff00, 0.6); // Vert = vision claire
        }

        this.debugGraphics.strokeLineShape(ray);
        */

        // Même logique, sans le visuel
        const tiles = groundLayer.getTilesWithinShape(ray, { isColliding: true });
        return tiles.length === 0;
    }
}