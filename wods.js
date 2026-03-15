const wods = {

  // --------------------------------- DOMINGO ------------------------------------
  domingo: [
    {
      titulo: "WARM-UP",
      contenido: `*3 Rounds*
20-second Hollow Hold
8 Abmat Sit Ups
5 Hanging Knee Raises
10-second Superman Hold`
    },
    {
      titulo: "Custom Metcon",
      contenido: `*“OLIVE GREEN”*
*Every 1:00 (10:00)*
Minute 1: *15 V-Ups*
Minute 2: *10 Toes to Ring (or 8 Toes to Bar)*`
    },
    {
      titulo: "Accesorio",
      contenido: `*Mini Pump - Upper Push*
*4 sets*
8 Barbell Bench Press *@ RPE 8/10*
8 Reverse Grip Incline Dumbbell Bench Press *@ RPE 8/10*
10 Ring or Bar Dips *(or to RPE 7-7.5/10)*
12 Alternating DB Skull Crushers *(each side)* @ RPE 8/10
*-Rest 2:00-2:30 between sets-*`
    }
  ],

  // ------------------------------------ LUNES ------------------------------------
  lunes: [
    {
      titulo: "WARM-UP",
      contenido: `*7:00 AMRAP*
30-second Cardio
10 Cossack Squats
5 Tempo Air Squats *(3 seconds down)*
10 Deadbugs
6 Pike Push Ups`
    },
    {
      titulo: "Weightlifting (Back Squat)",
      contenido: `*Every 3:00 × 3 sets*
2 Back Squats *@78-82%*`
    },
    {
      titulo: "Custom Metcon (Tiempo)",
      contenido: `*“EMERALD”*
*2 sets*
9-6-3 Squat Cleans *(60/42.5)*
15-12-9 Handstand Push Ups
*-rest 3:00 between sets-*`
    }
  ],

  // ----------------------------------- MARTES ------------------------------------
  martes: [
    {
      titulo: "WARM-UP",
      contenido: `*Every 1:00 (9:00)*
Min 1: 30-second Cardio + 5 Russian Kettlebell Swings
Min 2: 3 Jump to Pike + Arch
Min 3: 5 Scap Circles *(forward)* + 5 Kip Swings`
    },
    {
      titulo: "Gymnastics (Muscle-up)",
      contenido: `*RING MUSCLE-UPS*

*Level 1: Every 1:00 (9:00)*
Min 1: 8 Feet Assisted Strict Pull-ups
Min 2: 6-8 Matador Dips or Bench Dips
Min 3: Rest Minute

*Level 2: Every 1:00 (9:00)*
Min 1: 2-3 Jump to Hollow + Tight Arch + Feet Rise + Hip Extension *(Straight Arms)*
Min 2: 3-6 Banded Low Bar Muscle Ups OR 1-2 Spotted Bar Muscle Ups
Min 3: Rest Minute

*Level 3:*
8 Bar Muscle Ups
16/12 Cal Row
6 Bar Muscle Ups
12/8 Cal Row
4 Bar Muscle Ups
8/6 Cal Row
2 Bar Muscle Ups
*(Scored by Time, 9:00 Time Cap)*`
    },
    {
      titulo: "Custom Metcon (Tiempo)",
      contenido: `*“FOREST GREEN”*
21-15-9 Burpees & KB Swing *(24/16)*
*-rest till 7:00-*
21-15-9 Burpees & Toes to Bar
*-rest till 14:00-*
21-15-9 Toes to Bar & KB Swing *(24/16)*`
    }
  ],

  // --------------------------------- MIÉRCOLES ----------------------------------
  miercoles: [
    {
      titulo: "WARM-UP",
      contenido: `*7:00 AMRAP*
30-second Easy Row
30-second Jump Rope
20 Mountain Climbers
8 Banded Pass Throughs
8 Half Kneeling Single Arm DB Press *(each/light)*
8 Step Back Lunges`
    },
    {
      titulo: "Weightlifting (Shoulder Press)",
      contenido: `*Every 3:00 × 3 sets*
2 Shoulder Press *@78-82%*`
    },
    {
      titulo: "Custom Metcon",
      contenido: `*“PISTACHIO”*
*Teams of 2*
*Every 1:00 (16:00)*
Minute 1: 15/12 Calorie Row
Minute 2: 100m Run or 5x50ft Shuttle Run
*Athletes start on opposite stations & switch every min*`
    }
  ],

  // ----------------------------------- JUEVES -----------------------------------
  jueves: [
    {
      titulo: "WARM-UP",
      contenido: `*7:00 AMRAP*
30-second Cardio
10 Glute Bridges
8 Single Dumbbell Suitcase Deadlifts *(each)*
8 Walking Lunges
4 Up Downs`
    },
    {
      titulo: "Weightlifting (Deadlift)",
      contenido: `*Every 3:00 × 3 sets*
2 Deadlifts *@78-82%*`
    },
    {
      titulo: "Custom Metcon (Reps)",
      contenido: `*“TURQUOISE”*
*3 sets*
*3:00 AMRAP*
100ft Single DB Walking Lunge *(22.5/15)*
Max Burpee Over Dumbbell
*-rest 2:00 between sets-*`
    }
  ],

  // ----------------------------------- VIERNES ----------------------------------
  viernes: [
    {
      titulo: "WARM-UP",
      contenido: `*7:00 AMRAP*
30-second Cardio
25ft Lizard Crawl
10 PVC Pass Throughs
5 PVC Muscle Snatches
5 PVC Overhead Squats
5 Scap Pull Ups`
    },
    {
      titulo: "Weightlifting (Snatch)",
      contenido: `*Every 2:00 (10:00)*
2 Touch-and-Go Power Snatch + 1 Snatch Balance *@ RPE 7*`
    },
    {
      titulo: "Custom Metcon (Tiempo)",
      contenido: `*“LIME GREEN”*
*6 Rounds*
3 Wall Walks
9 Overhead Squats *(42.5/30)*
12 Pull Ups`
    }
  ],

  // ---------------------------------- SÁBADO ------------------------------------
  sabado: [
    {
      titulo: "WARM-UP",
      contenido: `*8:00 AMRAP*
100m Easy Jog
5 Light Dumbbell Deadlifts
5 Up Downs
5 Box Step Overs
10-second Plank Hold`
    },
    {
      titulo: "Custom Metcon (Rondas y Reps)",
      contenido: `*“SPEARMINT”*
*Teams of 3*
*25:00 AMRAP*

Partner 1: 400m Run *(or 16x50ft Shuttle Run)*

Partner 2: AMRAP
50ft Dumbbell Farmer Carry *(32.5/22.5 DBs)*
5 Burpee Box Getovers *(48/42)* *(or 8 @ 30/24)*

Partner 3: Rest

*Rotate when partner finishes the run. Partner picks up where AMRAP was left off.*`
    },
    {
      titulo: "Accesorio",
      contenido: `*MINI PUMP - CORE*
*3 sets*
20 Stick Sit Ups
*-rest 30 seconds-*
10 KB Side Bends *(each side)*
*-rest 30 seconds-*
10 Side Star Plank Reach Throughs
*-Rest 2:00 between sets-*`
    }
  ]
};
