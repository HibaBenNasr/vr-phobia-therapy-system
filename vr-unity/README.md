#  VR Phobia Therapy System — Unity Application

This folder contains the **Unity-based Virtual Reality (VR) application** developed as part of an academic project focused on immersive exposure therapy for phobias.

The application provides a virtual environment in which patients can experience different exposure scenarios, including public speaking and heights. These scenarios are designed with progressive exposure levels and are part of a larger system that integrates physiological data and a therapist monitoring dashboard.

##  Project Overview

The VR application is a component of the project **“Développement d'un environnement thérapeutique immersif en Réalité Virtuelle pour la gestion des phobies avec reconnaissance émotionnelle.”**

It provides an immersive experience in which patients can interact with virtual environments representing situations associated with specific phobias.

The application includes three main experiences:

- **VR Waiting Room:** The virtual starting environment for the patient.
- **Glossophobia Scenario:** A public-speaking simulation in front of three virtual judges.
- **Acrophobia Scenario:** A height-exposure simulation involving virtual locations at different heights.

The exposure scenarios feature different levels of intensity to support progressive exposure during a session.

##  Video Demonstrations

### 1. VR Waiting Room

This demonstration presents the virtual waiting room where the patient begins the VR experience.

[▶️ Watch the VR Waiting Room Demo](https://github.com/user-attachments/assets/94f8d79f-d7f4-4009-9252-980861c713a0)

### 2. Glossophobia — Public Speaking Scenario

This scenario simulates public speaking in front of three virtual judges. The patient experiences progressive exposure levels designed to vary the intensity of the presentation environment.

[▶️ Watch the Glossophobia Scenario Demo](https://github.com/user-attachments/assets/c4c66e2f-eb6c-40c8-8893-ec042113f859)

### 3. Acrophobia — Heights Scenario

This scenario exposes the patient to virtual environments at different heights. Multiple exposure levels allow the experience to progress through different height-related situations.

[▶️ Watch the Acrophobia Scenario Demo](https://github.com/user-attachments/assets/7b647aae-0d27-4d9e-b51e-cb8da2d04587)

##  Main Features

- **Immersive VR environment:** Provides a virtual setting for exposure scenarios.
- **Virtual waiting room:** Serves as the starting environment for the patient.
- **Glossophobia simulation:** Public-speaking scenario featuring three virtual judges.
- **Acrophobia simulation:** Virtual environments featuring different heights.
- **Progressive exposure levels:** Supports transitions between different levels of scenario intensity.
- **Physiological-data integration:** The wider system incorporates physiological measurements to support session monitoring and exposure-level management.
- **Therapist supervision:** The VR application is part of a system that includes a web dashboard for monitoring therapy sessions.

##  Technologies and Hardware

| Component | Technology |
|---|---|
| VR development engine | Unity |
| VR headset | Oculus Quest 2 |
| Physiological sensor | MAX30102 |
| Microcontroller | ESP32 |
| Authentication and cloud data | Firebase Authentication, Cloud Firestore, Firebase Realtime Database |
| Companion dashboard | React.js |

The MAX30102 sensor is used to collect heart-rate and blood-oxygen-saturation (SpO₂) measurements. An ESP32 is used as part of the physiological-data acquisition setup.

Firebase services support authentication and data storage across the broader system.

##  Related Project Components

The VR application is part of a larger project containing a therapist web dashboard and a cloud-backed data architecture.

- **Main repository:** [VR Phobia Therapy System](https://github.com/HibaBenNasr/vr-phobia-therapy-system)
- **Therapist dashboard:** [`../web-dashboard/`](../web-dashboard/)

##  Setup and Execution

The following is a general setup guide. The exact Unity version, package versions, and project-specific configuration should be verified against the original project before attempting a fresh build.

### Prerequisites

- Unity Hub and a compatible Unity Editor version.
- The Unity project files included in this directory.
- Android Build Support and the required Android SDK/NDK tools if building for Oculus Quest 2.
- An Oculus Quest 2 headset for device-based testing.
- Any required Firebase configuration files and project-specific SDK dependencies.

### Steps

1. Install Unity Hub and a Unity Editor version compatible with the project.
2. Open Unity Hub and select **Add project**.
3. Select the `vr-unity` directory.
4. Open the project and allow Unity to import its assets.
5. Review the Console for missing packages, dependencies, or configuration errors.
6. Configure the appropriate XR and Android build settings for the target headset.
7. Restore or configure the required Firebase dependencies and project credentials, if applicable.
8. Build and test the application in the intended VR environment.

**Important:** A fresh build may require additional setup. Firebase configuration, external assets, SDK dependencies, and the Unity version may need to be restored or verified. Do not publish Firebase credentials or private configuration files.

##  Academic Context

This application was developed as part of a graduation project for the Master's program in **Embedded Electronic Systems and Medical Equipment** at the Institut Supérieur des Technologies Médicales de Tunis, Université de Tunis El Manar.

**Academic year:** 2024–2025

The project explores the development of immersive VR exposure scenarios and their integration with physiological-data monitoring and a therapist dashboard.

> **Disclaimer:** This project is an academic prototype. Its scenarios and physiological monitoring features are not evidence of clinical effectiveness and should not be considered a substitute for professional medical or psychological care.

##  Author

**Hiba Ben Nasr**

[GitHub Profile](https://github.com/HibaBenNasr)
