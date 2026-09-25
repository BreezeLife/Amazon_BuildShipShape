import { demoBeeAdapter } from "./simulator";
import type { BeeDataAdapter } from "./types";

// The official Bee CLI/MCP/Agent Skill should be wired here once access is available.
// Keeping the boundary typed prevents UI code from depending on unverified SDK names.
export function getBeeAdapter(): BeeDataAdapter {
  const mode = import.meta.env.VITE_BEE_MODE ?? "simulator";
  if (mode !== "simulator") {
    throw new Error("A real Bee adapter is not configured yet. Set VITE_BEE_MODE=simulator for the demo.");
  }
  return demoBeeAdapter;
}
