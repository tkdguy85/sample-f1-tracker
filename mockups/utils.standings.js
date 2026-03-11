import { TEAMS, DRIVERS } from "../data/teams";
import { RESULTS } from "../data/results";

// ── Lookups ──────────────────────────────────────────────────
export const getTeam   = (id) => TEAMS.find((t) => t.id === id);
export const getDriver = (id) => DRIVERS.find((d) => d.id === id);
export const getTeamDrivers = (teamId) => DRIVERS.filter((d) => d.team === teamId);

// ── Points calculators ───────────────────────────────────────
export function calcDriverPoints() {
  const pts = Object.fromEntries(DRIVERS.map((d) => [d.id, 0]));

  Object.values(RESULTS).forEach((race) => {
    ["race", "sprint"].forEach((session) => {
      if (!race[session]) return;
      Object.entries(race[session]).forEach(([dId, r]) => {
        pts[dId] = (pts[dId] ?? 0) + (r.points ?? 0);
      });
    });
  });
  return pts;
}

export function calcTeamPoints() {
  const driverPts = calcDriverPoints();
  const pts = Object.fromEntries(TEAMS.map((t) => [t.id, 0]));
  DRIVERS.forEach((d) => {
    pts[d.team] = (pts[d.team] ?? 0) + (driverPts[d.id] ?? 0);
  });
  return pts;
}

export function calcTeamRacePoints(teamId, raceId) {
  const race = RESULTS[raceId];
  if (!race?.race) return null;
  return getTeamDrivers(teamId).reduce(
    (acc, d) => acc + (race.race[d.id]?.points ?? 0),
    0
  );
}

// ── Sorted standings ─────────────────────────────────────────
export function getDriverStandings() {
  const pts = calcDriverPoints();
  return [...DRIVERS].sort((a, b) => (pts[b.id] ?? 0) - (pts[a.id] ?? 0));
}

export function getTeamStandings() {
  const pts = calcTeamPoints();
  return [...TEAMS].sort((a, b) => (pts[b.id] ?? 0) - (pts[a.id] ?? 0));
}

// ── Race status helpers ──────────────────────────────────────
export const SPECIAL_STATUSES = ["DNS", "DNF", "DSQ"];
export const isSpecialStatus = (val) => SPECIAL_STATUSES.includes(val);

export const STATUS_COLORS = { DNF: "#FF4444", DNS: "#FF8C00", DSQ: "#CC00CC" };

export function positionColor(position) {
  if (position === 1) return "#FFD700";
  if (position === 2) return "#C0C0C0";
  if (position === 3) return "#CD7F32";
  return null;
}

// ── Misc ─────────────────────────────────────────────────────
export const completedRaceCount = () => Object.keys(RESULTS).length;
