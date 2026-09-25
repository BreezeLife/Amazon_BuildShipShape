import type { RokidCue, RokidOutputAdapter } from "./types";

export class SimulatedRokidAdapter implements RokidOutputAdapter {
  async sendCue(cue: RokidCue): Promise<RokidCue> {
    await new Promise<void>((resolve) => setTimeout(resolve, 380));
    return cue;
  }
}

export const demoRokidAdapter = new SimulatedRokidAdapter();
