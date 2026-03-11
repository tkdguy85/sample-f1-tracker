// ============================================================
//  RESULTS  —  update this file after every race weekend
//
//  Standard weekend keys:   fp1, fp2, fp3, q, race
//  Sprint weekend keys:     fp1, sq, sprint, q, race
//
//  Practice / qualifying sessions:
//    { driverId: classifiedPosition }   (1 = fastest / pole)
//
//  Sprint & Race sessions:
//    driverId: {
//      position : number | "DNS" | "DNF" | "DSQ"
//      time     : "H:MM:SS.mmm" for P1 · "+S.mmm" / "+X Laps" for others
//      laps     : number
//      points   : number
//      status?  : "DNS" | "DNF" | "DSQ"   — only when applicable
//    }
//
//  Points scales
//    Race   (top 10): 25 · 18 · 15 · 12 · 10 · 8 · 6 · 4 · 2 · 1
//    Sprint (top  8):  8 ·  7 ·  6 ·  5 ·  4 · 3 · 2 · 1
// ============================================================

export const RESULTS = {

  // ──────────────────────────────────────────────────────────
  //  R01  ·  Australian GP  ·  Albert Park  ·  Mar 14–16
  // ──────────────────────────────────────────────────────────
  r01: {
    fp1: {
      norris: 3, piastri: 5, russell: 1, antonelli: 2,
      leclerc: 7, hamilton: 8, verstappen: 4, hadjar: 6,
      albon: 12, sainz: 10, lindblad: 18, lawson: 15,
      alonso: 9, stroll: 11, ocon: 14, bearman: 16,
      hulkenberg: 13, bortoleto: 17, gasly: 20, colapinto: 22,
      perez: 19, bottas: 21,
    },
    fp2: {
      norris: 2, piastri: 4, russell: 1, antonelli: 3,
      leclerc: 6, hamilton: 9, verstappen: 5, hadjar: 7,
      albon: 11, sainz: 12, lindblad: 20, lawson: 16,
      alonso: 8, stroll: 13, ocon: 15, bearman: 17,
      hulkenberg: 14, bortoleto: 18, gasly: 19, colapinto: 21,
      perez: 22, bottas: 10,
    },
    fp3: {
      norris: 3, piastri: 5, russell: 2, antonelli: 1,
      leclerc: 7, hamilton: 8, verstappen: 4, hadjar: 6,
      albon: 14, sainz: 11, lindblad: 19, lawson: 17,
      alonso: 9, stroll: 12, ocon: 13, bearman: 16,
      hulkenberg: 15, bortoleto: 20, gasly: 18, colapinto: 22,
      perez: 21, bottas: 10,
    },
    q: {
      norris: 3, piastri: 6, russell: 1, antonelli: 2,
      leclerc: 5, hamilton: 9, verstappen: 4, hadjar: 7,
      albon: 14, sainz: 12, lindblad: 20, lawson: 18,
      alonso: 10, stroll: 11, ocon: 13, bearman: 17,
      hulkenberg: 15, bortoleto: 19, gasly: 16, colapinto: 22,
      perez: 21, bottas: 8,
    },
    race: {
      norris:     { position: 4,  time: "+12.415",     laps: 58, points: 12 },
      piastri:    { position: 5,  time: "+18.022",     laps: 58, points: 10 },
      russell:    { position: 1,  time: "1:23:06.801", laps: 58, points: 25 },
      antonelli:  { position: 2,  time: "+2.974",      laps: 58, points: 18 },
      leclerc:    { position: 3,  time: "+15.519",     laps: 58, points: 15 },
      hamilton:   { position: 8,  time: "+48.331",     laps: 58, points: 4  },
      verstappen: { position: 6,  time: "+22.188",     laps: 58, points: 8  },
      hadjar:     { position: 7,  time: "+31.002",     laps: 58, points: 6  },
      albon:      { position: 13, time: "+1:12.005",   laps: 57, points: 0  },
      sainz:      { position: 10, time: "+54.221",     laps: 58, points: 1  },
      lindblad:   { position: 15, time: "+1 Lap",      laps: 57, points: 0  },
      lawson:     { position: 14, time: "+1:20.112",   laps: 57, points: 0  },
      alonso:     { position: 11, time: "+58.004",     laps: 58, points: 0  },
      stroll:     { position: 12, time: "+1:03.441",   laps: 58, points: 0  },
      ocon:       { position: 9,  time: "+51.188",     laps: 58, points: 2  },
      bearman:    { position: 16, time: "+1 Lap",      laps: 57, points: 0  },
      hulkenberg: { position: 17, time: "+1 Lap",      laps: 57, points: 0  },
      bortoleto:  { position: 20, time: "DNF",         laps: 32, points: 0, status: "DNF" },
      gasly:      { position: 18, time: "+1 Lap",      laps: 57, points: 0  },
      colapinto:  { position: 19, time: "+1 Lap",      laps: 57, points: 0  },
      perez:      { position: 21, time: "DNF",         laps: 18, points: 0, status: "DNF" },
      bottas:     { position: 22, time: "+1 Lap",      laps: 57, points: 0  },
    },
  },

  // ──────────────────────────────────────────────────────────
  //  R02 onwards — paste new blocks here after each race week
  // ──────────────────────────────────────────────────────────

};
