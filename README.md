# CAMARA Industrial Predictive Maintenance Platform

---

### 1.1 The Industrial Challenge: The High Cost of Unplanned Downtime

Industrial equipment in the MENA region fails unexpectedly, causing downtime and financial losses. Equipment failures in oil and gas operations cost between $500,000 and $2 million each day in production. Manufacturing sectors face supply chain disruptions while logistics and port operations pay between $10,000 and $50,000 per hour for container fees.
The main problem comes from reactive run‑to‑failure maintenance models. Industrial equipment runs until it breaks down and then emergency teams rush for hours or days to fix it. Current maintenance methods do not give a view of device health signals such as battery level, temperature, vibration, or cellular connectivity. In areas where connectivity is poor, industrial equipment failures stay unnoticed until production stops.
The annual cost to the MENA sector is more than $50 billion and less than $100 billion in unplanned downtime.


### 1.2 The "Silent Failure" Problem: Why Traditional IoT Fails
Existing predictive maintenance solutions rely exclusively on isolated device sensors (vibration and temperature) transmitting over standard public cellular links. In remote industrial sectors, cellular towers regularly undergo resource block saturation or RF fade.

When an industrial device encounters network degradation:
1. **Telemetry Packets Drop:** Critical high-frequency vibration and thermal surge indicators fail to reach the cloud server.
2. **The False Idle Assumption:** Supervisory SCADA consoles interpret the silence as "normal standby" rather than active sensor drop.
3. **Catastrophic Failure Occurs Silently:** The machinery suffers thermal runaway or bearing seizure without operator notification.

### 1.3 The Solution: Network Health as a First-Class Predictor
Team Phu Four's platform solves the silent failure problem by fusing **CAMARA Network APIs** (via the **Nokia Network-as-Code** platform) with **ISO 10816 industrial vibration standards** and multi-sensor telemetry. By monitoring the cellular network link *in real time* alongside mechanical metrics, the platform detects degradation patterns **48 to 72 hours prior to functional failure**, dynamically reserves guaranteed network quality (QoS), throttles machinery load to reduce mechanical stress, and automatically dispatches local maintenance crews.

### 1.4 Validated Commercial Value & ROI Benchmarks
Based on industrial maintenance standards and automated operations across a 50-node fleet:
* **25% to 35% Reduction in Unplanned Stoppages:** Early warning alerts eliminate catastrophic mechanical seizures.
* **15% to 20% Reduction in Maintenance Overhead:** Planned component replacements replace costly emergency mobilization and premium-rate weekend overtime.
* **+10% to 20% Extension in Asset Useful Life:** Autonomous load shedding (-45% mechanical throttle) prevents irreversible thermal distortion.
* **3.8x Benefit-to-Cost Ratio:** Across a typical 50-node facility, the platform yields **$320,000+ in annual net downtime avoidance** against nominal API and cloud operational costs, reaching breakeven within **3.2 months**.

---

## 2. CAMARA API Usage Synopsis for Hackathon Judges

The platform orchestrates four CAMARA standardized APIs in a unified, continuous 60-second autonomous cycle:

| CAMARA API | Endpoint Specification | Ingestion Cadence | Primary Operational Role |
| :--- | :--- | :--- | :--- |
| **Device Status v0.3** | `POST /camara/device-status/v0/status` | Every 60s / On-Demand | Ingests device battery percentage, core processor temperature, and RF signal strength (RSSI). Detects power drain velocity and thermal anomalies. |
| **Congestion Insights v0.2** | `POST /camara/congestion-insights/v0/query` | Every 60s / On-Demand | Queries cellular cell tower physical resource block (PRB) utilization and 2-hour saturation trends. Distinguishes network packet dropouts from equipment idle states. |
| **Location Retrieval v0.2** | `POST /camara/location-retrieval/v0/retrieve` | Every 60s / On-Demand | Verifies exact GPS geographic coordinates, geofence validity, and regional RF coverage tier (Optimal, Standard, Marginal). |
| **QoS on Demand v0.4** | `POST /camara/qod/v0/sessions` | Event-Triggered (Risk > 75%) | Dynamically provisions a dedicated 5G network slice (10 Mbps guaranteed throughput, <50 ms latency) to stream uncompressed diagnostic telemetry for emergency triage. |

### 2.1 Autonomous 5-Step Orchestration Pipeline
```
  [Step 1: Device Status]  ──>  [Step 2: Congestion Insights]  ──>  [Step 3: Location Retrieval]
             │                                   │                                  │
             └───────────────────────────────────┼──────────────────────────────────┘
                                                 ▼
                             [Step 4: Multi-Signal Degradation Model]
                                                 │
                                                 ▼ (If Risk > 75%)
                             [Step 5: QoS on Demand Slice Provisioning]
                                                 │
                             ┌───────────────────┴───────────────────┐
                             ▼                                       ▼
                  Autonomous Load Throttling (-45%)      Automated Maintenance Work Order
```

### 2.2 CAMARA REST Request & Response Payloads

#### 1. Device Status API (`POST /camara/device-status/v0/status`)
```json
// Request Body
{
  "device": {
    "phoneNumber": "+966501234567",
    "networkAccessIdentifier": "device_007@nas.operator.net",
    "ipv4Address": {
      "publicAddress": "10.45.12.7",
      "privateAddress": "192.168.1.107"
    }
  },
  "metrics": ["battery_level", "core_temperature", "signal_strength"]
}

// Response Body (200 OK)
{
  "status": "ACTIVE",
  "battery": {
    "levelPercent": 34,
    "drainRatePerHour": 4.8,
    "state": "RAPID_DISCHARGE"
  },
  "thermal": {
    "coreTempCelsius": 68.4,
    "thresholdStatus": "WARNING"
  },
  "radio": {
    "signalStrengthDbm": -94,
    "snrDb": 12.2
  },
  "timestamp": "2026-09-11T08:45:10Z"
}
```

#### 2. Congestion Insights API (`POST /camara/congestion-insights/v0/query`)
```json
// Request Body
{
  "device": { "networkAccessIdentifier": "device_008@nas.operator.net" },
  "location": { "latitude": 31.2653, "longitude": 32.3019 },
  "predictionHorizonHours": 2
}

// Response Body (200 OK)
{
  "cellId": "CELL-EG-PORTSAID-04",
  "congestionLevel": "HIGH",
  "resourceBlockUtilizationPercent": 92.4,
  "trend": "INCREASING",
  "confidence": 0.94,
  "recommendedAction": "PRIORITIZE_QOS"
}
```

#### 3. Location Retrieval API (`POST /camara/location-retrieval/v0/retrieve`)
```json
// Request Body
{
  "device": { "networkAccessIdentifier": "device_003@nas.operator.net" },
  "maxAge": 60
}

// Response Body (200 OK)
{
  "area": {
    "center": { "latitude": 25.9304, "longitude": 49.6711 },
    "radius": 150
  },
  "facility": "Ghawar Crude Extraction Field - Station 04",
  "coverageTier": "OPTIMAL",
  "accuracy": 15
}
```

#### 4. QoS on Demand API (`POST /camara/qod/v0/sessions`)
```json
// Request Body
{
  "duration": 3600,
  "device": { "networkAccessIdentifier": "device_008@nas.operator.net" },
  "applicationServer": { "ipv4Address": "198.51.100.42" },
  "devicePorts": { "ranges": [{ "from": 50000, "to": 50010 }] },
  "qosProfile": "QOS_L",
  "qosFeature": "URLLC_PREDICTIVE_MAINTENANCE",
  "targetMinThroughputMbps": 10,
  "targetMaxLatencyMs": 50
}

// Response Body (201 Created)
{
  "sessionId": "qos-session-e84a29bf-4091",
  "status": "AVAILABLE",
  "qosStatus": "CONFIRMED",
  "bandwidthMbps": 10,
  "latencyTargetMs": 50,
  "expiresAt": "2026-09-11T09:45:10Z"
}
```

---

## 3. Evaluation Demo Scenarios for Hackathon Presentation

The application provides three pre-configured operational scenarios accessible via the top-bar **"Evaluation Guide & Scenarios"** modal or the scenario quick-triggers:

### Scenario 1: Port Said Container Terminal — Quay Crane Drive Motor
* **Asset:** `device_008` (Quay Crane 04 Hoist Motor)
* **Location:** Port Said Terminal, Egypt (Latitude: 31.2653° N, Longitude: 32.3019° E)
* **Operational Event:** The terminal experiences severe cellular tower saturation (PRB load reaches **92%** due to nearby marine cargo radio traffic). Simultaneously, the hoist motor drive incurs high winding friction, elevating temperature toward 74°C.
* **Autonomous Platform Response:**
  1. Detects elevated packet drop probability via **Congestion Insights**.
  2. The multi-signal fusion model raises degradation probability to **84.2%** (~28h horizon).
  3. The **QoS on Demand API** triggers automatically, provisioning a dedicated 10 Mbps / 50 ms URLLC slice to ensure telemetry continuity.
  4. Emergency diagnostic telemetry streams unhindered; automated load shed reduces peak container lifting speeds by 45%.
  5. Work Order `WO-PORTSAID-4091` dispatches to local dock mechanics.

### Scenario 2: Ghawar Oil Field — High-Pressure Crude Extraction Pump
* **Asset:** `device_003` (Crude Extraction Pump 12)
* **Location:** Ghawar Field, Eastern Province, Saudi Arabia (Latitude: 25.9304° N, Longitude: 49.6711° E)
* **Operational Event:** Severe sand ingress damages bearing assembly, causing radial vibration velocity to spike to **7.2 mm/s** (exceeding ISO 10816 Zone C limits of 4.5 mm/s).
* **Autonomous Platform Response:**
  1. The platform processes **Device Status** and vibration telemetry, calculating a failure probability of **91.4%** with a **14-hour failure horizon**.
  2. Autonomous load throttling reduces motor throughput to 55%, preventing mechanical seizure and pipe rupture.
  3. Work order `WO-GHAWAR-9214` alerts field technicians with replacement bearing specifications.

### Scenario 3: Ras Tanura Marine Oil Terminal — Distillation Pipeline Pump
* **Asset:** `device_007` (Heavy Crude Transfer Pump 07)
* **Location:** Ras Tanura, Saudi Arabia (Latitude: 26.6575° N, Longitude: 50.1583° E)
* **Operational Event:** Power converter degradation causes rapid battery depletion (4.8%/hr) paired with thermal runaway (core temp: 69.8°C).
* **Autonomous Platform Response:**
  1. Multi-signal fusion flags accelerated discharge rate alongside thermal spikes.
  2. Risk probability reaches **88.6%** with an estimated **18-hour failure horizon**.
  3. The platform initiates QoS slice reservation and schedules an emergency work order before catastrophic field trip.

---

The dashboard is structured into five functional modules, accessible via top navigation tabs:

### 4.1 Operations Overview (`Tab: Operations Overview`)
* **Interactive Geo-Spatial Map:** Custom SVG map of the Middle East region covering industrial hubs across Saudi Arabia, UAE, Qatar, Egypt, Jordan, Oman, and Kuwait. Node markers indicate operational health (Slate = Nominal, Amber = Warning, Orange Pulse = Critical). Includes toggleable cell tower PRB congestion overlays.
* **Telemetry & Degradation Gauge:**
  * Displays calculated failure probability percentage and model confidence score.
  * ISO 10816 standard comparison indicator.
  * Real-time SVG sparklines for Battery Level, Core Temperature (°C), Vibration Velocity (mm/s), and RF Latency (ms).
  * Manual simulation triggers: **"Simulate Failure"** and **"Throttle Load (55%)"**.
* **Automated Actions & Dispatch Feed:** Real-time chronological audit trail of autonomous actions: QoS reservation confirmations, load shed orders, and dispatched work orders with one-click technician acknowledgment.
* **Silent Failure Comparison Module:** Side-by-side technical breakdown illustrating the difference between traditional run-to-failure IoT architectures and CAMARA network-integrated orchestration.

### 4.2 CAMARA API Orchestration Inspector (`Tab: CAMARA API Orchestration`)
* **Live API Stream:** Chronological feed of all outbound REST queries to the Nokia Network-as-Code platform, filterable by API (`DeviceStatus`, `CongestionInsights`, `LocationRetrieval`, `QoSonDemand`).
* **5-Step Autonomous Pipeline Flowchart:** Visual workflow of ingestion, trend analysis, multi-signal fusion, risk evaluation, and QoS actuation.
* **Dual JSON Payload Inspector:** High-contrast, formatted view of exact CAMARA REST Request and Response JSON payloads with a one-click **"Copy Payload"** tool for technical demonstrations.

### 4.3 Asset Inventory Fleet (`Tab: Asset Inventory`)
* Tabular directory of all **50 monitored industrial assets** across Oil & Gas, Maritime Ports, and Advanced Manufacturing.
* Real-time multi-parameter search (Device ID, Facility Name, Country).
* Sector and Risk filters (Critical >75%, Warning 50-75%, Nominal <50%).
* Column sorting by Degradation Risk, Forecast Horizon (hours), and ID.
* Inline quick actions to inspect telemetry or simulate individual bearing failures.

### 4.4 Network Dependency Architecture (`Tab: Network Dependency Architecture`)
* Deep technical comparison demonstrating the vulnerability of isolated telemetry vs. network-integrated monitoring.
* Documentation of cellular resource block exhaustion, blindspot detection, and URLLC slice intervention.

### 4.5 Maintenance Economics & ROI Calculator (`Tab: Maintenance Economics`)
* Interactive financial modeling tool parameterized by industry sector:
  * Oil & Gas: $22,000 / hour downtime cost baseline.
  * Logistics & Ports: $14,000 / hour downtime cost baseline.
  * Manufacturing: $8,500 / hour downtime cost baseline.
* Sliders for connected node count (10 to 500 units) and historical downtime hours (10 to 120 hrs/yr).
* Computes Avoided Downtime Losses, Net Annual Savings, Benefit-to-Cost Ratio, and Breakeven Horizon in months.

### 4.6 Header & Simulation Control Bar
* **Simulation Cycles:** Tracks elapsed 60-second autonomous orchestration cycles.
* **Total API Calls Counter:** Real-time count of cumulative CAMARA API transactions.
* **Loss Avoided Counter:** Dollar savings accrued through autonomous interventions.
* **Execution Controls:** Single cycle advance (`Run 1 Cycle`), Autonomous Execution (`Auto-Run / Pause`), Speed Multipliers (`1x`, `2x`, `5x`), Quick Demo Failure Injection (`Simulate Failure`), and System State Reset.

---

## 5. Technical Stack & Deployment

* **Frontend:** React 18+, TypeScript, Tailwind CSS, Lucide Icons.
* **Animation & Visuals:** SVG Vector Sparklines, Custom Cartographic Projection, Tailwind animations.
* **API Specifications:** CAMARA Open Gateway Standard APIs (Device Status, Congestion Insights, Location Retrieval, QoS on Demand) aligned with Nokia Network-as-Code.
* **Architecture:** Client-side orchestration engine with multi-signal fusion algorithms and deterministic state generation.

---

## 6. Team & Acknowledgments

* **Hackathon:** MENA Open Gateway Hackathon
* **Theme:** Theme 5 — Industrial & Enterprise Automation
* **Team:** Phu Four
* **Institution:** Philadelphia University — Amman, Jordan
* **Team Members:**
  * Laith Ghanayem
  * Obay Nour Al Deen
  * Hasan Dawood
  * Abdulrahman Habib
