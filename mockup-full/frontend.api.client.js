/**
 * src/api/client.js
 *
 * Thin typed wrapper around fetch().
 * Every function maps 1:1 to a backend endpoint.
 * The React app never calls fetch() directly — only these functions.
 */

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail?.detail ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

const get    = (path)         => request("GET",    path);
const post   = (path, body)   => request("POST",   path, body);
const patch  = (path, body)   => request("PATCH",  path, body);
const put    = (path, body)   => request("PUT",    path, body);
const del    = (path)         => request("DELETE", path);


// ── Teams ─────────────────────────────────────────────────────────────────────

export const teamsApi = {
  list:   ()           => get("/teams/"),
  get:    (id)         => get(`/teams/${id}`),
  create: (payload)    => post("/teams/", payload),
  update: (id, patch_) => patch(`/teams/${id}`, patch_),
  remove: (id)         => del(`/teams/${id}`),
};


// ── Drivers ───────────────────────────────────────────────────────────────────

export const driversApi = {
  list:   ()           => get("/drivers/"),
  get:    (id)         => get(`/drivers/${id}`),
  create: (payload)    => post("/drivers/", payload),
  update: (id, patch_) => patch(`/drivers/${id}`, patch_),
  remove: (id)         => del(`/drivers/${id}`),
};


// ── Races ─────────────────────────────────────────────────────────────────────

export const racesApi = {
  list:         ()           => get("/races/"),
  get:          (id)         => get(`/races/${id}`),
  create:       (payload)    => post("/races/", payload),
  update:       (id, patch_) => patch(`/races/${id}`, patch_),
  remove:       (id)         => del(`/races/${id}`),
  getSessions:  (id)         => get(`/races/${id}/sessions`),

  /**
   * Replace the full weekend data for a race.
   * payload: { sessions: [ { session_type, entries: [...] } ] }
   */
  putWeekend:   (id, payload) => put(`/races/${id}/weekend`, payload),
};


// ── Standings & Grid ──────────────────────────────────────────────────────────

export const standingsApi = {
  /** { drivers: [...], teams: [...] } */
  get: () => get("/standings"),
};

export const gridApi = {
  /**
   * Full season grid in one fetch.
   * Returns { races, drivers, teams, cells }
   */
  get: () => get("/grid"),
};
