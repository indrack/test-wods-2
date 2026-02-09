const wods = {

  // --------------------------------- DOMINGO ------------------------------------
  domingo: [
    {
      titulo: "WARM-UP",
      contenido: `*2 Rounds*
*1:00 Cardio*
10 Walking Lunge Steps
10 Banded Clam Shells
6 Alternating Dumbbell Hang Clean and Jerk *(light)*`
    },
    {
      titulo: "Custom Metcon",
      contenido: `*BANANA SPLIT*
50 Wall Balls *(20/14)*
50 Alternating Hang Dumbbell Clean and Jerk *(22.5/15)*
50 Wall Balls *(20/14)*`
    },
    {
      titulo: "FINISHER",
      contenido: `*BREATH CONTROL*
*EMOM 8*
1: Wall Sit *(Max time)*
2: Burpee Step-back
3: High Knees
4: Active Rest`
    }
  ],

  // ------------------------------------ LUNES ------------------------------------
  lunes: [
    {
      titulo: "WARM-UP",
      contenido: `*2 Rounds*
100m Run
8 Cossack Squats
3 Clean Deadlifts
3 Hang Muscle Cleans *(PVC / e bar)*
3 Front Squats *(PVC / e bar)*
3 Push Press *(PVC / e bar)*
3 Up Downs *(PVC / e bar)*`
    },
    {
      titulo: "Weightlifting (Clean and Jerk)",
      contenido: `*Every 1:00 (10:00)*
1 Squat Clean + Push Jerk
*@ RPE 6*`
    },
    {
      titulo: "Custom Metcon (Reps)",
      contenido: `*SPRINKLES ON MY CUPCAKE*
*7:00 AMRAP*
500m Run
Max Clean & Jerks *(60/42.5)*`
    }
  ],

  // ----------------------------------- MARTES ------------------------------------
  martes: [
    {
      titulo: "WARM-UP",
      contenido: `*7:00 AMRAP*
10 Abmat Sit Ups
5 Scap Pull Ups
3 Jumping Pull Ups
5/5 Single Arm Ring Rows
3 Up Downs to Bar`
    },
    {
      titulo: "Gymnastics (Bar Muscle-up)",
      contenido: `*OPEN PREP: CHEST TO BAR / BAR MUSCLE UPS*
*Level 1: EMOM x10*
Odd: 6-8 Scap Pull-ups
Even: 6-8 Kip Swings
*Level 2: EMOM x10*
Odd: 4-6 Single Leg Box Butterfly drill
Even: 8-10 Butterfly Pull Ups *(or 4-6 Chest to Bar Pull Ups)*`
    },
    {
      titulo: "Gymnastics (Bar Muscle-up)",
      contenido: `*OPEN PREP: CHEST TO BAR / BAR MUSCLE UPS*

*Level 3: EMOM x10*
Odd: 30 Sec Row *@ 5k pace*
Even: 30-40% max unbroken Bar Muscle Ups *(cap 5)*`
    },
    {
      titulo: "Custom Metcon (Tiempo)",
      contenido: `*PB&J*
*2 Sets*
*3 Rounds*
15 V-Ups
12 Chest to Bar
9 Burpee to Bar
*-rest 3:00 between sets-*`
    }
  ],

  // --------------------------------- MIÉRCOLES ----------------------------------
  miercoles: [
    {
      titulo: "WARM-UP",
      contenido: `*8:00 AMRAP*
30-second Row
4 Lunge Matrix
5 Tempo Dumbbell Front Squats *(light)*
10 Deadbugs
5 Wall Balls
5 Box Step Ups`
    },
    {
      titulo: "Weightlifting (Back Squat)",
      contenido: `*Every 2:00 × 4 sets*
3 Back Squats
*@65%*`
    },
    {
      titulo: "Custom Metcon (Tiempo)",
      contenido: `*BALL OUT*
*Teams of 3*
*27-21-15-9*
Partner 1: Wall Balls *(20/14)*
Partner 2: Calorie Row
Partner 3: Box Jump Overs *(24/20)*
*(Switch when complete)*`
    }
  ],

  // ----------------------------------- JUEVES -----------------------------------
  jueves: [
    {
      titulo: "WARM-UP",
      contenido: `*Banded 7s*
-into-
*6:00 AMRAP*
100m Easy Run
5 Half Kneeling Single Arm DB Shoulder Press *(each)*
5 Hand Release Push Ups
5 Single Arm DB Bench Press *(each)*`
    },
    {
      titulo: "Weightlifting (Shoulder Press)",
      contenido: `*Every 2:00 × 4 sets*
3 Shoulder Press
*@60%*`
    },
    {
      titulo: "Custom Metcon",
      contenido: `*RED ROSES*
*Every 1:00 (14:00)*
Odd: 200m Run (or 8x50ft Shuttle Run)
Even: 10 Bench Press (70/42.5)`
    }
  ],

  // ----------------------------------- VIERNES ----------------------------------
  viernes: [
    {
      titulo: "WARM-UP",
      contenido: `*6:00 AMRAP*
10 Glute Bridges
3 Inchworms
4 Deadlifts *(empty bar)*
20 Single Unders
4 PVC Muscle Snatch
4 PVC Overhead Squats`
    },
    {
      titulo: "Weightlifting (Deadlift)",
      contenido: `*Every 2:00 × 4 sets*
3 Deadlifts
*@65%*`
    },
    {
      titulo: "Custom Metcon",
      contenido: `*OPEN 23.3*
*Starting with 6-min time cap*

5 Wall Walks
50 Double Unders
15 Snatches *(W1)*
5 Wall Walks
50 Double Unders
12 Snatches *(W2)*

*If completed before 6:00 → +3 min*
20 Strict HSPU
50 Double Unders
9 Snatches *(W3)*

*If completed before 9:00 → +3 min*
20 Strict HSPU
50 Double Unders
6 Snatches *(W4)*

*Weights*
♀ 30 / 43 / 57 / 70
♂ 43 / 61 / 84 / 102`
    }
  ],

  // ---------------------------------- SÁBADO ------------------------------------
  sabado: [
    {
      titulo: "WARM-UP",
      contenido: `*7:00 AMRAP*
100m Run
30-second Row
10 Air Squats
5 Push-Ups
1 Zombie Rope Climb *(or 5 Ring Rows)*
20s Plank *(elbows)*`
    },
    {
      titulo: "Custom Metcon (Tiempo)",
      contenido: `*THE CHERRY ON MY SUNDAE*
*Teams of 2*
400m Run *(together)*
15 Rope Climbs *(or 30 Strict Pullups split)*
400m Run *(together)*
100 Push Ups *(split)*
400m Run *(together)*
150 Synchro Air Squats
400m Run *(together)*`
    },
    {
      titulo: "Accesorio",
      contenido: `*CORE WORK*
*3 Sets*
15 Strict Hanging Leg Raises
*-rest 30s*
30yd Single DB Overhead Carry *(Left – heavy)*
30yd Single DB Overhead Carry *(Right – heavy)*
*-rest 30s*
10 V-Ups + Alt V-Ups *(R+L+Both=1)*
*-rest 30s*
30yd Single DB Overhead Carry *(Left – heavy)*
30yd Single DB Overhead Carry *(Right – heavy)*
*-Rest 2:00 between sets-*`
    }
  ]
};
