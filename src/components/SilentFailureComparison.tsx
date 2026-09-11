import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export const SilentFailureComparison: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'traditional' | 'camara'>('camara');

  return (
    <div id="silent-failure-proof" className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">
              Technical Architecture
            </span>
            <h3 className="font-semibold text-sm text-slate-900">
              The Silent Failure Problem: Network Health as a First-Class Predictor
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comparing traditional isolated IoT telemetry against integrated CAMARA network status orchestration
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setSelectedScenario('traditional')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              selectedScenario === 'traditional'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Traditional (Isolated IoT)
          </button>
          <button
            onClick={() => setSelectedScenario('camara')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              selectedScenario === 'camara'
                ? 'bg-orange-500 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            With CAMARA Orchestration
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Box 1: Traditional Device-Only IoT */}
        <div
          className={`rounded-lg p-4 border transition-all ${
            selectedScenario === 'traditional'
              ? 'bg-slate-50 border-slate-400 ring-1 ring-slate-400'
              : 'bg-slate-50/50 border-slate-200 opacity-75'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800 text-xs">
              <ShieldAlert className="w-4 h-4 text-slate-600" />
              Traditional Run-to-Failure Model
            </span>
            <span className="text-[10px] font-mono text-slate-700 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
              High Downtime Risk
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2 bg-white p-2.5 rounded border border-slate-200 shadow-xs">
              <span className="w-4 h-4 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] mt-0.5 font-bold">X</span>
              <div>
                <strong className="text-slate-900">Cell Congestion Blindspot:</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Cellular tower experiences congestion in remote industrial zones. Critical telemetry packets are silently dropped.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-white p-2.5 rounded border border-slate-200 shadow-xs">
              <span className="w-4 h-4 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] mt-0.5 font-bold">X</span>
              <div>
                <strong className="text-slate-900">False Idle Assumption:</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Device goes offline silently. Supervisory control systems assume equipment is idle rather than failing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-white p-2.5 rounded border border-slate-200 shadow-xs">
              <span className="w-4 h-4 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] mt-0.5 font-bold">X</span>
              <div>
                <strong className="text-slate-900">Unplanned Emergency Stoppage:</strong>
                <p className="text-slate-600 text-[11px] mt-0.5 font-mono">
                  Operational cost: $12,000 to $45,000 per hour in production halt. Emergency repair teams mobilize reactively.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Box 2: CAMARA Orchestration */}
        <div
          className={`rounded-lg p-4 border transition-all ${
            selectedScenario === 'camara'
              ? 'bg-orange-50/20 border-orange-500 ring-1 ring-orange-500/50'
              : 'bg-slate-50/50 border-slate-200 opacity-75'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
              <CheckCircle2 className="w-4 h-4 text-orange-600" />
              Integrated CAMARA Network Orchestration
            </span>
            <span className="text-[10px] font-mono text-orange-800 bg-orange-100 px-2 py-0.5 rounded border border-orange-300 font-bold">
              Autonomous Resolution
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex items-start gap-2 bg-white p-2.5 rounded border border-slate-200 shadow-xs">
              <span className="w-4 h-4 rounded bg-orange-500 text-white flex items-center justify-center text-[10px] mt-0.5 font-bold">✓</span>
              <div>
                <strong className="text-slate-900">Congestion and Coverage Foresight:</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  CAMARA Congestion Insights and Location Retrieval track PRB utilization and RF cell quality before transmission errors occur.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-white p-2.5 rounded border border-slate-200 shadow-xs">
              <span className="w-4 h-4 rounded bg-orange-500 text-white flex items-center justify-center text-[10px] mt-0.5 font-bold">✓</span>
              <div>
                <strong className="text-slate-900">Dedicated QoS on Demand Slice:</strong>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  When degradation probability exceeds 75%, QoS API dynamically provisions guaranteed 10Mbps 50ms latency for diagnostic stream.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-white p-2.5 rounded border border-slate-200 shadow-xs">
              <span className="w-4 h-4 rounded bg-orange-500 text-white flex items-center justify-center text-[10px] mt-0.5 font-bold">✓</span>
              <div>
                <strong className="text-slate-900">Proactive 48-72h Mitigation:</strong>
                <p className="text-slate-700 text-[11px] mt-0.5 font-mono">
                  Automated load throttling (-45% mechanical stress) and direct work order dispatch to local maintenance teams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-slate-50 p-2 rounded border border-slate-200">
          <div className="text-slate-500 text-[10px] font-mono">UNPLANNED DOWNTIME</div>
          <div className="text-slate-900 font-bold font-mono text-sm mt-0.5">25% - 35% Lower</div>
        </div>
        <div className="bg-slate-50 p-2 rounded border border-slate-200">
          <div className="text-slate-500 text-[10px] font-mono">MAINTENANCE COSTS</div>
          <div className="text-slate-900 font-bold font-mono text-sm mt-0.5">15% - 20% Reduction</div>
        </div>
        <div className="bg-slate-50 p-2 rounded border border-slate-200">
          <div className="text-slate-500 text-[10px] font-mono">EQUIPMENT LIFESPAN</div>
          <div className="text-slate-900 font-bold font-mono text-sm mt-0.5">+10% - 20% Extension</div>
        </div>
        <div className="bg-slate-50 p-2 rounded border border-slate-200">
          <div className="text-slate-500 text-[10px] font-mono">DETECTION HORIZON</div>
          <div className="text-orange-600 font-bold font-mono text-sm mt-0.5">48 - 72 Hours Ahead</div>
        </div>
      </div>
    </div>
  );
};
