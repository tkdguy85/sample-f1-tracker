import { RACES } from "../data/races";
import { RESULTS } from "../data/results";

export function AppHeader({ view, onViewChange, onAdminOpen }) {
  const completedCount = Object.keys(RESULTS).length;
  const totalCount     = RACES.length;
  const sprintCount    = RACES.filter((r) => r.sprint).length;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 28,
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      {/* Title block */}
      <div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 40,
              fontWeight: 900,
              letterSpacing: -1.5,
              color: "#FFFFFF",
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            <span style={{ color: "#E10600" }}>F1</span> 2026
          </h1>
          <span
            style={{
              color: "#3A3D48",
              fontSize: 13,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Season Tracker
          </span>
        </div>
        <div style={{ color: "#444", fontSize: 11, marginTop: 6, letterSpacing: 0.3 }}>
          {totalCount} Rounds &middot; 11 Teams &middot; 22 Drivers &middot; {sprintCount} Sprint Weekends
          &nbsp;
          <span style={{ color: "#2A5C2A" }}>
            ({completedCount}/{totalCount} complete)
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <ViewToggle view={view} onChange={onViewChange} />
        <AdminButton onClick={onAdminOpen} />
      </div>
    </div>
  );
}

// ── ViewToggle ────────────────────────────────────────────────
function ViewToggle({ view, onChange }) {
  return (
    <div
      style={{
        background: "#0F1117",
        border: "1px solid #2A2D35",
        borderRadius: 10,
        padding: 4,
        display: "flex",
      }}
    >
      {["driver", "team"].map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          style={{
            background: view === v ? "#E10600" : "transparent",
            border: "none",
            color: view === v ? "#fff" : "#666",
            borderRadius: 7,
            padding: "7px 22px",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 1,
            transition: "all .15s",
          }}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

// ── AdminButton ───────────────────────────────────────────────
function AdminButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#161920",
        border: "1px solid #2A2D35",
        color: "#666",
        borderRadius: 10,
        padding: "8px 16px",
        cursor: "pointer",
        fontSize: 12,
        letterSpacing: 0.3,
        transition: "border-color .15s, color .15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#555";
        e.currentTarget.style.color = "#AAA";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#2A2D35";
        e.currentTarget.style.color = "#666";
      }}
    >
      ⚙ Edit
    </button>
  );
}
