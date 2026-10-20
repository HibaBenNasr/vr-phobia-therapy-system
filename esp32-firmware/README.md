# ESP32 Firmware — Physiological Monitoring

Firmware for the ESP32-based physiological monitoring component of the **VR Phobia Therapy System**. It reads heart-rate data from a MAX30102-compatible sensor, processes heartbeat measurements, and transmits session data to Firebase Realtime Database over Wi-Fi.

The firmware is designed to support real-time monitoring during VR exposure sessions, allowing the therapist dashboard to display physiological measurements and a basic rule-based stress indicator.

## Features

- **Heart-rate monitoring:** Reads infrared sensor measurements and detects heartbeats using the `heartRate.h` algorithm.
- **BPM calculation:** Calculates the current heart rate and maintains a rolling average over four samples.
- **Finger-contact detection:** Uses an infrared-value threshold to identify possible loss of contact with the sensor.
- **Wi-Fi connectivity:** Connects the ESP32 to a configured wireless network.
- **Firebase integration:** Authenticates with Firebase and exchanges session information through Firebase Realtime Database.
- **Session-aware data transmission:** Checks whether a therapy session is active and retrieves its session ID before uploading measurements.
- **Rule-based stress indicator:** Classifies valid heart-rate measurements into three predefined categories.
- **Timestamped records:** Uses Network Time Protocol (NTP) to obtain Unix timestamps for sensor records and contact-related notes.
- **Concurrent execution:** Runs sensor acquisition and Firebase communication in separate FreeRTOS tasks.

## Hardware Requirements

| Component | Purpose |
|---|---|
| ESP32 development board | Sensor processing and wireless communication |
| MAX30102 sensor module | Optical measurement used for heart-rate estimation |
| USB cable | Programming and serial debugging |
| Wi-Fi network | Connectivity to Firebase Realtime Database |

**Note:** The MAX30102 supports heart-rate and blood-oxygen-related measurements, but the current firmware processes heart rate only. SpO₂ calculation is not implemented in this version.

## Software and Libraries

- Arduino IDE or another compatible Arduino development environment
- ESP32 Arduino core
- `WiFi.h` — Wi-Fi connectivity
- `Wire.h` — I²C communication
- `Firebase_ESP_Client.h` — Firebase authentication and Realtime Database operations
- `MAX30105.h` — sensor interface from the SparkFun MAX3010x sensor library
- `heartRate.h` — heartbeat detection utilities
- `time.h` — time handling
- Firebase library helper files: `TokenHelper.h` and `RTDBHelper.h`

The firmware also uses the ESP32 FreeRTOS APIs for task creation and scheduling.

## System Architecture

```text
MAX30102 Sensor
      |
      | I²C
      v
ESP32
  ├── Sensor Task
  │     ├── Read IR values
  │     ├── Detect heartbeats
  │     ├── Calculate BPM
  │     └── Calculate average BPM
  │
  └── Firebase Task
        ├── Monitor session state
        ├── Retrieve session ID
        ├── Classify BPM
        └── Upload data over Wi-Fi
                  |
                  v
       Firebase Realtime Database
                  |
          VR Therapy System
                  |
          Therapist Dashboard
```

## How It Works

### 1. Sensor initialization

The ESP32 initializes I²C communication and the MAX30102 sensor. The sensor is configured using the library's default setup, with a low red LED amplitude and the green LED disabled.

If the sensor cannot be detected, the firmware prints an error message to the Serial Monitor and stops execution.

### 2. Heart-rate acquisition

A dedicated FreeRTOS task continuously reads the sensor's infrared values.

The firmware uses the heartbeat detection algorithm to calculate BPM and accepts individual measurements between 40 and 254 BPM. It maintains a four-entry rolling average.

When the infrared value falls below `50000`, the firmware treats this as a possible loss of finger contact, resets the average BPM to zero, and marks contact as unavailable.

### 3. Firebase connection and session monitoring

The firmware connects to Wi-Fi, configures NTP time synchronization, and initializes Firebase using the configured API key, database URL, and user credentials.

The Firebase task checks the following database paths:

- `/pre_session_validation/session/start_session` — indicates whether a session is active.
- `/pre_session_validation/session/session_id` — identifies the active therapy session.
- `/pre_session_validation/equipment_ready/sensors_ready/last_online` — stores the latest device heartbeat timestamp.

The session state is checked approximately every two seconds, while the device heartbeat timestamp is updated approximately every five seconds.

### 4. Heart-rate classification

For valid BPM values between 46 and 179, the firmware assigns a simple category:

| Average heart rate | Assigned category |
|---|---|
| BPM ≤ 120 | `neutral` |
| BPM > 120 and ≤ 140 | `high` |
| BPM > 140 | `very high` |

The resulting category is stored as `stress_level`, and the current session's `stress_state` is updated when the category changes.

These thresholds are fixed rules implemented in the firmware. They are not a validated clinical stress-detection algorithm, and heart rate alone cannot establish a person's emotional state.

### 5. Uploading session data

When a session is active and a session ID is available, the firmware uploads valid heart-rate measurements to Firebase Realtime Database.

A sensor data record contains the following fields:

```json
{
  "BPM": 85,
  "stress_level": "neutral"
}
```

The numerical BPM value above is an illustrative example, not a live measurement.

If the firmware detects a possible loss of finger contact, it can also write a note to the active session's database record.

## Firebase Realtime Database Structure

The firmware reads and writes the following paths.

```text
pre_session_validation/
├── equipment_ready/
│   └── sensors_ready/
│       └── last_online
│
└── session/
    ├── start_session
    └── session_id

sessions/
└── <session_id>/
    ├── stress_state
    ├── sensorData/
    │   └── <unix_timestamp>/
    │       ├── BPM
    │       └── stress_level
    │
    └── notes/
        └── <unix_timestamp>/
            └── "No contact detected"
```

The `pre_session_validation` paths are used to coordinate equipment readiness and session startup. The `sessions/<session_id>` paths contain the session-specific physiological data.

**Integration note:** This structure describes the paths used by the firmware. The Firebase database must be configured to match them, and the dashboard must read the same paths to display the data correctly.

## Installation and Configuration

### 1. Install the development environment

Install the Arduino IDE and configure it for your ESP32 development board using the ESP32 Arduino core.

### 2. Install the required libraries

Install the following libraries through the Arduino IDE Library Manager where available:

- **Firebase ESP Client** by Mobizt
- **SparkFun MAX3010x Pulse and Proximity Sensor Library**

The ESP32 core provides `WiFi.h`, `Wire.h`, and the FreeRTOS functionality. The time-related functions are provided by the ESP32 environment.

The firmware also includes `TokenHelper.h` and `RTDBHelper.h` from the Firebase library's `addons` directory. Ensure these files are available in your installed library version.

### 3. Configure Wi-Fi and Firebase credentials

Open `esp32-firmware.ino` and replace the placeholder values in the configuration section:

```cpp
#define WIFI_SSID       "YOUR_WIFI_SSID"
#define WIFI_PASSWORD   "YOUR_WIFI_PASSWORD"

#define API_KEY         "YOUR_FIREBASE_API_KEY"
#define USER_EMAIL      "YOUR_FIREBASE_USER_EMAIL"
#define USER_PASSWORD   "YOUR_FIREBASE_USER_PASSWORD"
#define DATABASE_URL    "YOUR_FIREBASE_DATABASE_URL"
```

Configure Firebase Authentication with the account used by the firmware, enable Firebase Realtime Database, and ensure the account has the required database permissions.

**Security:** Never commit real Wi-Fi passwords, Firebase credentials, private keys, or other secrets to a public repository. Use placeholders in the version tracked by Git and keep actual credentials in a local, untracked configuration. Firebase database rules should restrict access to authorized users and devices.

### 4. Connect the sensor

Connect the MAX30102 module to the ESP32's I²C interface:

- Connect power and ground according to the specifications of your particular sensor module.
- Connect SDA and SCL to the corresponding I²C pins on your ESP32 board.

The firmware initializes I²C with `Wire`, using the board's default I²C pin configuration. Check your specific ESP32 board's pinout and sensor module voltage requirements before powering the circuit.

### 5. Upload and test

1. Open `esp32-firmware.ino` in the Arduino IDE.
2. Select the correct ESP32 board and serial port.
3. Enter your local configuration values.
4. Upload the firmware.
5. Open the Serial Monitor at **115200 baud**.
6. Check the Wi-Fi connection, Firebase initialization, sensor detection, and BPM output.
7. Verify that the equipment heartbeat and session data appear at the expected Firebase paths.

For session data to be uploaded, the firmware must be connected to Firebase, `start_session` must be true, and `session_id` must contain a valid session identifier rather than `"none"`.

## Current Implementation Notes

- The firmware uploads heart-rate and rule-based category data; it does not currently calculate SpO₂.
- Sensor data transmission is attempted approximately once per second while a session is active and a session ID is available.
- Unix timestamps depend on successful NTP synchronization. Check time synchronization before relying on record timestamps.
- The sensor-contact check is based on a fixed infrared threshold and may need calibration for the specific hardware and placement.
- The current BPM classification uses fixed thresholds and should be interpreted as a basic monitoring indicator, not a clinical diagnosis or validated stress assessment.
- Firebase operations should be checked for failures during testing. The current implementation does not handle every database error or automatically recover from all possible connection failures.

## Related Components

- [Main Project — VR Phobia Therapy System](https://github.com/HibaBenNasr/vr-phobia-therapy-system)
- [Unity VR Application](../vr-unity/)
- [Therapist Web Dashboard](../web-dashboard/)

## Academic Context

This firmware is part of an academic project focused on developing an immersive VR exposure-therapy environment with physiological monitoring and therapist supervision.

**Disclaimer:** This is an academic prototype intended for demonstration and development. It is not a certified medical device and should not be used as a substitute for professional medical assessment or treatment.
