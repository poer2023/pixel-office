import Phaser from 'phaser';
import { GAME_CONFIG, COLORS } from '../../utils/constants';

export class UIScene extends Phaser.Scene {
  private processCountText!: Phaser.GameObjects.Text;
  private activeText!: Phaser.GameObjects.Text;
  private idleText!: Phaser.GameObjects.Text;

  constructor() { super({ key: 'UIScene' }); }

  create(): void {
    const panelX = GAME_CONFIG.WIDTH - 10, panelY = 10;
    const bg = this.add.graphics();
    bg.fillStyle(COLORS.UI_BG, 0.9); bg.fillRoundedRect(panelX - 140, panelY, 130, 110, 8);
    bg.lineStyle(1, 0x374151, 1); bg.strokeRoundedRect(panelX - 140, panelY, 130, 110, 8);
    this.add.text(panelX - 130, panelY + 10, '📊 进程状态', { font: 'bold 13px Arial', color: '#ffffff' });
    bg.lineStyle(1, 0x374151, 0.5); bg.lineBetween(panelX - 130, panelY + 32, panelX - 20, panelY + 32);
    this.processCountText = this.add.text(panelX - 130, panelY + 40, '总进程: 0', { font: '12px Arial', color: '#94a3b8' });
    this.activeText = this.add.text(panelX - 130, panelY + 60, '🟢 活跃: 0', { font: '12px Arial', color: '#4ade80' });
    this.idleText = this.add.text(panelX - 130, panelY + 80, '🟡 空闲: 0', { font: '12px Arial', color: '#fbbf24' });
    this.add.text(10, GAME_CONFIG.HEIGHT - 25, '按 A 添加进程 | 按 R 移除进程', { font: '11px Arial', color: '#64748b' });
  }

  public updateStats(total: number, active: number, idle: number): void {
    this.processCountText.setText(`总进程: ${total}`);
    this.activeText.setText(`🟢 活跃: ${active}`);
    this.idleText.setText(`🟡 空闲: ${idle}`);
    this.tweens.add({ targets: [this.processCountText, this.activeText, this.idleText], scaleX: 1.05, scaleY: 1.05, duration: 100, yoyo: true, ease: 'Power2' });
  }
}
