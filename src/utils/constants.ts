// 游戏配置常量
export const GAME_CONFIG = {
  WIDTH: 800,
  HEIGHT: 600,
  TILE_SIZE: 32,
  SCALE: 2,
};

// 员工状态
export enum EmployeeState {
  WORKING = 'working',
  IDLE = 'idle',
  AWAY = 'away',
}

// 进程状态
export enum ProcessStatus {
  ACTIVE = 'active',
  IDLE = 'idle',
  ENDED = 'ended',
}

// 颜色配置
export const COLORS = {
  BACKGROUND: 0x1a1a2e,
  FLOOR: 0x3d3d5c,
  DESK: 0x8b7355,
  UI_BG: 0x16213e,
  UI_TEXT: 0xffffff,
  STATUS_ACTIVE: 0x4ade80,
  STATUS_IDLE: 0xfbbf24,
  STATUS_ENDED: 0xef4444,
};

// 动画配置
export const ANIMATION_CONFIG = {
  FRAME_RATE: 8,
  IDLE_SWITCH_INTERVAL: 5000,
  POLLING_INTERVAL: 3000,
};

// 办公室布局
export const OFFICE_CONFIG = {
  DESK_SPACING_X: 96,
  DESK_SPACING_Y: 80,
  START_X: 100,
  START_Y: 150,
  MAX_COLUMNS: 6,
};
