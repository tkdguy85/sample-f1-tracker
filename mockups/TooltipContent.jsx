import { getDriver, getTeam, getTeamDrivers, calcDriverPoints, calcTeamPoints } from "../utils/standings";
import { TeamBar, TeamSwatch, KVRow } from "./UI";
import { RESULTS } from "../data/results";

// ── DriverTooltipContent ──────────────────────────────────────
export function DriverTooltipContent({ driverId, raceId }) {
  const driver = getDriver(driverId);
  const team   = getTeam(driver?.team);
  const driverPts = calcDriverPoints();
  const raceResult = RESULTS[raceId]?.race?.[driverId];

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <TeamSwatch teamId={driver?.team} size={12} />
        <span style={{ color: "#E0E1E2", fontWeight: 700, fontSize: 13 }}>
          {driver?.name}
        </span>
        <span style={{ color: "#666", fontSize: 11 }}>#{driver?.number}</span>
      </div>
      <div style={{ color: "#888", fontSize: 11, marginBottom: 8 }}>{team?.name}</div>

      {/* Race result */}
      {raceResult && (
        <div
          style={{
            borderTop: "1px solid #1E2028",
            paddingTop: 8,
            marginBottom: 6,
          }}
        >
          <KVRow label="Finish"  value={raceResult.status ?? `P${raceResult.position}`} />
          <KVRow label="Laps"    value={raceResult.laps} />
          <KVRow label="Time"    value={raceResult.status ?? raceResult.time} />
          <KVRow label="Points"  value={raceResult.points} accent />
        </div>
      )}

      {/* Season total */}
      <div style={{ borderTop: "1px solid #1E2028", paddingTop: 6 }}>
        <KVRow label="Season Total" value={`${driverPts[driverId] ?? 0} pts`} accent />
      </div>
    </div>
  );
}

// ── TeamTooltipContent ────────────────────────────────────────
export function TeamTooltipContent({ teamId, raceId }) {
  const team       = getTeam(teamId);
  const teamPts    = calcTeamPoints();
  const raceData   = RESULTS[raceId]?.race;
  const drivers    = getTeamDrivers(teamId);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <TeamBar teamId={teamId} height={14} />
        <span style={{ color: "#E0E1E2", fontWeight: 700, fontSize: 13 }}>{team?.name}</span>
      </div>

      {/* Per-driver row */}
      {drivers.map((d) => {
        const r = raceData?.[d.id];
        return (
          <div
            key={d.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <span style={{ color: "#AAB", fontSize: 11 }}>
              {d.flag} #{d.number} {d.name.split(" ").at(-1)}
            </span>
            {r && (
              <span style={{ color: "#E8CA00", fontWeight: 700, fontSize: 11 }}>
                {r.points ?? 0} pts
              </span>
            )}
          </div>
        );
      })}

      {/* Season total */}
      <div style={{ borderTop: "1px solid #1E2028", paddingTop: 6, marginTop: 4 }}>
        <KVRow label="Season Total" value={`${teamPts[teamId] ?? 0} pts`} accent />
      </div>
    </div>
  );
}
