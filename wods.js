const wods = {

  // --------------------------------- DOMINGO ------------------------------------
  domingo: [
    {
      titulo: "WARM-UP",
      contenido: `*9:00 AMRAP*
*1:00 Machine*
5 Roll and Reach
10-second Single Leg Glute Bridge Hold *(each)*
10 Russian KBS *(light)*
20 Single Unders`
    },
    {
      titulo: "Custom Metcon (Tiempo)",
      contenido: `*“FRENCH ONION SOUP”*
*8 rounds*
15 Kettlebell Swings *(24/16)*
45 Unbroken Single Unders`
    },
    {
      titulo: "Accesorio",
      contenido: `*CORE*
*3 sets*
15 Strict Abmat Sit Ups *(hands by head or across chest)*
15 Pulse Ups
10 V-Ups
30 sec Copenhagen Plank *(each side)*
*-rest 2:00 between sets-*`
    }
  ],

  // ------------------------------------ LUNES ------------------------------------
  lunes: [
    {
      titulo: "WARM-UP",
      contenido: `*2 Rounds*
30-second Jump Rope
20 Single Unders
3 Clean Deadlifts
3 Hang Muscle Cleans *(PVC/empty bar)*
3 Front Squats *(PVC/empty bar)*
3 Push Press *(PVC/empty bar)*
3 Up Downs`
    },
    {
      titulo: "Weightlifting (Clean and Jerk)",
      contenido: `*Every 1:00 (8:00)*
1 Power Clean + Push Jerk
*@ RPE 5-6*`
    },
    {
      titulo: "Custom Metcon (Tiempo)",
      contenido: `*“CHICKEN NOODLE SOUP”*
21-18-15-12-9-6
Dumbbell Push Press *(22.5/15)*
63-54-45-36-27-18
Double Unders`
    }
  ],

  // ----------------------------------- MARTES ------------------------------------
  martes: [
    {
      titulo: "WARM-UP",
      contenido: `*9:00 AMRAP*
30-second Cardio
10 Cossack Squats
4 Up Downs
10 Alt. Step Back Lunges
3 Empty-Bar Back Squats`
    },
    {
      titulo: "Weightlifting (Back Squat)",
      contenido: `*Every 2:00 x 3 sets*
5 Back Squats
*@60%*`
    },
    {
      titulo: "Custom Metcon",
      contenido: `*MINESTRONE*
10x50ft Shuttle Run
25 Burpees
10x50ft Shuttle Run
*-at 8:00-*
10x50ft Shuttle Run
20 Burpee to Bar *(6in)*
10x50ft Shuttle Run
*-at 16:00-*
10x50ft Shuttle Run
15 Burpee Box Jump Over *(24/20)*
10x50ft Shuttle Run`
    }
  ],

  // --------------------------------- MIÉRCOLES ----------------------------------
  miercoles: [
    {
      titulo: "WARM-UP",
      contenido: `*2 Rounds*
1:00 Cardio
10 Glute Bridges
10 Deadbugs
10 Box Step Ups
5 Ring Rows
5 Empty Bar Deadlifts`
    },
    {
      titulo: "Weightlifting (Deadlift)",
      contenido: `*Every 2:00 x 3 sets*
5 Deadlifts
*@60%*`
    },
    {
      titulo: "Custom Metcon (Tiempo)",
      contenido: `*“CLAM CHOWDER”*
*3 Rounds*
30 Wall Balls *(20/14)*
20 Pull Ups
10 Power Snatch *(60/42.5)*`
    }
  ],

  // ----------------------------------- JUEVES -----------------------------------
  jueves: [
    {
      titulo: "WARM-UP",
      contenido: `*2:00 Easy Cardio*
-into-
*3 Rounds*
10 Scap Pulls *(rings or bar)*
4 Lunge Matrix *(each)*
10-second Dead Hang
10 Alternating V-Ups`
    },
    {
      titulo: "Gymnastics (Strict Pull-up)",
      contenido: `*Level 1:*
False Grip Ring Pull Ups: 3 sets max reps (perfect form). Rest 1:00.
+ *12min EMOM:*
Min 1: 8 Single Arm DB Row/per arm
Min 2: Max Chin Over Ring Hold *(30 sec cap)*
Min 3: 6-8 Hanging Scap Circles *(each direction)*
Min 4: Rest minute

*Level 2:*
EMOM5: 2 “small” ring swings + 1 “max-effort” ring swing + 1 Hip Drive + Pull to shoulder
+ *12min EMOM:*
Min 1: 2 Complexes *(2 Ground Assisted Jumps + 2 Ring Turnovers)*
Min 2: Rest minute
Min 3: 2-3 Low Ring Horizontal Assisted Ring Muscle Ups
Min 4: Rest minute`
    },
    {
      titulo: "Custom Metcon",
      contenido: `*“GAZPACHO”*
*4 sets*
1:00 Max Calorie Row
1:00 Max Sit Ups
1:00 Max Step Back Lunges
1:00 Rest`
    }
  ],

  // ----------------------------------- VIERNES ----------------------------------
  viernes: [
    {
      titulo: "WARM-UP",
      contenido: `*10:00 AMRAP*
1:00 Easy Cardio
10 PVC/Banded Pass Throughs
5 Push Press *(empty bar)*
5 Hang Muscle Cleans
5 Pike Push Ups
10 Box Step Ups`
    },
    {
      titulo: "Weightlifting (Shoulder Press)",
      contenido: `*Every 2:00 x 3 sets*
5 Shoulder Press
*@55%*`
    },
    {
      titulo: "Custom Metcon",
      contenido: `*BEEF CHILI*
*10:00 AMRAP*
2-4-6-8-10...
Dumbbell Hang Power Cleans *(22.5/15)*
Handstand Push Ups
Box Jumps *(30/24)*`
    }
  ],

  // ---------------------------------- SÁBADO ------------------------------------
  sabado: [
    {
      titulo: "WARM-UP",
      contenido: `*9:00 AMRAP*
100m Run
30-second Cardio
3 Up Downs
5 Roll and Reach
10 Cossack Squats`
    },
    {
      titulo: "Custom Metcon",
      contenido: `*“MULLIGATAWNY”*
*Teams of 2*
*20:00 AMRAP*
200m Run *(together)* *(or 10x50ft Shuttle Run together)*
Partner 1: 15 Burpee to Bar *(6in)*
Partner 2: 30 Air Squats
*-Switch. Both partners complete Burpees and Air Squats each round-*`
    },
    {
      titulo: "Accesorio",
      contenido: `*Mini Pump - Shoulders and Arms*
*4 sets*
6 Barbell Shoulder Press *@ RPE 8/10*
8 Double DB Z-Press *@ RPE 8/10*
12 Banded Push Ups *@ RPE 8/10*
10 Standing Barbell Curl *@ RPE 8/10*
*-rest 2:00-2:30 b/t sets-*`
    }
  ]
};
