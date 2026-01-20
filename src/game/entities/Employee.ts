import Phaser from 'phaser';
import { EmployeeState, ANIMATION_CONFIG } from '../../utils/constants';

export class Employee extends Phaser.GameObjects.Container {
  private sprite: Phaser.GameObjects.Sprite;
  private currentState: EmployeeState = EmployeeState.WORKING;
  private characterType: number;
  private animTimer?: Phaser.Time.TimerEvent;
  private breathTween?: Phaser.Tweens.Tween;

  private static readonly FRAME_WIDTH = 32;
  private static readonly FRAME_HEIGHT = 32;
  private static readonly FRAMES_PER_STATE = 4;

  constructor(scene: Phaser.Scene, x: number, y: number, characterType: number, public readonly processId: string) {
    super(scene, x, y);
    this.characterType = characterType % 5;
    this.sprite = scene.add.sprite(0, 0, 'employees');
    this.sprite.setScale(1.5);
    this.add(this.sprite);
    this.updateFrame(0);
    this.startAnimation();
    this.startBreathAnimation();
    this.sprite.setInteractive();
    this.setSize(Employee.FRAME_WIDTH * 1.5, Employee.FRAME_HEIGHT * 1.5);
    scene.add.existing(this as unknown as Phaser.GameObjects.GameObject);
  }

  private updateFrame(frameIndex: number): void {
    const stateOffset = this.getStateOffset();
    const x = (stateOffset + frameIndex) * Employee.FRAME_WIDTH;
    const y = this.characterType * Employee.FRAME_HEIGHT;
    this.sprite.setCrop(x, y, Employee.FRAME_WIDTH, Employee.FRAME_HEIGHT);
  }

  private getStateOffset(): number {
    switch (this.currentState) {
      case EmployeeState.WORKING: return 0;
      case EmployeeState.IDLE: return Employee.FRAMES_PER_STATE;
      case EmployeeState.AWAY: return Employee.FRAMES_PER_STATE * 2;
      default: return 0;
    }
  }

  private startAnimation(): void {
    if (this.animTimer) this.animTimer.destroy();
    const delay = this.currentState === EmployeeState.WORKING ? 150 + Math.random() * 100 : 400 + Math.random() * 200;
    let currentFrame = 0;
    this.animTimer = this.scene.time.addEvent({
      delay, loop: true,
      callback: () => { currentFrame = (currentFrame + 1) % Employee.FRAMES_PER_STATE; this.updateFrame(currentFrame); }
    });
  }

  private startBreathAnimation(): void {
    if (this.breathTween) this.breathTween.stop();
    const amplitude = this.currentState === EmployeeState.WORKING ? 2 : 3;
    this.breathTween = this.scene.tweens.add({
      targets: this, y: this.y - amplitude, duration: 800 + Math.random() * 400,
      ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
    });
  }

  public setEmployeeState(newState: EmployeeState): void {
    if (this.currentState === newState) return;
    this.currentState = newState;
    this.startAnimation();
    this.startBreathAnimation();
    if (newState === EmployeeState.AWAY) {
      this.scene.tweens.add({ targets: this, alpha: 0.3, duration: 500, ease: 'Power2' });
    }
  }

  public getState(): EmployeeState { return this.currentState; }
  public getProcessId(): string { return this.processId; }

  public destroy(fromScene?: boolean): void {
    if (this.animTimer) this.animTimer.destroy();
    if (this.breathTween) this.breathTween.stop();
    super.destroy(fromScene);
  }
}
