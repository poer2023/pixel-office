import Phaser from 'phaser';
import { GAME_CONFIG } from '../../utils/constants';
import { Office } from '../entities/Office';
import { getProcessManager, ProcessManager } from '../../data/ProcessManager';
import { ProcessData } from '../../data/types';

export class OfficeScene extends Phaser.Scene {
  private _floor!: Phaser.GameObjects.TileSprite;
  private _background?: Phaser.GameObjects.Image;
  private office!: Office;
  private processManager!: ProcessManager;
  private unsubscribe?: () => void;
  private tooltipContainer?: Phaser.GameObjects.Container;

  constructor() { super({ key: 'OfficeScene' }); }

  create(): void {
    // 尝试使用高质量背景，否则使用平铺地板
    if (this.textures.exists('office_bg')) {
      this._background = this.add.image(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT / 2, 'office_bg')
        .setDisplaySize(GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT)
        .setDepth(0);
      // 添加半透明遮罩让角色更突出
      this.add.graphics()
        .fillStyle(0x1a1a2e, 0.3)
        .fillRect(0, 0, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT)
        .setDepth(0.5);
    } else {
      this._floor = this.add.tileSprite(GAME_CONFIG.WIDTH / 2, GAME_CONFIG.HEIGHT / 2, GAME_CONFIG.WIDTH, GAME_CONFIG.HEIGHT, 'floor_tile').setDepth(0);
    }

    // 装饰性植物
    [{ x: 50, y: 100 }, { x: GAME_CONFIG.WIDTH - 50, y: 100 }, { x: 50, y: GAME_CONFIG.HEIGHT - 60 }, { x: GAME_CONFIG.WIDTH - 50, y: GAME_CONFIG.HEIGHT - 60 }]
      .forEach(pos => this.add.image(pos.x, pos.y, 'plant').setScale(1.5).setDepth(1));

    this.office = new Office(this);

    // 标题区域 - 添加渐变背景
    const titleBg = this.add.graphics();
    titleBg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x1a1a2e, 0x1a1a2e, 0.9, 0.9, 0, 0);
    titleBg.fillRect(0, 0, GAME_CONFIG.WIDTH, 70);
    titleBg.setDepth(99);

    this.add.text(GAME_CONFIG.WIDTH / 2, 25, '🏢 像素办公室', { font: 'bold 24px Arial', color: '#ffffff', shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 4, fill: true } }).setOrigin(0.5).setDepth(100);
    this.add.text(GAME_CONFIG.WIDTH / 2, 50, 'Claude Code 进程可视化', { font: '14px Arial', color: '#94a3b8' }).setOrigin(0.5).setDepth(100);

    this.scene.launch('UIScene');

    this.time.delayedCall(100, () => {
      this.processManager = getProcessManager();
      this.unsubscribe = this.processManager.onUpdate((processes) => this.handleProcessUpdate(processes));
      this.processManager.startPolling();
    });

    this.input.keyboard?.on('keydown-A', () => this.processManager?.addProcess());
    this.input.keyboard?.on('keydown-R', () => {
      const processes = this.processManager?.getProcesses();
      if (processes?.length) this.processManager.removeProcess(processes[processes.length - 1].id);
    });
  }

  private handleProcessUpdate(processes: ProcessData[]): void {
    this.office.updateProcesses(processes);
    const uiScene = this.scene.get('UIScene') as any;
    if (uiScene?.updateStats) uiScene.updateStats(this.office.getEmployeeCount(), this.office.getActiveCount(), this.office.getIdleCount());

    for (const employee of this.office.getAllEmployees()) {
      const process = processes.find(p => p.id === employee.getProcessId());
      if (!process) continue;
      employee.removeAllListeners();
      employee.setInteractive();
      employee.on('pointerover', () => this.showTooltip(employee.x, employee.y - 50, `${process.name}\n${process.command || '运行中...'}`));
      employee.on('pointerout', () => this.hideTooltip());
    }
  }

  private showTooltip(x: number, y: number, text: string): void {
    this.hideTooltip();
    const bg = this.add.graphics();
    bg.fillStyle(0x1f2937, 0.95); bg.fillRoundedRect(-70, -30, 140, 60, 6);
    bg.lineStyle(1, 0x4b5563, 1); bg.strokeRoundedRect(-70, -30, 140, 60, 6);
    const label = this.add.text(0, 0, text, { font: '10px Arial', color: '#ffffff', align: 'center' }).setOrigin(0.5);
    this.tooltipContainer = this.add.container(x, y, [bg, label]).setDepth(200);
  }

  private hideTooltip(): void { if (this.tooltipContainer) { this.tooltipContainer.destroy(); this.tooltipContainer = undefined; } }

  shutdown(): void { if (this.unsubscribe) this.unsubscribe(); this.processManager?.stopPolling(); }
}
