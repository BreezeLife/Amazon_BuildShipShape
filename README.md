# DayTrace

DayTrace is a wearable-first personal context demo for the Amazon Developer Hackathon Bee track. It turns a day of small signals into a readable timeline, a short reflection, and one actionable cue for a Rokid companion display.

The app currently runs in an honest simulator mode. Every demo memory is marked `source: "simulator"`, and the UI labels the stream as simulated. The project must not claim Bee-track compliance until an official Bee CLI, MCP, or Agent Skill integration is connected and verified.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the URL printed by Vite. The production build can be checked with:

```bash
npm run build
npm run preview
```

## What the demo shows

- A daily context timeline with focus, movement, people, place, and capture signals.
- Filtering and selection of moments, including confidence and provenance.
- A day review with focus, continuity, and recovery indicators.
- A `Capture signal` interaction that appends a simulated live event.
- A Rokid companion preview that records a simulated cue send.

## Architecture

The UI depends on typed adapter contracts rather than a vendor SDK:

- `src/lib/bee/types.ts` defines `BeeMemory`, `BeeDay`, and `BeeDataAdapter`.
- `src/lib/bee/simulator.ts` provides deterministic local demo data.
- `src/lib/bee/adapter.ts` is the only mode-selection boundary. It currently accepts `VITE_BEE_MODE=simulator` and fails clearly for any unconfigured mode.
- `src/lib/rokid/types.ts` and `src/lib/rokid/simulator.ts` isolate wearable output from the UI.

## Bee integration checklist

Before presenting the project as Bee-track compliant:

1. Obtain official Bee access and document the supported CLI, MCP, or Agent Skill path.
2. Implement a production `BeeDataAdapter` in `src/lib/bee/` without changing the UI contract.
3. Map official Bee records into the typed `BeeMemory` shape and preserve source provenance as `bee`.
4. Add authentication and endpoint configuration without committing credentials.
5. Test the live adapter with a redacted replay and confirm that the demo can distinguish live and simulated records.
6. Update the stream badge, README, and submission notes only after live data is verified.

The current app intentionally does not invent Bee endpoint names, SDK calls, or authentication behavior.

## Rokid boundary

The current Rokid implementation is a companion output simulator and an on-screen preview. A native Rokid CXR-S integration should implement `RokidOutputAdapter` separately, then be selected behind a runtime configuration once the device SDK and deployment target are confirmed.

## Project status

The frontend MVP is complete. Build and smoke verification remains environment-dependent because this workspace is stored in iCloud; run the commands above from a local checkout before publishing.
