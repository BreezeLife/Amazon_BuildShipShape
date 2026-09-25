# DayTrace Findings

## Hackathon Constraints

- Bee projects must use real data recorded and processed through a Bee device or an Apple Watch running Bee software.
- The project must actually use that data through Bee CLI, MCP, or Agent Skills; a README mention or static mock is insufficient.
- Rokid Glasses can be an additional wearable interface, but it is not a substitute for the Bee data source.
- The MVP therefore needs a visible simulator mode for development and a clearly separated real Bee adapter for final integration.

## Product Direction

DayTrace turns fragmented wearable context into a calm end-of-day memory: a timeline of moments, a short pattern summary, and one actionable cue delivered to a wearable display. The first demo should make the data flow legible in under three minutes:

`Bee event -> DayTrace timeline -> AI-style synthesis -> Rokid cue`

## Unknowns To Resolve Later

- Official Bee Apple Watch software availability and supported models.
- Bee CLI/MCP/Agent Skill package and authentication details.
- Whether the final demo can use a live session plus a persisted, redacted replay.
