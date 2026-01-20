import { ProcessStatus } from '../utils/constants';

export interface ProcessData {
  id: string;
  name: string;
  status: ProcessStatus;
  startTime: number;
  lastActiveTime: number;
  command?: string;
}

export interface EmployeeData {
  processId: string;
  characterType: number;
  deskIndex: number;
}

export interface OfficeState {
  processes: ProcessData[];
  employees: EmployeeData[];
  totalDesks: number;
}
