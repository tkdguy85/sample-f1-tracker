# Claude Notes

Mock up run through via Claude. Good scaffolding, but now the knives come out. 

Data layer (only files you touch week-to-week)

data.results.js — race results, one block per weekend
data.teams.js — TEAMS + DRIVERS constants
data.races.js — full 24-race schedule with circuit details

Logic layer (pure functions, no UI)

utils.standings.js — points calculation, standings sorting, color helpers
hooks.useTooltip.js — tiny hover visibility hook

UI primitives (UI.jsx)

TeamSwatch, TeamBar, StatusBadge, SprintPip, KVRow, Tooltip

Feature components

TooltipContent.jsx — DriverTooltipContent + TeamTooltipContent panels
PositionCell.jsx — the individual grid cell with its tooltip wrapper
SeasonGrid.jsx — the full scrollable standings grid
TrackModal.jsx — circuit info overlay
AdminPanel.jsx — driver roster, track list, and schema reference
AppHeader.jsx — title, driver/team toggle, edit button
GridLegend.jsx — legend strip

Entry point

App.jsx — composes everything, owns view and showAdmin state

To scaffold it with Vite: npm create vite@latest f1-tracker -- --template react, then drop these into src/ with the folder structure restored (components/, data/, hooks/, utils/).
