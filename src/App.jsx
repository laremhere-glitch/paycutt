import { useState, useEffect } from "react";

const CURRENCIES = [
  { symbol: "$", label: "USD" }, { symbol: "€", label: "EUR" },
  { symbol: "£", label: "GBP" }, { symbol: "₹", label: "INR" },
  { symbol: "¥", label: "JPY" }, { symbol: "A$", label: "AUD" },
  { symbol: "C$", label: "CAD" }, { symbol: "₩", label: "KRW" },
  { symbol: "R$", label: "BRL" }, { symbol: "₺", label: "TRY" },
  { symbol: "₦", label: "NGN" }, { symbol: "Rp", label: "IDR" },
  { symbol: "₱", label: "PHP" }, { symbol: "RM", label: "MYR" },
  { symbol: "฿", label: "THB" }, { symbol: "د.إ", label: "AED" },
  { symbol: "R", label: "ZAR" }, { symbol: "MX$", label: "MXN" },
  { symbol: "S$", label: "SGD" }, { symbol: "kr", label: "SEK" },
];

const DEFAULT_CATS = [
  { id: 1, name: "🏠 Rent / Housing", percent: 30, color: "#6366f1" },
  { id: 2, name: "🍔 Food & Groceries", percent: 15, color: "#f59e0b" },
  { id: 3, name: "💰 Savings", percent: 20, color: "#10b981" },
  { id: 4, name: "📈 Investments", percent: 10, color: "#3b82f6" },
  { id: 5, name: "🎉 Fun & Lifestyle", percent: 15, color: "#ec4899" },
  { id: 6, name: "⚡ Bills & Utilities", percent: 10, color: "#8b5cf6" },
];

const EXTRA_COLORS = ["#f43f5e","#14b8a6","#f97316","#a855f7","#06b6d4","#84cc16"];

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function Paycutt() {
  const [dark, setDark] = useState(() => load("pc_dark", true));
  const [tab, setTab] = useState("split");
  const [currency, setCurrency] = useState(() => load("pc_currency", CURRENCIES[0]));

  // Split tab state
  const [income, setIncome] = useState(() => load("pc_income", ""));
  const [categories, setCategories] = useState(() => load("pc_cats", DEFAULT_CATS));

  // Goals tab state — completely independent
  const [goalIncome, setGoalIncome] = useState(() => load("pc_goalIncome", ""));
  const [saveMode, setSaveMode] = useState(() => load("pc_saveMode", "amount")); // "amount" or "percent"
  const [saveAmount, setSaveAmount] = useState(() => load("pc_saveAmount", ""));
  const [savePercent, setSavePercent] = useState(() => load("pc_savePercent", ""));
  const [goalName, setGoalName] = useState(() => load("pc_goalName", ""));
  const [goalTarget, setGoalTarget] = useState(() => load("pc_goalTarget", ""));
  const [savedTotal, setSavedTotal] = useState(() => load("pc_savedTotal", 0));
  const [streak, setStreak] = useState(() => load("pc_streak", 0));
  const [lastCheckin, setLastCheckin] = useState(() => load("pc_lastCheckin", ""));
  const [checkedInToday, setCheckedInToday] = useState(() => load("pc_lastCheckin", "") === todayStr());
  const [showCelebration, setShowCelebration] = useState(false);
  const [goalStarted, setGoalStarted] = useState(() => load("pc_goalStarted", false));

  // Persist everything
  useEffect(() => save("pc_dark", dark), [dark]);
  useEffect(() => save("pc_currency", currency), [currency]);
  useEffect(() => save("pc_income", income), [income]);
  useEffect(() => save("pc_cats", categories), [categories]);
  useEffect(() => save("pc_goalIncome", goalIncome), [goalIncome]);
  useEffect(() => save("pc_saveMode", saveMode), [saveMode]);
  useEffect(() => save("pc_saveAmount", saveAmount), [saveAmount]);
  useEffect(() => save("pc_savePercent", savePercent), [savePercent]);
  useEffect(() => save("pc_goalName", goalName), [goalName]);
  useEffect(() => save("pc_goalTarget", goalTarget), [goalTarget]);
  useEffect(() => save("pc_savedTotal", savedTotal), [savedTotal]);
  useEffect(() => save("pc_streak", streak), [streak]);
  useEffect(() => save("pc_lastCheckin", lastCheckin), [lastCheckin]);
  useEffect(() => save("pc_goalStarted", goalStarted), [goalStarted]);

  const D = {
    bg: dark ? "#0a0a0a" : "#f5f5f5",
    card: dark ? "#111" : "#ffffff",
    border: dark ? "#1e1e1e" : "#e5e5e5",
    text: dark ? "#f0f0f0" : "#111111",
    sub: dark ? "#666" : "#888",
    input: dark ? "#1a1a1a" : "#f0f0f0",
    inputBorder: dark ? "#2a2a2a" : "#ddd",
    label: dark ? "#555" : "#aaa",
    muted: dark ? "#333" : "#ccc",
    summaryBg: dark ? "#0d0d1a" : "#f0f0ff",
    summaryBorder: dark ? "#1a1a2e" : "#d0d0ff",
  };

  // Split tab calculations
  const inc = parseFloat(income) || 0;
  const total = categories.reduce((s, c) => s + c.percent, 0);
  const remaining = 100 - total;
  const fmt = (n) => currency.symbol + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const getAmt = (p) => inc ? fmt(inc * p / 100) : "—";

  // Goals tab calculations
  const gInc = parseFloat(goalIncome) || 0;
  const monthlySaving = saveMode === "amount"
    ? parseFloat(saveAmount) || 0
    : gInc * (parseFloat(savePercent) || 0) / 100;
  const dailySaving = monthlySaving / 30;
  const goalAmt = parseFloat(goalTarget) || 0;
  const progressPct = goalAmt > 0 ? Math.min((savedTotal / goalAmt) * 100, 100) : 0;
  const daysLeft = dailySaving > 0 && goalAmt > savedTotal ? Math.ceil((goalAmt - savedTotal) / dailySaving) : 0;
  const monthsLeft = daysLeft > 0 ? (daysLeft / 30).toFixed(1) : 0;
  const goalReached = goalAmt > 0 && savedTotal >= goalAmt;
  const canStart = goalName && goalAmt > 0 && monthlySaving > 0;

  const handleCheckin = () => {
    if (checkedInToday || !goalStarted) return;
    const today = todayStr();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const newStreak = lastCheckin === yesterday ? streak + 1 : 1;
    setSavedTotal(s => parseFloat((s + dailySaving).toFixed(2)));
    setStreak(newStreak);
    setLastCheckin(today);
    setCheckedInToday(true);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2500);
  };

  const startGoal = () => {
    if (!canStart) return;
    setSavedTotal(0);
    setStreak(0);
    setLastCheckin("");
    setCheckedInToday(false);
    setGoalStarted(true);
  };

  const resetGoal = () => {
    setGoalStarted(false);
    setSavedTotal(0);
    setStreak(0);
    setLastCheckin("");
    setCheckedInToday(false);
    setGoalName("");
    setGoalTarget("");
    setSaveAmount("");
    setSavePercent("");
  };

  const updatePercent = (id, val) => {
    const raw = val.replace(/^0+(?=\d)/, "");
    const num = Math.max(0, Math.min(100, parseInt(raw) || 0));
    setCategories(cats => cats.map(c => c.id === id ? { ...c, percent: num } : c));
  };
  const updateName = (id, val) => setCategories(cats => cats.map(c => c.id === id ? { ...c, name: val } : c));
  const removeCat = (id) => setCategories(cats => cats.filter(c => c.id !== id));
  const addCat = () => setCategories(cats => [...cats, {
    id: Date.now(), name: "✏️ New Category", percent: 0,
    color: EXTRA_COLORS[Math.floor(Math.random() * EXTRA_COLORS.length)]
  }]);

  const card = { background: D.card, border: `1px solid ${D.border}`, borderRadius: 14, padding: "16px", marginBottom: 12 };
  const labelStyle = { fontSize: 10, color: D.label, letterSpacing: 2, textTransform: "uppercase", marginBottom: 5, display: "block" };
  const inputStyle = { background: D.input, border: `1px solid ${D.inputBorder}`, borderRadius: 8, color: D.text, padding: "10px 12px", fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box" };
  const tabBtn = (active) => ({
    flex: 1, padding: "9px 4px", borderRadius: 10, border: "none", cursor: "pointer",
    fontSize: 12, fontWeight: 600, transition: "all 0.2s",
    background: active ? "#6366f1" : D.input,
    color: active ? "#fff" : D.sub,
  });

  return (
    <div style={{ minHeight: "100vh", background: D.bg, color: D.text, fontFamily: "'Inter',-apple-system,sans-serif", padding: "20px 14px 48px", boxSizing: "border-box", WebkitTextSizeAdjust: "100%", transition: "background 0.3s", position: "relative" }}>

      {showCelebration && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, pointerEvents: "none", background: "#00000080" }}>
          <div style={{ background: "#10b981", borderRadius: 20, padding: "28px 36px", textAlign: "center", boxShadow: "0 20px 60px #10b98150" }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🎉</div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 20, margin: "0 0 6px" }}>Day checked in!</p>
            <p style={{ color: "#d1fae5", fontSize: 14, margin: "0 0 4px" }}>+{fmt(dailySaving)} saved today</p>
            <p style={{ color: "#d1fae5", fontSize: 13, margin: 0 }}>{streak} day streak 🔥</p>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 500, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <span style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: 8, padding: "3px 10px", fontSize: 15, fontWeight: 800, color: "#fff", display: "inline-block", marginBottom: 6 }}>Paycutt</span>
            <h1 style={{ fontSize: 21, fontWeight: 700, margin: "0 0 3px", color: D.text }}>Paycheck Splitter</h1>
            <p style={{ color: D.sub, fontSize: 12, margin: 0 }}>Know exactly where every dollar goes.</p>
          </div>
          <button onClick={() => setDark(d => !d)} style={{ background: D.input, border: `1px solid ${D.inputBorder}`, borderRadius: 10, padding: "8px 12px", fontSize: 16, cursor: "pointer", flexShrink: 0, marginTop: 4 }}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Currency selector */}
        <div style={{ marginBottom: 12 }}>
          <select value={currency.label} onChange={e => setCurrency(CURRENCIES.find(c => c.label === e.target.value))}
            style={{ ...inputStyle, fontSize: 13 }}>
            {CURRENCIES.map(c => <option key={c.label} value={c.label}>{c.symbol} {c.label}</option>)}
          </select>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {[["split","💸 Split"],["goals","🎯 Goals"]].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} style={tabBtn(tab === t)}>{label}</button>
          ))}
        </div>

        {/* ── SPLIT TAB ── */}
        {tab === "split" && <>
          <div style={card}>
            <span style={labelStyle}>Monthly Income</span>
            <input type="number" inputMode="decimal" placeholder="0.00" value={income} onChange={e => setIncome(e.target.value)}
              style={{ ...inputStyle, fontSize: 22, fontWeight: 700 }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ ...labelStyle, marginBottom: 0 }}>Allocation</span>
            <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
              color: remaining === 0 ? "#10b981" : remaining < 0 ? "#ef4444" : "#f59e0b",
              background: remaining === 0 ? "#10b98115" : remaining < 0 ? "#ef444415" : "#f59e0b15" }}>
              {remaining === 0 ? "✓ 100% allocated" : remaining > 0 ? `${remaining}% unallocated · ${inc ? fmt(inc * remaining / 100) : "—"}` : `${Math.abs(remaining)}% over budget`}
            </span>
          </div>

          <div style={{ height: 4, background: D.input, borderRadius: 99, marginBottom: 12, overflow: "hidden", display: "flex" }}>
            {categories.map(c => <div key={c.id} style={{ width: `${Math.min(c.percent, 100)}%`, background: c.color, transition: "width 0.3s" }} />)}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 10 }}>
            {categories.map(cat => (
              <div key={cat.id} style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 12, padding: "11px 12px", display: "flex", alignItems: "center", gap: 8, borderLeft: `3px solid ${cat.color}` }}>
                <input value={cat.name} onChange={e => updateName(cat.id, e.target.value)}
                  style={{ flex: 1, background: "transparent", border: "none", color: D.text, fontSize: 13, fontWeight: 500, outline: "none", minWidth: 0 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                  <input type="number" inputMode="numeric" value={cat.percent} onChange={e => updatePercent(cat.id, e.target.value)} min={0} max={100}
                    style={{ width: 40, background: D.input, border: `1px solid ${D.inputBorder}`, borderRadius: 7, color: D.text, padding: "5px 4px", fontSize: 13, fontWeight: 600, textAlign: "center", outline: "none" }} />
                  <span style={{ color: D.muted, fontSize: 11 }}>%</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: cat.color, minWidth: 65, textAlign: "right", flexShrink: 0 }}>{getAmt(cat.percent)}</div>
                <button onClick={() => removeCat(cat.id)} style={{ background: "none", border: "none", color: D.muted, cursor: "pointer", fontSize: 16, padding: "0 2px", flexShrink: 0 }}>×</button>
              </div>
            ))}
          </div>

          <button onClick={addCat} style={{ width: "100%", background: "transparent", border: `1px dashed ${D.inputBorder}`, borderRadius: 12, color: D.muted, padding: "10px", fontSize: 12, cursor: "pointer", marginBottom: 16 }}>
            + Add Category
          </button>

          {inc > 0 && (
            <div style={{ background: D.summaryBg, border: `1px solid ${D.summaryBorder}`, borderRadius: 14, padding: "16px" }}>
              <span style={{ ...labelStyle, color: "#6366f1" }}>Monthly Breakdown</span>
              {categories.map(cat => (
                <div key={cat.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: D.sub }}>{cat.name}</span>
                  <span style={{ fontWeight: 600, color: cat.color }}>{getAmt(cat.percent)}</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${D.border}`, marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: D.sub, fontSize: 12 }}>Total Income</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: D.text }}>{fmt(inc)}</span>
              </div>
              {remaining > 0 && inc > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ color: "#f59e0b", fontSize: 12, fontWeight: 600 }}>💰 Unallocated</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#f59e0b" }}>{fmt(inc * remaining / 100)}</span>
                </div>
              )}
              {remaining < 0 && inc > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ color: "#ef4444", fontSize: 12, fontWeight: 600 }}>⚠️ Over budget</span>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#ef4444" }}>{fmt(inc * Math.abs(remaining) / 100)}</span>
                </div>
              )}
            </div>
          )}
        </>}

        {/* ── GOALS TAB ── */}
        {tab === "goals" && <>

          {!goalStarted ? <>
            {/* Setup */}
            <div style={card}>
              <span style={labelStyle}>Monthly Income</span>
              <input type="number" inputMode="decimal" placeholder="0.00" value={goalIncome} onChange={e => setGoalIncome(e.target.value)}
                style={{ ...inputStyle, fontSize: 22, fontWeight: 700, marginBottom: 14 }} />

              <span style={labelStyle}>How much do you want to save per month?</span>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                <button onClick={() => setSaveMode("amount")} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: saveMode === "amount" ? "#6366f1" : D.input, color: saveMode === "amount" ? "#fff" : D.sub }}>Fixed Amount</button>
                <button onClick={() => setSaveMode("percent")} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: saveMode === "percent" ? "#6366f1" : D.input, color: saveMode === "percent" ? "#fff" : D.sub }}>Percentage</button>
              </div>

              {saveMode === "amount" ? (
                <input type="number" inputMode="decimal" placeholder={`e.g. ${currency.symbol}500`} value={saveAmount} onChange={e => setSaveAmount(e.target.value)} style={{ ...inputStyle, marginBottom: 14 }} />
              ) : (
                <div style={{ position: "relative", marginBottom: 14 }}>
                  <input type="number" inputMode="decimal" placeholder="e.g. 20" value={savePercent} onChange={e => setSavePercent(e.target.value)} style={{ ...inputStyle, paddingRight: 36 }} />
                  <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: D.sub, fontSize: 14 }}>%</span>
                </div>
              )}

              {monthlySaving > 0 && gInc > 0 && (
                <p style={{ color: "#10b981", fontSize: 12, margin: "0 0 14px", textAlign: "center" }}>
                  Saving {fmt(monthlySaving)}/month · {fmt(monthlySaving / 30)}/day
                </p>
              )}

              <span style={labelStyle}>Goal Name</span>
              <input placeholder="e.g. Emergency Fund" value={goalName} onChange={e => setGoalName(e.target.value)} style={{ ...inputStyle, marginBottom: 10 }} />

              <span style={labelStyle}>Target Amount ({currency.symbol})</span>
              <input type="number" inputMode="decimal" placeholder="e.g. 10000" value={goalTarget} onChange={e => setGoalTarget(e.target.value)} style={{ ...inputStyle, marginBottom: 14 }} />

              {canStart && goalAmt > 0 && monthlySaving > 0 && (
                <p style={{ color: D.sub, fontSize: 12, textAlign: "center", margin: "0 0 12px" }}>
                  You'll reach {currency.symbol}{parseFloat(goalTarget).toLocaleString()} in ~{monthsLeft} months
                </p>
              )}

              <button onClick={startGoal} disabled={!canStart} style={{
                width: "100%", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700,
                cursor: canStart ? "pointer" : "default",
                background: canStart ? "linear-gradient(135deg,#6366f1,#10b981)" : D.input,
                color: canStart ? "#fff" : D.muted,
              }}>
                Start Saving →
              </button>
            </div>

          </> : <>

            {/* Active Goal */}
            <div style={{ background: D.summaryBg, border: `1px solid ${D.summaryBorder}`, borderRadius: 14, padding: "18px", marginBottom: 12 }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <p style={{ color: D.sub, fontSize: 11, margin: "0 0 2px" }}>Current Goal</p>
                  <p style={{ color: D.text, fontWeight: 800, fontSize: 17, margin: 0 }}>{goalName}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: D.sub, fontSize: 11, margin: "0 0 2px" }}>Target</p>
                  <p style={{ color: "#6366f1", fontWeight: 800, fontSize: 17, margin: 0 }}>{fmt(goalAmt)}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div style={ 
