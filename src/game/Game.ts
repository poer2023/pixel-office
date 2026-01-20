import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { OfficeScene } from './scenes/OfficeScene';
import { UIScene } from './scenes/UIScene';
import { GAME_CONFIG, COLORS } from '../utils/constants';

export class Game extends Phaser.Game {
  constructor() {
    super({
      type: Phaser.AUTO,
      width: GAME_CONFIG.WIDTH,
      height: GAME_CONFIG.HEIGHT,
      parent: 'game-container',
      backgroundColor: COLORS.BACKGROUND,
      pixelArt: true,
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: [BootScene, OfficeScene, UIScene],
    });
  }
}
