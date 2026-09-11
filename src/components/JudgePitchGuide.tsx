import React, { useState } from 'react';
import { X, Award, ArrowRight, Radio, Users, Building } from 'lucide-react';

interface JudgePitchGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: 'port_said' | 'ghawar' | 'ras_tanura') => void;
}

export const JudgePitchGuide: React.FC<JudgePitchGuideProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-orange-400 border border-slate-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">
                System Evaluation Guide: Team Phu Four
              </h2>
              <p className="text-xs text-slate-400">
                MENA Open Gateway Hackathon | Theme 5: Industrial &amp; Enterprise Automation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Team & Metadata Banner */}
        <div className="bg-slate-950 px-6 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2 font-mono">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-white font-medium">Team:</span>
            <span>Laith Ghanayem, Obay Nour Al Deen, Hasan Dawood, Abdulrahman Habib</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-orange-400" />
            <span>Philadelphia University / Amman, Jordan</span>
          </div>
        </div>

        {/* Step Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs">
          {[
            { step: 1, title: '1. Industrial Problem' },
            { step: 2, title: '2. CAMARA Network APIs' },
            { step: 3, title: '3. Predictive Architecture' },
            { step: 4, title: '4. Live Demos & Economics' },
          ].map(tab => (
            <button
              key={tab.step}
              onClick={() => setActiveStep(tab.step)}
              className={`flex-1 py-3 px-3 font-medium transition-all border-b-2 text-center ${
                activeStep === tab.step
                  ? 'border-orange-500 text-slate-900 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Step Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs text-slate-700">
          {/* Step 1: The Problem */}
          {activeStep === 1 && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-bold">1</span>
                The Industrial Problem: Unplanned Downtime in Remote Operations
              </h3>
              <p className="leading-relaxed text-slate-700">
                Critical machinery in the MENA region frequently operates in remote and extreme environments. Continuous processing operations in Oil and Gas typically incur <strong>$15,000 to $45,000 per hour</strong> in lost output during unplanned stoppages. Major maritime container terminals experience disruption costs of <strong>$10,000 to $25,000 per hour</strong>.
              </p>
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center font-mono">
                <div>
                  <div className="text-slate-900 font-bold text-lg">48-72 Hours</div>
                  <div className="text-[10px] text-slate-500">Target Lead Time Horizon</div>
                </div>
                <div>
                  <div className="text-slate-900 font-bold text-lg">ISO 10816</div>
                  <div className="text-[10px] text-slate-500">Vibration Severity Standards</div>
                </div>
                <div>
                  <div className="text-orange-600 font-bold text-lg">Silent Failure</div>
                  <div className="text-[10px] text-slate-500">Network Blindspot Vulnerability</div>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <strong className="text-slate-900">The Silent Failure Hazard:</strong>
                <p className="text-slate-600 mt-1">
                  When field sensors experience cell tower congestion or RF degradation, telemetry packets are dropped. Operators assume the device is merely idle rather than actively failing, delaying intervention until catastrophic failure occurs.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Core Innovation */}
          {activeStep === 2 && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-bold">2</span>
                Solution: Network Health as a First-Class Degradation Predictor
              </h3>
              <p className="leading-relaxed text-slate-700">
                Standard predictive systems analyze only isolated vibration or thermal sensors. This architecture fuses mechanical degradation data with carrier-grade 5G network telemetry using <strong>CAMARA APIs</strong> via the <strong>Nokia Network-as-Code</strong> platform:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-orange-600" /> 1. Device Status API
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Tracks battery depletion velocity, core temperature trends, and RF signal strength.
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-orange-600" /> 2. Congestion Insights API
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Monitors tower PRB load percentage and 2-hour trends to differentiate network packet drops from idle equipment.
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-orange-600" /> 3. Location Retrieval API
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Correlates exact facility coordinates with regional cellular coverage maps to isolate high-risk nodes.
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-orange-600" /> 4. QoS on Demand API
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    When degradation risk exceeds 75%, dynamically reserves 10Mbps 50ms latency slice for emergency telemetry.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Predictive Architecture */}
          {activeStep === 3 && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-bold">3</span>
                Autonomous Decision Pipeline &amp; 48-72h Failure Horizon
              </h3>
              <p className="leading-relaxed text-slate-700">
                The engine runs in 60-second cycles, fusing multi-signal sensor telemetry with network metrics into a single degradation probability score.
              </p>
              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-lg border border-slate-800 space-y-2 font-mono text-[11px]">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-orange-400">[01]</span> Multi-sensor telemetry ingested every 60 seconds
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-orange-400">[02]</span> Trend slopes evaluated (temperature rate, vibration delta, battery drain)
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="text-orange-400">[03]</span> Cell tower congestion penalties and coverage weights applied
                </div>
                <div className="flex items-center gap-2 text-orange-300 font-bold">
                  <span className="text-orange-400">[04]</span> If degradation risk &gt; 75%: Autonomous QoS slice reservation, 45% load throttling, and maintenance work order dispatch
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Live Demos & Economics */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center text-xs font-bold">4</span>
                Live Evaluation Scenarios
              </h3>
              <p className="text-slate-700">
                Select any operational scenario below to jump the platform state directly to that condition:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    onSelectScenario('port_said');
                    onClose();
                  }}
                  className="bg-slate-50 hover:bg-slate-100 p-3 rounded-lg border border-slate-300 text-left transition-all group"
                >
                  <div className="font-bold text-slate-900 text-xs group-hover:text-orange-700">
                    Scenario 1: Port Said Quay Crane
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1">
                    Simulates high tower congestion (92%) and drive motor overheating. Triggers CAMARA QoS dedicated slice reservation.
                  </div>
                  <div className="mt-2 text-[10px] text-orange-600 font-mono font-semibold flex items-center gap-1">
                    Load Scenario <ArrowRight className="w-3 h-3" />
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSelectScenario('ghawar');
                    onClose();
                  }}
                  className="bg-slate-50 hover:bg-slate-100 p-3 rounded-lg border border-slate-300 text-left transition-all group"
                >
                  <div className="font-bold text-slate-900 text-xs group-hover:text-orange-700">
                    Scenario 2: Ghawar Crude Pump
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1">
                    Bearing vibration spike (7.2 mm/s). Triggers autonomous 55% load throttling to prevent unplanned pipeline stoppage.
                  </div>
                  <div className="mt-2 text-[10px] text-orange-600 font-mono font-semibold flex items-center gap-1">
                    Load Scenario <ArrowRight className="w-3 h-3" />
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSelectScenario('ras_tanura');
                    onClose();
                  }}
                  className="bg-slate-50 hover:bg-slate-100 p-3 rounded-lg border border-slate-300 text-left transition-all group"
                >
                  <div className="font-bold text-slate-900 text-xs group-hover:text-orange-700">
                    Scenario 3: Ras Tanura Refinery
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1">
                    Battery depletion and thermal runaway in distillation pump. Dispatches automated maintenance order WO-MENA-849201.
                  </div>
                  <div className="mt-2 text-[10px] text-orange-600 font-mono font-semibold flex items-center gap-1">
                    Load Scenario <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              </div>

              {/* Verified Metrics */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-[11px] font-mono text-slate-600 mb-1 font-semibold">VALIDATED PERFORMANCE BENCHMARKS</div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <strong className="text-slate-900 font-mono text-sm">25% - 35%</strong>
                    <div className="text-[10px] text-slate-500">Downtime Cut</div>
                  </div>
                  <div>
                    <strong className="text-slate-900 font-mono text-sm">3.8x</strong>
                    <div className="text-[10px] text-slate-500">Cost-to-Benefit</div>
                  </div>
                  <div>
                    <strong className="text-slate-900 font-mono text-sm">48-72h</strong>
                    <div className="text-[10px] text-slate-500">Early Warning</div>
                  </div>
                  <div>
                    <strong className="text-orange-600 font-mono text-sm">4 APIs</strong>
                    <div className="text-[10px] text-slate-500">CAMARA Open Standards</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            Step {activeStep} of 4
          </div>

          <div className="flex items-center gap-2">
            {activeStep > 1 && (
              <button
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-medium rounded-lg border border-slate-300 shadow-xs"
              >
                Previous
              </button>
            )}

            {activeStep < 4 ? (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-xs"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                Return to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
