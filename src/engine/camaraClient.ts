import { APICall, CoverageQuality, DeviceInfo, DeviceTelemetry } from '../types';

export class CAMARAAPIClient {
  private devices: Map<string, DeviceInfo>;
  public apiCalls: APICall[];
  private maxStoredCalls: number;

  constructor(devices: DeviceInfo[], maxStoredCalls: number = 200) {
    this.devices = new Map(devices.map(d => [d.device_id, d]));
    this.apiCalls = [];
    this.maxStoredCalls = maxStoredCalls;
  }

  public updateDevices(devices: DeviceInfo[]) {
    this.devices = new Map(devices.map(d => [d.device_id, d]));
  }

  private logCall(call: APICall) {
    this.apiCalls.unshift(call);
    if (this.apiCalls.length > this.maxStoredCalls) {
      this.apiCalls.pop();
    }
  }

  /**
   * API 1: CAMARA Device Status API
   * Standard: /device-status/v0/connectivity
   * Queries real-time device battery, temperature, RF signal, and connectivity status
   */
  public deviceStatus(deviceId: string, telemetry: DeviceTelemetry): {
    battery_percent: number;
    cpu_temp_celsius: number;
    signal_strength_dbm: number;
    online: boolean;
    network_latency_ms: number;
    apiCall: APICall;
  } {
    const isOnline = telemetry.signal_strength_dbm > -105;
    const executionTime = +(45 + Math.random() * 65).toFixed(1);

    const requestPayload = {
      device: {
        phoneNumber: `+97150${deviceId.replace('device_', '')}120`,
        networkAccessIdentifier: `${deviceId}@industrial.5g.nokia.net`,
        ipv4Address: { publicAddress: `10.244.12.${parseInt(deviceId.replace('device_', ''), 10) + 10}` }
      },
      monitoringType: 'BATTERY_THERMAL_CONNECTIVITY'
    };

    const responsePayload = {
      status: 'AVAILABLE',
      battery_percent: telemetry.battery_percent,
      cpu_temp_celsius: telemetry.cpu_temp_celsius,
      signal_strength_dbm: telemetry.signal_strength_dbm,
      online: isOnline,
      vibration_mms: telemetry.vibration_mms,
      timestamp: new Date().toISOString()
    };

    const call: APICall = {
      id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      api_name: 'DeviceStatus',
      device_id: deviceId,
      timestamp: new Date().toISOString(),
      endpoint: 'POST https://nokia.networkascode.com/camara/device-status/v0/status',
      request: requestPayload,
      response: responsePayload,
      execution_time_ms: executionTime,
      status: 200
    };

    this.logCall(call);

    return {
      battery_percent: telemetry.battery_percent,
      cpu_temp_celsius: telemetry.cpu_temp_celsius,
      signal_strength_dbm: telemetry.signal_strength_dbm,
      online: isOnline,
      network_latency_ms: telemetry.network_latency_ms,
      apiCall: call
    };
  }

  /**
   * API 2: CAMARA Congestion Insights API
   * Standard: /congestion-insights/v0/query
   * Queries cellular radio cell congestion around the industrial facility
   */
  public congestionInsights(deviceId: string, isFailingDevice: boolean = false): {
    tower_load_percent: number;
    forecast_2h: 'overload' | 'normal';
    trend: 'increasing' | 'decreasing';
    cell_id: string;
    apiCall: APICall;
  } {
    // Failing devices or heavy industrial zones experience high localized traffic/interference
    const baseCongestion = isFailingDevice 
      ? 75 + Math.random() * 23 // 75-98%
      : 35 + Math.random() * 40; // 35-75%
    const towerLoad = +baseCongestion.toFixed(1);
    const forecast: 'overload' | 'normal' = towerLoad > 80 ? 'overload' : 'normal';
    const trend: 'increasing' | 'decreasing' = Math.random() > 0.45 ? 'increasing' : 'decreasing';
    const cellId = `MENA-CELL-5G-${deviceId.slice(-3)}-SA`;
    const executionTime = +(70 + Math.random() * 85).toFixed(1);

    const requestPayload = {
      device: { networkAccessIdentifier: `${deviceId}@industrial.5g.nokia.net` },
      predictionIntervalHours: 2,
      lookbackIntervalHours: 6
    };

    const responsePayload = {
      tower_load_percent: towerLoad,
      forecast_2h: forecast,
      trend: trend,
      confidence_level: 'HIGH',
      cell_id: cellId,
      carrier: 'Zain/Etisalat/STC Partner Node'
    };

    const call: APICall = {
      id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      api_name: 'CongestionInsights',
      device_id: deviceId,
      timestamp: new Date().toISOString(),
      endpoint: 'POST https://nokia.networkascode.com/camara/congestion-insights/v0/query',
      request: requestPayload,
      response: responsePayload,
      execution_time_ms: executionTime,
      status: 200
    };

    this.logCall(call);

    return {
      tower_load_percent: towerLoad,
      forecast_2h: forecast,
      trend: trend,
      cell_id: cellId,
      apiCall: call
    };
  }

  /**
   * API 3: CAMARA Location Retrieval API
   * Standard: /location-retrieval/v0/retrieve
   * Geographically pinpoints device and evaluates RF coverage quality
   */
  public locationRetrieval(deviceId: string): {
    latitude: number;
    longitude: number;
    coverage_quality: CoverageQuality;
    estimated_downtime_risk: 'high' | 'low';
    accuracy_meters: number;
    apiCall: APICall;
  } {
    const device = this.devices.get(deviceId);
    const lat = device ? device.location_lat : 25.0;
    const lon = device ? device.location_lon : 55.0;

    // Quality distribution
    const rand = Math.random();
    let coverageQuality: CoverageQuality = 'good';
    if (device?.is_failing_target) {
      // In remote or failing industrial enclosures, signal is often fair or poor
      coverageQuality = rand > 0.5 ? 'fair' : (rand > 0.2 ? 'poor' : 'good');
    } else {
      coverageQuality = rand > 0.6 ? 'excellent' : (rand > 0.25 ? 'good' : 'fair');
    }

    const downtimeRisk: 'high' | 'low' = (coverageQuality === 'fair' || coverageQuality === 'poor') ? 'high' : 'low';
    const executionTime = +(55 + Math.random() * 65).toFixed(1);

    const requestPayload = {
      device: { networkAccessIdentifier: `${deviceId}@industrial.5g.nokia.net` },
      maxAgeSeconds: 60
    };

    const responsePayload = {
      area: {
        center: { latitude: lat, longitude: lon },
        radius: 25.0
      },
      coverage_quality: coverageQuality,
      estimated_downtime_risk: downtimeRisk,
      verificationStatus: 'VERIFIED_IN_AREA',
      facility: device?.facility || 'MENA Hub'
    };

    const call: APICall = {
      id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      api_name: 'LocationRetrieval',
      device_id: deviceId,
      timestamp: new Date().toISOString(),
      endpoint: 'POST https://nokia.networkascode.com/camara/location-retrieval/v0/retrieve',
      request: requestPayload,
      response: responsePayload,
      execution_time_ms: executionTime,
      status: 200
    };

    this.logCall(call);

    return {
      latitude: lat,
      longitude: lon,
      coverage_quality: coverageQuality,
      estimated_downtime_risk: downtimeRisk,
      accuracy_meters: 25.0,
      apiCall: call
    };
  }

  /**
   * API 4: CAMARA Quality on Demand (QoS on Demand) API
   * Standard: /qod/v0/sessions
   * Dynamically allocates dedicated low-latency 5G slice/bandwidth when failure risk exceeds 75%
   */
  public qosOnDemand(deviceId: string, priority: 'critical' | 'normal' = 'critical'): {
    reserved: boolean;
    bandwidth_mbps: number;
    latency_sla_ms: number;
    duration_seconds: number;
    sessionId: string;
    apiCall: APICall;
  } {
    const bandwidth = priority === 'critical' ? 10 : 5;
    const latencySla = priority === 'critical' ? 50 : 100;
    const duration = 300;
    const sessionId = `qos-ses-${Math.random().toString(36).substring(2, 9)}`;
    const executionTime = +(28 + Math.random() * 45).toFixed(1);

    const requestPayload = {
      device: { networkAccessIdentifier: `${deviceId}@industrial.5g.nokia.net` },
      qosProfile: priority === 'critical' ? 'QOS_E_URLLC_PREVENTIVE' : 'QOS_DEFAULT',
      sink: `https://orchestrator.phufour.mena/api/v1/qos-events/${sessionId}`,
      duration: duration,
      reason: 'AUTOMATED_CRITICAL_EQUIPMENT_PREVENTIVE_MAINTENANCE'
    };

    const responsePayload = {
      sessionId: sessionId,
      reserved: true,
      qosStatus: 'ACTIVE',
      bandwidth_mbps: bandwidth,
      latency_sla_ms: latencySla,
      duration_seconds: duration,
      guaranteedBitrate: `${bandwidth}Mbps`,
      networkSlice: 'NSSAI-INDUSTRIAL-CRITICAL'
    };

    const call: APICall = {
      id: `call_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      api_name: 'QoSonDemand',
      device_id: deviceId,
      timestamp: new Date().toISOString(),
      endpoint: 'POST https://nokia.networkascode.com/camara/qod/v0/sessions',
      request: requestPayload,
      response: responsePayload,
      execution_time_ms: executionTime,
      status: 201
    };

    this.logCall(call);

    return {
      reserved: true,
      bandwidth_mbps: bandwidth,
      latency_sla_ms: latencySla,
      duration_seconds: duration,
      sessionId: sessionId,
      apiCall: call
    };
  }
}
