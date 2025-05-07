import * as Phaser from 'phaser';
import KeyManager from '@/class/KeysManager';
import Player from '@/class/player/Player';
import KingSlime from '@/class/enemies/KingSlime';

interface PointsBar 
{
    backgroundBar: Phaser.GameObjects.Graphics;
    mainBar: Phaser.GameObjects.Graphics;
}

export default class HUD extends Phaser.Scene 
{
    private keyManager!: KeyManager;
    private keys: any;

    private player!: Player;
    private kingSlime?: KingSlime;

    private maxLife!: number;
    private currentLife!: number;

    private maxMana!: number;
    private currentMana!: number;

    private coins!: number;
    private coinText!: Phaser.GameObjects.Text;

    private lifeBar!: PointsBar;
    private manaBar!: PointsBar;
    private lifeKingBar: PointsBar | null = null;

    private currentKingLife!: number;
    private maxKingLife!: number;

    gamePause!: boolean;

    constructor() 
    {
        super({ key: 'HUD' },);
    }

    init(data: { player: Player; kingSlime?: KingSlime }): void 
    {
        this.player = data.player;
        this.kingSlime = data.kingSlime;
    }

    create(): void 
    {
        this.keyManager = new KeyManager(this);
        this.keys = this.keyManager.getKeys();

        this.gamePause = false;

        // LIFE
        this.maxLife = this.player.lifePointMax;
        this.currentLife = this.player.lifePoint;

        this.lifeBar = this.pointsBar(10, 10, 300, 40, this.currentLife, this.maxLife, 'red', 'grey');
        this.lifeBar.backgroundBar.setScrollFactor(0).setDepth(1000);
        this.lifeBar.mainBar.setScrollFactor(0).setDepth(1001);

        // MANA
        this.maxMana = this.player.manaPointMax;
        this.currentMana = this.player.manaPoint;

        this.manaBar = this.pointsBar(10, 60, 300, 40, this.currentMana, this.maxMana, 'blue', 'grey');
        this.manaBar.backgroundBar.setScrollFactor(0).setDepth(1000);
        this.manaBar.mainBar.setScrollFactor(0).setDepth(1001);

        // COINS
        this.coins = this.player.coins;

        this.coinText = this.add.text(this.scale.width / 2, 60, 'Score: ' + this.coins, {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold'
        } as Phaser.Types.GameObjects.Text.TextStyle)
        .setOrigin(0.5, 0)
        .setScale(2)
        .setScrollFactor(0)
        .setDepth(1000);

        // KING SLIME HP
        if (this.kingSlime) {
            this.maxKingLife = this.kingSlime.maxLifePoint;
            this.currentKingLife = this.kingSlime.lifePoint;

            const barWidth = 1200;
            const barHeight = 80;
            const screenSize = 1908;
            const barX = screenSize / 2 - barWidth / 2;
            const barY = 980;

            this.lifeKingBar = this.pointsBar(barX, barY, barWidth, barHeight, this.currentKingLife, this.maxKingLife, 'dark-red', 'grey');
            this.lifeKingBar.backgroundBar.setScrollFactor(0).setDepth(1000);
            this.lifeKingBar.mainBar.setScrollFactor(0).setDepth(1001);

            const text = this.add.text(screenSize / 2, barY + barHeight / 2, 'KING SLIME', {
                fontSize: '48px',
                color: '#ffffff',
                fontStyle: 'bold'
            } as Phaser.Types.GameObjects.Text.TextStyle)
            .setOrigin(0.5, 0.5)
            .setDepth(1002)
            .setName('kingSlimeText');
        }

        this.scene.pause('Start');
        this.scene.launch('Pause');
    }

    update(): void 
    {
        if (Phaser.Input.Keyboard.JustUp(this.keys.PAUSE)) 
        {
            this.scene.pause('Start');
            this.scene.launch('Pause');
        }

        // PLAYER LIFE
        if (this.currentLife !== this.player.lifePoint) 
        {
            this.currentLife = this.player.lifePoint;
            const percent = Phaser.Math.Clamp(this.currentLife / this.maxLife, 0, 1);
            this.lifeBar.mainBar.clear();
            this.lifeBar.mainBar.fillStyle(0xff0000, 1);
            this.lifeBar.mainBar.fillRect(10, 10, 300 * percent, 40);
        }

        // PLAYER MANA
        if (this.currentMana !== this.player.manaPoint)
        {
            this.currentMana = this.player.manaPoint;
            const percent = Phaser.Math.Clamp(this.currentMana / this.maxMana, 0, 1);
            this.manaBar.mainBar.clear();
            this.manaBar.mainBar.fillStyle(0x0000ff, 1);
            this.manaBar.mainBar.fillRect(10, 60, 300 * percent, 40);
        }

        // PLAYER SCORE (COINS)
        if (this.coins !== this.player.coins) 
        {
            this.coins = this.player.coins;
            this.coinText.setText('Score: ' + this.coins);
        }

        // BOSS LIFE
        if (this.kingSlime)
        {
            if (this.kingSlime.lifePoint <= 0) 
                {
                if (this.lifeKingBar) 
                {
                    this.lifeKingBar.backgroundBar.destroy();
                    this.lifeKingBar.mainBar.destroy();
                    this.lifeKingBar = null;
                }

                const kingSlimeText = this.children.getByName('kingSlimeText') as Phaser.GameObjects.Text;
                if (kingSlimeText) kingSlimeText.destroy();
            } 
            else 
            {
                if (this.lifeKingBar && this.currentKingLife !== this.kingSlime.lifePoint) 
                {
                    this.currentKingLife = this.kingSlime.lifePoint;
                    const percent = Phaser.Math.Clamp(this.currentKingLife / this.maxKingLife, 0, 1);
                    const barWidth = 1200;
                    const screenSize = 1908;
                    const barY = 980;
                    const newWidth = barWidth * percent;

                    this.lifeKingBar.mainBar.clear();
                    this.lifeKingBar.mainBar.fillStyle(0x8B0000, 1);
                    this.lifeKingBar.mainBar.fillRect(screenSize / 2 - barWidth / 2, barY, newWidth, 80);
                    this.lifeKingBar.mainBar.setVisible(true);
                }
            }
        }

        const isPauseActive = this.scene.isActive('Pause');
        this.coinText.setVisible(!isPauseActive);
    }

    private pointsBar(
        x: number,
        y: number,
        sizeX: number,
        sizeY: number,
        points: number,
        maxPoints: number,
        color1: string = 'red',
        color2: string = 'grey'
    ): PointsBar 
    {
        const percent = Phaser.Math.Clamp(points / maxPoints, 0, 1);

        const backgroundBar = this.add.graphics();
        backgroundBar.fillStyle(Phaser.Display.Color.HexStringToColor(color2).color, 1);
        backgroundBar.fillRect(x, y, sizeX, sizeY);

        let color: number;
        switch (color1) 
        {
            case 'red': color = 0xff0000; break;
            case 'dark-red': color = 0x8B0000; break;
            case 'blue': color = 0x0000ff; break;
            case 'green': color = 0x00ff00; break;
            case 'yellow': color = 0xffff00; break;
            default:
                color = Phaser.Display.Color.HexStringToColor(color1).color;
                break;
        }

        const mainBar = this.add.graphics();
        mainBar.fillStyle(color, 1);
        mainBar.fillRect(x, y, sizeX * percent, sizeY);

        return { backgroundBar, mainBar };
    }
}
