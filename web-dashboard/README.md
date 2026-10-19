#  VR Phobia Therapy System — Therapist Web Dashboard

This folder contains the **React-based web dashboard** developed for the VR phobia therapy system. It provides a centralized interface for therapists to manage patients, schedule appointments, configure therapy sessions, monitor physiological measurements, and follow exposure-level changes.

The dashboard is part of an academic project combining Virtual Reality, physiological sensing, and cloud-based data management.

##  Project Overview

The dashboard belongs to the project **“Développement d'un environnement thérapeutique immersif en Réalité Virtuelle pour la gestion des phobies avec reconnaissance émotionnelle.”**

It is designed to support the therapist before, during, and after a VR exposure session.

Before a session, the therapist can manage patient information and appointments. During a session, the dashboard provides access to physiological data, session information, and exposure-level controls. After a session, the therapist can consult session summaries and patient history.

##  Video Demonstrations

### 1. Patient Management and Dashboard Features

This demonstration presents the main dashboard workflows, including authentication, adding and managing patients, scheduling appointments through the calendar, and editing the therapist's profile.

[▶️ Watch the Patient Management Demo](https://github.com/user-attachments/assets/f760981c-e212-4647-8ada-e2d5cce5379d)

### 2. Live Therapy Session Monitoring

This demonstration presents the therapy-session workflow, including session configuration, live physiological data visualization, session logs, equipment availability, stress-status monitoring, exposure-level adjustments, and session history.

[▶️ Watch the Live Therapy Session Demo](https://github.com/user-attachments/assets/e89cc1aa-bb3e-4724-8f2b-200c6a52af78)

##  Main Features

###  Authentication and Therapist Profile

- Therapist registration and sign-in.
- Authenticated access to dashboard features.
- Therapist profile editing.

###  Patient Management

- Add and manage patient records.
- Access patient-related information.
- Consult a patient's previous therapy sessions and available session history.

###  Appointment Scheduling

- View and manage appointments through a calendar interface.
- Organize patient appointments for therapy sessions.

###  Therapy Session Configuration

- Configure a therapy session before starting.
- Select the exposure scenario and initial exposure level.
- Monitor equipment-readiness information as part of the session workflow.

###  Real-Time Physiological Monitoring

- Display incoming physiological measurements during a session.
- Visualize sensor data using charts.
- Present a stress-status indicator derived from the available sensor data.
- Display session information and logs to support therapist supervision.

###  Exposure-Level Management

- Support automatic and therapist-controlled exposure-level transitions.
- Allow the therapist to adjust the exposure level manually.
- Display a chart representing exposure-level transitions, including progression and retreat.
- Keep track of level changes during the session.

###  Session History and Summary

- Display session logs and relevant session information.
- Present a summary of the latest session when returning to the dashboard.
- Provide access to a patient's previous sessions.

##  Technology Stack

| Component | Technology |
|---|---|
| Frontend framework | React.js |
| Development tooling | Vite |
| Styling | Tailwind CSS |
| Authentication | Firebase Authentication |
| Patient and session records | Cloud Firestore |
| Real-time sensor data | Firebase Realtime Database |
| VR application | Unity |
| Physiological-data acquisition | MAX30102 sensor and ESP32 |

The dashboard uses Firebase services as part of the system's cloud-backed architecture. Firestore supports structured patient and session-related information, while Realtime Database is used for live physiological-data updates.

The Unity application provides the VR experience, and the physiological sensing setup supplies measurements used by the broader system.

##  System Architecture

At a high level, the system consists of three cooperating components:

1. **VR application:** Built with Unity for the Oculus Quest 2, providing the waiting room and exposure scenarios.
2. **Physiological sensing:** Uses a MAX30102 sensor and an ESP32 as part of the data-acquisition setup.
3. **Therapist dashboard:** A React web application for patient management, session supervision, physiological-data visualization, and exposure-level control.

Firebase Authentication, Cloud Firestore, and Firebase Realtime Database support authentication and data exchange across the wider application.

##  Installation and Local Development

The following steps describe a typical Vite-based React development workflow. Check the actual project files for the required Node.js version, package manager, scripts, and dependencies.

### Prerequisites

- [Node.js](https://nodejs.org/) with npm.
- Git, if cloning the repository.
- Access to the Firebase project and any required environment configuration.

### 1. Clone the repository

```bash
git clone https://github.com/HibaBenNasr/vr-phobia-therapy-system.git
cd vr-phobia-therapy-system/web-dashboard
```

### 2. Install dependencies

If the project contains a `package.json` and uses npm:

```bash
npm install
```

### 3. Configure Firebase

Review the project's existing Firebase configuration and environment-variable requirements. Provide the configuration values required by the application using the method expected by the codebase.

**Security note:** Never commit private credentials, service-account keys, or other sensitive Firebase configuration. Configure appropriate Firebase Authentication, Firestore, and Realtime Database security rules before using real patient data.

### 4. Start the development server

For a typical Vite project:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

**Note:** The commands above are standard Vite workflow examples. If the project's `package.json` defines different scripts or package-management requirements, follow those instead.

## 🔗 Related Project Components

- **Main repository:** [VR Phobia Therapy System](https://github.com/HibaBenNasr/vr-phobia-therapy-system)
- **Unity VR application:** [`../vr-unity/`](../vr-unity/)

##  Academic Context

This dashboard was developed as part of a graduation project for the Master's program in **Embedded Electronic Systems and Medical Equipment** at the Institut Supérieur des Technologies Médicales de Tunis, Université de Tunis El Manar.

**Academic year:** 2024–2025

The project explores how a therapist-facing web interface can support the monitoring and management of VR exposure sessions alongside physiological measurements.

> **Disclaimer:** This dashboard is part of an academic prototype. Sensor-derived stress indicators are not clinical diagnoses, and the system has not been established as clinically validated. It is not a substitute for professional medical or psychological care.

##  Author

**Hiba Ben Nasr**

[GitHub Profile](https://github.com/HibaBenNasr)
