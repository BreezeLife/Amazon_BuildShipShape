import type { BeeDataAdapter, BeeDay, BeeMemory, MemoryKind } from "./types";

const baseMemories: BeeMemory[] = [
  {
    id: "m-0812",
    timestamp: "2026-09-25T08:12:00+08:00",
    timeLabel: "08:12",
    kind: "movement",
    title: "Morning walk",
    detail: "A steady 24-minute loop before the first meeting.",
    location: "Riverside path",
    tags: ["movement", "morning"],
    confidence: 0.98,
    source: "simulator",
    durationMinutes: 24,
  },
  {
    id: "m-0905",
    timestamp: "2026-09-25T09:05:00+08:00",
    timeLabel: "09:05",
    kind: "focus",
    title: "Deep work block",
    detail: "You stayed on one task for 76 minutes with no context switch.",
    location: "Home office",
    tags: ["focus", "writing"],
    confidence: 0.91,
    source: "simulator",
    durationMinutes: 76,
  },
  {
    id: "m-1048",
    timestamp: "2026-09-25T10:48:00+08:00",
    timeLabel: "10:48",
    kind: "people",
    title: "Conversation with Maya",
    detail: "A 32-minute conversation about the launch narrative and customer proof.",
    location: "Home office",
    tags: ["people", "launch"],
    confidence: 0.87,
    source: "simulator",
    durationMinutes: 32,
  },
  {
    id: "m-1216",
    timestamp: "2026-09-25T12:16:00+08:00",
    timeLabel: "12:16",
    kind: "place",
    title: "Lunch away from desk",
    detail: "You left the workspace and took a full break before the afternoon.",
    location: "North Market",
    tags: ["place", "break"],
    confidence: 0.95,
    source: "simulator",
    durationMinutes: 42,
  },
  {
    id: "m-1340",
    timestamp: "2026-09-25T13:40:00+08:00",
    timeLabel: "13:40",
    kind: "capture",
    title: "Voice note captured",
    detail: "“Show the before-and-after workflow in the demo.”",
    location: "North Market",
    tags: ["capture", "idea"],
    confidence: 0.89,
    source: "simulator",
  },
  {
    id: "m-1455",
    timestamp: "2026-09-25T14:55:00+08:00",
    timeLabel: "14:55",
    kind: "focus",
    title: "Prototype review",
    detail: "Three concrete decisions moved the DayTrace prototype forward.",
    location: "Home office",
    tags: ["focus", "prototype"],
    confidence: 0.93,
    source: "simulator",
    durationMinutes: 58,
  },
  {
    id: "m-1642",
    timestamp: "2026-09-25T16:42:00+08:00",
    timeLabel: "16:42",
    kind: "movement",
    title: "Reset walk",
    detail: "A short reset created a clean handoff into the evening.",
    location: "Riverside path",
    tags: ["movement", "reset"],
    confidence: 0.9,
    source: "simulator",
    durationMinutes: 18,
  },
];

const initialDay: BeeDay = {
  date: "2026-09-25",
  displayDate: "September 25, 2026",
  weekday: "Friday",
  memories: baseMemories,
  metrics: {
    activeMinutes: 256,
    focusMinutes: 134,
    places: 3,
    captures: 8,
  },
  headline: "A focused day with one useful reset.",
  reflection:
    "Your best work came after leaving the desk at lunch. The two focused blocks were shorter than yesterday, but they produced clearer decisions and one strong demo idea.",
  nextCue: "Protect the first 60 minutes tomorrow for the launch narrative.",
};

const cloneDay = (day: BeeDay): BeeDay => ({
  ...day,
  memories: day.memories.map((memory) => ({ ...memory, tags: [...memory.tags] })),
  metrics: { ...day.metrics },
});

const createSampleMemory = (kind: MemoryKind, index: number): BeeMemory => ({
  id: `m-live-${Date.now()}`,
  timestamp: new Date().toISOString(),
  timeLabel: new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()),
  kind,
  title: kind === "capture" ? "Demo thought captured" : "Demo context signal",
  detail: "A simulated moment was added to this day for the demo.",
  location: "Current context",
  tags: [kind, "live"],
  confidence: 0.84 + (index % 10) / 100,
  source: "simulator",
});

export class SimulatedBeeAdapter implements BeeDataAdapter {
  readonly source = "simulator" as const;
  private currentDay = cloneDay(initialDay);

  async getDay(_date: string): Promise<BeeDay> {
    await new Promise((resolve) => window.setTimeout(resolve, 260));
    return cloneDay(this.currentDay);
  }

  async addSampleMemory(memory = createSampleMemory("capture", this.currentDay.memories.length)): Promise<BeeDay> {
    this.currentDay.memories = [...this.currentDay.memories, memory];
    this.currentDay.metrics = {
      ...this.currentDay.metrics,
      captures: this.currentDay.metrics.captures + 1,
    };
    return cloneDay(this.currentDay);
  }
}

export const demoBeeAdapter = new SimulatedBeeAdapter();
