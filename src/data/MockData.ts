import { ProcessData } from './types';
import { ProcessStatus } from '../utils/constants';

const PROCESS_NAMES = ['claude-code', 'npm build', 'tsc --watch', 'vite dev', 'jest --watch', 'eslint', 'prettier', 'git pull', 'docker build', 'webpack'];
const COMMANDS = ['Analyzing code...', 'Building project...', 'Running tests...', 'Linting files...', 'Formatting code...', 'Compiling TypeScript...', 'Hot reloading...', 'Installing dependencies...'];

let processIdCounter = 0;

export function generateMockProcess(): ProcessData {
  const id = `proc_${++processIdCounter}`;
  const now = Date.now();
  return {
    id,
    name: PROCESS_NAMES[Math.floor(Math.random() * PROCESS_NAMES.length)],
    status: ProcessStatus.ACTIVE,
    startTime: now,
    lastActiveTime: now,
    command: COMMANDS[Math.floor(Math.random() * COMMANDS.length)],
  };
}

export function generateInitialProcesses(count: number): ProcessData[] {
  const processes: ProcessData[] = [];
  for (let i = 0; i < count; i++) {
    processes.push(generateMockProcess());
  }
  return processes;
}

export function simulateProcessChange(processes: ProcessData[]): ProcessData[] {
  const updated = [...processes];
  const now = Date.now();

  for (const process of updated) {
    if (process.status === ProcessStatus.ENDED) continue;
    const random = Math.random();
    if (random < 0.1 && process.status === ProcessStatus.ACTIVE) {
      process.status = ProcessStatus.IDLE;
    } else if (random < 0.15 && process.status === ProcessStatus.IDLE) {
      process.status = ProcessStatus.ACTIVE;
      process.lastActiveTime = now;
    } else if (random < 0.18) {
      process.status = ProcessStatus.ENDED;
    } else if (process.status === ProcessStatus.ACTIVE) {
      process.lastActiveTime = now;
    }
  }

  if (Math.random() < 0.05 && updated.filter(p => p.status !== ProcessStatus.ENDED).length < 12) {
    updated.push(generateMockProcess());
  }

  return updated.filter(p => p.status !== ProcessStatus.ENDED || now - p.lastActiveTime < 5000);
}
