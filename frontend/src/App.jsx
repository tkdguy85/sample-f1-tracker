import { useState } from "react"
import { useSeasonGrid } from "./api/hooks"
import { AppHeader }  from "./components/AppHeader"
import { GridLegend } from "./components/GridLegend"
import { SeasonGrid }  from "./components/SeasonGrid"
import { AdminPanel }  from "./components/AdminPanel"


export default function App() {
  const [view, setView] = useState("driver")
  const [showAdmin, setShowAdmin] = useState(false)
  const { races, drivers, teams, cells, loading, error, refetch } = useSeasonGrid()

  return (
    <div style={{
      background: "#080A0E", 
      minHeight: "100vh",
      fontFamily: "'Barlow Condensed','Arial Narrow',Arial,sans-serif",
      color: "#E0E1E2", 
      padding: "28px 24px",
    }}>
      <div style={{ maxWidth: 1700, margin: "0 auto" }}>
        <AppHeader
          view={view}
          onViewChange={setView}
          onAdminOpen={() => setShowAdmin(true)}
          racesTotal={races.length}
          racesComplete={[...new Set(cells.filter(c => c.session_type === "race").map(c => c.race_id))].length}
        />

        <GridLegend />

        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={refetch} />}

        {!loading && !error && (
          <SeasonGrid
            view={view}
            races={races}
            drivers={drivers}
            teams={teams}
            cells={cells}
          />
        )}
      </div>

      {showAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          onSaved={refetch} /* refresh grid after any admin save */
        />
      )}
    </div>
  )
}


// *  Loading / Error states 
function LoadingState() {
  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      height: 300, gap: 12 
    }}>
      <div style={{ 
        width: 8, 
        height: 8, 
        borderRadius: "50%", 
        background: "#E10600", 
        animation: "pulse 1s infinite" 
      }}/>
      <span style={{ 
        color: "#444", 
        fontSize: 14 
      }}>
        Loading season data…
      </span>
      <style>{`@keyframes pulse { 0%,100%{opacity:.2} 50%{opacity:1} }`}</style>
    </div>
  )
}

function ErrorState({ message, onRetry }) {
  return (
    <div style={{ 
      textAlign: "center", 
      padding: 60 
    }}>
      <div style={{ 
        color: "#FF4444", 
        fontSize: 16, 
        marginBottom: 12 
      }}>
        Failed to load data
      </div>
      <div style={{ 
        color: "#555", 
        fontSize: 12, 
        marginBottom: 20 
      }}>
        {message}
      </div>
      <button 
        onClick={onRetry} 
        style={{ 
          background: "#E10600", 
          border: "none", 
          color: "#fff", 
          borderRadius: 8, 
          padding: "8px 24px", 
          cursor: "pointer" 
      }}>
        Retry
      </button>
    </div>
  )
}
