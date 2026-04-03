import { useState, useEffect, useCallback } from "react"
import { gridApi, standingsApi, teamsApi, driversApi, racesApi } from "./client"


function useAsync(asyncFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      setData(await asyncFn())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { run() }, [run])

  return { data, loading, error, refetch: run }
}


//* Season Grid
// Returns { races, drivers, teams, cells, loading, error, refetch }.
// The FE groups cells by race_id + session_type client-side.

export function useSeasonGrid() {
  const { data, ...rest } = useAsync(gridApi.get)
  return {
    races: data?.races ?? [],
    drivers: data?.drivers ?? [],
    teams: data?.teams ?? [],
    cells: data?.cells ?? [],
    ...rest,
  }
}


//* Current Standings
export function useStandings() {
  const { data, ...rest } = useAsync(standingsApi.get)
  return {
    driverStandings: data?.drivers ?? [],
    teamStandings: data?.teams ?? [],
    ...rest,
  }
}


//* ADMIN: Teams
export function useTeams() {
  const { data, loading, error, refetch } = useAsync(teamsApi.list)

  const createTeam = useCallback(async (payload) => {
    await teamsApi.create(payload)
    refetch()
  }, [refetch])

  const updateTeam = useCallback(async (id, patch) => {
    await teamsApi.update(id, patch)
    refetch()
  }, [refetch])

  const removeTeam = useCallback(async (id) => {
    await teamsApi.remove(id)
    refetch()
  }, [refetch])

  return {
    teams: data ?? [],
    loading, error, refetch,
    createTeam, updateTeam, removeTeam,
  }
}


//* ADMIN: Drivers
export function useDrivers() {
  const { data, loading, error, refetch } = useAsync(driversApi.list)

  const createDriver = useCallback(async (payload) => {
    await driversApi.create(payload)
    refetch()
  }, [refetch])

  const updateDriver = useCallback(async (id, patch) => {
    await driversApi.update(id, patch)
    refetch()
  }, [refetch])

  const removeDriver = useCallback(async (id) => {
    await driversApi.remove(id)
    refetch()
  }, [refetch])

  return {
    drivers: data ?? [],
    loading, error, refetch,
    createDriver, updateDriver, removeDriver,
  }
}


//* ADMIN: Races
export function useRaces() {
  const { data, loading, error, refetch } = useAsync(racesApi.list)

  const updateRace = useCallback(async (id, patch) => {
    await racesApi.update(id, patch)
    refetch()
  }, [refetch])

  return { 
    races: data ?? [], 
    loading, error, 
    refetch, updateRace 
  }
}


//* ADMIN: Weekend Round up
export function useWeekendEntry(raceId) {
  const fetchSessions = useCallback(
    () => raceId ? racesApi.getSessions(raceId) : Promise.resolve([]),
    [raceId]
  )

  const { data, loading, error, refetch } = useAsync(fetchSessions, [raceId])

  // Replace the entire weekend payload.
  // weekendPayload: { sessions: [ { session_type, entries: [...] } ] }

  const saveWeekend = useCallback(async (weekendPayload) => {
    await racesApi.putWeekend(raceId, weekendPayload)
    refetch()
  }, [raceId, refetch])

  return {
    sessions: data ?? [],
    loading, error, refetch,
    saveWeekend,
  }
}
