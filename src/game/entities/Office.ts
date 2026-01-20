import Phaser from 'phaser';
import { Employee } from './Employee';
import { Desk } from './Desk';
import { ProcessData } from '../../data/types';
import { EmployeeState, ProcessStatus, OFFICE_CONFIG } from '../../utils/constants';

export class Office {
  private scene: Phaser.Scene;
  private desks: Desk[] = [];
  private employees: Map<string, Employee> = new Map();
  private nextCharacterType: number = 0;

  constructor(scene: Phaser.Scene) { this.scene = scene; }

  public updateProcesses(processes: ProcessData[]): void {
    const activeProcessIds = new Set(processes.map(p => p.id));
    for (const [processId] of this.employees) {
      if (!activeProcessIds.has(processId)) this.removeEmployee(processId);
    }
    for (const process of processes) {
      const existing = this.employees.get(process.id);
      if (existing) this.updateEmployeeState(existing, process);
      else if (process.status !== ProcessStatus.ENDED) this.addEmployee(process);
    }
  }

  private addEmployee(process: ProcessData): void {
    let desk: Desk | undefined = this.desks.find(d => !d.isOccupied);
    if (!desk) desk = this.createDesk() ?? undefined;
    if (!desk) return;
    desk.setOccupied(true);
    const pos = desk.getEmployeePosition();
    const employee = new Employee(this.scene, pos.x, pos.y, this.nextCharacterType, process.id);
    employee.setDepth(10);
    this.employees.set(process.id, employee);
    this.nextCharacterType = (this.nextCharacterType + 1) % 5;
    this.updateEmployeeState(employee, process);
    employee.setAlpha(0);
    this.scene.tweens.add({ targets: employee, alpha: 1, duration: 500, ease: 'Power2' });
  }

  private removeEmployee(processId: string): void {
    const employee = this.employees.get(processId);
    if (!employee) return;
    employee.setEmployeeState(EmployeeState.AWAY);
    this.scene.tweens.add({
      targets: employee, alpha: 0, y: employee.y - 20, duration: 800, ease: 'Power2',
      onComplete: () => { employee.destroy(); this.employees.delete(processId); }
    });
  }

  private updateEmployeeState(employee: Employee, process: ProcessData): void {
    switch (process.status) {
      case ProcessStatus.ACTIVE: employee.setEmployeeState(EmployeeState.WORKING); break;
      case ProcessStatus.IDLE: employee.setEmployeeState(EmployeeState.IDLE); break;
      case ProcessStatus.ENDED: employee.setEmployeeState(EmployeeState.AWAY); break;
    }
  }

  private createDesk(): Desk | null {
    const count = this.desks.length;
    if (count >= OFFICE_CONFIG.MAX_COLUMNS * 4) return null;
    const col = count % OFFICE_CONFIG.MAX_COLUMNS;
    const row = Math.floor(count / OFFICE_CONFIG.MAX_COLUMNS);
    const x = OFFICE_CONFIG.START_X + col * OFFICE_CONFIG.DESK_SPACING_X;
    const y = OFFICE_CONFIG.START_Y + row * OFFICE_CONFIG.DESK_SPACING_Y;
    const desk = new Desk(this.scene, x, y);
    desk.setDepth(5);
    this.desks.push(desk);
    return desk;
  }

  public getEmployeeCount(): number { return this.employees.size; }
  public getActiveCount(): number { let c = 0; for (const e of this.employees.values()) if (e.getState() === EmployeeState.WORKING) c++; return c; }
  public getIdleCount(): number { let c = 0; for (const e of this.employees.values()) if (e.getState() === EmployeeState.IDLE) c++; return c; }
  public getAllEmployees(): Employee[] { return Array.from(this.employees.values()); }
}
