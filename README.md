![CI](https://github.com/HibaBenNasr/vr-phobia-therapy-system/actions/workflows/ci.yml/badge.svg) 

CI builds the web dashboard and compiles the ESP32 firmware. The Unity app and the hardware itself are not covered.

#  VR Phobia Therapy System

**An immersive Virtual Reality system combining progressive phobia-exposure scenarios, physiological monitoring, and a therapist web dashboard.**

This project explores the development of a VR-based therapeutic system designed to support supervised exposure sessions for two specific phobias: **glossophobia (fear of public speaking)** and **acrophobia (fear of heights)**.

The system combines a Unity VR application, physiological data acquisition using a MAX30102 sensor and ESP32, and a React-based therapist dashboard connected to Firebase services. It allows therapists to manage patients and appointments, monitor physiological measurements during sessions, and supervise or adjust exposure levels.

This project was developed as an academic prototype as part of a Master's degree in Embedded Electronic Systems and Medical Equipment.

##  Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [System Architecture](#️-system-architecture)
- [Technology Stack](#️-technology-stack)
- [Video Demonstrations](#-video-demonstrations)
- [Repository Structure](#-repository-structure)
- [Setup and Configuration](#️-setup-and-configuration)
- [Academic Context](#-academic-context)
- [Disclaimer](#️-disclaimer)

## 📌 Project Overview

Exposure-based approaches involve confronting feared situations in a controlled and progressive manner. Virtual Reality provides a way to recreate such situations in an immersive, configurable environment.

The objective of this project is to bring together three components:

1. **Immersive VR experience:** Patients enter virtual environments designed around specific phobias, with different exposure levels.
2. **Physiological monitoring:** A sensor-based setup collects heart-rate and blood-oxygen-saturation (SpO₂) measurements during sessions.
3. **Therapist supervision dashboard:** A web application supports patient management, session monitoring, visualization of physiological data, and exposure-level control.

The system includes two distinct VR exposure scenarios:

- **Glossophobia:** A public-speaking environment where the patient presents in front of three virtual judges.
- **Acrophobia:** Virtual environments featuring different heights and progressive exposure levels.

The therapist dashboard supports both automatic and manual exposure-level adjustments, allowing the therapist to monitor the session and intervene through the available controls.

##  Key Features

###  Virtual Reality Application

- Virtual waiting room serving as the starting environment.
- Public-speaking simulation featuring three virtual judges.
- Height-exposure scenario with different virtual locations and heights.
- Multiple exposure levels for each scenario.
- Integration with the wider system's session-monitoring workflow.

###  Physiological Monitoring

- Acquisition of physiological measurements using a MAX30102 sensor and ESP32.
- Heart-rate and SpO₂ data monitoring.
- Real-time visualization of available sensor readings in the therapist dashboard.
- A sensor-derived stress-status indicator to support session observation.

###  Therapist Web Dashboard

- Therapist registration and authentication.
- Patient management.
- Appointment scheduling through a calendar.
- Therapist profile management.
- Therapy-session configuration and monitoring.
- Live physiological-data charts and session logs.
- Equipment-readiness information.
- Manual and automatic exposure-level management.
- Exposure-transition visualization.
- Session summaries and patient session history.

##  System Architecture

The project is organized into three main components.

### 1. Unity VR Application

The VR application provides the patient-facing experience using Unity and an Oculus Quest 2 headset. It contains the virtual waiting room and the two exposure scenarios: glossophobia and acrophobia.

### 2. Physiological Data Acquisition

A MAX30102 sensor is used to collect heart-rate and SpO₂ measurements. An ESP32 serves as part of the sensor-data acquisition setup.

The physiological data is made available to the wider system for monitoring during therapy sessions.

### 3. Therapist Web Dashboard and Firebase

The therapist dashboard is built with React.js and provides the interface for patient management and therapy-session supervision.

Firebase services support the wider system:

- **Firebase Authentication:** Therapist authentication.
- **Cloud Firestore:** Structured patient and session-related information.
- **Firebase Realtime Database:** Real-time physiological data and related live session state.

At a high level, the system connects the patient's VR experience, physiological monitoring, and the therapist's dashboard to support observation and control during a session.

##  Technology Stack

| Component | Technologies |
|---|---|
| VR development | Unity |
| VR hardware | Oculus Quest 2 |
| Frontend dashboard | React.js, Vite, Tailwind CSS |
| Physiological sensor | MAX30102 |
| Microcontroller | ESP32 |
| Authentication | Firebase Authentication |
| Structured data storage | Cloud Firestore |
| Real-time data | Firebase Realtime Database |

##  Video Demonstrations

Explore the main components of the project through the following demonstrations.

###  Part 1 — Virtual Reality Application

#### 1. VR Waiting Room

Demonstrates the virtual waiting room where the patient begins the VR experience.

[▶️ Watch the VR Waiting Room Demo](https://github.com/user-attachments/assets/94f8d79f-d7f4-4009-9252-980861c713a0)

#### 2. Glossophobia — Public Speaking Scenario

Demonstrates the public-speaking scenario, in which the patient presents in front of three virtual judges across different exposure levels.

[▶️ Watch the Glossophobia Scenario Demo](https://github.com/user-attachments/assets/c4c66e2f-eb6c-40c8-8893-ec042113f859)

#### 3. Acrophobia — Heights Scenario

Demonstrates the height-exposure scenario, featuring virtual locations at different heights and multiple exposure levels.

[▶️ Watch the Acrophobia Scenario Demo](https://github.com/user-attachments/assets/7b647aae-0d27-4d9e-b51e-cb8da2d04587)

###  Part 2 — Therapist Web Dashboard

#### 4. Patient Management and Dashboard Features

Demonstrates therapist authentication, patient management, appointment scheduling through the calendar, and therapist profile editing.

[▶️ Watch the Patient Management Demo](https://github.com/user-attachments/assets/f760981c-e212-4647-8ada-e2d5cce5379d)

#### 5. Live Therapy Session Monitoring

Demonstrates session configuration, physiological-data charts, session logs, equipment availability, stress-status monitoring, manual and automatic exposure-level changes, and session history.

[▶️ Watch the Live Therapy Session Demo](https://github.com/user-attachments/assets/e89cc1aa-bb3e-4724-8f2b-200c6a52af78)

##  Repository Structure

```text
vr-phobia-therapy-system/
├── README.md
├── vr-unity/
│   └── README.md
└── web-dashboard/
    └── README.md
```

The `vr-unity/` directory contains the Unity VR application and its related project assets.

The `web-dashboard/` directory contains the React-based therapist dashboard.

Refer to each subdirectory's README for component-specific information, demonstrations, and setup guidance.

##  Setup and Configuration

This repository documents the project's components and provides video demonstrations. Running the complete system requires additional environment-specific configuration.

### Web Dashboard

Typical prerequisites include:

- Node.js and npm.
- The dashboard's project dependencies.
- The required Firebase project configuration.

Start by navigating to the `web-dashboard/` directory and consulting its README and `package.json` for the appropriate installation and development commands.

### Unity VR Application

Typical prerequisites include:

- Unity Hub and a compatible Unity Editor version.
- The required project packages and external assets.
- Android Build Support and the necessary build tools if deploying to Oculus Quest 2.
- The required Firebase configuration and dependencies, if applicable.

Open the `vr-unity/` directory through Unity Hub and check the project configuration before building.

**Note:** A fresh build has not been verified as part of this README update. Unity version compatibility, external assets, Firebase configuration, and other dependencies may need to be checked or restored.

##  Academic Context

This project was developed as part of the Master's program in **Embedded Electronic Systems and Medical Equipment** at the Institut Supérieur des Technologies Médicales de Tunis, Université de Tunis El Manar.

**Academic year:** 2024–2025

The project brings together Virtual Reality, embedded physiological sensing, cloud-based data management, and web development in an academic prototype for supervised exposure-session monitoring.

##  Disclaimer

This repository presents an academic prototype, not a clinically validated medical product. The physiological measurements and sensor-derived stress-status indicator should not be interpreted as a medical diagnosis. The project does not establish clinical effectiveness and is not intended to replace professional medical or psychological care.

## 👩‍💻 Author

**Hiba Ben Nasr**

[GitHub Profile](https://github.com/HibaBenNasr)

[View the complete project repository](https://github.com/HibaBenNasr/vr-phobia-therapy-system)
