# 🔌 ESP32 Firmware — VR Phobia Therapy System

This directory contains the ESP32 firmware developed for the **VR Phobia Therapy System**, an academic prototype that combines immersive Virtual Reality exposure scenarios, physiological monitoring, and a therapist web dashboard.

The firmware is responsible for the microcontroller-side operations associated with physiological data acquisition and communication with the wider system, according to the implemented hardware and software configuration.

## 📌 Project Overview

The firmware is part of a system designed to support supervised VR exposure sessions for two phobia scenarios:

- **Glossophobia:** Public speaking in front of virtual judges.
- **Acrophobia:** Exposure to virtual environments at different heights.

The overall system integrates a Unity VR application, physiological sensing hardware, Firebase services, and a React-based therapist dashboard.

The ESP32 firmware provides the embedded component of this architecture.

## ⚙️ Hardware

| Component | Purpose |
|---|---|
| ESP32 | Microcontroller for the embedded system |
| MAX30102 sensor | Heart-rate and blood-oxygen-saturation (SpO₂) measurements |
| USB connection | Firmware upload, power, and serial debugging, where supported |

Refer to the actual firmware and hardware wiring for the exact board model, pin assignments, and sensor configuration.

## ✨ Firmware Responsibilities

Depending on the implemented sketch, the firmware may handle the following operations:

- Initialize the ESP32 and connected sensor.
- Acquire physiological measurements.
- Process or format sensor readings.
- Transmit measurements to the configured data destination.
- Report sensor or connection errors when supported.
- Provide serial output for debugging and testing.

The exact responsibilities and implemented features should be verified against `esp32_firmware.ino`.

## 🛠️ Technologies

- ESP32 microcontroller
- Arduino framework
- C/C++ using the Arduino programming model
- MAX30102 sensor interface
- The communication protocol and data destination configured in the firmware

## 📂 Project Structure

```text
esp32-firmware/
├── esp32_firmware.ino
└── README.md
```

## 🚀 Setup and Installation

### Prerequisites

- An ESP32 development board.
- A USB cable compatible with the board.
- Arduino IDE.
- The required sensor and communication libraries used by the sketch.
- The MAX30102 sensor and its required wiring, if used by the firmware.

### 1. Install the Arduino IDE

Download and install the [Arduino IDE](https://www.arduino.cc/en/software).

### 2. Configure ESP32 board support

Follow the official [Arduino-ESP32 documentation](https://docs.espressif.com/projects/arduino-esp32/en/latest/installing.html) to install ESP32 board support.

### 3. Open the firmware

Open `esp32_firmware.ino` in the Arduino IDE.

### 4. Install the required libraries

Review the sketch's `#include` statements and install the corresponding libraries through the Arduino IDE Library Manager or their official installation instructions.

The exact library names and versions depend on the implementation.

### 5. Configure the board and port

1. Connect the ESP32 to your computer.
2. Select the appropriate ESP32 board in the Arduino IDE.
3. Select the serial port associated with the board.
4. Verify any sensor pin assignments and configuration values against the hardware wiring.

### 6. Upload and test

1. Compile the sketch using **Verify**.
2. Upload the firmware to the ESP32.
3. Open the Serial Monitor if the sketch uses serial output.
4. Check the sensor readings and communication status.

If the firmware communicates with an external service, configure the required network credentials, endpoints, and other settings according to the implementation.

## 🔐 Configuration and Security

Before uploading or publishing the firmware, make sure that:

- Wi-Fi passwords and private credentials are not hardcoded into publicly shared code.
- Firebase credentials or access tokens are not exposed.
- Any external database is protected by appropriate access controls.
- Configuration values are documented without revealing secrets.

Use placeholder values in public examples and keep private configuration out of version control.

## 🔗 Related Components

This firmware belongs to the larger VR Phobia Therapy System.

- **Main project:** [VR Phobia Therapy System](https://github.com/HibaBenNasr/vr-phobia-therapy-system)
- **Unity VR application:** [`../vr-unity/`](../vr-unity/)
- **Therapist web dashboard:** [`../web-dashboard/`](../web-dashboard/)

## 🎓 Academic Context

Developed as part of a Master's graduation project in **Embedded Electronic Systems and Medical Equipment** at the Institut Supérieur des Technologies Médicales de Tunis, Université de Tunis El Manar.

**Academic year:** 2024–2025

## ⚠️ Disclaimer

This firmware is part of an academic prototype. Physiological measurements and sensor-derived indicators are intended for project development and demonstration, not for medical diagnosis or clinical decision-making.

## 👩‍💻 Author

**Hiba Ben Nasr**

[GitHub Profile](https://github.com/HibaBenNasr)
