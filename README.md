# CrossFit WOD TV Display

A custom-built web application designed to natively display CrossFit Workouts of the Day (WODs) on vertically mounted televisions.

## 📖 Success Story & Motivation
This project was created to solve a specific infrastructure challenge that existing commercial solutions (like CrossHero) could not address. 

We utilize standard 50-inch televisions mounted continuously in a vertical (portrait) orientation. We found that standard WOD tracking software did not properly handle the software rotation required for these displays, often resulting in cut-off content or poor readability. Furthermore, we needed a control method that didn't require a mouse and keyboard connected to the TV.

This solution was built to:
1.  **Natively handle vertical layouts** without relying on external rotation drivers.
2.  **Be controlled entirely by a standard TV remote**, allowing coaches to switch views using the number pad.

## 🚀 Features
- **Vertical-First Design**: UI optimized for 90-degree rotation.
- **Remote Control Navigation**:
    - `Keys 1-6`: Quick jump to specific workout slides.
    - `Key 7`: Switch to **Miraflores** Location Custom WOD.
    - `Key 8`: Switch to **Calacoto** Location Custom WOD.
    - `Key 9`: Switch to **WGirls** Program.
    - `Key 0`: Toggle "Full View" (Summary Mode).
- **Admin Panel**: A secure interface for staff to upload custom daily workouts to Firebase.
- **Multi-Location Sync**: Supports independent content streams for different gym branches.
- **Glassmorphism UI**: High-contrast, modern aesthetic designed for readability from a distance.

## 🛠️ Built With
*   **Frontend**: HTML5, CSS3, Vanilla JavaScript.
*   **Backend**: Firebase Realtime Database & Authentication.

---
*Created to provide a seamless training experience where other tools fell short.*
