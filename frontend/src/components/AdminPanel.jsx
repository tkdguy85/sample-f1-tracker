import { useState } from "react"
import { useTeams, useDrivers, useRaces, useWeekendEntry } from "../api/hooks"

const SESSION_TYPES_STANDARD = ["fp1","fp2","fp3","q","race"]
const SESSION_TYPES_SPRINT   = ["fp1","sq","sprint","q","race"]

// * Main Admin Panel
export function AdminPanel({ onClose, onSaved }) {
  const [tab, setTab] = useState("weekend")

  return (
    <div style={{
      position:"fixed",
      inset:0,
      background:"rgba(0,0,0,.93)",
      zIndex:2000,
      display:"flex",
      alignItems:"center",
      justifyContent:"center"
    }}>
      <div style={{
        background:"#0F1117",
        border:"1px solid #2A2D35",
        borderRadius:16,
        padding:28,
        width:720,
        maxHeight:"90vh",
        overflowY:"auto",
        boxShadow:"0 24px 80px rgba(0,0,0,.9)"
      }}>

        <div style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          marginBottom:24
        }}>
          <div>
            <div style={{
              color:"#E8E9EA",
              fontSize:20,
              fontWeight:700
            }}>
              ⚙ Admin Panel
            </div>
            <div style={{
              color:"#555",
              fontSize:11,
              marginTop:2
            }}>
              Backed by FastAPI — changes persist to SQLite
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background:"none",
              border:"1px solid #333",
              color:"#777",
              borderRadius:8,
              padding:"5px 14px",
              cursor:"pointer"
            }}
          >
            Close
          </button>
        </div>

        <div style={{
          display:"flex",
          gap:8,
          marginBottom:22
        }}>
          {["weekend","drivers","teams","tracks"].map(tabType => (
            <button 
              key={tabType} 
              onClick={() => setTab(tabType)} 
              style={{
                background:tab===tabType?"#E10600":"#161920",
                border:`1px solid ${tab===tabType?"#E10600":"#2A2D35"}`,
                color:tab===tabType?"#fff":"#777",
                borderRadius:8
                ,padding:"6px 16px",
                cursor:"pointer",
                fontSize:12,
                fontWeight:600,
                textTransform:"capitalize"
              }}
            >
              {tabType}
            </button>
          ))}
        </div>

        {tab === "weekend"  && <WeekendTab onSaved={onSaved} />}
        {tab === "drivers"  && <DriversTab />}
        {tab === "teams"    && <TeamsTab />}
        {tab === "tracks"   && <TracksTab />}
      </div>
    </div>
  )
}

