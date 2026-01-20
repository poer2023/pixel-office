import Phaser from 'phaser';
import { COLORS } from '../../utils/constants';

export class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
    const progressBar = this.add.graphics();
    const loadingText = this.add.text(width / 2, height / 2 - 50, '加载中...', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5);
    const percentText = this.add.text(width / 2, height / 2, '0%', { font: '18px Arial', color: '#ffffff' }).setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      percentText.setText(Math.round(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0x4ade80, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });
    this.load.on('complete', () => { progressBar.destroy(); progressBox.destroy(); loadingText.destroy(); percentText.destroy(); });
    this.createPixelArtAssets();
  }

  create(): void { this.scene.start('OfficeScene'); }

  private createPixelArtAssets(): void {
    this.createEmployeeSprites();
    this.createDeskSprite();
    this.createFloorTile();
    this.createChairSprite();
    this.createPlantSprite();
    this.createCoffeeMugSprite();
  }

  private createEmployeeSprites(): void {
    const shirtColors = [
      { main: 0x4ade80, dark: 0x22c55e },
      { main: 0x60a5fa, dark: 0x3b82f6 },
      { main: 0xf472b6, dark: 0xec4899 },
      { main: 0xfbbf24, dark: 0xf59e0b },
      { main: 0xa78bfa, dark: 0x8b5cf6 },
    ];
    const skinColors = [
      { main: 0xfcd5ce, dark: 0xf8b4a8 },
      { main: 0xdeb887, dark: 0xc9a66b },
      { main: 0xffe4c4, dark: 0xecd1a8 },
      { main: 0xd2b48c, dark: 0xb89b6d },
      { main: 0xffeaa7, dark: 0xecd68a },
    ];
    const hairColors = [0x2d1b0e, 0x4a3728, 0x1a1a1a, 0x8b4513, 0x654321];

    const g = this.make.graphics({ x: 0, y: 0 });
    const frameW = 32, frameH = 32, framesPerState = 4, states = 3;

    for (let charIdx = 0; charIdx < 5; charIdx++) {
      const shirt = shirtColors[charIdx], skin = skinColors[charIdx], hair = hairColors[charIdx];
      for (let state = 0; state < states; state++) {
        for (let frame = 0; frame < framesPerState; frame++) {
          const x = (state * framesPerState + frame) * frameW, y = charIdx * frameH;
          const bounce = state === 0 ? (frame % 2 === 0 ? 0 : -1) : 0;
          const headTilt = state === 1 ? (frame % 2 === 0 ? 0 : 1) : 0;

          g.fillStyle(shirt.main, 1); g.fillRect(x + 10, y + 14 + bounce, 12, 14);
          g.fillStyle(shirt.dark, 1); g.fillRect(x + 10, y + 24 + bounce, 12, 4);
          g.fillStyle(skin.main, 1); g.fillRect(x + 11, y + 4 + bounce + headTilt, 10, 11);
          g.fillStyle(skin.dark, 1); g.fillRect(x + 11, y + 12 + bounce + headTilt, 10, 3);
          g.fillStyle(hair, 1); g.fillRect(x + 10, y + 2 + bounce + headTilt, 12, 4);
          g.fillRect(x + 10, y + 4 + bounce + headTilt, 2, 3);
          g.fillRect(x + 20, y + 4 + bounce + headTilt, 2, 3);

          g.fillStyle(0x1a1a2e, 1);
          if (state === 0) {
            const blink = frame === 3;
            if (blink) { g.fillRect(x + 13, y + 9 + bounce, 2, 1); g.fillRect(x + 17, y + 9 + bounce, 2, 1); }
            else { g.fillRect(x + 13, y + 8 + bounce, 2, 2); g.fillRect(x + 17, y + 8 + bounce, 2, 2); }
          } else if (state === 1) {
            if (frame < 2) { g.fillRect(x + 14, y + 10 + bounce + headTilt, 2, 1); g.fillRect(x + 17, y + 10 + bounce + headTilt, 2, 1); }
            else { g.fillRect(x + 13, y + 9 + bounce + headTilt, 2, 2); g.fillRect(x + 17, y + 9 + bounce + headTilt, 2, 2); }
          } else { g.fillRect(x + 13, y + 9 + bounce, 3, 1); g.fillRect(x + 17, y + 9 + bounce, 3, 1); }

          g.fillStyle(shirt.main, 1);
          if (state === 0) {
            const armMove = frame % 2 === 0 ? 0 : 1;
            g.fillRect(x + 7, y + 16 + bounce, 3, 6); g.fillRect(x + 22, y + 16 + bounce + armMove, 3, 6);
          } else if (state === 1) { g.fillRect(x + 7, y + 16 + bounce, 3, 8); g.fillRect(x + 22, y + 14 + bounce, 3, 8); }
          else { g.fillRect(x + 6, y + 16 + bounce, 4, 6); g.fillRect(x + 22, y + 16 + bounce, 4, 6); }

          g.fillStyle(skin.main, 1);
          if (state === 0) { g.fillRect(x + 7, y + 22 + bounce, 3, 2); g.fillRect(x + 22, y + 22 + bounce, 3, 2); }
          else if (state === 1 && frame < 2) {
            g.fillRect(x + 22, y + 20 + bounce, 3, 4);
            g.fillStyle(0x374151, 1); g.fillRect(x + 24, y + 18 + bounce, 4, 6);
            g.fillStyle(0x60a5fa, 1); g.fillRect(x + 25, y + 19 + bounce, 2, 4);
          }
        }
      }
    }
    g.generateTexture('employees', frameW * framesPerState * states, frameH * 5);
    g.destroy();
  }

  private createDeskSprite(): void {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(COLORS.DESK, 1); g.fillRect(0, 12, 48, 8);
    g.fillStyle(0x9d8465, 1); g.fillRect(2, 12, 44, 2);
    g.fillStyle(0x6b5344, 1); g.fillRect(0, 18, 48, 2);
    g.fillStyle(0x5c4433, 1); g.fillRect(4, 20, 4, 12); g.fillRect(40, 20, 4, 12);
    g.fillStyle(0x1f2937, 1); g.fillRect(16, 0, 16, 12);
    g.fillStyle(0x374151, 1); g.fillRect(17, 1, 14, 10);
    g.fillStyle(0x1e3a5f, 1); g.fillRect(18, 2, 12, 8);
    g.fillStyle(0x4ade80, 1); g.fillRect(19, 3, 8, 1);
    g.fillStyle(0x60a5fa, 1); g.fillRect(19, 5, 6, 1);
    g.fillStyle(0xfbbf24, 1); g.fillRect(19, 7, 10, 1);
    g.fillStyle(0x4b5563, 1); g.fillRect(22, 12, 4, 2);
    g.fillStyle(0x374151, 1); g.fillRect(14, 14, 12, 4);
    g.fillStyle(0x4b5563, 1); g.fillRect(15, 15, 10, 2);
    g.fillStyle(0x374151, 1); g.fillRect(28, 15, 4, 3);
    g.generateTexture('desk', 48, 32);
    g.destroy();
  }

  private createFloorTile(): void {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0x3d3d5c, 1); g.fillRect(0, 0, 32, 32);
    g.fillStyle(0x454573, 1); g.fillRect(0, 0, 16, 16); g.fillRect(16, 16, 16, 16);
    g.fillStyle(0x2d2d4a, 1);
    g.fillRect(0, 0, 32, 1); g.fillRect(0, 0, 1, 32); g.fillRect(16, 0, 1, 32); g.fillRect(0, 16, 32, 1);
    g.generateTexture('floor_tile', 32, 32);
    g.destroy();
  }

  private createChairSprite(): void {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0x1f2937, 1); g.fillRect(4, 0, 16, 14);
    g.fillStyle(0x374151, 1); g.fillRect(5, 1, 14, 12);
    g.fillStyle(0x1f2937, 1); g.fillRect(2, 14, 20, 6);
    g.fillStyle(0x374151, 1); g.fillRect(3, 15, 18, 4);
    g.fillStyle(0x4b5563, 1); g.fillRect(10, 20, 4, 6);
    g.fillStyle(0x374151, 1); g.fillRect(4, 26, 16, 2);
    g.fillStyle(0x1f2937, 1); g.fillRect(4, 28, 4, 4); g.fillRect(16, 28, 4, 4);
    g.generateTexture('chair', 24, 32);
    g.destroy();
  }

  private createPlantSprite(): void {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0x92400e, 1); g.fillRect(4, 20, 16, 12);
    g.fillStyle(0x78350f, 1); g.fillRect(6, 20, 12, 2);
    g.fillStyle(0x44403c, 1); g.fillRect(5, 18, 14, 4);
    g.fillStyle(0x166534, 1); g.fillRect(11, 8, 2, 12);
    g.fillStyle(0x22c55e, 1); g.fillRect(6, 4, 6, 6); g.fillRect(12, 2, 6, 6); g.fillRect(4, 10, 5, 5); g.fillRect(15, 8, 5, 5);
    g.fillStyle(0x4ade80, 1); g.fillRect(7, 5, 2, 2); g.fillRect(13, 3, 2, 2);
    g.generateTexture('plant', 24, 32);
    g.destroy();
  }

  private createCoffeeMugSprite(): void {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xffffff, 1); g.fillRect(2, 4, 10, 12);
    g.fillStyle(0xe5e5e5, 1); g.fillRect(10, 4, 2, 12);
    g.fillStyle(0x78350f, 1); g.fillRect(3, 5, 8, 4);
    g.fillStyle(0xffffff, 1); g.fillRect(12, 6, 3, 2); g.fillRect(14, 6, 2, 6); g.fillRect(12, 10, 3, 2);
    g.fillStyle(0xd1d5db, 0.6); g.fillRect(5, 0, 2, 3); g.fillRect(8, 1, 2, 2);
    g.generateTexture('coffee', 16, 16);
    g.destroy();
  }
}
