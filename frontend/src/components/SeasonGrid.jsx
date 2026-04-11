import { useState } from "react"
import { RACES } from "../data/races"
import { getTeam, getDriverStandings, getTeamStandings, calcDriverPoints, calcTeamPoints } from "../utils/standings"
import { SprintPip } from "./UI"
import { PositionCell } from "./PositionCell"
import { TrackModal } from "./TrackModal"

const COL_W      = 48
const LABEL_W    = 182
const PTS_W      = 72

// ── SeasonGrid ────────────────────────────────────────────────
export function SeasonGrid({ view }) {
  const [activeRace, setActiveRace] = useState(null)

  const driverPts  = calcDriverPoints()
  const teamPts    = calcTeamPoints()
  const rows       = view === "driver" ? getDriverStandings() : getTeamStandings()

  const gridCols = `${LABEL_W}px repeat(${RACES.length}, ${COL_W}px) ${PTS_W}px`
  const minWidth = LABEL_W + RACES.length * COL_W + PTS_W

  return (
    <>
      <div
        style={{
          overflowX: "auto",
          border: "1px solid #1A1C22",
          borderRadius: 12,
          background: "#0B0D12",
        }}
      >
        <div style={{ minWidth }}>
          {/* ── Header row ───────────────────────────── */}
          <div style={{ display: "grid", gridTemplateColumns: gridCols }}>
            {/* Corner */}
            <HeaderCell style={{ justifyContent: "flex-start", padding: "0 14px" }}>
              <span style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: 1 }}>
                {view === "driver" ? "Driver" : "Constructor"}
              </span>
            </HeaderCell>

            {/* Race columns */}
            {RACES.map((race) => (
              <RaceHeaderCell
                key={race.id}
                race={race}
                onClick={() => setActiveRace(race)}
              />
            ))}

            {/* PTS column */}
            <HeaderCell>
              <span style={{ fontSize: 10, color: "#E8CA00", fontWeight: 700, letterSpacing: 1 }}>PTS</span>
            </HeaderCell>
          </div>

          {/* ── Data rows ────────────────────────────── */}
          {rows.map((row, idx) => {
            const isDriver  = view === "driver"
            const driverId  = isDriver ? row.id : null
            const teamId    = isDriver ? row.team : row.id
            const totalPts  = isDriver ? (driverPts[row.id] ?? 0) : (teamPts[row.id] ?? 0)
            const team      = getTeam(teamId)

            return (
              <div
                key={row.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: gridCols,
                  background: idx % 2 === 0 ? "#0B0D12" : "#0D0F14",
                }}
              >
                {/* Row label */}
                <div
                  style={{
                    borderRight: "1px solid #1A1C22",
                    borderBottom: "1px solid #1A1C22",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 12px",
                    gap: 8,
                    minHeight: 36,
                  }}
                >
                  <span style={{ color: "#444", fontSize: 11, fontWeight: 700, width: 20, flexShrink: 0 }}>
                    {idx + 1}
                  </span>
                  <div
                    style={{
                      width: 3,
                      height: 22,
                      background: team?.color ?? "#555",
                      borderRadius: 2,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ overflow: "hidden" }}>
                    {isDriver ? (
                      <>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#E0E1E2", letterSpacing: 0.3, whiteSpace: "nowrap" }}>
                          {row.name.split(" ").at(-1).toUpperCase()}
                        </div>
                        <div style={{ fontSize: 10, color: "#555" }}>
                          #{row.number} · {team?.name}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#E0E1E2", letterSpacing: 0.3, whiteSpace: "nowrap" }}>
                          {row.name.toUpperCase()}
                        </div>
                        <div style={{ fontSize: 10, color: "#555" }}>
                          {/* driver numbers */}
                          {/* populated via getTeamDrivers if needed */}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Per-race cells */}
                {RACES.map((race) => (
                  <div
                    key={race.id}
                    style={{
                      borderRight: "1px solid #1A1C22",
                      borderBottom: "1px solid #1A1C22",
                      minHeight: 36,
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <PositionCell
                      teamId={teamId}
                      driverId={driverId}
                      raceId={race.id}
                      isTeamView={!isDriver}
                    />
                  </div>
                ))}

                {/* Total points */}
                <div
                  style={{
                    borderBottom: "1px solid #1A1C22",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0F1117",
                  }}
                >
                  <span style={{ color: "#E8CA00", fontWeight: 700, fontSize: 14 }}>
                    {totalPts}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Track modal */}
      <TrackModal race={activeRace} onClose={() => setActiveRace(null)} />
    </>
  )
}

// ── Header cells ──────────────────────────────────────────────
function HeaderCell({ children, style = {} }) {
  return (
    <div
      style={{
        borderRight: "1px solid #1A1C22",
        borderBottom: "2px solid #2A2D35",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 40,
        background: "#0F1117",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function RaceHeaderCell({ race, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        borderRight: "1px solid #1A1C22",
        borderBottom: "2px solid #2A2D35",
        minHeight: 40,
        background: "#0F1117",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        padding: "6px 2px",
        cursor: "pointer",
        position: "relative",
        transition: "background .12s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#161920")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#0F1117")}
    >
      {race.sprint && <SprintPip />}
      <span style={{ fontSize: 9, color: "#CCC", fontWeight: 700, letterSpacing: 0.3 }}>
        R{race.round}
      </span>
      <span style={{ fontSize: 12 }}>{race.flag}</span>
    </div>
  )
}
