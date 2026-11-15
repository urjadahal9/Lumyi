import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownRight, ArrowUpRight, BarChart3, BrainCircuit,
  CheckCircle2, ChevronDown, CircleAlert, CloudRain, Database, Droplets,
  FileText, HeartPulse, Info, Layers3, MapPin, Menu, Radio, RefreshCw,
  Satellite, Search, ShieldCheck, Sparkles, Waves, X
} from "lucide-react";

const PLACES = [
  { name: "Kathmandu", district: "Bagmati", lat: 27.7172, lon: 85.3240, access: 24, mapped: 82 },
  { name: "Pokhara", district: "Gandaki", lat: 28.2096, lon: 83.9856, access: 32, mapped: 76 },
  { name: "Bharatpur", district: "Chitwan", lat: 27.6766, lon: 84.4359, access: 29, mapped: 70 },
  { name: "Biratnagar", district: "Koshi", lat: 26.4525, lon: 87.2718, access: 38, mapped: 68 },
  { name: "Nepalgunj", district: "Lumbini", lat: 28.0500, lon: 81.6167, access: 43, mapped: 58 },
  { name: "Dhangadhi", district: "Sudurpashchim", lat: 28.6950, lon: 80.5930, access: 49, mapped: 54 },
  { name: "Chautara", district: "Sindhupalchok", lat: 27.7780, lon: 85.7130, access: 61, mapped: 39 },
  { name: "Jumla", district: "Karnali", lat: 29.2747, lon: 82.1838, access: 68, mapped: 34 },
  { name: "Dunai", district: "Dolpa", lat: 28.9857, lon: 82.8190, access: 76, mapped: 26 },
  { name: "Simikot", district: "Humla", lat: 29.9711, lon: 81.8189, access: 79, mapped: 22 }
];

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(n)));
const level = (n) => n >= 70 ? "High" : n >= 40 ? "Moderate" : "Low";

function scorePlace(place, rain) {
  // Transparent demonstration formula, not a validated disaster probability.
  const rainSignal = clamp((rain / 80) * 100);
  const accessSignal = clamp((place.access / 90) * 100);
  const dataGapSignal = clamp(100 - place.mapped);
  const combined = clamp(rainSignal * 0.50 + accessSignal * 0.30 + dataGapSignal * 0.20);
  return { rainSignal, accessSignal, dataGapSignal, combined };
}

function classifyReport(text) {
  const t = text.toLowerCase();
  const rules = [
    { label: "Rising / overflowing water", words: ["river", "overflow", "flood", "water level", "rising water"] },
    { label: "Road access concern", words: ["road", "bridge", "blocked", "landslide", "path"] },
    { label: "Health access concern", words: ["hospital", "clinic", "ambulance", "medical", "injured"] },
    { label: "Heavy rainfall", words: ["rain", "rainfall", "storm", "cloudburst"] },
    { label: "Water shortage", words: ["shortage", "dry", "drinking water", "no water"] }
  ];
  return rules.filter(rule => rule.words.some(w => t.includes(w))).map(rule => rule.label);
}

function App() {
  const [selected, setSelected] = useState(PLACES[0]);
  const [weather, setWeather] = useState(null);
  const [weatherState, setWeatherState] = useState("loading");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [report, setReport] = useState("The river near the bridge is overflowing and the road to the hospital is blocked.");
  const [analysed, setAnalysed] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);

  async function loadWeather(place = selected) {
    setWeatherState("loading");
    setWeather(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lon}&daily=precipitation_sum&forecast_days=3&timezone=Asia%2FKathmandu`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Weather service unavailable");
      const data = await response.json();
      const rain = data.daily?.precipitation_sum?.[0];
      if (typeof rain !== "number") throw new Error("No rainfall value returned");
      setWeather({ rain, dates: data.daily.time, source: "Open-Meteo forecast" });
      setLastUpdated(new Date());
      setWeatherState("live");
    } catch {
      setWeatherState("unavailable");
    }
  }

  useEffect(() => { loadWeather(selected); }, [selected.name]);

  const rain = weather?.rain ?? 18; // clearly marked illustrative fallback
  const scores = useMemo(() => scorePlace(selected, rain), [selected, rain]);
  const reportSignals = useMemo(() => classifyReport(report), [report]);
  const riskLabel = level(scores.combined);
  const baseline = scores.rainSignal;
  const reportReady = report.trim().length > 8;

  const choosePlace = (place) => {
    setSelected(place);
    setMobileNav(false);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">L</div>
          <div><div className="brand-name">lumyi<span>.</span></div><div className="brand-sub">INVISIBLE CRISIS DETECTOR</div></div>
          <button className="icon-btn close-nav" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <div className="side-status"><span className="pulse"></span> PROTOTYPE · NEPAL</div>
        <div className="nav-label">WORKSPACE</div>
        <a className="nav-item active" href="#overview"><Activity size={17}/> Overview</a>
        <a className="nav-item" href="#signals"><Layers3 size={17}/> Data signals</a>
        <a className="nav-item" href="#forgotten"><MapPin size={17}/> Forgotten populations</a>
        <a className="nav-item" href="#community"><FileText size={17}/> Community reports</a>
        <a className="nav-item" href="#evaluation"><BarChart3 size={17}/> Evaluation</a>
        <div className="sidebar-bottom">
          <div className="side-note"><ShieldCheck size={17}/><div><b>Human verification</b><span>Prototype scores are decision-support indicators, not emergency alerts.</span></div></div>
          <div className="side-foot">VERITAS AI HACKATHON · 2026</div>
        </div>
      </aside>

      {mobileNav && <div className="scrim" onClick={() => setMobileNav(false)} />}
      <main className="main">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu/></button>
          <div className="crumb">Workspace <span>/</span> <b>Overview</b></div>
          <div className="top-right"><span className="top-live"><i></i> Data connection</span><div className="avatar">L</div></div>
        </header>

        <div className="content">
          <section className="hero" id="overview">
            <div>
              <div className="eyebrow"><Sparkles size={13}/> EARLY SIGNALS. HUMAN-CENTRED RESPONSE.</div>
              <h1>A lack of reports<br/><em>is not a lack of danger.</em></h1>
              <p className="hero-copy">Lumyi combines environmental signals with community access indicators to help identify emerging risks and communities that may be overlooked.</p>
              <div className="hero-tags"><span><Radio size={13}/> Explainable prototype</span><span><MapPin size={13}/> Nepal-focused</span><span><ShieldCheck size={13}/> Human-in-the-loop</span></div>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
              <div className="orbit-core"><Activity size={35}/></div>
              <div className="orbit-dot dot-a"></div><div className="orbit-dot dot-b"></div><div className="orbit-dot dot-c"></div>
              <div className="art-label label-a">SIGNAL DETECTED</div><div className="art-label label-b">COMMUNITY FIRST</div>
            </div>
          </section>

          <section className="stats-grid">
            <div className="stat-card"><div className="stat-top"><span>SELECTED LOCATION</span><MapPin size={16}/></div><div className="stat-value small-value">{selected.name}</div><div className="stat-foot">{selected.district}, Nepal</div></div>
            <div className="stat-card"><div className="stat-top"><span>3-DAY RAINFALL FORECAST</span><CloudRain size={16}/></div><div className="stat-value">{weatherState === "live" ? `${rain.toFixed(1)} <small>mm</small>` : weatherState === "loading" ? "…" : "N/A"}</div><div className="stat-foot">{weatherState === "live" ? "Day 1 forecast · Open-Meteo" : weatherState === "loading" ? "Fetching forecast…" : "Live source unavailable"}</div></div>
            <div className="stat-card"><div className="stat-top"><span>COMBINED INDICATOR</span><Activity size={16}/></div><div className="stat-value">{scores.combined}<small>/100</small></div><div className="stat-foot"><span className={`level-dot ${riskLabel.toLowerCase()}`}></span>{riskLabel} · illustrative score</div></div>
            <div className="stat-card"><div className="stat-top"><span>DATA COMPLETENESS</span><Database size={16}/></div><div className="stat-value">{selected.mapped}<small>%</small></div><div className="stat-foot">Illustrative mapping-coverage input</div></div>
          </section>

          <div className="section-heading" id="signals"><div><div className="eyebrow">01 — COLLECT & ANALYSE</div><h2>Signals, not assumptions.</h2></div><button className="refresh-btn" onClick={() => loadWeather()}><RefreshCw size={14}/> Refresh weather</button></div>
          <section className="signal-grid">
            <div className="panel source-panel">
              <div className="panel-title"><div><h3>Five sources of information</h3><p>Each source contributes a different piece of context.</p></div><span className="count-pill">05 SOURCES</span></div>
              <div className="source-list">
                <Source icon={<CloudRain/>} title="Weather data" desc="Rainfall and short-term forecast" status="LIVE API"/>
                <Source icon={<Satellite/>} title="Satellite imagery" desc="Land, vegetation and surface-water change" status="PLANNED"/>
                <Source icon={<Radio/>} title="Community reports" desc="Local observations and access disruptions" status="DEMO"/>
                <Source icon={<Database/>} title="Historical records" desc="Past flood, landslide and drought events" status="PLANNED"/>
                <Source icon={<HeartPulse/>} title="Infrastructure" desc="Hospital access and mapped facilities" status="ILLUSTRATIVE"/>
              </div>
              <div className="panel-foot"><Info size={14}/> Status labels distinguish connected sources from planned or illustrative inputs.</div>
            </div>
            <div className="panel methods-panel">
              <div className="panel-title"><div><h3>Analysis methods</h3><p>What the current prototype really does.</p></div><BrainCircuit size={19}/></div>
              <div className="method"><div className="method-icon"><Activity/></div><div><b>Weather indicator</b><p>Uses forecast rainfall as one environmental signal.</p><span className="method-state live-state">IMPLEMENTED</span></div></div>
              <div className="method"><div className="method-icon"><FileText/></div><div><b>Report keyword analysis</b><p>Rule-based phrase matching; not a trained NLP model.</p><span className="method-state demo-state">PROTOTYPE</span></div></div>
              <div className="method"><div className="method-icon"><Satellite/></div><div><b>Computer vision</b><p>Satellite-image analysis is a future development step.</p><span className="method-state plan-state">PLANNED</span></div></div>
              <div className="method"><div className="method-icon"><BrainCircuit/></div><div><b>Predictive modelling</b><p>No trained disaster prediction model is claimed yet.</p><span className="method-state plan-state">PLANNED</span></div></div>
            </div>
          </section>

          <section className="fusion panel">
            <div className="fusion-head"><div><div className="eyebrow">02 — CONNECT</div><h2>From separate signals to a clearer picture.</h2><p>Example scenario showing why context matters.</p></div><span className="scenario-tag">ILLUSTRATIVE SCENARIO</span></div>
            <div className="fusion-flow">
              <div className="fusion-inputs">
                <div className="input-chip"><CloudRain/><span><b>Heavy rainfall</b><small>Environmental signal</small></span></div>
                <div className="input-chip"><Waves/><span><b>Rising river</b><small>Community observation</small></span></div>
                <div className="input-chip"><MapPin/><span><b>Road blocked</b><small>Access disruption</small></span></div>
              </div>
              <div className="flow-arrow"><span>+</span><div></div><span>›</span></div>
              <div className="fusion-result"><div className="result-icon"><CircleAlert/></div><div><small>COMBINED INTERPRETATION</small><b>Potential flood-related access concern</b><p>Signals warrant local verification; they do not confirm a disaster.</p></div></div>
            </div>
          </section>

          <section className="section-heading" id="forgotten"><div><div className="eyebrow">03 — ASSESS</div><h2>The Forgotten Population Algorithm.</h2><p className="section-sub">A transparent prioritisation indicator for places with weaker access or less mapped information.</p></div></section>
          <section className="dashboard-grid">
            <div className="panel location-panel">
              <div className="panel-title"><div><h3>Nepal location explorer</h3><p>Select a location to inspect its indicators.</p></div><span className="count-pill">10 LOCATIONS</span></div>
              <div className="location-list">
                {PLACES.map(p => {
                  const s = scorePlace(p, p.name === selected.name ? rain : 18);
                  return <button key={p.name} onClick={() => choosePlace(p)} className={`location-row ${selected.name === p.name ? "selected" : ""}`}>
                    <span className="loc-pin"><MapPin size={15}/></span><span className="loc-name"><b>{p.name}</b><small>{p.district}</small></span>
                    <span className="loc-score">{s.combined}<small>/100</small></span><span className={`risk-pill ${level(s.combined).toLowerCase()}`}>{level(s.combined)}</span>
                  </button>;
                })}
              </div>
              <div className="panel-foot"><Info size={14}/> Non-selected locations use an illustrative rainfall input of 18 mm.</div>
            </div>
            <div className="panel score-panel">
              <div className="panel-title"><div><h3>{selected.name} indicators</h3><p>{selected.district} · Nepal</p></div><span className={`risk-pill ${riskLabel.toLowerCase()}`}>{riskLabel} indicator</span></div>
              <div className="big-score"><strong>{scores.combined}</strong><span>/100</span><div><b>Combined prioritisation score</b><small>Not a calibrated probability of disaster.</small></div></div>
              <ScoreBar label="Rainfall signal" value={scores.rainSignal} color="blue"/>
              <ScoreBar label="Access difficulty input" value={scores.accessSignal} color="orange"/>
              <ScoreBar label="Mapped-data gap" value={scores.dataGapSignal} color="purple"/>
              <div className="formula"><b>How it is calculated</b><code>50% rainfall + 30% access + 20% data gap</code><p>Weights are provisional design choices, not scientifically validated. Access and mapping inputs are illustrative.</p></div>
              <div className="source-note"><CheckCircle2 size={15}/> {weatherState === "live" ? `Rainfall: Open-Meteo forecast (${rain.toFixed(1)} mm)` : "Rainfall: illustrative fallback because live weather is unavailable"}</div>
            </div>
          </section>

          <section className="panel forgotten-explain">
            <div className="forgot-icon"><ShieldCheck/></div><div><div className="eyebrow">THE CORE IDEA</div><h3>Absence of evidence is not evidence of safety.</h3><p>Some communities may have fewer mapped facilities or less access to services. Lumyi surfaces these gaps so that low reporting volume is not automatically interpreted as low need. The score prioritises further assessment; it does not label a community as unsafe.</p></div>
          </section>

          <section className="section-heading" id="community"><div><div className="eyebrow">04 — LISTEN</div><h2>Analyse a community report.</h2><p className="section-sub">Try a report and see which phrases the prototype recognises.</p></div></section>
          <section className="report-grid">
            <div className="panel report-input-panel"><div className="panel-title"><div><h3>Community observation</h3><p>Enter a short description of what someone noticed.</p></div><FileText size={19}/></div>
              <textarea value={report} onChange={e => {setReport(e.target.value); setAnalysed(false);}} placeholder="Example: The river is rising and the road is blocked..."/>
              <div className="report-actions"><span>{report.length} characters</span><button className="primary-btn" disabled={!reportReady} onClick={() => setAnalysed(true)}>Analyse report <ArrowUpRight size={15}/></button></div>
              <div className="privacy-note"><Info size={13}/> Demo only. Do not enter names, phone numbers or private information.</div>
            </div>
            <div className="panel report-result-panel"><div className="panel-title"><div><h3>Detected concerns</h3><p>Rule-based keyword matching output.</p></div><span className="demo-label">DEMO NLP</span></div>
              {analysed ? reportSignals.length ? <><div className="detected-list">{reportSignals.map(x => <div className="detected-item" key={x}><CheckCircle2 size={16}/>{x}</div>)}</div><div className="interpretation"><b>What this means</b><p>The text contains phrases associated with these topics. This is not proof that the event occurred, and a human should verify the report.</p></div></> : <div className="empty-state"><Search size={22}/><b>No supported keywords found</b><span>Try mentioning rainfall, river, road, hospital or water shortage.</span></div> : <div className="empty-state"><Sparkles size={22}/><b>Ready to analyse</b><span>Submit the text to see the rule-based result.</span></div>}
            </div>
          </section>

          <section className="section-heading" id="evaluation"><div><div className="eyebrow">05 — TEST & BE TRANSPARENT</div><h2>Measure what actually works.</h2><p className="section-sub">A baseline comparison is included as a demonstration of the evaluation approach, not as measured model performance.</p></div></section>
          <section className="evaluation-grid">
            <div className="panel eval-panel"><div className="panel-title"><div><h3>Baseline vs combined approach</h3><p>Same illustrative input, two different views.</p></div><BarChart3 size={19}/></div>
              <div className="compare-row"><div><b>Rainfall-only baseline</b><small>Considers environmental rainfall signal only</small></div><strong>{baseline}<small>/100</small></strong></div>
              <div className="compare-row"><div><b>Lumyi combined indicator</b><small>Adds access and mapped-data gap inputs</small></div><strong>{scores.combined}<small>/100</small></strong></div>
              <div className="compare-callout"><Info size={15}/> A different score is not proof of better prediction. A fair test needs labelled historical events and unseen test locations or dates.</div>
            </div>
            <div className="panel limits-panel"><div className="panel-title"><div><h3>Known limitations</h3><p>What Lumyi cannot claim yet.</p></div><Info size={19}/></div>
              <ul className="limits-list"><li>No trained or validated disaster prediction model.</li><li>Satellite analysis and historical event ingestion are not connected.</li><li>Hospital access and mapping-coverage values are illustrative.</li><li>Rainfall forecast is not observed rainfall or river discharge.</li><li>Scores are not calibrated probabilities or official warnings.</li></ul>
            </div>
          </section>

          <section className="architecture panel">
            <div className="panel-title"><div><div className="eyebrow">06 — ARCHITECTURE</div><h2>Built to be extended responsibly.</h2><p>Current prototype components and planned next steps.</p></div><Layers3 size={20}/></div>
            <div className="arch-steps">
              <Arch n="01" title="Collect" desc="Open-Meteo forecast + user-entered report" state="Connected / demo"/>
              <Arch n="02" title="Prepare" desc="Input checks, location selection, missing-data labels" state="Implemented"/>
              <Arch n="03" title="Analyse" desc="Transparent score + keyword rules" state="Prototype"/>
              <Arch n="04" title="Evaluate" desc="Baseline display + evaluation plan" state="Framework only"/>
              <Arch n="05" title="Verify" desc="Human review before any real-world response" state="Required"/>
            </div>
          </section>
          <footer><div className="footer-brand">lumyi<span>.</span></div><span>Prototype for the Veritas AI International High School Hackathon 2026</span><span>Weather: Open-Meteo · Map data inputs are illustrative</span></footer>
        </div>
      </main>
    </div>
  );
}

function Source({icon, title, desc, status}) {
  return <div className="source-row"><div className="source-icon">{icon}</div><div className="source-text"><b>{title}</b><small>{desc}</small></div><span className={`source-status ${status === "LIVE API" ? "live-state" : status === "PLANNED" ? "plan-state" : "demo-state"}`}>{status}</span></div>;
}
function ScoreBar({label, value, color}) {
  return <div className="score-bar"><div className="score-label"><span>{label}</span><b>{value}/100</b></div><div className="bar-track"><div className={`bar-fill ${color}`} style={{width: `${value}%`}}/></div></div>;
}
function Arch({n,title,desc,state}) {
  return <div className="arch-step"><span>{n}</span><b>{title}</b><p>{desc}</p><small>{state}</small></div>;
}

export default App;