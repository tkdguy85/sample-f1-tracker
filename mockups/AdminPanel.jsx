import { useState } from "react";
import { DRIVERS, TEAMS } from "../data/teams";
import { RACES } from "../data/races";
import { RESULTS } from "../data/results";
import { getTeam } from "../utils/standings";
import { TeamBar } from "./UI";

// ── AdminPanel ────────────────────────────────────────────────
export function AdminPanel({ onClose }) {
  const [tab, setTab] = useState("drivers");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.93)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#0F1117",
          border: "1px solid #2A2D35",
          borderRadius: 16,
          padding: 28,
          width: 680,
          maxHeight: "88vh",
          overflowY: "auto",
          boxShadow: "0 24px 80px rgba(0,0,0,.9)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <div style={{ color: "#E8E9EA", fontSize: 20, fontWeight: 700 }}>
              ⚙ Admin Panel
            </div>
            <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>
              Update the source files after each race weekend
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid #333",
              color: "#777",
              borderRadius: 8,
              padding: "5px 14px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          {["drivers", "tracks", "results schema"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? "#E10600" : "#161920",
                border: `1px solid ${tab === t ? "#E10600" : "#2A2D35"}`,
                color: tab === t ? "#fff" : "#777",
                borderRadius: 8,
                padding: "6px 16px",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "capitalize",
                letterSpacing: 0.3,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "drivers"        && <AdminDrivers />}
        {tab === "tracks"         && <AdminTracks />}
        {tab === "results schema" && <AdminResultsSchema />}
      </div>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────
function AdminDrivers() {
  return (
    <div>
      <p style={{ color: "#666", fontSize: 12, marginBottom: 14 }}>
        Edit <code style={{ color: "#AA88FF" }}>src/data/teams.js</code> to add,
        remove, or update drivers.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {DRIVERS.map((d) => {
          const t = getTeam(d.team);
          return (
            <div
              key={d.id}
              style={{
                background: "#161920",
                border: "1px solid #1E2028",
                borderRadius: 8,
                padding: "10px 14px",
                borderLeft: `3px solid ${t?.color}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#DDE", fontSize: 13 }}>
                  {d.flag} {d.name}
                </span>
                <span style={{ color: t?.color, fontWeight: 700, fontSize: 13 }}>
                  #{d.number}
                </span>
              </div>
              <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>
                {t?.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminTracks() {
  const completedIds = new Set(Object.keys(RESULTS));
  return (
    <div>
      <p style={{ color: "#666", fontSize: 12, marginBottom: 14 }}>
        Edit <code style={{ color: "#AA88FF" }}>src/data/races.js</code> to update
        circuits, lap records, or suspension info.
      </p>
      {RACES.map((r) => (
        <div
          key={r.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "9px 12px",
            borderBottom: "1px solid #141619",
            opacity: completedIds.has(r.id) ? 1 : 0.55,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#444", fontSize: 11, fontWeight: 700, width: 22 }}>
              R{r.round}
            </span>
            <span style={{ fontSize: 14 }}>{r.flag}</span>
            <div>
              <div style={{ color: "#CCC", fontSize: 12 }}>{r.name}</div>
              <div style={{ color: "#555", fontSize: 11 }}>{r.circuit}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {completedIds.has(r.id) && (
              <span
                style={{
                  color: "#4CAF50",
                  fontSize: 10,
                  background: "#0A1F0A",
                  padding: "2px 7px",
                  borderRadius: 4,
                  fontWeight: 700,
                }}
              >
                ✓ DONE
              </span>
            )}
            {r.sprint && (
              <span
                style={{
                  color: "#AA88FF",
                  fontSize: 10,
                  background: "#1A1040",
                  padding: "2px 7px",
                  borderRadius: 4,
                  fontWeight: 700,
                }}
              >
                SPRINT
              </span>
            )}
            <span style={{ color: "#444", fontSize: 11 }}>{r.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminResultsSchema() {
  return (
    <div>
      <p style={{ color: "#666", fontSize: 12, marginBottom: 14 }}>
        Add a new block to{" "}
        <code style={{ color: "#AA88FF" }}>src/data/results.js</code> after each
        race. Choose the schema that matches the weekend format.
      </p>

      <SchemaBlock
        title="Standard Weekend (FP1 · FP2 · FP3 · Q · Race)"
        code={STANDARD_SCHEMA}
      />
      <SchemaBlock
        title="Sprint Weekend (FP1 · SQ · Sprint · Q · Race)"
        code={SPRINT_SCHEMA}
        style={{ marginTop: 16 }}
      />

      <div
        style={{
          marginTop: 16,
          background: "#0D1520",
          border: "1px solid #1E3A5F",
          borderRadius: 8,
          padding: "10px 14px",
        }}
      >
        <div style={{ color: "#5599CC", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>
          POINTS REFERENCE
        </div>
        <div style={{ color: "#668", fontSize: 11 }}>
          Race top 10 &nbsp;→&nbsp; 25 · 18 · 15 · 12 · 10 · 8 · 6 · 4 · 2 · 1
        </div>
        <div style={{ color: "#668", fontSize: 11, marginTop: 3 }}>
          Sprint top 8 →&nbsp;&nbsp; 8 · 7 · 6 · 5 · 4 · 3 · 2 · 1
        </div>
      </div>
    </div>
  );
}

function SchemaBlock({ title, code, style }) {
  return (
    <div style={style}>
      <div style={{ color: "#888", fontSize: 11, marginBottom: 6 }}>{title}</div>
      <pre
        style={{
          background: "#080A0E",
          border: "1px solid #1E2028",
          borderRadius: 8,
          padding: "14px 16px",
          color: "#7EC8AA",
          fontSize: 11,
          overflowX: "auto",
          fontFamily: "monospace",
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {code}
      </pre>
    </div>
  );
}

// ── Schema strings ────────────────────────────────────────────
const STANDARD_SCHEMA = `rXX: {
  fp1: { driverId: classifiedPosition, ... },
  fp2: { driverId: classifiedPosition, ... },
  fp3: { driverId: classifiedPosition, ... },
  q:   { driverId: gridPosition, ... },   // final Q result (Q1→Q3)
  race: {
    driverId: {
      position : 1,              // number | "DNS" | "DNF" | "DSQ"
      time     : "1:23:04.801",  // winner · "+X.XXX" for others
      laps     : 58,
      points   : 25,
      status   : "DNF",          // only include when applicable
    },
    ...
  },
},`;

const SPRINT_SCHEMA = `rXX: {
  fp1: { driverId: classifiedPosition, ... },
  sq:  { driverId: gridPosition, ... },   // Sprint Qualifying
  sprint: {
    driverId: {
      position : 1,
      time     : "...",
      laps     : 19,
      points   : 8,
    },
    ...
  },
  q:  { driverId: gridPosition, ... },    // Main Qualifying
  race: { /* same shape as standard */ },
},`;
