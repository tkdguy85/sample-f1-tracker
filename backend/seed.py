# DB seed for 2026 F1 Season
# Run with: python -m backend.seed or app.seed (can be re-run)

from sqlmodel import Session, select
from .db import engine, create_db_and_tables
from .models import Team, Driver, Race


#* TEAMS & DRIVERS *#
TEAMS = [
  {
    "id": "mclaren",     
    "name": "McLaren",       
    "color": "#FF8000"
  },
  {
    "id": "mercedes",    
    "name": "Mercedes",      
    "color": "#00D2BE"
  },
  {
    "id": "ferrari",     
    "name": "Ferrari",       
    "color": "#DC0000"
  },
  {
    "id": "redbull",     
    "name": "Red Bull",      
    "color": "#3671C6"
  },
  {
    "id": "williams",    
    "name": "Williams",      
    "color": "#005AFF"
  },
  {
    "id": "racingbulls", 
    "name": "Racing Bulls",  
    "color": "#6692FF"
  },
  {
    "id": "astonmartin", 
    "name": "Aston Martin",  
    "color": "#358C75"
  },
  {
    "id": "haas",        
    "name": "Haas",          
    "color": "#B6BABD"
  },
  {
    "id": "audi",        
    "name": "Audi",          
    "color": "#F50537"
  },
  {
    "id": "alpine",      
    "name": "Alpine",        
    "color": "#0093CC"

  },
  {
    "id": "cadillac",    
    "name": "Cadillac",      
    "color": "#CCCCCC"
  },
]

DRIVERS = [
  {
    "id": "norris",     
    "name": "Lando Norris",      
    "number": 1,  
    "team_id": "mclaren",     
    "flag": "🇬🇧"
  },
  {
    "id": "piastri",    
    "name": "Oscar Piastri",      
    "number": 81, 
    "team_id": "mclaren",     
    "flag": "🇦🇺"
  },
  {
    "id": "russell",    
    "name": "George Russell",     
    "number": 63, 
    "team_id": "mercedes",    
    "flag": "🇬🇧"
  },
  {
    "id": "antonelli",  
    "name": "Kimi Antonelli",     
    "number": 12, 
    "team_id": "mercedes",    
    "flag": "🇮🇹"
  },
  {
    "id": "leclerc",    
    "name": "Charles Leclerc",    
    "number": 16, 
    "team_id": "ferrari",     
    "flag": "🇲🇨"
  },
  {
    "id": "hamilton",   
    "name": "Lewis Hamilton",     
    "number": 44, 
    "team_id": "ferrari",     
    "flag": "🇬🇧"
  },
  {
    "id": "verstappen", 
    "name": "Max Verstappen",     
    "number": 3,  
    "team_id": "redbull",     
    "flag": "🇳🇱"
  },
  {
    "id": "hadjar",     
    "name": "Isack Hadjar",       
    "number": 6,  
    "team_id": "redbull",     
    "flag": "🇫🇷"
  },
  {
    "id": "albon",      
    "name": "Alexander Albon",    
    "number": 23, 
    "team_id": "williams",    
    "flag": "🇹🇭"
  },
  {
    "id": "sainz",      
    "name": "Carlos Sainz",       
    "number": 55, 
    "team_id": "williams",    
    "flag": "🇪🇸"
  },
  {
    "id": "lindblad",   
    "name": "Arvid Lindblad",     
    "number": 41, 
    "team_id": "racingbulls", 
    "flag": "🇬🇧"
  },
  {
    "id": "lawson",     
    "name": "Liam Lawson",        
    "number": 30, 
    "team_id": "racingbulls", 
    "flag": "🇳🇿"
  },
  {
    "id": "alonso",     
    "name": "Fernando Alonso",    
    "number": 14, 
    "team_id": "astonmartin", 
    "flag": "🇪🇸"
  },
  {
    "id": "stroll",     
    "name": "Lance Stroll",       
    "number": 18, 
    "team_id": "astonmartin", 
    "flag": "🇨🇦"
  },
  {
    "id": "ocon",       
    "name": "Esteban Ocon",       
    "number": 31, 
    "team_id": "haas",        
    "flag": "🇫🇷"
  },
  {
    "id": "bearman",    
    "name": "Oliver Bearman",     
    "number": 87, 
    "team_id": "haas",        
    "flag": "🇬🇧"
  },
  {
    "id": "hulkenberg", 
    "name": "Nico Hülkenberg",    
    "number": 27, 
    "team_id": "audi",        
    "flag": "🇩🇪"
  },
  {
    "id": "bortoleto",  
    "name": "Gabriel Bortoleto",  
    "number": 5,  
    "team_id": "audi",        
    "flag": "🇧🇷"
  },
  {
    "id": "gasly",      
    "name": "Pierre Gasly",       
    "number": 10, 
    "team_id": "alpine",      
    "flag": "🇫🇷"
  },
  {
    "id": "colapinto",  
    "name": "Franco Colapinto",   
    "number": 43, 
    "team_id": "alpine",      
    "flag": "🇦🇷"
  },
  {
    "id": "perez",      
    "name": "Sergio Pérez",       
    "number": 11, 
    "team_id": "cadillac",    
    "flag": "🇲🇽"
  },
  {
    "id": "bottas",     
    "name": "Valtteri Bottas",    
    "number": 77, 
    "team_id": "cadillac",    
    "flag": "🇫🇮"
  },
]
#* TEAMS & DRIVERS *#

#* RACE/TRACK INFO *#
RACES = [
  {
    "id": "r01",
    "round": 1, 
    "name": "Australian GP",    
    "circuit": "Albert Park Circuit",              
    "country": "Australia",    
    "flag": "🇦🇺",
    "date": "Mar 14–16, 2026",
    "city": "Melbourne",   
    "sprint": False,
    "laps": 58,
    "length": 5.278,
    "lap_record_time": "1:20.235",
    "lap_record_holder": "Leclerc",     
    "lap_record_year": 2022
  },
  {
    "id": "r02",
    "round": 2, 
    "name": "Chinese GP",        
    "circuit": "Shanghai International Circuit",   
    "country": "China",        
    "flag": "🇨🇳",
    "date": "Mar 20–22, 2026",
    "city": "Shanghai",    
    "sprint": True, 
    "laps": 56,
    "length": 5.451,
    "lap_record_time": "1:32.238",
    "lap_record_holder": "Hamilton",     
    "lap_record_year": 2004
  },
  {
    "id": "r03",
    "round": 3, 
    "name": "Japanese GP",       
    "circuit": "Suzuka Circuit",                   
    "country": "Japan",        
    "flag": "🇯🇵",
    "date": "Apr 3–5, 2026",  
    "city": "Suzuka",     
    "sprint": False,
    "laps": 53,
    "length": 5.807,
    "lap_record_time": "1:30.983",
    "lap_record_holder": "Hamilton",     
    "lap_record_year": 2019
  },
  {
    "id": "r04",
    "round": 4, 
    "name": "Bahrain GP",        
    "circuit": "Bahrain International Circuit",    
    "country": "Bahrain",      
    "flag": "🇧🇭",
    "date": "Apr 17–19, 2026",
    "city": "Sakhir",     
    "sprint": False,
    "laps": 57,
    "length": 5.412,
    "lap_record_time": "1:31.447",
    "lap_record_holder": "De la Rosa",  
    "lap_record_year": 2005
  },
  {
    "id": "r05",
    "round": 5, 
    "name": "Saudi Arabian GP",  
    "circuit": "Jeddah Corniche Circuit",          
    "country": "Saudi Arabia", 
    "flag": "🇸🇦",
    "date": "Apr 24–26, 2026",
    "city": "Jeddah",     
    "sprint": False,
    "laps": 50,
    "length": 6.174,
    "lap_record_time": "1:30.734",
    "lap_record_holder": "Leclerc",     
    "lap_record_year": 2022
  },
  {
    "id": "r06",
    "round": 6, 
    "name": "Miami GP",          
    "circuit": "Miami International Autodrome",    
    "country": "USA",          
    "flag": "🇺🇸",
    "date": "May 1–3, 2026",  
    "city": "Miami",      
    "sprint": True, 
    "laps": 57,
    "length": 5.412,
    "lap_record_time": "1:29.708",
    "lap_record_holder": "Verstappen",  
    "lap_record_year": 2023
  },
  {
    "id": "r07",
    "round": 7, 
    "name": "Canadian GP",       
    "circuit": "Circuit Gilles Villeneuve",        
    "country": "Canada",       
    "flag": "🇨🇦",
    "date": "May 22–24, 2026",
    "city": "Montréal",   
    "sprint": True, 
    "laps": 70,
    "length": 4.361,
    "lap_record_time": "1:13.078",
    "lap_record_holder": "Bottas",      
    "lap_record_year": 2019
  },
  {
    "id": "r08",
    "round": 8, 
    "name": "Monaco GP",         
    "circuit": "Circuit de Monaco",                
    "country": "Monaco",       
    "flag": "🇲🇨",
    "date": "Jun 5–7, 2026",  
    "city": "Monte Carlo",
    "sprint": False,
    "laps": 78,
    "length": 3.337,
    "lap_record_time": "1:12.909",
    "lap_record_holder": "Leclerc",     
    "lap_record_year": 2021
  },
  {
    "id": "r09",
    "round": 9, 
    "name": "Spanish GP",        
    "circuit": "Circuit de Barcelona-Catalunya",   
    "country": "Spain",        
    "flag": "🇪🇸",
    "date": "Jun 12–14, 2026",
    "city": "Barcelona",  
    "sprint": False,
    "laps": 66,
    "length": 4.657,
    "lap_record_time": "1:18.149",
    "lap_record_holder": "Verstappen",  
    "lap_record_year": 2021
  },
  {
    "id": "r10",
    "round": 10,
    "name": "Austrian GP",       
    "circuit": "Red Bull Ring",                    
    "country": "Austria",      
    "flag": "🇦🇹",
    "date": "Jun 26–28, 2026",
    "city": "Spielberg",  
    "sprint": False,
    "laps": 71,
    "length": 4.318,
    "lap_record_time": "1:05.619",
    "lap_record_holder": "Bottas",      
    "lap_record_year": 2020
  },
  {
    "id": "r11",
    "round": 11,
    "name": "British GP",        
    "circuit": "Silverstone Circuit",              
    "country": "UK",           
    "flag": "🇬🇧",
    "date": "Jul 3–5, 2026",  
    "city": "Silverstone",
    "sprint": True, 
    "laps": 52,
    "length": 5.891,
    "lap_record_time": "1:27.097",
    "lap_record_holder": "Hamilton",     
    "lap_record_year": 2020
  },
  {
    "id": "r12",
    "round": 12,
    "name": "Belgian GP",        
    "circuit": "Circuit de Spa-Francorchamps",     
    "country": "Belgium",      
    "flag": "🇧🇪",
    "date": "Jul 17–19, 2026",
    "city": "Stavelot",   
    "sprint": False,
    "laps": 44,
    "length": 7.004,
    "lap_record_time": "1:46.286",
    "lap_record_holder": "Bottas",      
    "lap_record_year": 2018
  },
  {
    "id": "r13",
    "round": 13,
    "name": "Hungarian GP",      
    "circuit": "Hungaroring",                      
    "country": "Hungary",      
    "flag": "🇭🇺",
    "date": "Jul 24–26, 2026",
    "city": "Budapest",   
    "sprint": False,
    "laps": 70,
    "length": 4.381,
    "lap_record_time": "1:16.627",
    "lap_record_holder": "Hamilton",     
    "lap_record_year": 2020
  },
  {
    "id": "r14",
    "round": 14,
    "name": "Dutch GP",          
    "circuit": "Circuit Zandvoort",                
    "country": "Netherlands",  
    "flag": "🇳🇱",
    "date": "Aug 21–23, 2026",
    "city": "Zandvoort",  
    "sprint": True, 
    "laps": 72,
    "length": 4.259,
    "lap_record_time": "1:11.097",
    "lap_record_holder": "Verstappen",  
    "lap_record_year": 2021
  },
  {
    "id": "r15",
    "round": 15,
    "name": "Italian GP",        
    "circuit": "Autodromo Nazionale Monza",        
    "country": "Italy",        
    "flag": "🇮🇹",
    "date": "Sep 4–6, 2026",  
    "city": "Monza",      
    "sprint": False,
    "laps": 53,
    "length": 5.793,
    "lap_record_time": "1:21.046",
    "lap_record_holder": "Barrichello", 
    "lap_record_year": 2004
  },
  {
    "id": "r16",
    "round": 16,
    "name": "Madrid GP",         
    "circuit": "Madrid Street Circuit",            
    "country": "Spain",        
    "flag": "🇪🇸",
    "date": "Sep 11–13, 2026",
    "city": "Madrid",     
    "sprint": False,
    "laps": 65,
    "length": 5.476,
    "lap_record_time": "TBD",      
    "lap_record_holder": "—",           
    "lap_record_year": None
  },
  {
    "id": "r17",
    "round": 17,
    "name": "Azerbaijan GP",     
    "circuit": "Baku City Circuit",                
    "country": "Azerbaijan",   
    "flag": "🇦🇿",
    "date": "Sep 24–26, 2026",
    "city": "Baku",       
    "sprint": False,
    "laps": 51,
    "length": 6.003,
    "lap_record_time": "1:43.009",
    "lap_record_holder": "Leclerc",     
    "lap_record_year": 2019
  },
  {
    "id": "r18",
    "round": 18,
    "name": "Singapore GP",      
    "circuit": "Marina Bay Street Circuit",        
    "country": "Singapore",    
    "flag": "🇸🇬",
    "date": "Oct 9–11, 2026", 
    "city": "Singapore",  
    "sprint": True, 
    "laps": 62,
    "length": 4.940,
    "lap_record_time": "1:35.867",
    "lap_record_holder": "Leclerc",     
    "lap_record_year": 2023
  },
  {
    "id": "r19",
    "round": 19,
    "name": "United States GP",  
    "circuit": "Circuit of the Americas",          
    "country": "USA",          
    "flag": "🇺🇸",
    "date": "Oct 23–25, 2026",
    "city": "Austin",     
    "sprint": False,
    "laps": 56,
    "length": 5.513,
    "lap_record_time": "1:36.169",
    "lap_record_holder": "Hamilton",     
    "lap_record_year": 2019
  },
  {
    "id": "r20",
    "round": 20,
    "name": "Mexico City GP",    
    "circuit": "Autódromo Hermanos Rodríguez",     
    "country": "Mexico",       
    "flag": "🇲🇽",
    "date": "Oct 30–Nov 1, 2026",
    "city": "Mexico City",
    "sprint": False,
    "laps": 71,
    "length": 4.304,
    "lap_record_time": "1:17.774",
    "lap_record_holder": "Hamilton", 
    "lap_record_year": 2021
  },
  {
    "id": "r21",
    "round": 21,
    "name": "São Paulo GP",      
    "circuit": "Autódromo José Carlos Pace",       
    "country": "Brazil",       
    "flag": "🇧🇷",
    "date": "Nov 6–8, 2026",  
    "city": "São Paulo",  
    "sprint": False,
    "laps": 71,
    "length": 4.309,
    "lap_record_time": "1:10.540",
    "lap_record_holder": "Barrichello",
    "lap_record_year": 2004
  },
  {
    "id": "r22",
    "round": 22,
    "name": "Las Vegas GP",      
    "circuit": "Las Vegas Street Circuit",         
    "country": "USA",          
    "flag": "🇺🇸",
    "date": "Nov 19–21, 2026",
    "city": "Las Vegas",  
    "sprint": False,
    "laps": 50,
    "length": 6.201,
    "lap_record_time": "1:35.490",
    "lap_record_holder": "Leclerc",     
    "lap_record_year": 2023
  },
  {
    "id": "r23",
    "round": 23,
    "name": "Qatar GP",          
    "circuit": "Lusail International Circuit",     
    "country": "Qatar",        
    "flag": "🇶🇦",
    "date": "Nov 27–29, 2026",
    "city": "Lusail",     
    "sprint": False,
    "laps": 57,
    "length": 5.380,
    "lap_record_time": "1:24.319",
    "lap_record_holder": "Hamilton",     
    "lap_record_year": 2021
  },
  {
    "id": "r24",
    "round": 24,
    "name": "Abu Dhabi GP",      
    "circuit": "Yas Marina Circuit",               
    "country": "UAE",          
    "flag": "🇦🇪",
    "date": "Dec 4–6, 2026",  
    "city": "Abu Dhabi",  
    "sprint": False,
    "laps": 58,
    "length": 5.281,
    "lap_record_time": "1:26.103",
    "lap_record_holder": "Hamilton",     
    "lap_record_year": 2021
  },
]
#* RACE/TRACK INFO *#

def seed() -> None:
  create_db_and_tables()

  with Session(engine) as db:
    for t in TEAMS:
      if not db.get(Team, t["id"]):
        db.add(Team(**t))

    for d in DRIVERS:
      if not db.get(Driver, d["id"]):
        db.add(Driver(**d))

    for r in RACES:
      if not db.get(Race, r["id"]):
        db.add(Race(**r))

  db.commit()
  print("Seed population complete.")


if __name__ == "__main__":
  seed()
