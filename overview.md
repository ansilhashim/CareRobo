# CareRobo — Smart Healthcare & Autonomous Robot Companion

**CareRobo** is a mobile application built with **React Native** and **Expo Router** designed for smart hospitals, care facilities, and home healthcare environments. It bridges patient health tracking with autonomous robotic assistance, enabling real-time vitals monitoring, medication management, schedule tracking, and hardware control of autonomous caregiving robots.

---

## 🌟 Key Capabilities & Features

### 1. 🤖 Autonomous Robot Control & Telemetry
- **Interactive Robot Controller**: Remote navigation with manual direction controls (Forward, Reverse, Left, Right, Brake), speed throttling, and instant **Emergency Stop (E-Stop)**.
- **Radar & Obstacle Detection**: Visual radar sweep animation simulating proximity sensing and obstacle detection.
- **Indoor Facility Mapping**: Real-time waypoint navigation across hospital zones (Docking Station, Pharmacy, Nurse Station, Patient Rooms).
- **Healthcare Task Dispatcher**: Automated task assignment for prescription deliveries, supply runs, nurse telepresence requests, and patient escorts with live status and ETA tracking.
- **Battery & Power Health**: Diagnostics for charge cycles, estimated operating runtime, auto-docking threshold management, and simulated hardware telemetry.
- **Hardware & Network Settings**: Configuration for BLE, ROS (Robot Operating System) Bridge, IoT WiFi credentials, safety distance limits, and alert triggers.

---

### 2. 🩺 Patient Vitals & Health Tracking
- **Real-Time Vital Monitoring**: Continuous tracking of key bio-metrics:
  - Heart Rate (BPM)
  - Blood Pressure (mmHg)
  - Blood Oxygen / SpO2 (%)
  - Body Temperature (°F / °C)
  - Blood Glucose (mg/dL)
- **Status & Trend Indicators**: Clear visual indicators (`Normal`, `Warning`, `Critical`) and trend directions (`Up`, `Down`, `Stable`).
- **Vital History**: Interactive historical timelines and trends for clinical reviews.

---

### 3. 💊 Medication & Prescription Management
- **Intake Schedules**: Daily medicine calendar categorized by time of day (Morning, Afternoon, Evening, Bedtime).
- **Adherence Tracking**: One-tap intake confirmations, dosage instructions, and refill alerts.
- **Detailed Prescription Information**: In-depth medication guide outlining prescribed doctor, purpose, frequency, and instructions.

---

### 4. 📅 Clinical Appointments & Visits
- **Visit Scheduling**: Overview of past and upcoming doctor consultations, lab tests, and hospital appointments.
- **Doctor & Facility Info**: Direct details for attending physicians, department locations, and visit preparation notes.

---

### 5. 🚨 Safety & Emergency Response
- **Emergency SOS Trigger**: One-tap high-priority emergency alarm with vibration and visual confirmation.
- **Emergency Contact Dispatch**: Instant contact access for primary caregivers and family members.
- **Quick Emergency Services**: Direct dialing shortcuts for local Ambulance, Hospital, Police, and Fire services.

---

### 6. 👤 Patient Profile & Caregiver Access
- **Health Profile**: Patient details, blood group, allergies, chronic conditions, and emergency medical IDs.
- **Notification Center**: Real-time push updates for task completions, vitals alerts, battery warnings, and upcoming appointments.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React Native](https://reactnative.dev/) (v0.86) + [Expo](https://expo.dev/) (SDK 57) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict typing) |
| **Routing** | [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation with Tabs + Stack) |
| **UI & Styling** | Custom design system (`constants/colors.ts`), `expo-linear-gradient`, `@expo/vector-icons` |
| **Animations & Gestures** | `react-native-reanimated`, `react-native-gesture-handler`, Native Animated API |
| **Storage & State** | `@react-native-async-storage/async-storage`, React state & hooks |
| **Device Integrations** | Screen orientation control, haptic feedback, notifications, splash screen |

---

## 📁 Directory Structure

```text
CareRobo/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Bottom tab navigation bar
│   │   ├── index.tsx           # Dashboard / Home Screen
│   │   ├── appointments.tsx    # Visits & Consultations
│   │   ├── vitals.tsx          # Real-time Vitals Screen
│   │   ├── medications.tsx     # Medication Tracker
│   │   ├── robo.tsx            # Robot Hub & Quick Telemetry
│   │   └── profile.tsx         # Medical Profile & Info
│   ├── _layout.tsx             # Root Stack Navigator & Theme
│   ├── appointment-detail.tsx  # Appointment Details Screen
│   ├── battery-monitor.tsx     # Battery Diagnostics & Power Health
│   ├── emergency.tsx           # SOS & Emergency Contacts
│   ├── medication-detail.tsx   # Detailed Prescription View
│   ├── notifications.tsx       # Notification Center
│   ├── robot-control.tsx       # Full D-Pad Remote & Radar Controller
│   ├── robot-location.tsx      # Live Map & Hospital Waypoints
│   ├── robot-settings.tsx      # IoT, ROS Bridge & Hardware Config
│   ├── robot-tasks.tsx         # Healthcare Mission Dispatcher
│   └── vital-history.tsx       # Historical Vital Trends
├── constants/
│   └── colors.ts               # Theme palette and styling tokens
├── assets/                     # App icons, splash images, fonts
├── app.json                    # Expo configuration
└── package.json                # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (>= 18.x)
- Expo Go app on iOS/Android or an active emulator

### Running the Project
```bash
# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

Press `a` to open in Android emulator, `i` for iOS simulator, or scan the QR code using the **Expo Go** app on your physical mobile device.
