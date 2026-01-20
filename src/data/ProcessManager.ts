import { ProcessData } from './types';
import { generateInitialProcesses, simulateProcessChange } from './MockData';
import { ANIMATION_CONFIG } from '../utils/constants';

type ProcessUpdateCallback = (processes: ProcessData[]) => void;

export class ProcessManager {
  private processes: ProcessData[] = [];
  private pollingTimer?: number;
  private callbacks: ProcessUpdateCallback[] = [];
  private isPolling: boolean = false;

  constructor() {
    this.processes = generateInitialProcesses(4);
  }

  public startPolling(): void {
    if (this.isPolling) return;
    this.isPolling = true;
    this.poll();
  }

  public stopPolling(): void {
    this.isPolling = false;
    if (this.pollingTimer) {
      clearTimeout(this.pollingTimer);
      this.pollingTimer = undefined;
    }
  }

  private poll(): void {
    if (!this.isPolling) return;
    this.processes = simulateProcessChange(this.processes);
    this.notifyCallbacks();
    this.pollingTimer = window.setTimeout(() => this.poll(), ANIMATION_CONFIG.POLLING_INTERVAL);
  }

  public onUpdate(callback: ProcessUpdateCallback): () => void {
    this.callbacks.push(callback);
    callback(this.getProcesses());
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) this.callbacks.splice(index, 1);
    };
  }

  private notifyCallbacks(): void {
    const processes = this.getProcesses();
    for (const callback of this.callbacks) callback(processes);
  }

  public getProcesses(): ProcessData[] { return [...this.processes]; }

  public addProcess(): void {
    const newProcess = generateInitialProcesses(1)[0];
    this.processes.push(newProcess);
    this.notifyCallbacks();
  }

  public removeProcess(id: string): void {
    const process = this.processes.find(p => p.id === id);
    if (process) {
      process.status = 'ended' as any;
      this.notifyCallbacks();
    }
  }
}

let instance: ProcessManager | null = null;
export function getProcessManager(): ProcessManager {
  if (!instance) instance = new ProcessManager();
  return instance;
}
