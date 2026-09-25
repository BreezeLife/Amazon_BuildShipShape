import type { BeeMemory } from "./bee/types";

export const kindLabels: Record<BeeMemory["kind"], string> = {
  focus: "Focus",
  movement: "Movement",
  people: "People",
  place: "Place",
  capture: "Capture",
};

export const kindAccent: Record<BeeMemory["kind"], string> = {
  focus: "violet",
  movement: "green",
  people: "coral",
  place: "blue",
  capture: "gold",
};

export function minutesToDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  if (!hours) return `${remaining}m`;
  return `${hours}h ${remaining.toString().padStart(2, "0")}m`;
}
