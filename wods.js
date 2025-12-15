const wods = {

// --------------------------------- DOMINGO ------------------------------------
  domingo: [
    {
      titulo: "WARM-UP",
      contenido: `5:00 Practice Jump Rope
-into
6:00 AMRAP 
4 Lunge Matrix 
10 Sit Ups
4 InchWorms
4 Up Downs`
    },
    {
      titulo: "METCON (Reps)",
      contenido: `
5 sets 
1:00 Max Burpees (or Sand Ball Slams (15/10)) 
1:00 Max Double Unders 
1:00 Max Stick Sit Ups 
1:00 Rest  
Scoring: Reps `
    }
  ],

// ------------------------------------ LUNES -----------------------------------------------------
   lunes: [
    {
      titulo: "WARM-UP",
      contenido: `8:00 AMRAP
30-second Cardio
10 Empty Bar Strict Press
10 Handstand Shoulder Taps or 8 Box Pike Shoulder Taps
5 Controlled Push Us
10 Band Pull Aparts`
    },
    {
      titulo: "WEIGHTLIFTING (Bench Press)",
      contenido: `BENCH PRESS
4 sets
8 Bench Press
-build across sets by feel-
-rest 1:00-2:00 between sets-`
    },
    {
      titulo: "METCON (Tiempo)",
      contenido: `3 sets
10 Handstand Push Ups
400m Run
15 Wall Walks
-rest 3:00 between sets-
(Scored by time each set)`
    }
  ],


// ----------------------------------- MARTES ------------------------------------------------
  martes: [
    {
      titulo: "WARM-UP",
      contenido: `8:00 AMRAP 
30-second Row (moderate) 
10 Beat Swings 
6 Hanging Knee Raises 
6 Low Box Step-Overs 
8 Samson Lunges`
    },
    {
      titulo: "METCON- Teams of 3",
      contenido: `9 rounds, 3 round each
6/5 Calorie Row 
5 Toes to Bar 
4 Box Jump Overs (30/24) 
then:
For Time a completar: 
100/80 Calorie Row 
60 Toes to Bar 
50 Box Jump Overs (30/24)`
    },
    {
      titulo: "Gymnastics (Toes-to-Bar)",
      contenido: `AMRAP + 1 minute rest + 3 minute AMRAP - start where you left off
•Level 1: 8 Hanging Knee Raises 100-foot farmers carry [35/25] 8 Plank Shoulder Taps [right/left = 2 reps] (KG: 15/10)
•Level 2: 8 Alternating Leg Toes to Bar 100-foot farmers carry [50/35] 1 wall walk INTO 6 Wall Facing Handstand Shoulder Taps [right/left = 2 reps] (KG: 22.5/15)
•Level 3: 10 Alternating Leg Toes to Bar 100-foot farmers carry [70/50] 1 wall walk INTO 10 Wall Facing Handstand Shoulder Taps [right/left = 2 reps (KG: 32.5/22.5)`
    }
  ],

// --------------------------------- MIÉRCOLES --------------------------------------  
  miercoles: [
    {
      titulo: "WARM-UP",
      contenido: `8:00 AMRAP 
30 Single Unders 
10 PVC Good Mornings 
6 Front Squats (empty bar) 
4 Power Cleans + 2 Squat Cleans (empty bar) 
Optional: 1–2 barbell build-up sets`
    },
    {
      titulo: "METCON",
      contenido: `2-2-2-3 min AMRAP 
TC: 20:00
75 Double Unders 
Max Squat Cleans in the time remaining ( 60/42.5) 
-rest 1:00 between AMRAPs- 
* Go until you get 40 squat cleans or hit the cap 
(Score is total time, including rest)`
    },
    {
      titulo: "ACCESORIO",
      contenido: `MINI PUMP - ARMS
5 SETS 
12 Dumbbell Alternating Skull Crushers (each side) @ RPE 7/10 
-rest 30 secs
12 Dumbbell Alternating Curls (each side) @ RPE 7/10 
-rest 1 minute between sets- 
* Instead of resting :30, athletes can partner up and go 1:1 on movements and advance together to the next station when their partner finishes.`
    }
  ],
// ----------------------------------- JUEVES -----------------------------------------
  jueves: [
    {
      titulo: "WARM-UP",
      contenido: `10:00 AMRAP 
1:00 Machine 
5 Deadlifts (empty bar) 
5 Hang Squat Cleans (empty Bar) 
5 Strict Pull Ups or 10 Ring rows 
5 V-ups (each side) 
5 Birddogs (each side)`
    },
    {
      titulo: "METCON",
      contenido: `”12 Days of Christmas”
1 Squat Clean (70/47.5) 
2 Strict Pull Ups
3 Burpees
4 Muscle Ups (Bar or Ring)  
5 Deadlifts (70/47.5) 
6 Pull Ups 
7 V-Ups 
8 Wall Balls (30/20) 
9 Box Jumps (24/20) 
10 Back Rack Lunges (70/47.5) 
11 Handstand Push Ups 
12 Thrusters (70/47.5)`
    },
    {
      titulo: "ACCESORIO",
      contenido: `4 ROUNDS 
10 Banded Pushups @ moderate weight RPE 7 
-rest 30 seconds
10 Ring Row – Feet Elevated @ moderate weight RPE 7 
-rest 30 seconds
10 Standing Tricep DB French Press @ moderate weight RPE 7 
* Rest 2 minutes between rounds`
    }
  ],

// ----------------------------------- VIERNES -------------------------------------

  viernes: [
    {
      titulo: "WARM-UP",
      contenido: `8:00 AMRAP 
30-second Cardio
3 Muscle Snatch (PVC-empty bar) 
3 Overhead Squats (PVC-empty bar) 
3 Hang Power Snatch (PVC-empty bar) 
3 Squat Snatch (PVC-empty bar) 
4 Burpees 
-into
3 sets 
2 Squat Snatch (singles, build up to starting weight)`
    },
    {
      titulo: "WEIGHTLIFTING (Snatch)",
      contenido: `5 sets 
1 Squat Snatch (@70-75%)
 -rest 1:00-2:00 between sets-`
    },
    {
      titulo: "METCON",
      contenido: ` 21-15-9 
Power Snatch (52/38) 
Burpee Over Bar 
(Scored by Time)`
    }
  ],

// ---------------------------------- SÁBADO ---------------------------------------------
  
  sabado: [
    {
      titulo: "WARM-UP",
      contenido: `8:00 AMRAP 
100m Easy Run 
10 Supermans 
10 Alternating V-ups 
6 Walking Lunges (each leg) 
10 Beat Swings
Optional: 1–2 practice rounds of 50ft lunges + 5 V-Ups`
    },
    {
      titulo: "METCON",
      contenido: `7 Rounds 
200m Run 
15  V-Ups 
50ft Walking Lunge 
(Scored by Time)`
    }
  ]

};





