import { StatusBadge } from "./UI";

const LEGEND_ITEMS = [
  { color: "#FFD700",  label: "1st Place"  },
  { color: "#C0C0C0",  label: "2nd Place"  },
  { color: "#CD7F32",  label: "3rd Place"  },
  { color: "#AA88FF",  label: "Sprint weekend", dot: true },
];

export function GridLegend() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        marginBottom: 14,
        flexWrap: "wrap",
      }}
    >
      {LEGEND_ITEMS.map(({ color, label, dot }) => (
        <div
          key={label}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          {dot ? (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color,
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background: `${color}30`,
                borderLeft: `3px solid ${color}`,
                flexShrink: 0,
              }}
            />
          )}
          <span style={{ color: "#555", fontSize: 11 }}>{label}</span>
        </div>
      ))}

      <div style={{ display: "flex", gap: 6, marginLeft: 4 }}>
        {["DNF", "DNS", "DSQ"].map((s) => <StatusBadge key={s} status={s} />)}
      </div>

      <span style={{ color: "#444", fontSize: 11, marginLeft: "auto" }}>
        Click round header for circuit info · Hover cells for details
      </span>
    </div>
  );
}
