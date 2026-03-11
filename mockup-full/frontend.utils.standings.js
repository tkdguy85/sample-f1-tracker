/**
 * src/utils/standings.js  (API-backed version)
 *
 * Same helper signatures as the static version — the rest of the app
 * doesn't need to change. Receives live data from useSeasonGrid().
 */

export const STATUS_COLORS = { DNF: "#FF4444", DNS: "#FF8C00", DSQ: "#CC00CC" };

export function positionColor(pos) {
  if (pos === 1) return "#FFD700";
  if (pos === 2) return "#C0C0C0";
  if (pos === 3) return "#CD7F32";
  return null;
}

// ── Lookups (pure, no side-effects) ──────────────────────────────────────────

export const getTeam        = (teams, id)    => teams.find((t) => t.id === id);
export const getDriver      = (drivers, id)  => drivers.find((d) => d.id === id);
export const getTeamDrivers = (drivers, tid) => drivers.filter((d) => d.team_id === tid);


// ── Points from flat cells array ──────────────────────────────────────────────

/**
 * cells: GridCell[] from /grid
 * Returns { [driverId]: totalPoints }
 */
export function calcDriverPoints(cells) {
  const pts = {};
  cells.forEach((c) => {
    if ((c.session_type === "race" || c.session_type === "sprint") && c.points) {
      pts[c.driver_id] = (pts[c.driver_id] ?? 0) + c.points;
    }
  });
  return pts;
}

/**
 * Returns { [teamId]: totalPoints }
 */
export function calcTeamPoints(cells, drivers) {
  const driverPts = calcDriverPoints(cells);
  const pts = {};
  drivers.forEach((d) => {
    pts[d.team_id] = (pts[d.team_id] ?? 0) + (driverPts[d.id] ?? 0);
  });
  return pts;
}

/**
 * Total points earned by a team in a single race.
 * Returns null if no race data exists for that race yet.
 */
export function calcTeamRacePoints(cells, drivers, teamId, raceId) {
  const teamDriverIds = new Set(
    drivers.filter((d) => d.team_id === teamId).map((d) => d.id)
  );
  const raceCells = cells.filter(
    (c) => c.race_id === raceId && c.session_type === "race" && teamDriverIds.has(c.driver_id)
  );
  if (raceCells.length === 0) return null;
  return raceCells.reduce((acc, c) => acc + (c.points ?? 0), 0);
}


// ── Sorted standings ──────────────────────────────────────────────────────────

export function getDriverStandings(cells, drivers) {
  const pts = calcDriverPoints(cells);
  return [...drivers].sort((a, b) => (pts[b.id] ?? 0) - (pts[a.id] ?? 0));
}

export function getTeamStandings(cells, drivers, teams) {
  const pts = calcTeamPoints(cells, drivers);
  return [...teams].sort((a, b) => (pts[b.id] ?? 0) - (pts[a.id] ?? 0));
}


// ── Cell lookup helpers ───────────────────────────────────────────────────────

/**
 * Returns the GridCell for a specific driver + race + session type, or null.
 */
export function getCell(cells, driverId, raceId, sessionType = "race") {
  return cells.find(
    (c) => c.driver_id === driverId && c.race_id === raceId && c.session_type === sessionType
  ) ?? null;
}

/**
 * Returns all race-session cells for a given team in a given race.
 */
export function getTeamRaceCells(cells, drivers, teamId, raceId) {
  const ids = new Set(drivers.filter((d) => d.team_id === teamId).map((d) => d.id));
  return cells.filter(
    (c) => c.race_id === raceId && c.session_type === "race" && ids.has(c.driver_id)
  );
}
