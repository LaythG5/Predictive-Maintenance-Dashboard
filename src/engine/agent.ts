import {
  AlertEvent,
  APICall,
  DeviceInfo,
  DeviceTelemetry,
  OrchestrationCycleResult,
  Prediction,
} from '../types';
import { CAMARAAPIClient } from './camaraClient';
import { PredictionEngine } from './predictionEngine';
import { SyntheticDataGenerator } from './syntheticData';

export class PredictiveMaintenanceAgent {
  public dataGen: SyntheticDataGenerator;
  public apiClient: CAMARAAPIClient;
  public predictionEngine: PredictionEngine;
  public deviceHistory: Map<string, DeviceTelemetry[]>;
  public latestPredictions: Map<string, Prediction>;
  public alerts: AlertEvent[];
  public cycleCount: number;
  public totalApiCalls: number;
  public downtimePreventedUsd: number;

  constructor(numDevices: number = 50) {
    this.dataGen = new SyntheticDataGenerator(numDevices);
    this.apiClient = new CAMARAAPIClient(this.dataGen.devices);
    this.predictionEngine = new PredictionEngine();
    this.deviceHistory = new Map();
    this.latestPredictions = new Map();
    this.alerts = [];
    this.cycleCount = 0;
    this.totalApiCalls = 0;
    this.downtimePreventedUsd = 0;

    // Initialize history
    for (const dev of this.dataGen.devices) {
      this.deviceHistory.set(dev.device_id, []);
    }

    // Run initial seed cycles so history and predictions exist immediately
    this.seedInitialState();
  }

  private seedInitialState() {
    // Run 3 quick warmup cycles to establish baseline trends
    for (let i = 0; i < 3; i++) {
      this.runCycle(false);
    }
  }

  public getDevices(): DeviceInfo[] {
    return this.dataGen.devices;
  }

  public getDeviceById(id: string): DeviceInfo | undefined {
    return this.dataGen.devices.find(d => d.device_id === id);
  }

  public getDeviceHistory(id: string): DeviceTelemetry[] {
    return this.deviceHistory.get(id) || [];
  }

  public getRecentApiCalls(limit: number = 20): APICall[] {
    return this.apiClient.apiCalls.slice(0, limit);
  }

  public calculateTrend(deviceId: string, metric: keyof DeviceTelemetry, windowSize: number = 6): number {
    const history = this.deviceHistory.get(deviceId) || [];
    if (history.length < 2) return 0;

    const recent = history.slice(-windowSize);
    if (recent.length < 2) return 0;

    const first = Number(recent[0][metric]);
    const last = Number(recent[recent.length - 1][metric]);
    const slope = (last - first) / recent.length;

    return +slope.toFixed(3);
  }

  /**
   * Run 1 orchestration cycle across all 50 MENA devices
   * Orchestrates the 4 CAMARA APIs
   */
  public runCycle(recordAlerts: boolean = true): OrchestrationCycleResult {
    this.cycleCount++;
    const newApiCallsInThisCycle: APICall[] = [];
    const currentPredictions: Prediction[] = [];
    let highRiskCount = 0;

    for (const device of this.dataGen.devices) {
      const deviceId = device.device_id;

      // 1. Generate next telemetry sample
      const { telemetry, isFailing } = this.dataGen.getNextTelemetry(device);

      // Store in rolling history (keep up to 30 data points)
      const hist = this.deviceHistory.get(deviceId) || [];
      hist.push(telemetry);
      if (hist.length > 30) hist.shift();
      this.deviceHistory.set(deviceId, hist);

      // === CAMARA ORCHESTRATION PIPELINE ===
      // Step 1: Device Status API
      const statusRes = this.apiClient.deviceStatus(deviceId, telemetry);
      this.totalApiCalls++;
      newApiCallsInThisCycle.push(statusRes.apiCall);

      // Calculate slopes
      const batteryTrend = this.calculateTrend(deviceId, 'battery_percent');
      const tempTrend = this.calculateTrend(deviceId, 'cpu_temp_celsius');
      const vibrationTrend = this.calculateTrend(deviceId, 'vibration_mms');

      // Step 2: Congestion Insights API
      const congestionRes = this.apiClient.congestionInsights(deviceId, isFailing);
      this.totalApiCalls++;
      newApiCallsInThisCycle.push(congestionRes.apiCall);

      // Step 3: Location Retrieval API
      const locationRes = this.apiClient.locationRetrieval(deviceId);
      this.totalApiCalls++;
      newApiCallsInThisCycle.push(locationRes.apiCall);

      // Step 4: ML Prediction Engine (Sensor + CAMARA network intelligence fusion)
      const pred = this.predictionEngine.predictFailureProbability(
        telemetry,
        batteryTrend,
        tempTrend,
        vibrationTrend,
        congestionRes.tower_load_percent,
        locationRes.coverage_quality
      );

      let actionTaken: 'alert' | 'maintenance_book' | 'load_reduce' | 'none' = 'none';

      // Step 5: High-Risk Threshold Trigger (> 75% failure probability)
      if (pred.failureProbability > 0.75) {
        highRiskCount++;
        actionTaken = 'alert';

        // Reserve CAMARA QoS on Demand (Emergency guaranteed 10Mbps 50ms URLLC slice)
        const qosRes = this.apiClient.qosOnDemand(deviceId, 'critical');
        this.totalApiCalls++;
        newApiCallsInThisCycle.push(qosRes.apiCall);

        if (recordAlerts) {
          // Autonomous actions: Book maintenance & reduce load
          this.triggerAutomatedActions(device, pred.failureProbability, pred.predictedHoursUntilFailure);
        }
      }

      const predictionObj: Prediction = {
        device_id: deviceId,
        timestamp: telemetry.timestamp,
        failure_probability: pred.failureProbability,
        predicted_failure_hours: pred.predictedHoursUntilFailure,
        confidence: pred.confidence,
        contributing_factors: pred.contributingFactors,
        action_taken: actionTaken,
        trends: {
          battery_trend: batteryTrend,
          temp_trend: tempTrend,
          vibration_trend: vibrationTrend,
        },
        metrics: {
          battery: telemetry.battery_percent,
          temp: telemetry.cpu_temp_celsius,
          vibration: telemetry.vibration_mms,
          signal: telemetry.signal_strength_dbm,
          congestion: congestionRes.tower_load_percent,
          coverage: locationRes.coverage_quality,
        },
      };

      this.latestPredictions.set(deviceId, predictionObj);
      currentPredictions.push(predictionObj);
    }

    return {
      timestamp: new Date().toISOString(),
      cycle_number: this.cycleCount,
      devices_processed: this.dataGen.devices.length,
      predictions: currentPredictions,
      alerts: this.alerts,
      api_calls_made: this.totalApiCalls,
      new_api_calls: newApiCallsInThisCycle,
      high_risk_count: highRiskCount,
    };
  }

  private triggerAutomatedActions(device: DeviceInfo, failureProb: number, hoursUntilFailure: number) {
    // Avoid duplicate alert within short time
    const existingRecentAlert = this.alerts.find(
      a => a.device_id === device.device_id && a.status !== 'acknowledged'
    );

    if (!existingRecentAlert) {
      const workOrderId = `WO-MENA-${Math.floor(100000 + Math.random() * 900000)}`;

      // Execute autonomous load reduction to extend equipment lifespan
      this.dataGen.reduceLoad(device.device_id, 55);

      // Financial savings: $500,000 / 24h = ~$20,800/hr in oil & gas, $35,000/hr in ports
      const hourlyCost = device.sector === 'oil_gas' ? 35000 : (device.sector === 'logistics' ? 25000 : 15000);
      this.downtimePreventedUsd += hourlyCost * Math.min(24, hoursUntilFailure);

      const alert: AlertEvent = {
        id: `alert_${Date.now()}_${device.device_id}`,
        timestamp: new Date().toISOString(),
        device_id: device.device_id,
        device_name: device.name,
        facility: device.facility,
        sector: device.sector,
        failure_probability: failureProb,
        hours_until_failure: hoursUntilFailure,
        status: 'sent',
        qos_reserved: true,
        work_order_id: workOrderId,
        load_shed: true,
      };

      this.alerts.unshift(alert);
      if (this.alerts.length > 50) this.alerts.pop();
    }
  }

  public acknowledgeAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'acknowledged';
    }
  }

  public injectFailureDemo(deviceId: string, hours: number = 38) {
    this.dataGen.injectFailure(deviceId, hours);
    return this.runCycle(true);
  }

  public resetSimulation() {
    this.dataGen = new SyntheticDataGenerator(50);
    this.apiClient = new CAMARAAPIClient(this.dataGen.devices);
    this.deviceHistory.clear();
    this.latestPredictions.clear();
    this.alerts = [];
    this.cycleCount = 0;
    this.totalApiCalls = 0;
    this.downtimePreventedUsd = 0;

    for (const dev of this.dataGen.devices) {
      this.deviceHistory.set(dev.device_id, []);
    }
    this.seedInitialState();
  }
}
