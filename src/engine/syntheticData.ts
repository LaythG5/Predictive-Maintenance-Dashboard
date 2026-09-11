import { DeviceInfo, DeviceTelemetry, EquipmentType, IndustrialSector } from '../types';

const MENA_FACILITIES: Array<{
  name: string;
  facility: string;
  country: string;
  lat: number;
  lon: number;
  sector: IndustrialSector;
}> = [
  { name: 'Ghawar Crude Booster Station', facility: 'Ghawar Oil Field', country: 'Saudi Arabia', lat: 25.42, lon: 49.62, sector: 'oil_gas' },
  { name: 'Ras Tanura Distillation Unit', facility: 'Ras Tanura Refinery', country: 'Saudi Arabia', lat: 26.65, lon: 50.15, sector: 'oil_gas' },
  { name: 'Yanbu Petrochem Feed Pump', facility: 'Yanbu Industrial City', country: 'Saudi Arabia', lat: 24.09, lon: 38.06, sector: 'oil_gas' },
  { name: 'Jubail Polymer Extruder', facility: 'Jubail Industrial Complex', country: 'Saudi Arabia', lat: 27.01, lon: 49.66, sector: 'manufacturing' },
  { name: 'Jebel Ali STS Gantry Crane 08', facility: 'Jebel Ali Port Terminal 2', country: 'UAE', lat: 25.01, lon: 55.06, sector: 'logistics' },
  { name: 'Jebel Ali Automated AGV Fleet #4', facility: 'Jebel Ali Port Terminal 3', country: 'UAE', lat: 24.99, lon: 55.08, sector: 'logistics' },
  { name: 'Ruwais Gas Fractionation Turbine', facility: 'Ruwais Energy Center', country: 'UAE', lat: 24.11, lon: 52.73, sector: 'oil_gas' },
  { name: 'Khalifa Port Reefer Monitoring', facility: 'Khalifa Port Hub', country: 'UAE', lat: 24.81, lon: 54.67, sector: 'logistics' },
  { name: 'Port Said Container Quay Handler', facility: 'Port Said Gateway Terminal', country: 'Egypt', lat: 31.26, lon: 32.30, sector: 'logistics' },
  { name: 'Suez Canal Convoy Guide Motor', facility: 'Suez Canal North Anchorage', country: 'Egypt', lat: 30.70, lon: 32.34, sector: 'logistics' },
  { name: 'Helwan Cement Rotary Kiln', facility: 'Helwan Industrial Zone', country: 'Egypt', lat: 29.85, lon: 31.33, sector: 'manufacturing' },
  { name: 'Alexandria High-Speed Loom', facility: 'Alexandria Textile Complex', country: 'Egypt', lat: 31.20, lon: 29.92, sector: 'manufacturing' },
  { name: 'Sahab Precision Milling Unit', facility: 'Amman Industrial Estate (Sahab)', country: 'Jordan', lat: 31.87, lon: 35.96, sector: 'manufacturing' },
  { name: 'Aqaba Phosphate Conveyor', facility: 'Aqaba Industrial Port', country: 'Jordan', lat: 29.53, lon: 35.00, sector: 'logistics' },
  { name: 'Mesaieed Liquefaction Pump', facility: 'Mesaieed Industrial Zone', country: 'Qatar', lat: 24.99, lon: 51.55, sector: 'oil_gas' },
  { name: 'Sohar Bulk Material Stacker', facility: 'Sohar Port & Freezone', country: 'Oman', lat: 24.49, lon: 56.63, sector: 'logistics' },
];

const EQUIPMENT_TYPES: EquipmentType[] = ['pump', 'motor', 'vehicle', 'handler', 'compressor', 'turbine'];

export class SyntheticDataGenerator {
  numDevices: number;
  devices: DeviceInfo[];
  currentTime: Date;

  constructor(numDevices: number = 50) {
    this.numDevices = numDevices;
    this.devices = this.createDevices();
    this.currentTime = new Date();
  }

  private createDevices(): DeviceInfo[] {
    const devices: DeviceInfo[] = [];

    for (let i = 0; i < this.numDevices; i++) {
      const facilityPreset = MENA_FACILITIES[i % MENA_FACILITIES.length];
      const type = EQUIPMENT_TYPES[i % EQUIPMENT_TYPES.length];
      // small jitter around facility location
      const latJitter = (Math.random() - 0.5) * 0.12;
      const lonJitter = (Math.random() - 0.5) * 0.12;

      devices.push({
        device_id: `device_${String(i).padStart(3, '0')}`,
        name: `${facilityPreset.facility} ${type.toUpperCase()} #${i + 1}`,
        type,
        sector: facilityPreset.sector,
        facility: facilityPreset.facility,
        country: facilityPreset.country,
        location_lat: +(facilityPreset.lat + latJitter).toFixed(4),
        location_lon: +(facilityPreset.lon + lonJitter).toFixed(4),
        will_fail_in_hours: null,
        is_failing_target: false,
        load_reduction_active: false,
        load_percent: 100,
      });
    }

    // Pre-inject 6-8 devices with progressive degradation matching the paper's 48-72h failure horizon
    // Target devices across different sectors:
    const initialFailingIndexes = [3, 7, 14, 22, 35, 41];
    initialFailingIndexes.forEach((idx, order) => {
      if (devices[idx]) {
        // Spread between 32h to 68h until catastrophic failure
        devices[idx].will_fail_in_hours = +(34 + order * 6.5).toFixed(1);
        devices[idx].is_failing_target = true;
      }
    });

    return devices;
  }

  public injectFailure(deviceId: string, hoursUntilFailure: number = 48) {
    const dev = this.devices.find(d => d.device_id === deviceId);
    if (dev) {
      dev.will_fail_in_hours = hoursUntilFailure;
      dev.is_failing_target = true;
      dev.load_reduction_active = false;
      dev.load_percent = 100;
    }
  }

  public reduceLoad(deviceId: string, targetLoadPercent: number = 55) {
    const dev = this.devices.find(d => d.device_id === deviceId);
    if (dev) {
      dev.load_reduction_active = true;
      dev.load_percent = targetLoadPercent;
      // Reducing load extends lifespan significantly
      if (dev.will_fail_in_hours !== null) {
        dev.will_fail_in_hours = +(dev.will_fail_in_hours * 1.6).toFixed(1);
      }
    }
  }

  public getNextTelemetry(device: DeviceInfo): { telemetry: DeviceTelemetry; isFailing: boolean } {
    const isFailing = device.will_fail_in_hours !== null && device.will_fail_in_hours > 0;

    // Normal Gaussian random helper
    const randNorm = (mean: number, std: number) => {
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1 || 0.0001)) * Math.cos(2.0 * Math.PI * u2);
      return mean + z * std;
    };

    // Base values (healthy device)
    let battery = randNorm(86, 4);
    let temp = randNorm(48, 2.5);
    let vibration = randNorm(2.1, 0.4);
    let signal = randNorm(-68, 4.5);
    let latency = randNorm(22, 4);

    if (isFailing && device.will_fail_in_hours !== null) {
      const hoursUntilFailure = device.will_fail_in_hours;
      // degradation factor 0 to 1 as it gets closer to failure
      const degradationFactor = Math.min(1, Math.max(0, 1 - (hoursUntilFailure / 72)));

      // If load reduction is active, thermal stress and vibration are alleviated
      const loadMultiplier = device.load_reduction_active ? (device.load_percent / 100) : 1.0;

      // Battery depletes faster
      battery = 85 - (70 * degradationFactor) + randNorm(0, 1.8);

      // Temperature increases (mechanical friction and thermal runaway)
      temp = 50 + (22 * degradationFactor * loadMultiplier) + randNorm(0, 2);

      // Vibration increases (bearing wear and cavitation)
      vibration = 2.2 + (6.5 * degradationFactor * loadMultiplier) + randNorm(0, 0.3);

      // Signal degradation in industrial cage environments
      signal = -70 - (25 * degradationFactor) + randNorm(0, 3);
      latency = 25 + (120 * degradationFactor) + randNorm(0, 15);

      // Advance countdown by 0.5 simulated hour per cycle for demonstrability
      device.will_fail_in_hours = Math.max(0, +(device.will_fail_in_hours - 0.4).toFixed(2));
      if (device.will_fail_in_hours <= 0) {
        device.will_fail_in_hours = null;
      }
    }

    const telemetry: DeviceTelemetry = {
      device_id: device.device_id,
      timestamp: this.currentTime.toISOString(),
      battery_percent: Math.max(0, Math.min(100, +battery.toFixed(1))),
      cpu_temp_celsius: Math.max(30, Math.min(85, +temp.toFixed(1))),
      vibration_mms: Math.max(0, Math.min(12, +vibration.toFixed(2))),
      signal_strength_dbm: Math.max(-120, Math.min(-30, +signal.toFixed(0))),
      network_latency_ms: Math.max(5, Math.min(600, +latency.toFixed(0))),
    };

    return { telemetry, isFailing };
  }
}
