export type CuePriority = "low" | "normal" | "high";

export interface RokidCue {
  title: string;
  body: string;
  priority: CuePriority;
  sentAt: string;
}

export interface RokidOutputAdapter {
  sendCue(cue: RokidCue): Promise<RokidCue>;
}
