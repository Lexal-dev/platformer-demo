import Phaser from 'phaser';
import  HUD  from '@/class/HUD'; 

interface PauseSceneData {
    hud: HUD;
  }

export class Pause extends Phaser.Scene {
  private hud!: HUD;
  private overlay!: Phaser.GameObjects.Graphics;
  private titleText!: Phaser.GameObjects.Text;
  private resumeText!: Phaser.GameObjects.Text;
  private controlsTextHint!: Phaser.GameObjects.Text;
  private controlsBg!: Phaser.GameObjects.Graphics;
  private controlsText!: Phaser.GameObjects.Text;
  private controlsVisible: boolean = false;

  constructor() {
    super({ key: 'Pause' });
  }

  create(): void {

    const data = this.scene.settings.data as PauseSceneData;
    this.hud = data.hud;
    this.controlsVisible = false;

    const { width, height } = this.cameras.main;

    this.overlay = this.add.graphics();
    this.overlay.fillStyle(0x000000, 0.6);
    this.overlay.fillRect(0, 0, width, height);
    this.overlay.setScrollFactor(0);
    this.overlay.setDepth(1);

    this.titleText = this.add.text(width / 2, 50, 'PAUSE', {
      fontSize: '100px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(2);

    this.resumeText = this.add.text(width / 2, height / 2 - 30, 'Press SPACE to return', {
      fontSize: '50px',
      color: '#ffffff',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2);

    this.controlsTextHint = this.add.text(width / 2, height / 2 + 30, 'Press C to check controls panel', {
      fontSize: '50px',
      color: '#ffffff',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(2);

    this.input.keyboard?.on('keydown-SPACE', () => {
      this.resumeGame();
    });

    this.input.keyboard?.on('keydown-C', () => {
      this.toggleControlsPanel();
    });

    this.input.keyboard?.on('keydown-ESC', () => {
      if (this.controlsVisible) {
        this.toggleControlsPanel();
      }
    });

    this.createControlsPanel();
  }

  private resumeGame(): void {
    this.scene.resume('Start');
    if (this.hud) {
      this.hud.gamePause = false;
    }
    this.scene.stop();
  }

  private createControlsPanel(): void {
    const { width, height } = this.cameras.main;

    this.controlsBg = this.add.graphics();
    this.controlsBg.fillStyle(0x000000, 0.9);
    this.controlsBg.fillRect(0, 0, width, height);
    this.controlsBg.setDepth(3).setVisible(false).setScrollFactor(0);

    this.controlsText = this.add.text(175, 30, `
                Controls in game:


        Q       - Move left 

        D       - Move right  

        S       - Crouch / Drop down faster  

        R       - Dash

        SPACE   - Jump  

        F       - Sword attack  

        A       - Spell n.1  

        Esc     - Pause  


    Press ESC to go back - press SPACE to go game
    `, {
      fontSize: '24px',
      color: '#ffffff',
    });

    this.controlsText.setDepth(4).setVisible(false).setScale(2).setScrollFactor(0);
  }

  private toggleControlsPanel(): void {
    this.controlsVisible = !this.controlsVisible;
    this.controlsBg.setVisible(this.controlsVisible);
    this.controlsText.setVisible(this.controlsVisible);
  }
}
