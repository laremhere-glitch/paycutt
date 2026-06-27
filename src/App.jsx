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
      background: "#0a0a0a",
      color: "#f0f0f0",
      fontFamily: "'Inter', sans-serif",
      padding: "32px 16px",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              borderRadius: 10,
              padding: "4px 12px",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: -0.5,
              color: "#fff",
            }}>Paycutt</span>
            <span style={{ fontSize: 11, color: "#444", letterSpacing: 2, textTransform: "uppercase" }}>by Paycutt</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: "8px 0 6px", lineHeight: 1.2 }}>
            Paycheck Splitter
          </h1>
          <p style={{ color: "#555", fontSize: 14, margin: 0 }}>
            Put your income in. Know exactly where every dollar goes.
          </p>
        </div>

        {/* Income Input */}
        <div style={{
          background: "#111",
          border: "1px solid #1e1e1e",
          borderRadius: 16,
          padding: "20px 24px",
          marginBottom: 20,
        }}>
          <label style={{ fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase" }}>
            Monthly Income
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
            <select
              value={currency.label}
              onChange={e => setCurrency(CURRENCIES.find(c => c.label === e.target.value))}
              style={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                color: "#f0f0f0",
                padding: "10px 10px",
                fontSize: 13,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              {CURRENCIES.map(c => (
                <option key={c.label} value={c.label}>{c.symbol} {c.label}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="0.00"
              value={income}
              onChange={e => setIncome(e.target.value)}
              style={{
                flex: 1,
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: 8,
                color: "#f0f0f0",
                padding: "10px 16px",
                fontSize: 22,
                fontWeight: 600,
                outline: "none",
                width: "100%",
              }}
            />
          </div>
        </div>

        {/* Total indicator */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
          padding: "0 4px",
        }}>
          <span style={{ fontSize: 11, color: "#444", letterSpacing: 2 }}>ALLOCATION</span>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: remaining === 0 ? "#10b981" : remaining < 0 ? "#ef4444" : "#f59e0b",
            background: remaining === 0 ? "#10b98115" : remaining < 0 ? "#ef444415" : "#f59e0b15",
            padding: "4px 10px",
            borderRadius: 20,
          }}>
            {total}% {remaining === 0 ? "✓ Perfect" : remaining > 0 ? `· ${remaining}% unallocated` : `· ${Math.abs(remaining)}% over`}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 5,
          background: "#1a1a1a",
          borderRadius: 99,
          marginBottom: 16,
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
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {categories.map(cat => (
            <div key={cat.id} style={{
              background: "#111",
              border: "1px solid #1a1a1a",
              borderRadius: 14,
              padding: "13px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
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
                  fontSize: 14,
                  fontWeight: 500,
                  outline: "none",
                  minWidth: 0,
                }}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <input
                  type="number"
                  value={cat.percent}
                  onChange={e => updatePercent(cat.id, e.target.value)}
                  min={0}
                  max={100}
                  style={{
                    width: 46,
                    background: "#1a1a1a",
                    border: "1px solid #252525",
                    borderRadius: 8,
                    color: "#f0f0f0",
                    padding: "6px 6px",
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: "center",
                    outline: "none",
                  }}
                />
                <span style={{ color: "#333", fontSize: 12 }}>%</span>
              </div>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: cat.color,
                minWidth: 75,
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
                  color: "#2a2a2a",
                  cursor: "pointer",
                  fontSize: 18,
                  padding: "0 2px",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                ×
              </button>
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
            borderRadius: 14,
            color: "#333",
            padding: "13px",
            fontSize: 13,
            cursor: "pointer",
            marginBottom: 28,
          }}
        >
          + Add Category
        </button>

        {/* Summary */}
        {income && (
          <div style={{
            background: "#0d0d1a",
            border: "1px solid #1a1a2e",
            borderRadius: 16,
            padding: "20px 24px",
            marginBottom: 28,
          }}>
            <p style={{ fontSize: 11, color: "#6366f1", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16, marginTop: 0 }}>
              Monthly Breakdown
            </p>
            {categories.map(cat => (
              <div key={cat.id} style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
                fontSize: 14,
              }}>
                <span style={{ color: "#666" }}>{cat.name}</span>
                <span style={{ fontWeight: 600, color: cat.color }}>{getAmount(cat.percent)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #1a1a1a", marginTop: 14, paddingTop: 14, display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#555", fontSize: 13 }}>Total Income</span>
              <span style={{ fontWeight: 700, fontSize: 15 }}>
                {currency.symbol}{parseFloat(income).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <p style={{ textAlign: "center", color: "#222", fontSize: 11, marginTop: 8 }}>
          Paycutt · Stop guessing where your money goes
        </p>

      </div>
    </div>
  );
                  }
