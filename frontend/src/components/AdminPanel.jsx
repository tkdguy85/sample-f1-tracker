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
                background:tab === tabType?"#E10600":"#161920",
                border:`1px solid ${tab === tabType?"#E10600":"#2A2D35"}`,
                color:tab===tabType?"#fff":"#777",
                borderRadius:8,
                padding:"6px 16px",
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

        { tab === "weekend" && <WeekendTab onSaved={onSaved} />}
        { tab === "drivers" && <DriversTab />}
        { tab === "teams" && <TeamsTab />}
        { tab === "tracks" && <TracksTab />}
      </div>
    </div>
  )
}


// * Weekend Results
function WeekendTab({ onSaved }) {
  const {races} = useRaces()
  const [raceId, setRaceId] = useState("")
  const {sessions, loading, saveWeekend} = useWeekendEntry(raceId)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)

  // Build local editable state from API sessions
  const selectedRace = races.find(race => race.id === raceId)
  const sessionTypes = selectedRace?.sprint ? SESSION_TYPES_SPRINT : SESSION_TYPES_STANDARD

  // sessionData: { [session_type]: [ { driver_id, position, status, time, laps, points } ] }
  const [sessionData, setSessionData] = useState({})

  // When sessions load from server, populate local state
  const initFromServer = () => {
    const init = {}
    sessions.forEach(session => { init[session.session_type] = session.entries })
    setSessionData(init)
  }

  const handleRaceChange = (id) => {
    setRaceId(id)
    setSessionData({})
    setStatus(null)
  }

  const updateEntry = (sessionType, driverId, field, value) => {
    setSessionData(prev => {
      const entries = [...(prev[sessionType] ?? [])]
      const idx = entries.findIndex(e => e.driver_id === driverId)
      const entry = idx >= 0 ? { ...entries[idx] } : { driver_id: driverId }
      entry[field] = value === "" ? null : value
      
      if (idx >= 0) entries[idx] = entry 
      else entries.push(entry)
      return { ...prev, [sessionType]: entries }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setStatus(null)
    
    try {
      const payload = {
        sessions: Object.entries(sessionData)
          .filter(([, entries]) => entries?.length > 0)
          .map(([session_type, entries]) => ({ session_type, entries: entries.filter(entry => entry.driver_id) })),
      }
      await saveWeekend(payload)
      setStatus("Saved successfully")
      onSaved?.()
    } catch (err) {
      setStatus(`${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Race picker */}
      <div style={{
        marginBottom:20
      }}>
        <Label>Select Race</Label>
        <select 
          value={raceId} 
          onChange={e => handleRaceChange(e.target.value)}
          style={{
            width:"100%",
            background:"#161920",
            border:"1px solid #2A2D35",
            color:"#DDE",
            borderRadius:8,
            padding:"8px 12px",
            fontSize:13
          }}
        >
          <option value="">— choose a race —</option>
          {races.map(race => (
            <option key={race.id} value={race.id}>R{race.round} · {race.name} {race.sprint?"⚡":""}</option>
          ))}
        </select>
      </div>

      {raceId && (
        <>
          {loading ? (
            <div style={{
              color:"#555",
              fontSize:12,
              padding:20,
              textAlign:"center"
            }}>
              Loading existing data…
            </div>
          ) : (
            <>
              <button 
                onClick={initFromServer} 
                style={{
                  marginBottom:16,
                  background:"#161920",
                  border:"1px solid #2A2D35",
                  color:"#888",
                  borderRadius:8,
                  padding:"5px 14px",
                  cursor:"pointer",
                  fontSize:12
                }}
              >
                ↓ Load saved data from server
              </button>

              {sessionTypes.map(sessionType => (
                <SessionEntrySection
                  key={sessionType}
                  sessionType={sessionType}
                  entries={sessionData[sessionType] ?? []}
                  onUpdate={(driverId, field, value) => updateEntry(sessionType, driverId, field, value)}
                />
              ))}

              <div style={{
                display:"flex",
                alignItems:"center",
                gap:12,
                marginTop:20
              }}>
                <button 
                  onClick={handleSave} 
                  disabled={saving}
                  style={{
                    background:saving?"#555":"#E10600",
                    border:"none",
                    color:"#fff",
                    borderRadius:8,
                    padding:"9px 28px",
                    cursor:saving?"default":"pointer",
                    fontWeight:700,
                    fontSize:13
                  }}>
                  {saving ? "Saving…" : "Save Weekend"}
                </button>
                {status && <span style={{fontSize:12,color:status.startsWith("✅")?"#4CAF50":"#FF4444"}}>{status}</span>}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

const DRIVER_IDS = [
  "norris", "piastri", "russell", "antonelli", "leclerc", "hamilton", 
  "verstappen", "hadjar", "albon", "sainz", "lindblad", "lawson", 
  "alonso", "stroll", "ocon", "bearman", "hulkenberg", "bortoleto", 
  "gasly", "colapinto", "perez", "bottas"
]

const DRIVER_LABELS = {
  norris: "Norris",
  piastri: "Piastri",
  russell: "Russell",
  antonelli: "Antonelli",
  leclerc: "Leclerc",
  hamilton: "Hamilton",
  verstappen: "Verstappen",
  hadjar: "Hadjar",
  albon: "Albon",
  sainz: "Sainz",
  lindblad: "Lindblad",
  lawson: "Lawson",
  alonso: "Alonso",
  stroll: "Stroll",
  ocon: "Ocon",
  bearman: "Bearman",
  hulkenberg: "Hülkenberg",
  bortoleto: "Bortoleto",
  gasly: "Gasly",
  colapinto: "Colapinto",
  perez: "Pérez",
  bottas: "Bottas"
}

const SESSION_LABELS = { 
  fp1:"FP1",
  fp2:"FP2",
  fp3:"FP3",
  sq:"Sprint Qualifying",
  sprint:"Sprint Race",
  q:"Qualifying",
  race:"Race" 
}

const IS_RACE_SESSION = (sessionType) => sessionType === "race" || sessionType === "sprint"

function SessionEntrySection({ sessionType, entries, onUpdate }) {
  const [open, setOpen] = useState(sessionType === "race")
  const entryMap = Object.fromEntries((entries ?? []).map(entry => [entry.driver_id, entry]))
  const isRace = IS_RACE_SESSION(sessionType)

  return (
    <div style={{
      marginBottom:14,
      border:"1px solid #1E2028",
      borderRadius:10,
      overflow:"hidden"
    }}>
      <div 
        onClick={() => setOpen(o => !o)} 
        style={{
          background:"#161920",
          padding:"10px 16px",
          cursor:"pointer",
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center"
        }}
      >
        <span style={{
          color:"#DDE",
          fontSize:13,
          fontWeight:600
        }}>
          {SESSION_LABELS[sessionType] ?? sessionType.toUpperCase()}
        </span>
        <span style={{
          color:"#555",
          fontSize:12
        }}>
          {open?"▲":"▼"}
        </span>
      </div>
      
      {open && (
        <div style={{padding:14}}>
          <div style={{
            display:"grid",
            gridTemplateColumns:isRace?"2fr 1fr 1fr 1fr 2fr 1fr":"2fr 1fr",
            gap:6,
            marginBottom:8
          }}>
            <ColHead>Driver</ColHead>
            <ColHead>Pos</ColHead>
            {isRace && <>
              <ColHead>Status</ColHead>
              <ColHead>Laps</ColHead>
              <ColHead>Time</ColHead>
              <ColHead>Pts</ColHead>
            </>}
          </div>

          {DRIVER_IDS.map(driverId => {
            const entry = entryMap[driverId] ?? {}
            return (
              <div 
                key={driverId} 
                style={{
                  display:"grid",
                  gridTemplateColumns:isRace?"2fr 1fr 1fr 1fr 2fr 1fr":"2fr 1fr",
                  gap:6,
                  marginBottom:4
                }}
              >
                <span style={{
                  color:"#888",
                  fontSize:11,
                  display:"flex",
                  alignItems:"center"
                }}>
                  {DRIVER_LABELS[driverId]}
                </span>
                
                <Input 
                  value={entry.position ?? ""} 
                  onChange={v => onUpdate(driverId,"position",v ? parseInt(v) : null)} 
                  placeholder="P" 
                  type="number" 
                />
                {isRace && (
                  <>
                    <select 
                      value={entry.status ?? ""} 
                      onChange={event => onUpdate(driverId,"status",event.target.value||null)}
                      style={{
                        background:"#0D0F14",
                        border:"1px solid #2A2D35",
                        color:"#DDE",
                        borderRadius:6,
                        padding:"4px 6px",
                        fontSize:11
                      }}
                    >
                      <option value="">—</option>
                      <option>DNF</option><option>DNS</option><option>DSQ</option>
                    </select>
                    <Input 
                      value={entry.laps ?? ""} 
                      onChange={lap => onUpdate(driverId,"laps",lap ? parseInt(lap) : null)} placeholder="Laps" 
                      type="number" 
                    />
                    <Input 
                      value={entry.time ?? ""} 
                      onChange={time => onUpdate(driverId,"time", time||null)} 
                      placeholder="+0.000 or 1:23:06" 
                    />
                    <Input 
                      value={entry.points ?? ""} 
                      onChange={point => onUpdate(driverId,"points",point ? parseInt(point) : null)} 
                      placeholder="Pts" 
                      type="number" 
                    />
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


// * Driver Section
function DriversTab() {
  const {drivers, loading, updateDriver} = useDrivers()
  const {teams} = useTeams()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const startEdit = (driver) => { 
    setEditing(driver.id) 
    setForm({ 
      name: driver.name, 
      number: driver.number, 
      team_id: driver.team_id 
    }) 
  }
  
  const save = async (id) => {
    setSaving(true)
    await updateDriver(id, form)
    setSaving(false)
    setEditing(null)
  }

  if (loading) return <Spinner />
  
  return (
    <div style={{
      display:"grid",
      gridTemplateColumns:"1fr 1fr",
      gap:8
    }}>
      {drivers.map(driver => {
        const team = teams.find(team => team.id === driver.team_id)
        return (
          <div 
            key={driver.id} 
            style={{
              background:"#161920",
              border:"1px solid #1E2028",
              borderRadius:8,
              padding:"10px 14px",
              borderLeft:`3px solid ${team?.color??"#555"}`
            }}
          >
            {editing === driver.id ? (
              <div style={{
                display:"flex",
                flexDirection:"column",
                gap:6
              }}>
                <Input 
                  value={form.name}    
                  onChange={name => setForm(form =>({...form, name: name}))}
                  placeholder="Name" 
                />
                <Input 
                  value={form.number}  
                  onChange={num => setForm(form =>({...form, number: num}))} 
                  placeholder="Number" 
                  type="number" 
                />
                <select 
                  value={form.team_id} 
                  onChange={event => setForm(form =>({...form, team_id: event.target.value}))}
                  style={{
                    background:"#0D0F14",
                    border:"1px solid #2A2D35",
                    color:"#DDE",
                    borderRadius:6,
                    padding:"4px 6px",
                    fontSize:11
                  }}
                >
                  {teams.map(team => <option 
                    key={team.id} 
                    value={team.id}
                  >
                    {team.name}
                  </option>)}
                </select>
                
                <div style={{
                    display:"flex",
                    gap:6,
                    marginTop:4
                  }}>
                  <button 
                    onClick={() => save(driver.id)} 
                    disabled={saving} 
                    style={{...btnStyle("#E10600")}}
                  >
                    {saving?"…":"Save"}
                  </button>
                  <button 
                    onClick={() => setEditing(null)} 
                    style={{...btnStyle("#333")}}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  display:"flex",
                  justifyContent:"space-between",
                  alignItems:"center"
                }}>
                  <span style={{
                    color:"#DDE",
                    fontSize:13}}
                  >
                    {driver.flag} {driver.name}
                  </span>
                  <span style={{
                    color:team?.color,
                    fontWeight:700,
                    fontSize:13
                  }}>
                    #{driver.number}
                  </span>
                </div>
                <div style={{
                  color:"#555",
                  fontSize:11,
                  marginTop:2
                }}>
                  {team?.name}
                </div>
                <button 
                  onClick={() => startEdit(driver)} 
                  style={{
                    ...btnStyle("#1E2028"),
                    marginTop:6,
                    fontSize:10
                }}>
                  Edit
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}


// * Teams Tab
function TeamsTab() {
  const {teams, loading, updateTeam} = useTeams()
  const [editing, setEditing] = useState(null)
  const [color, setColor] = useState("")

  const save = async (id) => {
    await updateTeam(id, { color })
    setEditing(null)
  }

  if (loading) return <Spinner />
  
  return (
    <div style={{
      display:"grid",
      gridTemplateColumns:"1fr 1fr",
      gap:8
    }}>
      {teams.map(team => (
        <div 
          key={team.id} 
          style={{
            background:"#161920",
            border:"1px solid #1E2028",
            borderRadius:8,
            padding:"10px 14px",
            borderLeft:`4px solid ${team.color}`
          }}
        >
          <div style={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center"
          }}>
            <span style={{
              color:"#DDE",
              fontSize:13,
              fontWeight:700
            }}>
              {team.name}
            </span>
            <div style={{
              width:16,
              height:16,
              borderRadius:3,
              background:team.color
            }}/>
          </div>
          {editing === team.id ? (
            <div style={{
              display:"flex",
              gap:6,
              marginTop:8,
              alignItems:"center"
            }}>
              <input 
                type="color" 
                value={color} 
                onChange={edit => setColor(edit.target.value)}
                style={{
                  width:32,
                  height:28,
                  borderRadius:4,
                  border:"none",
                  cursor:"pointer"
                }}/>
              <input 
                value={color} 
                onChange={edit => setColor(edit.target.value)}
                style={{
                  flex:1,
                  background:"#0D0F14",
                  border:"1px solid #2A2D35",
                  color:"#DDE",
                  borderRadius:6,
                  padding:"4px 8px",
                  fontSize:11,
                  fontFamily:"monospace"
                }}/>
              <button 
                onClick={() => save(team.id)} 
                style={{...btnStyle("#E10600")}}
              >
                Save
              </button>
              <button 
                onClick={() => setEditing(null)} 
                style={{...btnStyle("#333")}}
              >
                ✕
              </button>
            </div>
          ) : (
            <div style={{
              display:"flex",
              alignItems:"center",
              gap:6,
              marginTop:6
            }}>
              <span 
                style={{
                  color:"#555",
                  fontSize:11,
                  fontFamily:"monospace"
                }}
              >
                {team.color}
              </span>
              <button 
                onClick={() => { 
                  setEditing(team.id) 
                  setColor(team.color) 
                }} 
                style={{
                  ...btnStyle("#1E2028")
                  ,fontSize:10
                }}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}


// * Tracks Tab
function TracksTab() {
  const {races, loading, updateRace} = useRaces()
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const startEdit = (race) => {
    setEditing(race.id)
    setForm({ 
      lap_record_time: race.lap_record_time, 
      lap_record_holder: race.lap_record_holder, 
      lap_record_year: race.lap_record_year, 
      laps: race.laps, 
      sprint: race.sprint 
    })
  }
  const save = async (id) => {
    setSaving(true)
    await updateRace(id, form)
    setSaving(false)
    setEditing(null)
  }

  if (loading) return <Spinner />
  return (
    <div>
      {races.map(race => (
        <div 
          key={race.id} 
          style={{
            borderBottom:"1px solid #141619",
            padding:"10px 12px"
          }}
        >
          <div 
            style={{
              display:"flex",
              justifyContent:"space-between",
              alignItems:"flex-start"
            }}
          >
            <div>
              <div style={{
                color:"#CCC",
                fontSize:12
              }}
              >
                {race.flag} R{race.round} · {race.name}
              </div>
              <div style={{
                color:"#555",
                fontSize:11,
                marginTop:2}}
              >
                {race.circuit} · {race.laps} laps · {race.sprint?"Sprint":""}
              </div>
              
              {
                editing !== race.id && <div 
                  style={{
                    color:"#444",
                    fontSize:11
                  }}
                >
                  Lap record: {race.lap_record_time} — {race.lap_record_holder} {race.lap_record_year ?? ""}
                </div>
              }
            </div>
            {
              editing !== race.id && <button 
                onClick={() => startEdit(race)} 
                style={{
                  ...btnStyle("#1E2028"),
                  fontSize:10
                }}
              >
                Edit
              </button>
            }
          </div>
          {
            editing === race.id && (
              <div 
                style={{
                  marginTop:10,
                  display:"grid",
                  gridTemplateColumns:"1fr 1fr 1fr",
                  gap:8
                }}
              >
                <Field label="Lap record time">
                  <Input 
                    value={form.lap_record_time??""} 
                    onChange={value => setForm(form =>({...form, lap_record_time:value}))} 
                    placeholder="1:20.235"  
                  />
                </Field>

                <Field label="Record holder">
                  <Input 
                    value={form.lap_record_holder??""} 
                    onChange={value => setForm(form =>({...form, lap_record_holder:value}))} 
                    placeholder="Driver"
                  />
                </Field>

                <Field label="Record year">
                  <Input 
                    value={form.lap_record_year??""} 
                    onChange={value => setForm(form =>({...form, lap_record_year: value ? + value : null}))} 
                    placeholder="2024" 
                    type="number"
                  />
                </Field>

                <Field label="Laps">
                  <Input 
                    value={form.laps??""} 
                    onChange={value => setForm(form =>({...form, laps: + value}))} 
                    type="number"  
                  />
                </Field>

                <Field label="Sprint weekend">
                  <select 
                    value={form.sprint?"true":"false"} 
                    onChange={event => setForm(form =>({...form, sprint: event.target.value === "true"}))}
                    style={{
                      background:"#0D0F14",
                      border:"1px solid #2A2D35",
                      color:"#DDE",
                      borderRadius:6,
                      padding:"5px 8px",
                      fontSize:12,
                      width:"100%"
                    }}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </Field>

                <div style={{
                  display:"flex",
                  gap:6,
                  alignItems:"flex-end"
                }}>
                  <button 
                    onClick={() => save(race.id)} 
                    disabled={saving} 
                    style={{...btnStyle("#E10600")}}
                  >
                    {saving?"…":"Save"}
                  </button>
                  <button 
                    onClick={() => setEditing(null)} 
                    style={{...btnStyle("#333")}}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )
          }
        </div>
      ))}
    </div>
  )
}


// *Micro UI Primitives
function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input 
      type={type} 
      value={value ?? ""} 
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={{
        background:"#0D0F14",
        border:"1px solid #2A2D35",
        color:"#DDE",
        borderRadius:6,
        padding:"5px 8px",
        fontSize:12,
        width:"100%",
        boxSizing:"border-box"
      }}   
    />
  )
}

function Label({ children }) {
  return (
    <div style={{
      color:"#666",
      fontSize:11,
      textTransform:"uppercase",
      letterSpacing:1,
      marginBottom:6
    }}>
      {children}
    </div>
  )
}

function ColHead({ children }) {
  return (
    <div style={{
      color:"#444",
      fontSize:10,
      textTransform:"uppercase",
      letterSpacing:.5
    }}>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function Spinner() {
  return (
    <div style={{
      color:"#555",
      fontSize:12,
      padding:20,
      textAlign:"center"
    }}>
      Loading…
    </div>
  )
}

function btnStyle(backgroundColor) {
  return (
    { 
      background: backgroundColor, 
      border: "none", 
      color: "#DDE", 
      borderRadius: 6, 
      padding: "5px 12px", 
      cursor: "pointer", 
      fontSize: 12 
    }
  )
}
