import { useState } from "react";
import { AppHeader }  from "./components/AppHeader";
import { GridLegend } from "./components/GridLegend";
import { SeasonGrid }  from "./components/SeasonGrid";
import { AdminPanel }  from "./components/AdminPanel";

export default function App() {
  const [view,      setView]      = useState("driver"); // "driver" | "team"
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div
      style={{
        background: "#080A0E",
        minHeight: "100vh",
        fontFamily: "'Barlow Condensed', 'Arial Narrow', Arial, sans-serif",
        color: "#E0E1E2",
        padding: "28px 24px",
      }}
    >
      <div style={{ maxWidth: 1700, margin: "0 auto" }}>
        <AppHeader
          view={view}
          onViewChange={setView}
          onAdminOpen={() => setShowAdmin(true)}
        />

        <GridLegend />

        <SeasonGrid view={view} />
      </div>

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
