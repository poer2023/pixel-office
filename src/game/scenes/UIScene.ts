import Phaser from 'phaser';
import { GAME_CONFIG, COLORS } from '../../utils/constants';

export class UIScene extends Phaser.Scene {
  private processCountText!: Phaser.GameObjects.Text;
  private activeText!: Phaser.GameObjects.Text;
  private idleText!: Phaser.GameObjects.Text;
  private panelContainer!: Phaser.GameObjects.Container;

  constructor() { super({ key: 'UIScene' }); }

  create(): void {
    const panelX = GAME_CONFIG.WIDTH - 10, panelY = 80;

    // 创建更精美的状态面板
    const bg = this.add.graphics();
    // 面板背景 - 渐变效果
    bg.fillGradientStyle(0x1e293b, 0x1e293b, 0x0f172a, 0x0f172a, 0.95, 0.95, 0.95, 0.95);
    bg.fillRoundedRect(panelX - 150, panelY, 140, 130, 10);
    // 边框发光效果
    bg.lineStyle(2, 0x3b82f6, 0.6);
    bg.strokeRoundedRect(panelX - 150, panelY, 140, 130, 10);
    // 顶部高亮线
    bg.lineStyle(1, 0x60a5fa, 0.8);
    bg.lineBetween(panelX - 140, panelY + 2, panelX - 20, panelY + 2);

    // 标题图标
    this.add.text(panelX - 140, panelY + 12, '📊', { font: '18px Arial' });
    this.add.text(panelX - 115, panelY + 12, '进程状态', { font: 'bold 14px Arial', color: '#e2e8f0' });

    // 分割线
    bg.lineStyle(1, 0x475569, 0.5);
    bg.lineBetween(panelX - 140, panelY + 40, panelX - 20, panelY + 40);

    // 统计数据 - 更大更清晰
    this.processCountText = this.add.text(panelX - 140, panelY + 50, '💻 总进程: 0', { font: 'bold 13px Arial', color: '#cbd5e1' });
    this.activeText = this.add.text(panelX - 140, panelY + 75, '🟢 活跃: 0', { font: 'bold 13px Arial', color: '#4ade80' });
    this.idleText = this.add.text(panelX - 140, panelY + 100, '🟡 空闲: 0', { font: 'bold 13px Arial', color: '#fbbf24' });

    // 底部操作提示 - 更美观的样式
    const helpBg = this.add.graphics();
    helpBg.fillStyle(0x1e293b, 0.8);
    helpBg.fillRoundedRect(10, GAME_CONFIG.HEIGHT - 40, 280, 30, 6);
    this.add.text(20, GAME_CONFIG.HEIGHT - 32, '⌨️ A 添加进程  |  R 移除进程', { font: '12px Arial', color: '#94a3b8' });

    // 添加版本信息
    this.add.text(GAME_CONFIG.WIDTH - 80, GAME_CONFIG.HEIGHT - 20, 'v1.0.0 ✨', { font: '10px Arial', color: '#475569' });
  }

  public updateStats(total: number, active: number, idle: number): void {
    this.processCountText.setText(`💻 总进程: ${total}`);
    this.activeText.setText(`🟢 活跃: ${active}`);
    this.idleText.setText(`🟡 空闲: ${idle}`);
    // 更流畅的动画效果
    this.tweens.add({
      targets: [this.processCountText, this.activeText, this.idleText],
      scaleX: 1.08, scaleY: 1.08,
      duration: 150,
      yoyo: true,
      ease: 'Back.easeOut'
    });
  }
}
