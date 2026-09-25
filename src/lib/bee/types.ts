export type MemoryKind = "focus" | "movement" | "people" | "place" | "capture";
export type DataSource = "simulator" | "bee";

export interface BeeMemory {
  id: string;
  timestamp: string;
  timeLabel: string;
  kind: MemoryKind;
  title: string;
  detail: string;
  location: string;
  tags: string[];
  confidence: number;
  source: DataSource;
  durationMinutes?: number;
}

export interface BeeDayMetrics {
  activeMinutes: number;
  focusMinutes: number;
  places: number;
  captures: number;
}

export interface BeeDay {
  date: string;
  displayDate: string;
  weekday: string;
  memories: BeeMemory[];
  metrics: BeeDayMetrics;
  headline: string;
  reflection: string;
  nextCue: string;
}

export interface BeeDataAdapter {
  readonly source: DataSource;
  getDay(date: string): Promise<BeeDay>;
  addSampleMemory(memory?: BeeMemory): Promise<BeeDay>;
}
