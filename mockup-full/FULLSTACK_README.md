# F1 2026 Season Tracker — Full-Stack Setup

## Project Layout

```
f1-tracker/
├── backend/                  ← Python FastAPI project
│   ├── app/
│   │   ├── main.py           ← FastAPI app + CORS
│   │   ├── db.py             ← SQLite engine + session
│   │   ├── models.py         ← SQLModel table definitions
│   │   ├── schemas.py        ← Pydantic request/response schemas
│   │   ├── seed.py           ← One-time data seeder
│   │   └── routers/
│   │       ├── teams.py      ← GET/POST/PATCH/DELETE /teams
│   │       ├── drivers.py    ← GET/POST/PATCH/DELETE /drivers
│   │       ├── races.py      ← GET/POST/PATCH /races + PUT /weekend
│   │       └── standings.py  ← GET /standings  GET /grid
│   ├── requirements.txt
│   └── f1.db                 ← SQLite file (auto-created on first run)
│
└── frontend/  (your existing Vite/React project)
    └── src/
        ├── api/
        │   ├── client.js     ← Typed fetch wrapper
        │   └── hooks.js      ← useSeasonGrid, useTeams, useDrivers…
        ├── utils/
        │   └── standings.js  ← Same helpers, now accept live props
        ├── components/
        │   └── AdminPanel.jsx ← Live CRUD + weekend entry UI
        └── App.jsx           ← Wired to useSeasonGrid()
```

---

## Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Seed the database with 2026 season baseline
python -m app.seed

# Start the API server
uvicorn app.main:app --reload --port 8000
```

Interactive API docs → http://localhost:8000/docs  
Alternative UI      → http://localhost:8000/redoc

---

## Frontend Setup

```bash
cd frontend
cp .env.example .env.local   # sets VITE_API_URL=http://localhost:8000
npm install
npm run dev                  # → http://localhost:5173
```

### Files to drop into your existing src/

| New file | Replaces / extends |
|---|---|
| `src/api/client.js` | Nothing — new layer |
| `src/api/hooks.js` | Nothing — new layer |
| `src/utils/standings.js` | Replace the static version |
| `src/App.jsx` | Replace the static version |
| `src/components/AdminPanel.jsx` | Replace the static version |

The remaining components (SeasonGrid, PositionCell, TrackModal, etc.) stay
the same — they just receive `{ races, drivers, teams, cells }` as props
instead of importing from static data files.

---

## API Reference

### Core Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/grid` | **Main FE call** — everything in one payload |
| GET | `/standings` | Driver + team championship tables |
| GET | `/teams/` | All teams |
| PATCH | `/teams/{id}` | Update team color |
| GET | `/drivers/` | All drivers |
| PATCH | `/drivers/{id}` | Update driver name / number / team |
| GET | `/races/` | Full schedule |
| PATCH | `/races/{id}` | Update circuit info / lap record |
| GET | `/races/{id}/sessions` | All session data for a race |
| PUT | `/races/{id}/weekend` | **Replace entire weekend data** |

### Weekend Payload Shape

```json
PUT /races/r02/weekend
{
  "sessions": [
    {
      "session_type": "fp1",
      "entries": [
        { "driver_id": "russell", "position": 1 },
        { "driver_id": "norris",  "position": 2 }
      ]
    },
    {
      "session_type": "race",
      "entries": [
        {
          "driver_id": "russell",
          "position": 1,
          "time": "1:23:06.801",
          "laps": 58,
          "points": 25
        },
        {
          "driver_id": "bortoleto",
          "position": null,
          "status": "DNF",
          "laps": 32,
          "points": 0
        }
      ]
    }
  ]
}
```

Sprint weekends use `"sq"` and `"sprint"` as additional session types.

---

## Data Flow

```
React Admin Panel
       │
       │ useWeekendEntry(raceId).saveWeekend(payload)
       ▼
src/api/client.js → PUT /races/{id}/weekend
       │
       ▼
FastAPI routers/races.py
  → deletes old sessions + entries for that race
  → inserts new sessions + entries
       │
       ▼
SQLite  (f1.db)
       │
       ▼
GET /grid  (called by useSeasonGrid() on every App mount + after saves)
  → flat { races, drivers, teams, cells[] }
       │
       ▼
SeasonGrid.jsx   (groups cells by race_id + session_type client-side)
PositionCell.jsx (reads a single cell for driver + race)
AdminPanel.jsx   (reads/writes via useTeams, useDrivers, useWeekendEntry)
```

---

## Weekly Workflow (Race Weekend)

1. Open the app → click **⚙ Edit**
2. Go to **Weekend** tab → select the race
3. Click "Load saved data" to prefill from previous partial saves
4. Fill in session results top-to-bottom (FP1 → Qualifying → Race)
5. Click **Save Weekend** — single PUT call replaces all data
6. Grid auto-refreshes; standings update immediately

---

## Extending

**Add a driver mid-season** (e.g. reserve driver swap):
```bash
curl -X POST http://localhost:8000/drivers/ \
  -H "Content-Type: application/json" \
  -d '{"id":"reserve1","name":"Reserve Driver","number":99,"team_id":"haas","flag":"🏳️"}'
```

**Suspend / postpone a race**: PATCH the race's date field via the Tracks tab
or directly via the API. The round order is determined by the `round` field.

**Add a new team (Cadillac full entry, etc.)**: POST to `/teams/` then POST
the two drivers to `/drivers/`.
