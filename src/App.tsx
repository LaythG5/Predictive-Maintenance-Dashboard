import React, { useState, useEffect, useRef } from 'react';
import { PredictiveMaintenanceAgent } from './engine/agent';
import { DeviceInfo, Prediction, AlertEvent, APICall, IndustrialSector } from './types';
import { Header } from './components/Header';
import { MenaMap } from './components/MenaMap';
import { CamaraInspector } from './components/CamaraInspector';
import { TelemetryCharts } from './components/TelemetryCharts';
import { DeviceTable } from './components/DeviceTable';
import { AutomatedActionsFeed } from './components/AutomatedActionsFeed';
import { SilentFailureComparison } from './components/SilentFailureComparison';
import { RoiCalculator } from './components/RoiCalculator';
import { FleetHealthSummary } from './components/FleetHealthSummary';
import { LayoutDashboard, Network, Database, ShieldAlert, DollarSign, Radio } from 'lucide-react';

export default function App() {
  // Agent Instance
  const agentRef = useRef<PredictiveMaintenanceAgent | null>(null);
  if (!agentRef.current) {
    agentRef.current = new PredictiveMaintenanceAgent(50);
  }
  const agent = agentRef.current;

  // React States synced with Agent
  const [devices, setDevices] = useState<DeviceInfo[]>(agent.getDevices());
  const [predictions, setPredictions] = useState<Map<string, Prediction>>(new Map(agent.latestPredictions));
  const [alerts, setAlerts] = useState<AlertEvent[]>([...agent.alerts]);
  const [apiCalls, setApiCalls] = useState<APICall[]>(agent.getRecentApiCalls(50));
  const [cycleCount, setCycleCount] = useState<number>(agent.cycleCount);
  const [downtimePreventedUsd, setDowntimePreventedUsd] = useState<number>(agent.downtimePreventedUsd);

  // Selected device
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('device_003');

  // Simulation Controls
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orchestrator' | 'fleet' | 'silent_failure' | 'roi'>('dashboard');
  const [sectorFilter, setSectorFilter] = useState<'all' | IndustrialSector>('all');
  const [showCongestionOverlay, setShowCongestionOverlay] = useState<boolean>(true);

  // Synchronize state from agent
  const syncState = () => {
    setDevices([...agent.getDevices()]);
    setPredictions(new Map(agent.latestPredictions));
    setAlerts([...agent.alerts]);
    setApiCalls(agent.getRecentApiCalls(80));
    setCycleCount(agent.cycleCount);
    setDowntimePreventedUsd(agent.downtimePreventedUsd);
  };

  // Run 1 cycle
  const handleRunSingleCycle = () => {
    agent.runCycle(true);
    syncState();
  };

  // Toggle Auto-Run
  const handleToggleRunning = () => {
    setIsRunning(!isRunning);
  };

  // Auto-run loop
  useEffect(() => {
    if (!isRunning) return;

    // 1x = 2400ms, 2x = 1200ms, 5x = 500ms
    const intervalMs = Math.max(400, Math.floor(2400 / speedMultiplier));
    const timer = setInterval(() => {
      agent.runCycle(true);
      syncState();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isRunning, speedMultiplier]);

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    agent.resetSimulation();
    syncState();
    setSelectedDeviceId('device_003');
  };

  // Inject failure
  const handleInjectFailure = (deviceId?: string) => {
    const targetId = deviceId || selectedDeviceId || 'device_007';
    agent.injectFailureDemo(targetId, 36);
    setSelectedDeviceId(targetId);
    syncState();
  };

  // Reduce load
  const handleReduceLoad = (deviceId: string) => {
    agent.dataGen.reduceLoad(deviceId, 50);
    agent.runCycle(true);
    syncState();
  };

  // Acknowledge alert
  const handleAcknowledgeAlert = (alertId: string) => {
    agent.acknowledgeAlert(alertId);
    syncState();
  };

  // Handle Scenario from Judge Modal or Quick Trigger
  const handleSelectScenario = (scenario: 'port_said' | 'ghawar' | 'ras_tanura') => {
    let targetDevId = 'device_008';
    if (scenario === 'port_said') {
      const dev = devices.find(d => d.facility.includes('Port Said')) || devices[8];
      targetDevId = dev.device_id;
    } else if (scenario === 'ghawar') {
      const dev = devices.find(d => d.facility.includes('Ghawar')) || devices[0];
      targetDevId = dev.device_id;
    } else if (scenario === 'ras_tanura') {
      const dev = devices.find(d => d.facility.includes('Ras Tanura')) || devices[1];
      targetDevId = dev.device_id;
    }

    setSelectedDeviceId(targetDevId);
    handleInjectFailure(targetDevId);
    setActiveTab('dashboard');
  };

  const selectedDevice = devices.find(d => d.device_id === selectedDeviceId) || devices[0];
  const selectedTelemetryHistory = agent.getDeviceHistory(selectedDeviceId);
  const selectedPrediction = predictions.get(selectedDeviceId);

  const criticalDevicesCount = Array.from(predictions.values()).filter((p: Prediction) => p.failure_probability > 0.75).length;
  const activeQoSSlices = alerts.filter(a => a.action_taken?.toLowerCase().includes('qos')).length;

  return (
    <div className="min-h-screen bg-[#181a1f] text-white flex flex-col selection:bg-[#98cc65]/30 selection:text-white">
      {/* Top Header & Simulation Controls */}
      <Header
        cycleCount={cycleCount}
        totalDevices={devices.length}
        totalApiCalls={agent.totalApiCalls}
        criticalCount={criticalDevicesCount}
        downtimePreventedUsd={downtimePreventedUsd}
        isRunning={isRunning}
        onToggleRunning={handleToggleRunning}
        onRunSingleCycle={handleRunSingleCycle}
        onReset={handleReset}
        onInjectDemoFailure={() => handleInjectFailure('device_007')}
        speedMultiplier={speedMultiplier}
        onChangeSpeed={setSpeedMultiplier}
      />

      {/* Main Navigation Tabs */}
      <div className="bg-[#20242c] border-b border-slate-700/80 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 py-1.5">
          <nav className="flex space-x-2 text-xs overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-3.5 rounded-lg border font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-[#98cc65]/70 text-white font-bold bg-[#98cc65]/20'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#98cc65]" />
              <span>Operations Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orchestrator')}
              className={`py-2 px-3.5 rounded-lg border font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'orchestrator'
                  ? 'border-[#98cc65]/70 text-white font-bold bg-[#98cc65]/20'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Network className="w-4 h-4 text-[#98cc65]" />
              <span>CAMARA API Orchestration</span>
            </button>

            <button
              onClick={() => setActiveTab('fleet')}
              className={`py-2 px-3.5 rounded-lg border font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'fleet'
                  ? 'border-[#98cc65]/70 text-white font-bold bg-[#98cc65]/20'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Database className="w-4 h-4 text-[#98cc65]" />
              <span>Asset Inventory (50 Nodes)</span>
            </button>

            <button
              onClick={() => setActiveTab('silent_failure')}
              className={`py-2 px-3.5 rounded-lg border font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'silent_failure'
                  ? 'border-[#98cc65]/70 text-white font-bold bg-[#98cc65]/20'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-[#98cc65]" />
              <span>Network Dependency Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('roi')}
              className={`py-2 px-3.5 rounded-lg border font-medium flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'roi'
                  ? 'border-[#98cc65]/70 text-white font-bold bg-[#98cc65]/20'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <DollarSign className="w-4 h-4 text-[#98cc65]" />
              <span>Maintenance Economics</span>
            </button>
          </nav>

          {/* Map Layer quick toggles */}
          {activeTab === 'dashboard' && (
            <div className="flex items-center gap-3 text-xs text-slate-300 py-1.5">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showCongestionOverlay}
                  onChange={e => setShowCongestionOverlay(e.target.checked)}
                  className="rounded border-slate-600 bg-[#181a1f] text-[#98cc65] focus:ring-0 w-3.5 h-3.5"
                />
                <span className="text-xs font-medium text-slate-200">Cell Congestion Layer</span>
              </label>

              <select
                value={sectorFilter}
                onChange={e => setSectorFilter(e.target.value as any)}
                className="bg-[#181a1f] border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none shadow-2xs font-medium"
              >
                <option value="all">All Sectors</option>
                <option value="oil_gas">Oil &amp; Gas</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="logistics">Logistics &amp; Ports</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* TAB 1: OPERATIONS OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Grid: Interactive MENA Map + Selected Device Telemetry Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Map (7 cols) */}
              <div className="lg:col-span-7">
                <MenaMap
                  devices={devices}
                  predictions={predictions}
                  selectedDeviceId={selectedDeviceId}
                  onSelectDevice={id => setSelectedDeviceId(id)}
                  sectorFilter={sectorFilter}
                  showCongestionOverlay={showCongestionOverlay}
                />
              </div>

              {/* Selected Node Telemetry & Degradation Gauge (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <TelemetryCharts
                  device={selectedDevice}
                  telemetryHistory={selectedTelemetryHistory}
                  prediction={selectedPrediction}
                  onInjectFailure={() => handleInjectFailure(selectedDeviceId)}
                  onReduceLoad={() => handleReduceLoad(selectedDeviceId)}
                />
              </div>
            </div>

            {/* Bottom Row: Automated Actions Feed + Operational Health & Scenarios */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Automated Actions Feed (7 cols) */}
              <div className="lg:col-span-7">
                <AutomatedActionsFeed
                  alerts={alerts}
                  onAcknowledge={handleAcknowledgeAlert}
                  onSelectDevice={id => setSelectedDeviceId(id)}
                />
              </div>

              {/* Quick Scenarios & CAMARA Gateway Status (5 cols) */}
              <div className="lg:col-span-5">
                <FleetHealthSummary
                  onSelectScenario={handleSelectScenario}
                  criticalCount={criticalDevicesCount}
                  totalDevices={devices.length}
                  activeQoSSlices={activeQoSSlices}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAMARA API ORCHESTRATION */}
        {activeTab === 'orchestrator' && (
          <div className="space-y-6">
            <CamaraInspector
              apiCalls={apiCalls}
              currentCycle={cycleCount}
            />

            {/* Orchestration Technical Specifications Card */}
            <div className="bg-[#20242c] border border-slate-700/80 rounded-xl p-5 shadow-xs text-xs space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#98cc65]" />
                CAMARA Standardized Specification Mapping (Nokia Network-as-Code)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-[11px]">
                <div className="bg-[#181a1f] p-3.5 rounded-lg border border-slate-700/70">
                  <div className="font-bold text-white">Device Status v0.3</div>
                  <div className="text-slate-300 mt-1">POST /camara/device-status/v0/status</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">Captures battery %, core temp, RF RSSI</div>
                </div>
                <div className="bg-[#181a1f] p-3.5 rounded-lg border border-slate-700/70">
                  <div className="font-bold text-white">Congestion Insights v0.2</div>
                  <div className="text-slate-300 mt-1">POST /camara/congestion-insights/v0/query</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">Forecasts localized cell tower saturation</div>
                </div>
                <div className="bg-[#181a1f] p-3.5 rounded-lg border border-slate-700/70">
                  <div className="font-bold text-white">Location Retrieval v0.2</div>
                  <div className="text-slate-300 mt-1">POST /camara/location-retrieval/v0/retrieve</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">Verified GPS boundary and coverage audit</div>
                </div>
                <div className="bg-[#181a1f] p-3.5 rounded-lg border border-[#98cc65]/50">
                  <div className="font-bold text-[#aee37d]">QoS on Demand v0.4</div>
                  <div className="text-slate-300 mt-1">POST /camara/qod/v0/sessions</div>
                  <div className="text-[#aee37d] text-[10px] mt-0.5">10Mbps URLLC slice under high risk</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ASSET INVENTORY */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            <DeviceTable
              devices={devices}
              predictions={predictions}
              selectedDeviceId={selectedDeviceId}
              onSelectDevice={id => {
                setSelectedDeviceId(id);
                setActiveTab('dashboard');
              }}
              onInjectFailure={id => handleInjectFailure(id)}
            />
          </div>
        )}

        {/* TAB 4: NETWORK DEPENDENCY ARCHITECTURE */}
        {activeTab === 'silent_failure' && (
          <div className="space-y-6">
            <SilentFailureComparison />

            {/* Deep dive breakdown */}
            <div className="bg-[#20242c] border border-slate-700/80 rounded-xl p-5 shadow-xs text-xs space-y-3">
              <h4 className="font-bold text-white text-sm">
                Operational Reliability in Remote Regional Facilities
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                <div className="bg-[#181a1f] p-4 rounded-lg border border-slate-700">
                  <strong className="text-white text-xs block mb-1">
                    The Blindspot of Conventional Predictive Maintenance:
                  </strong>
                  <p className="text-slate-300">
                    If an IoT sensor disconnects due to cell tower saturation, traditional monitoring consoles register the device as idle or silent. Unmonitored degradation proceeds unchecked, leading to unplanned stoppages costing $15,000 to $45,000 per hour in continuous processing downtime.
                  </p>
                </div>
                <div className="bg-[#181a1f] p-4 rounded-lg border border-[#98cc65]/50">
                  <strong className="text-[#aee37d] text-xs block mb-1">
                    The CAMARA Orchestration Workflow:
                  </strong>
                  <p className="text-slate-200">
                    By monitoring cellular tower load and RF quality alongside mechanical telemetry, degradation models identify failure trajectories 48 to 72 hours in advance. The QoS on Demand API ensures reliable transmission of diagnostic data, automated load reduction lowers mechanical stress, and maintenance work orders are dispatched prior to failure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MAINTENANCE ECONOMICS */}
        {activeTab === 'roi' && (
          <div className="space-y-6">
            <RoiCalculator />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#20242c] border-t border-slate-700/80 py-4 text-center text-xs text-slate-300 font-mono mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2">
          <span>MENA Open Gateway Hackathon | Theme 5: Industrial &amp; Enterprise Automation | Team: Phu Four</span>
          <span className="text-[#aee37d]">Nokia Network-as-Code | CAMARA Alliance Standards</span>
        </div>
      </footer>
    </div>
  );
}
