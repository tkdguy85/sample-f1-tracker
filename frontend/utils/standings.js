export const STATUS_COLORS = { 
  DNF: "#FF4444", 
  DNS: "#FF8C00", 
  DSQ: "#CC00CC" 
}


//* Position Labels
export function positionColor(pos) {
  if (pos === 1) return "#FFD700"
  if (pos === 2) return "#C0C0C0"
  if (pos === 3) return "#CD7F32"
  return null
}


//* Team Lookups
export const getTeam = (teams, id) => teams.find((team) => team.id === id)
export const getDriver = (drivers, id) => drivers.find((driver) => driver.id === id)
export const getTeamDrivers = (drivers, tid) => drivers.filter((driver) => driver.team_id === tid)


//* Points from Cells Array
export function calcDriverPoints(cells) {
  const pts = {}
  cells.forEach((cell) => {
    if ((cell.session_type === "race" || cell.session_type === "sprint") && cell.points) {
      pts[cell.driver_id] = (pts[cell.driver_id] ?? 0) + cell.points
    }
  })
  return pts
}

export function calcTeamPoints(cells, drivers) {
  const driverPts = calcDriverPoints(cells);
  const pts = {}
  drivers.forEach((driver) => {
    pts[driver.team_id] = (pts[driver.team_id] ?? 0) + (driverPts[driver.id] ?? 0)
  })
  return pts
}