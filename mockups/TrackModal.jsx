// ── TrackModal ────────────────────────────────────────────────
// Shown when the user clicks a race column header.

export function TrackModal({ race, onClose }) {
  if (!race) return null;

  const raceDistance = (race.laps * race.length).toFixed(1);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.88)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#0F1117",
          border: "1px solid #2A2D35",
          borderRadius: 16,
          padding: 32,
          maxWidth: 480,
          width: "90%",
          boxShadow: "0 24px 80px rgba(0,0,0,.85)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <div style={{ fontSize: 30, marginBottom: 4 }}>{race.flag}</div>
            <div
              style={{
                color: "#E8E9EA",
                fontSize: 22,
                fontWeight: 700,
                fontFamily: "serif",
              }}
            >
              {race.name}
            </div>
            <div style={{ color: "#666", fontSize: 12, marginTop: 3 }}>
              Round {race.round} &middot; {race.date} &middot; {race.city}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid #333",
              color: "#777",
              borderRadius: 8,
              padding: "4px 12px",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Circuit diagram placeholder */}
        <div
          style={{
            background: "#0D0F14",
            border: "1px solid #1E2028",
            borderRadius: 10,
            height: 130,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            flexDirection: "column",
            gap: 6,
          }}
        >
          <CircuitPlaceholder />
          <span style={{ color: "#3A3D48", fontSize: 11 }}>{race.circuit}</span>
        </div>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["Circuit",        race.circuit],
            ["Location",       `${race.city}, ${race.country}`],
            ["Total Laps",     race.laps],
            ["Circuit Length", `${race.length} km`],
            ["Race Distance",  `${raceDistance} km`],
            [
              "Lap Record",
              race.lapRecord.time !== "TBD"
                ? `${race.lapRecord.time} (${race.lapRecord.holder}, ${race.lapRecord.year})`
                : "TBD — new venue",
            ],
          ].map(([label, value]) => (
            <StatCard key={label} label={label} value={value} />
          ))}
        </div>

        {/* Sprint badge */}
        {race.sprint && (
          <div
            style={{
              marginTop: 14,
              background: "#1A1040",
              border: "1px solid #5533AA",
              borderRadius: 8,
              padding: "8px 14px",
              color: "#AA88FF",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            ⚡ SPRINT WEEKEND
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────
function StatCard({ label, value }) {
  return (
    <div
      style={{
        background: "#161920",
        borderRadius: 8,
        padding: "10px 14px",
      }}
    >
      <div
        style={{
          color: "#555",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ color: "#DDE", fontSize: 12, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function CircuitPlaceholder() {
  return (
    <svg width="200" height="75" viewBox="0 0 200 75">
      <path
        d="M15 60 Q15 15 70 15 Q130 15 155 35 Q170 50 160 60 Q148 70 110 70 Q72 70 50 60 Q32 50 15 60 Z"
        fill="none"
        stroke="#2A2D3A"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M15 60 Q15 15 70 15 Q130 15 155 35 Q170 50 160 60 Q148 70 110 70 Q72 70 50 60 Q32 50 15 60 Z"
        fill="none"
        stroke="#E10600"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="6 5"
        opacity={0.4}
      />
      <circle cx="15" cy="60" r="3.5" fill="#E10600" opacity={0.8} />
    </svg>
  );
}
