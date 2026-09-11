export type IndustrialSector = 'oil_gas' | 'manufacturing' | 'logistics';
export type EquipmentType = 'pump' | 'motor' | 'vehicle' | 'handler' | 'compressor' | 'turbine';
export type CoverageQuality = 'excellent' | 'good' | 'fair' | 'poor';
export type ActionTaken = 'alert' | 'maintenance_book' | 'load_reduce' | 'none';

export interface DeviceTelemetry {
  device_id: string;
  timestamp: string;
  battery_percent: number;       // 0-100%
  cpu_temp_celsius: number;      // 30-80°C
  vibration_mms: number;         // 0-10 mm/s
  signal_strength_dbm: number;   // -120 to -30 dBm
  network_latency_ms: number;    // ms
}

export interface DeviceInfo {
  device_id: string;
  name: string;
  type: EquipmentType;
  sector: IndustrialSector;
  facility: string;
  country: string;
  location_lat: number;
  location_lon: number;
  will_fail_in_hours: number | null; // injected failure countdown
  is_failing_target?: boolean;
  load_reduction_active?: boolean;
  load_percent: number; // 0-100%
}

export interface APICall {
  id: string;
  api_name: 'DeviceStatus' | 'CongestionInsights' | 'LocationRetrieval' | 'QoSonDemand';
  device_id: string;
  timestamp: string;
  endpoint: string;
  request: Record<string, any>;
  response: Record<string, any>;
  execution_time_ms: number;
  status: number;
}

export interface Prediction {
  device_id: string;
  timestamp: string;
  failure_probability: number;   // 0-1
  predicted_failure_hours: number;
  confidence: number;            // 0-1
  contributing_factors: string[];
  action_taken: ActionTaken;
  trends: {
    battery_trend: number;
    temp_trend: number;
    vibration_trend: number;
  };
  metrics: {
    battery: number;
    temp: number;
    vibration: number;
    signal: number;
    congestion: number;
    coverage: CoverageQuality;
  };
}

export interface AlertEvent {
  id: string;
  timestamp: string;
  device_id: string;
  device_name: string;
  facility: string;
  sector: IndustrialSector;
  failure_probability: number;
  hours_until_failure: number;
  status: 'sent' | 'acknowledged' | 'in_progress';
  qos_reserved: boolean;
  work_order_id: string;
  load_shed: boolean;
}

export interface OrchestrationCycleResult {
  timestamp: string;
  cycle_number: number;
  devices_processed: number;
  predictions: Prediction[];
  alerts: AlertEvent[];
  api_calls_made: number;
  new_api_calls: APICall[];
  high_risk_count: number;
}
