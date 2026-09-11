import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export const SilentFailureComparison: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<'traditional' | 'camara'>('camara');

  return (
    <div id="silent-failure-proof" className="bg-[#20242c] border border-slate-700/80 rounded-xl p-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-700/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 bg-[#181a1f] border border-slate-700 px-2 py-0.5 rounded">
              Technical Architecture
            </span>
            <h3 className="font-bold text-sm text-white">
              The Silent Failure Problem: Network Health as a First-Class Predictor
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comparing traditional isolated IoT telemetry against integrated CAMARA network status orchestration
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex bg-[#181a1f] p-1 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setSelectedScenario('traditional')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              selectedScenario === 'traditional'
                ? 'bg-[#2a2f3a] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Traditional (Isolated IoT)
          </button>
          <button
            onClick={() => setSelectedScenario('camara')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              selectedScenario === 'camara'
                ? 'bg-[#98cc65] text-[#12160e] shadow-xs font-bold'
                : 'text-slate-400 hover:text-white'
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
              ? 'bg-[#181a1f] border-slate-600 ring-1 ring-slate-600'
              : 'bg-[#181a1f]/60 border-slate-800 opacity-75'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 font-bold text-slate-200 text-xs">
              <ShieldAlert className="w-4 h-4 text-slate-400" />
              Traditional Run-to-Failure Model
            </span>
            <span className="text-[10px] font-mono text-slate-300 bg-[#242831] px-2 py-0.5 rounded border border-slate-700">
              High Downtime Risk
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2 bg-[#20242c] p-2.5 rounded border border-slate-700/80 shadow-xs">
              <span className="w-4 h-4 rounded bg-[#2a2f3a] text-slate-400 flex items-center justify-center text-[10px] mt-0.5 font-bold">X</span>
              <div>
                <strong className="text-white">Cell Congestion Blindspot:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Cellular tower experiences congestion in remote industrial zones. Critical telemetry packets are silently dropped.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-[#20242c] p-2.5 rounded border border-slate-700/80 shadow-xs">
              <span className="w-4 h-4 rounded bg-[#2a2f3a] text-slate-400 flex items-center justify-center text-[10px] mt-0.5 font-bold">X</span>
              <div>
                <strong className="text-white">False Idle Assumption:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Device goes offline silently. Supervisory control systems assume equipment is idle rather than failing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-[#20242c] p-2.5 rounded border border-slate-700/80 shadow-xs">
              <span className="w-4 h-4 rounded bg-[#2a2f3a] text-slate-400 flex items-center justify-center text-[10px] mt-0.5 font-bold">X</span>
              <div>
                <strong className="text-white">Unplanned Emergency Stoppage:</strong>
                <p className="text-slate-300 text-[11px] mt-0.5 font-mono">
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
              ? 'bg-[#181a1f] border-[#98cc65]/70 ring-1 ring-[#98cc65]/50'
              : 'bg-[#181a1f]/60 border-slate-800 opacity-75'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 font-bold text-white text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#98cc65]" />
              Integrated CAMARA Network Orchestration
            </span>
            <span className="text-[10px] font-mono text-[#12160e] bg-[#98cc65] px-2 py-0.5 rounded border border-[#86bb54] font-bold">
              Autonomous Resolution
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2 bg-[#20242c] p-2.5 rounded border border-slate-700/80 shadow-xs">
              <span className="w-4 h-4 rounded bg-[#98cc65] text-[#12160e] flex items-center justify-center text-[10px] mt-0.5 font-bold">✓</span>
              <div>
                <strong className="text-white">Congestion and Coverage Foresight:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  CAMARA Congestion Insights and Location Retrieval track PRB utilization and RF cell quality before transmission errors occur.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-[#20242c] p-2.5 rounded border border-slate-700/80 shadow-xs">
              <span className="w-4 h-4 rounded bg-[#98cc65] text-[#12160e] flex items-center justify-center text-[10px] mt-0.5 font-bold">✓</span>
              <div>
                <strong className="text-white">Dedicated QoS on Demand Slice:</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  When degradation probability exceeds 75%, QoS API dynamically provisions guaranteed 10Mbps 50ms latency for diagnostic stream.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-[#20242c] p-2.5 rounded border border-slate-700/80 shadow-xs">
              <span className="w-4 h-4 rounded bg-[#98cc65] text-[#12160e] flex items-center justify-center text-[10px] mt-0.5 font-bold">✓</span>
              <div>
                <strong className="text-white">Proactive 48-72h Mitigation:</strong>
                <p className="text-slate-300 text-[11px] mt-0.5 font-mono">
                  Automated load throttling (-45% mechanical stress) and direct work order dispatch to local maintenance teams.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="mt-4 pt-3 border-t border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-[#181a1f] p-2 rounded border border-slate-700/80">
          <div className="text-slate-400 text-[10px] font-mono">UNPLANNED DOWNTIME</div>
          <div className="text-white font-bold font-mono text-sm mt-0.5">25% - 35% Lower</div>
        </div>
        <div className="bg-[#181a1f] p-2 rounded border border-slate-700/80">
          <div className="text-slate-400 text-[10px] font-mono">MAINTENANCE COSTS</div>
          <div className="text-white font-bold font-mono text-sm mt-0.5">15% - 20% Reduction</div>
        </div>
        <div className="bg-[#181a1f] p-2 rounded border border-slate-700/80">
          <div className="text-slate-400 text-[10px] font-mono">EQUIPMENT LIFESPAN</div>
          <div className="text-white font-bold font-mono text-sm mt-0.5">+10% - 20% Extension</div>
        </div>
        <div className="bg-[#181a1f] p-2 rounded border border-slate-700/80">
          <div className="text-slate-400 text-[10px] font-mono">DETECTION HORIZON</div>
          <div className="text-[#aee37d] font-bold font-mono text-sm mt-0.5">48 - 72 Hours Ahead</div>
        </div>
      </div>
    </div>
  );
};
