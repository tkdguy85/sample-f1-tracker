import { useTooltip } from "../hooks/useTooltip";
import { getTeam } from "../utils/standings";
import { STATUS_COLORS } from "../utils/standings";

// ── TeamSwatch ────────────────────────────────────────────────
export function TeamSwatch({ teamId, size = 10 }) {
  const t = getTeam(teamId);
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: 2,
        background: t?.color ?? "#888",
        flexShrink: 0,
      }}
    />
  );
}

// ── TeamBar ───────────────────────────────────────────────────
export function TeamBar({ teamId, height = 24 }) {
  const t = getTeam(teamId);
  return (
    <div
      style={{
        width: 3,
        height,
        background: t?.color ?? "#555",
        borderRadius: 2,
        flexShrink: 0,
      }}
    />
  );
}

// ── StatusBadge ───────────────────────────────────────────────
export function StatusBadge({ status }) {
  return (
    <span
      style={{
        background: STATUS_COLORS[status] ?? "#666",
        color: "#fff",
        fontSize: 9,
        fontWeight: 700,
        padding: "1px 5px",
        borderRadius: 3,
        letterSpacing: 0.5,
      }}
    >
      {status}
    </span>
  );
}

// ── SprintPip ─────────────────────────────────────────────────
export function SprintPip() {
  return (
    <div
      style={{
        position: "absolute",
        top: 3,
        right: 3,
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: "#AA88FF",
      }}
    />
  );
}

// ── KVRow — used inside tooltip panels ───────────────────────
export function KVRow({ label, value, accent }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 3,
        gap: 12,
      }}
    >
      <span style={{ color: "#666", fontSize: 11 }}>{label}</span>
      <span
        style={{
          color: accent ? "#E8CA00" : "#CCC",
          fontSize: 11,
          fontWeight: accent ? 700 : 400,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────
export function Tooltip({ children, content }) {
  const { isVisible, show, hide } = useTooltip();

  return (
    <div
      style={{ position: "relative", display: "contents" }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {isVisible && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 600,
            background: "#0D0F14",
            border: "1px solid #2A2D35",
            borderRadius: 10,
            padding: "10px 14px",
            minWidth: 210,
            boxShadow: "0 8px 32px rgba(0,0,0,.85)",
            pointerEvents: "none",
          }}
        >
          {content}
          {/* caret */}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid #2A2D35",
            }}
          />
        </div>
      )}
    </div>
  );
}
