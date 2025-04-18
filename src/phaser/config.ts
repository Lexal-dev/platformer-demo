import * as Phaser from 'phaser';
import { Start } from './scenes/Start';
import HUD from '@/class/HUD';
import { Pause } from './scenes/Pause';


const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  title: 'platformer-demo',
  parent: 'game-container',
  backgroundColor: '#575757',
  pixelArt: true,
  scene: [Start, HUD, Pause],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 1908,
    height: 1080,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
};

export default config;