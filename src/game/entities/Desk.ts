import Phaser from 'phaser';

export class Desk extends Phaser.GameObjects.Container {
  private deskSprite: Phaser.GameObjects.Image;
  private chairSprite: Phaser.GameObjects.Image;
  private _isOccupied: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.chairSprite = scene.add.image(0, -20, 'chair');
    this.chairSprite.setScale(1.2);
    this.add(this.chairSprite);
    this.deskSprite = scene.add.image(0, 0, 'desk');
    this.deskSprite.setScale(1.5);
    this.add(this.deskSprite);
    if (Math.random() > 0.4) {
      const coffee = scene.add.image(25, -10, 'coffee');
      this.add(coffee);
    }
    scene.add.existing(this);
  }

  public get isOccupied(): boolean { return this._isOccupied; }
  public setOccupied(occupied: boolean): void {
    this._isOccupied = occupied;
    if (!occupied) { this.deskSprite.setTint(0xcccccc); this.chairSprite.setTint(0xcccccc); }
    else { this.deskSprite.clearTint(); this.chairSprite.clearTint(); }
  }
  public getEmployeePosition(): { x: number; y: number } { return { x: this.x, y: this.y - 40 }; }
}
