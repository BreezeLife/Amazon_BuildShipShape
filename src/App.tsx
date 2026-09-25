import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Brain,
  CalendarDays,
  Check,
  Clock3,
  CircleHelp,
  Glasses,
  MapPin,
  Menu,
  Pause,
  Play,
  Plus,
  Radio,
  Send,
  Sparkles,
  Sunrise,
  Tag,
  X,
} from "lucide-react";
import { getBeeAdapter } from "./lib/bee/adapter";
import type { BeeDataAdapter, BeeDay, BeeMemory, MemoryKind } from "./lib/bee/types";
import { kindAccent, kindLabels, minutesToDuration } from "./lib/daytrace";
import { demoRokidAdapter } from "./lib/rokid/simulator";
import type { RokidCue } from "./lib/rokid/types";

type Filter = "all" | MemoryKind;
type ViewMode = "timeline" | "review";

const filters: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All signals" },
  { value: "focus", label: "Focus" },
  { value: "movement", label: "Movement" },
  { value: "people", label: "People" },
  { value: "place", label: "Places" },
  { value: "capture", label: "Captures" },
];

function App() {
  const [day, setDay] = useState<BeeDay | null>(null);
  const [selectedId, setSelectedId] = useState("m-1455");
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<ViewMode>("timeline");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [lastCue, setLastCue] = useState<RokidCue | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const adapterState = useMemo<{ adapter: BeeDataAdapter | null; error: string | null }>(() => {
    try {
      return { adapter: getBeeAdapter(), error: null };
    } catch (adapterError) {
      return {
        adapter: null,
        error: adapterError instanceof Error ? adapterError.message : "Bee adapter unavailable",
      };
    }
  }, []);
  const adapter = adapterState.adapter;

  useEffect(() => {
    if (adapterState.error) {
      setError(adapterState.error);
      setIsLoading(false);
      return;
    }
    if (!adapter) {
      setIsLoading(false);
      return;
    }
    adapter
      .getDay("2026-09-25")
      .then((nextDay) => {
        setDay(nextDay);
        setIsLoading(false);
      })
      .catch(() => {
        setError("We could not load the day stream.");
        setIsLoading(false);
      });
  }, [adapter, adapterState.error]);

  const visibleMemories = useMemo(() => {
    if (!day) return [];
    if (filter === "all") return day.memories;
    return day.memories.filter((memory) => memory.kind === filter);
  }, [day, filter]);

  const selectedMemory = day?.memories.find((memory) => memory.id === selectedId) ?? visibleMemories[visibleMemories.length - 1];

  async function addLiveSignal() {
    if (!adapter || !day) return;
    setIsAdding(true);
    try {
      const nextDay = await adapter.addSampleMemory();
      setDay(nextDay);
      setSelectedId(nextDay.memories[nextDay.memories.length - 1].id);
    } catch {
      setError("We could not capture a new signal.");
    } finally {
      setIsAdding(false);
    }
  }

  async function sendCue() {
    if (!day) return;
    setIsSending(true);
    try {
      const cue = await demoRokidAdapter.sendCue({
        title: "DayTrace cue",
        body: day.nextCue,
        priority: "normal",
        sentAt: new Date().toISOString(),
      });
      setLastCue(cue);
    } catch {
      setError("We could not send the cue to the companion preview.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${isNavOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Brain size={17} strokeWidth={2.4} /></div>
          <span>DayTrace</span>
          <button className="icon-button sidebar-close" onClick={() => setIsNavOpen(false)} aria-label="Close navigation">
            <X size={17} />
          </button>
        </div>
        <div className="workspace-switcher">
          <div className="avatar">W</div>
          <div>
            <strong>Wei's day</strong>
            <span>Personal context</span>
          </div>
        </div>
        <nav className="primary-nav" aria-label="Primary">
          <div className="nav-item active" aria-current="page"><CalendarDays size={17} /><span>Today</span><span className="nav-dot" /></div>
        </nav>
        <div className="nav-divider" />
        <div className="sidebar-caption">Your system</div>
        <button className="nav-item" onClick={() => setIsLive((value) => !value)}>
          <Radio size={17} />
          <span>Demo stream</span>
          <span className={`stream-dot ${isLive ? "on" : "off"}`} />
        </button>
        <div className="sidebar-footer">
          <div className="version-label">DAYTRACE / 0.1.0</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setIsNavOpen(true)} aria-label="Open navigation">
            <Menu size={19} />
          </button>
          <div className="breadcrumb"><span>Today</span><span className="breadcrumb-slash">/</span><span className="muted">Daily signal</span></div>
          <div className="topbar-actions">
            <div className="data-badge"><span className="pulse-dot" />{adapter?.source === "bee" ? "Bee stream" : "Simulated Bee stream"}</div>
            <div className="avatar avatar-small">W</div>
          </div>
        </header>

        <div className="content-wrap">
          <div className="page-heading">
            <div>
              <div className="eyebrow"><Sunrise size={15} /> FRIDAY, SEPTEMBER 25</div>
              <h1>Make sense of your day.</h1>
              <p>DayTrace turns small signals into a memory you can use.</p>
            </div>
            <div className="heading-actions">
              <button className="secondary-button" onClick={addLiveSignal} disabled={isAdding || !day || !isLive}>
                {isAdding ? <Activity className="spin" size={16} /> : <Plus size={16} />}
                {isAdding ? "Adding..." : "Add demo signal"}
              </button>
              <button className="primary-button" onClick={sendCue} disabled={isSending || !day}>
                {isSending ? <Activity className="spin" size={16} /> : <Glasses size={16} />}
                {isSending ? "Sending..." : "Send preview cue"}
              </button>
            </div>
          </div>

          {error && <div className="error-banner"><CircleHelp size={17} /><span>{error}</span><button className="icon-button" onClick={() => setError(null)} aria-label="Dismiss error"><X size={15} /></button></div>}

          {isLoading ? <LoadingState /> : day ? (
            <>
              <section className="signal-header" aria-label="Daily signal summary">
                <div className="signal-title">
                  <div className="signal-kicker"><Sparkles size={15} /> DAILY SIGNAL</div>
                  <h2>{day.headline}</h2>
                  <p>{day.reflection}</p>
                </div>
                <div className="metric-strip">
                  <Metric label="Active" value={minutesToDuration(day.metrics.activeMinutes)} detail="in motion" />
                  <Metric label="Focus" value={minutesToDuration(day.metrics.focusMinutes)} detail="deep work" />
                  <Metric label="Places" value={String(day.metrics.places)} detail="contexts" />
                  <Metric label="Captures" value={String(day.metrics.captures)} detail="moments" />
                </div>
              </section>

              <div className="view-switcher" role="tablist" aria-label="Day view">
                <button className={view === "timeline" ? "selected" : ""} onClick={() => setView("timeline")} role="tab" aria-selected={view === "timeline"}>Timeline</button>
                <button className={view === "review" ? "selected" : ""} onClick={() => setView("review")} role="tab" aria-selected={view === "review"}>Review</button>
                <div className="date-controls">
                  <span>{day.displayDate}</span>
                </div>
              </div>

              {view === "timeline" ? (
                <div className="dashboard-grid">
                  <section className="timeline-panel panel">
                    <div className="panel-heading">
                      <div><h3>Context timeline</h3><span>{visibleMemories.length} signals from your stream</span></div>
                    </div>
                    <div className="filter-row" aria-label="Signal filters">
                      {filters.map((item) => <button key={item.value} className={filter === item.value ? "filter active" : "filter"} onClick={() => setFilter(item.value)}>{item.label}</button>)}
                    </div>
                    <div className="timeline-list">
                      {visibleMemories.map((memory) => <MemoryRow key={memory.id} memory={memory} selected={selectedMemory?.id === memory.id} onSelect={() => setSelectedId(memory.id)} />)}
                      {!visibleMemories.length && <EmptyState />}
                    </div>
                    <div className="timeline-footer"><span><Radio size={14} /> {isLive ? "Demo stream ready" : "Demo stream paused"}</span><button onClick={() => setIsLive((value) => !value)}>{isLive ? <Pause size={13} /> : <Play size={13} />}{isLive ? "Pause" : "Resume"}</button></div>
                  </section>

                  <aside className="detail-column">
                    <section className="detail-panel panel">
                      <div className="panel-heading"><div><h3>Selected moment</h3><span>{selectedMemory?.timeLabel ?? "No selection"}</span></div><Tag size={17} className="muted-icon" /></div>
                      {selectedMemory ? <MemoryDetail memory={selectedMemory} /> : <EmptyState />}
                    </section>
                    <RokidPanel cue={lastCue} onSend={sendCue} isSending={isSending} nextCue={day.nextCue} />
                  </aside>
                </div>
              ) : <ReviewView day={day} onSend={sendCue} isSending={isSending} />}
            </>
          ) : <EmptyState />}
        </div>
      </main>
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>;
}

function MemoryRow({ memory, selected, onSelect }: { memory: BeeMemory; selected: boolean; onSelect: () => void }) {
  return (
    <button className={`memory-row ${selected ? "selected" : ""}`} onClick={onSelect}>
      <div className={`timeline-marker ${kindAccent[memory.kind]}`}><KindIcon kind={memory.kind} /></div>
      <div className="memory-time">{memory.timeLabel}</div>
      <div className="memory-content"><div className="memory-title"><strong>{memory.title}</strong><span className="memory-kind">{kindLabels[memory.kind]}</span></div><p>{memory.detail}</p><div className="memory-meta"><span><MapPin size={12} />{memory.location}</span>{memory.durationMinutes && <span><Clock3 size={12} />{memory.durationMinutes} min</span>}</div></div>
      <ArrowRight size={15} className="row-arrow" />
    </button>
  );
}

function MemoryDetail({ memory }: { memory: BeeMemory }) {
  return <div className="memory-detail"><div className={`detail-icon ${kindAccent[memory.kind]}`}><KindIcon kind={memory.kind} /></div><h4>{memory.title}</h4><p>{memory.detail}</p><div className="detail-tags">{memory.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div><div className="confidence"><div><span>Context confidence</span><strong>{Math.round(memory.confidence * 100)}%</strong></div><div className="confidence-bar"><span style={{ width: `${memory.confidence * 100}%` }} /></div></div><div className="provenance"><Radio size={13} /><span>Source: {memory.source === "bee" ? "Bee data" : "simulated data"}</span></div></div>;
}

function RokidPanel({ cue, onSend, isSending, nextCue }: { cue: RokidCue | null; onSend: () => void; isSending: boolean; nextCue: string }) {
  return <section className="rokid-panel panel"><div className="panel-heading"><div><h3>Rokid companion</h3><span>Wearable output preview</span></div><div className="connected-label"><span className="connected-dot" /> Preview ready</div></div><div className="glasses-stage"><div className="glasses-orbit orbit-one" /><div className="glasses-orbit orbit-two" /><Glasses size={54} strokeWidth={1.35} /><span className="glasses-caption">Rokid</span></div><div className="cue-preview"><div className="cue-label"><span>Next cue</span><span className="cue-live">{cue ? "Preview sent" : "Preview"}</span></div><p>{cue?.body ?? nextCue}</p></div><button className="outline-button full-width" onClick={onSend} disabled={isSending}>{cue ? <Check size={15} /> : <Send size={15} />}{cue ? "Preview cue sent" : "Send preview cue"}</button><div className="device-note"><Glasses size={13} /><span>Simulated companion output for this build</span></div></section>;
}

function ReviewView({ day, onSend, isSending }: { day: BeeDay; onSend: () => void; isSending: boolean }) {
  const focusPercent = Math.min(100, Math.round((day.metrics.focusMinutes / day.metrics.activeMinutes) * 100));
  return <div className="review-grid"><section className="review-main panel"><div className="review-top"><div><div className="signal-kicker"><Sparkles size={15} /> DAY REVIEW</div><h3>The shape of today</h3></div><span className="review-date">{day.displayDate}</span></div><p className="review-lead">{day.reflection}</p><div className="review-bars"><div className="review-bar-row"><div><span>Focus density</span><strong>{focusPercent}%</strong></div><div className="review-bar"><span style={{ width: `${focusPercent}%` }} /></div></div><div className="review-bar-row"><div><span>Context continuity</span><strong>82%</strong></div><div className="review-bar coral"><span style={{ width: "82%" }} /></div></div><div className="review-bar-row"><div><span>Recovery rhythm</span><strong>74%</strong></div><div className="review-bar green"><span style={{ width: "74%" }} /></div></div></div><div className="review-callout"><div className="callout-icon"><Sunrise size={17} /></div><div><span>One thing worth carrying forward</span><strong>{day.nextCue}</strong></div></div></section><section className="review-side panel"><div className="panel-heading"><div><h3>Tomorrow cue</h3><span>Companion output preview</span></div><Glasses size={17} className="muted-icon" /></div><div className="tomorrow-cue"><div className="cue-number">01</div><p>{day.nextCue}</p></div><button className="primary-button full-width" onClick={onSend} disabled={isSending}>{isSending ? <Activity className="spin" size={15} /> : <Glasses size={15} />}{isSending ? "Sending..." : "Send preview cue"}</button></section></div>;
}

function KindIcon({ kind }: { kind: MemoryKind }) {
  if (kind === "movement") return <Activity size={15} />;
  if (kind === "focus") return <Brain size={15} />;
  if (kind === "people") return <span className="kind-letter">P</span>;
  if (kind === "place") return <MapPin size={15} />;
  return <Tag size={15} />;
}

function LoadingState() {
  return <div className="loading-state"><div className="loading-line wide" /><div className="loading-line" /><div className="loading-panel"><div className="loading-line" /><div className="loading-line short" /><div className="loading-line" /></div></div>;
}

function EmptyState() {
  return <div className="empty-state"><Radio size={18} /><strong>No signals here yet</strong><span>New moments will appear when your stream continues.</span></div>;
}

export { App };
