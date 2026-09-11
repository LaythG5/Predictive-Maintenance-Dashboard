import React from 'react';
import { Play, Radio, ShieldCheck, Zap, Activity, Info, ChevronRight, Gauge } from 'lucide-react';

interface FleetHealthSummaryProps {
  onSelectScenario: (scenario: 'port_said' | 'ghawar' | 'ras_tanura') => void;
  criticalCount: number;
  totalDevices: number;
  activeQoSSlices: number;
}

export const FleetHealthSummary: React.FC<FleetHealthSummaryProps> = ({
  onSelectScenario,
  criticalCount,
  totalDevices,
  activeQoSSlices,
}) => {
  return (
    <div id="fleet-health-summary-panel" className="bg-[#20242c] border border-slate-700/80 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#608738] via-[#7aa948] to-[#98cc65] px-4 py-3 border-b border-[#527430] flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-white" />
          <h3 className="font-bold text-sm text-white">
            Network-as-Code &amp; Operational Scenarios
          </h3>
        </div>
        <span className="text-[11px] font-mono bg-[#486b29] text-white border border-[#b8e886]/40 px-2 py-0.5 rounded font-bold">
          CAMARA Open Gateway
        </span>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {/* Scenario Quick-Launchers */}
        <div>
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold mb-2">
            Quick-Trigger Hackathon Evaluation Scenarios
          </div>
          <div className="space-y-2">
            {/* Scenario 1 */}
            <div
              onClick={() => onSelectScenario('port_said')}
              className="group p-2.5 rounded-lg border border-slate-700/80 bg-[#181a1f] hover:bg-[#252a35] hover:border-[#98cc65]/60 cursor-pointer transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#2a2f3a] text-[#aee37d] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 group-hover:bg-[#98cc65] group-hover:text-[#12160e] transition-colors border border-slate-600 group-hover:border-[#86bb54]">
                  1
                </div>
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-[#aee37d]">
                    Port Said Quay Crane #04
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    92% cell congestion + motor winding overheat &rarr; Auto QoS slice
                  </div>
                </div>
              </div>
              <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#98cc65] shrink-0 fill-current" />
            </div>

            {/* Scenario 2 */}
            <div
              onClick={() => onSelectScenario('ghawar')}
              className="group p-2.5 rounded-lg border border-slate-700/80 bg-[#181a1f] hover:bg-[#252a35] hover:border-[#98cc65]/60 cursor-pointer transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#2a2f3a] text-[#aee37d] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 group-hover:bg-[#98cc65] group-hover:text-[#12160e] transition-colors border border-slate-600 group-hover:border-[#86bb54]">
                  2
                </div>
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-[#aee37d]">
                    Ghawar Crude Extraction Pump #12
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Sand ingress bearing spike (7.2 mm/s) &rarr; 55% load throttle
                  </div>
                </div>
              </div>
              <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#98cc65] shrink-0 fill-current" />
            </div>

            {/* Scenario 3 */}
            <div
              onClick={() => onSelectScenario('ras_tanura')}
              className="group p-2.5 rounded-lg border border-slate-700/80 bg-[#181a1f] hover:bg-[#252a35] hover:border-[#98cc65]/60 cursor-pointer transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#2a2f3a] text-[#aee37d] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 group-hover:bg-[#98cc65] group-hover:text-[#12160e] transition-colors border border-slate-600 group-hover:border-[#86bb54]">
                  3
                </div>
                <div>
                  <div className="font-bold text-white text-xs group-hover:text-[#aee37d]">
                    Ras Tanura Distillation Pump #07
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Rapid battery drain (4.8%/h) &amp; core temp (69.8°C) &rarr; Field dispatch
                  </div>
                </div>
              </div>
              <Play className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#98cc65] shrink-0 fill-current" />
            </div>
          </div>
        </div>

        {/* CAMARA API Gateway Status */}
        <div className="pt-2 border-t border-slate-700/80">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold mb-2 flex items-center justify-between">
            <span>CAMARA API Gateway Status</span>
            <span className="text-[#aee37d] font-bold flex items-center gap-1 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#98cc65] animate-pulse" />
              Connected (Nokia NaC)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-[#181a1f] p-2 rounded-lg border border-slate-700/80">
              <div className="font-bold text-white">Device Status v0.3</div>
              <div className="text-[10px] text-slate-400 font-mono">60s poll • 50 nodes</div>
            </div>

            <div className="bg-[#181a1f] p-2 rounded-lg border border-slate-700/80">
              <div className="font-bold text-white">Congestion Insights v0.2</div>
              <div className="text-[10px] text-slate-400 font-mono">2h horizon trend</div>
            </div>

            <div className="bg-[#181a1f] p-2 rounded-lg border border-slate-700/80">
              <div className="font-bold text-white">Location Retrieval v0.2</div>
              <div className="text-[10px] text-slate-400 font-mono">Boundary geofence</div>
            </div>

            <div className="bg-[#181a1f] p-2 rounded-lg border border-[#98cc65]/50">
              <div className="font-bold text-[#aee37d]">QoS on Demand v0.4</div>
              <div className="text-[10px] font-mono text-[#aee37d] font-medium">
                {activeQoSSlices > 0 ? `${activeQoSSlices} Active URLLC Slice` : 'Ready on risk > 75%'}
              </div>
            </div>
          </div>
        </div>

        {/* ISO 10816 Mechanical Standard Reference */}
        <div className="p-2.5 rounded-lg bg-[#181a1f] border border-slate-700/80 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#98cc65] shrink-0" />
            <div>
              <span className="font-bold text-white">ISO 10816 Standard: </span>
              <span className="text-slate-300">Normal &lt;2.8 mm/s | Warning 2.8–4.5 | Alert &gt;4.5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
