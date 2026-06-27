import { useState } from "react";

const DEFAULT_CATEGORIES = [
  { id: 1, name: "🏠 Rent / Housing", percent: 30, color: "#6366f1" },
  { id: 2, name: "🍔 Food & Groceries", percent: 15, color: "#f59e0b" },
  { id: 3, name: "💰 Savings", percent: 20, color: "#10b981" },
  { id: 4, name: "📈 Investments", percent: 10, color: "#3b82f6" },
  { id: 5, name: "🎉 Fun & Lifestyle", percent: 15, color: "#ec4899" },
  { id: 6, name: "⚡ Bills & Utilities", percent: 10, color: "#8b5cf6" },
];

const CURRENCIES = [
  { symbol: "$", label: "USD" },
  { symbol: "€", label: "EUR" },
  { symbol: "£", label: "GBP" },
  { symbol: "₹", label: "INR" },
  { symbol: "¥", label: "JPY" },
  { symbol: "A$", label: "AUD" },
  { symbol: "C$", label: "CAD" },
  { symbol: "Fr", label: "CHF" },
  { symbol: "₩", label: "KRW" },
  { symbol: "R$", label: "BRL" },
  { symbol: "₺", label: "TRY" },
  { symbol: "₦", label: "NGN" },
  { symbol: "Rp", label: "IDR" },
  { symbol: "₱", label: "PHP" },
  { symbol: "RM", label: "MYR" },
  { symbol: "฿", label: "THB" },
  { symbol: "د.إ", label: "AED" },
  { symbol: "﷼", label: "SAR" },
  { symbol: "zł", label: "PLN" },
  { symbol: "kr", label: "SEK" },
  { symbol: "R", label: "ZAR" },
  { symbol: "MX$", label: "MXN" },
  { symbol: "S$", label: "SGD" },
  { symbol: "HK$", label: "HKD" },
  { symbol: "NZ$", label: "NZD" },
];

export default function Paycutt() {
  const [income, setIncome] = useState("");
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [currency, setCurrency] = useState(CURRENCIES[0]);

  const total = categories.reduce((sum, c) => sum + c.percent, 0);
  const remaining = 100 - total;

  const getAmount = (percent) => {
    const val = parseFloat(income);
    if (!val) return "—";
    return currency.symbol + (val * percent / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const updatePercent = (id, val) => {
    const num = Math.max(0, Math.min(100, parseInt(val) || 0));
    setCategories(cats => cats.map(c => c.id === id ? { ...c, percent: num } : c));
  };

  const updateName = (id, val) => {
    setCategories(cats => cats.map(c => c.id === id ? { ...c, name: val } : c));
  };

  const removeCategory = (id) => {
    setCategories(cats => cats.filter(c => c.id !== id));
  };

  const addCategory = () => {
    const colors = ["#f43f5e", "#14b8a6", "#f97316", "#a855f7", "#06b6d4", "#84cc16"];
    setCategories(cats => [...cats, {
      id: Date.now(),
      name: "✏️ New Category",
      percent: 0,
      color: colors[Math.floor(Math.random() * colors.length)]
    }]);
  };

  return (
    <div style={{
      minHeight: "100vh",
      height: "100%",
      background: "#0a0a0a",
      color: "#f0f0f0",
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: "24px 16px 40px",
      boxSizing: "border-box",
      WebkitTextSizeAdjust: "100%",
    }}>
      <div style={{ maxWidth: 500, margin: "0 auto", width: "100%" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: 8,
              padding: "3px 10px",
              fontSize: 15,
              fontWeight: 800,
              color: "#fff",
              letterSpacing: -0.3,
            }}>Paycutt</span>
            <span style={{ fontSize: 10, color: "#444", letterSpacing: 2, textTransform: "uppercase" }}>by paycutt</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", lineHeight: 1.2 }}>
            Paycheck Splitter
          </h1>
          <p style={{ color: "#555", fontSize: 13, margin: 0 }}>
            Put your income in. Know exactly where every dollar goes.
          </p>
        </div>

        {/* Income Input */}
        <div style={{
          background: "#111",
          border: "1px solid #1e1e1e",
          borderRadius: 14,
          padding: "16px",
          marginBottom: 16,
        }}>
          <label style={{ fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase" }}>
            Monthly Income
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <select
              value={currency.label}
              onChange={e => setCurrency(CURRENCIES.find(c => c.label === e.target.value))}
              style={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                color: "#f0f0f0",
                padding: "10px 6px",
                fontSize: 12,
                cursor: "pointer",
                flexShrink: 0,
                WebkitAppearance: "none",
              }}
            >
              {CURRENCIES.map(c => (
                <option key={c.label} value={c.label}>{c.symbol} {c.label}</option>
              ))}
            </select>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={income}
              onChange={e => setIncome(e.target.value)}
              style={{
                flex: 1,
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                color: "#f0f0f0",
                padding: "10px 12px",
                fontSize: 20,
                fontWeight: 600,
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Total indicator */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}>
          <span style={{ fontSize: 10, color: "#444", letterSpacing: 2 }}>ALLOCATION</span>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: remaining === 0 ? "#10b981" : remaining < 0 ? "#ef4444" : "#f59e0b",
            background: remaining === 0 ? "#10b98115" : remaining < 0 ? "#ef444415" : "#f59e0b15",
            padding: "3px 10px",
            borderRadius: 20,
          }}>
            {total}% {remaining === 0 ? "✓ Perfect" : remaining > 0 ? `· ${remaining}% left` : `· ${Math.abs(remaining)}% over`}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 4,
          background: "#1a1a1a",
          borderRadius: 99,
          marginBottom: 12,
          overflow: "hidden",
          display: "flex",
        }}>
          {categories.map(c => (
            <div key={c.id} style={{
              width: `${Math.min(c.percent, 100)}%`,
              background: c.color,
              transition: "width 0.3s ease",
            }} />
          ))}
        </div>

        {/* Categories */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 10 }}>
          {categories.map(cat => (
            <div key={cat.id} style={{
              background: "#111",
              border: "1px solid #1a1a1a",
              borderRadius: 12,
              padding: "11px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              borderLeft: `3px solid ${cat.color}`,
            }}>
              <input
                value={cat.name}
                onChange={e => updateName(cat.id, e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "#e0e0e0",
                  fontSize: 13,
                  fontWeight: 500,
                  outline: "none",
                  minWidth: 0,
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                <input
                  type="number"
                  inputMode="numeric"
                  value={cat.percent}
                  onChange={e => updatePercent(cat.id, e.target.value)}
                  min={0}
                  max={100}
                  style={{
                    width: 42,
                    background: "#1a1a1a",
                    border: "1px solid #252525",
                    borderRadius: 7,
                    color: "#f0f0f0",
                    padding: "5px 4px",
                    fontSize: 13,
                    fontWeight: 600,
                    textAlign: "center",
                    outline: "none",
                  }}
                />
                <span style={{ color: "#333", fontSize: 11 }}>%</span>
              </div>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: cat.color,
                minWidth: 68,
                textAlign: "right",
                flexShrink: 0,
              }}>
                {getAmount(cat.percent)}
              </div>
              <button
                onClick={() => removeCategory(cat.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#333",
                  cursor: "pointer",
                  fontSize: 16,
                  padding: "0 2px",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >×</button>
            </div>
          ))}
        </div>

        {/* Add category */}
        <button
          onClick={addCategory}
          style={{
            width: "100%",
            background: "transparent",
            border: "1px dashed #222",
            borderRadius: 12,
            color: "#333",
            padding: "11px",
            fontSize: 12,
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          + Add Category
        </button>

        {/* Summary */}
        {income && (
          <div style={{
            background: "#0d0d1a",
            border: "1px solid #1a1a2e",
            borderRadius: 14,
            padding: "16px",
            marginBottom: 20,
          }}>
            <p style={{ fontSize: 10, color: "#6366f1", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, marginTop: 0 }}>
              Monthly Breakdown
            </p>
            {categories.map(cat => (
              <div key={cat.id} style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
                fontSize: 13,
              }}>
                <span style={{ color: "#666" }}>{cat.name}</span>
                <span style={{ fontWeight: 600, color: cat.color }}>{getAmount(cat.percent)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #1a1a1a", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#555", fontSize: 12 }}>Total Income</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>
                {currency.symbol}{parseFloat(income).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}

        <p style={{ textAlign: "center", color: "#222", fontSize: 10, margin: 0 }}>
          Paycutt · Stop guessing where your money goes
        </p>

      </div>
    </div>
  );
}
