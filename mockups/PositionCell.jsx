import { getTeam, getTeamDrivers, positionColor, isSpecialStatus, calcTeamRacePoints } from "../utils/standings";
import { StatusBadge, Tooltip } from "./UI";
import { DriverTooltipContent, TeamTooltipContent } from "./TooltipContent";
import { RESULTS } from "../data/results";

// ── PositionCell ──────────────────────────────────────────────
// Used in both driver and team rows.
function PositionCellInner({ teamId, driverId, raceId, isTeamView }) {
  const team    = getTeam(teamId);
  const raceRes = RESULTS[raceId];

  // ── Team view: total points earned by the team that race ──
  if (isTeamView) {
    const racePts = calcTeamRacePoints(teamId, raceId);
    const hasResult = racePts !== null;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: hasResult ? `${team?.color}18` : "transparent",
          borderLeft: `3px solid ${hasResult ? team?.color : "transparent"}`,
          padding: "0 4px",
          cursor: hasResult ? "pointer" : "default",
        }}
      >
        <span
          style={{
            color: hasResult ? team?.color : "#444",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: 0.3,
          }}
        >
          {hasResult ? racePts : "—"}
        </span>
      </div>
    );
  }

  // ── Driver view ───────────────────────────────────────────
  const r = raceRes?.race?.[driverId];
  if (!r) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: "#333", fontSize: 11 }}>—</span>
      </div>
    );
  }

  const status   = r.status;
  const pos      = status ? null : r.position;
  const posCol   = positionColor(pos) ?? team?.color ?? "#888";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `${posCol}18`,
        borderLeft: `3px solid ${posCol}`,
        padding: "0 4px",
        cursor: "pointer",
      }}
    >
      {status ? (
        <StatusBadge status={status} />
      ) : (
        <span
          style={{ color: posCol, fontWeight: 700, fontSize: 11, letterSpacing: 0.3 }}
        >
          P{pos}
        </span>
      )}
    </div>
  );
}

// Wrap with the appropriate tooltip
export function PositionCell({ teamId, driverId, raceId, isTeamView }) {
  const tooltipContent = isTeamView
    ? <TeamTooltipContent teamId={teamId} raceId={raceId} />
    : <DriverTooltipContent driverId={driverId} raceId={raceId} />;

  return (
    <Tooltip content={tooltipContent}>
      <PositionCellInner
        teamId={teamId}
        driverId={driverId}
        raceId={raceId}
        isTeamView={isTeamView}
      />
    </Tooltip>
  );
}
