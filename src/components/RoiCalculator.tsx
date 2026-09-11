import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { IndustrialSector } from '../types';

export const RoiCalculator: React.FC = () => {
  const [deviceCount, setDeviceCount] = useState<number>(50);
  const [sector, setSector] = useState<IndustrialSector>('oil_gas');
  const [downtimeHoursPerYear, setDowntimeHoursPerYear] = useState<number>(48);

  // Sector-specific average hourly downtime impact:
  // Oil & Gas: ~$22,000/hr
  // Logistics & Ports: ~$14,000/hr
  // Manufacturing: ~$8,500/hr
  const hourlyCostMap: Record<IndustrialSector, number> = {
    oil_gas: 22000,
    logistics: 14000,
    manufacturing: 8500,
  };

  const hourlyCost = hourlyCostMap[sector];
  const annualMonitoringCost = deviceCount * 120 * 12; // $120/device/month
  const baselineDowntimeCost = downtimeHoursPerYear * hourlyCost;
  const avoidedHours = Math.round(downtimeHoursPerYear * 0.30); // 30% realistic reduction
  const downtimeSavedUsd = avoidedHours * hourlyCost;
  const netAnnualSavings = Math.max(0, downtimeSavedUsd - annualMonitoringCost);
  const benefitRatio = (downtimeSavedUsd / Math.max(1, annualMonitoringCost)).toFixed(1);
  const breakevenMonths = Math.min(12, (annualMonitoringCost / Math.max(1, downtimeSavedUsd / 12))).toFixed(1);

  return (
    <div id="enterprise-roi-calculator" className="bg-[#20242c] border border-slate-700/80 rounded-xl p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-700/80">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#98cc65]" />
            <h3 className="font-bold text-sm text-white">
              Operational Impact and Maintenance Economics Model
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Calculated using standard industrial predictive maintenance benchmarks (30% reduction in unplanned downtime)
          </p>
        </div>

        <div className="text-[11px] font-mono bg-[#181a1f] text-slate-300 border border-slate-700 px-2.5 py-1 rounded">
          Baseline Platform Rate: $120 / node / month
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4 text-xs">
          {/* Sector Selector */}
          <div>
            <label className="text-slate-300 font-medium block mb-1">Industrial Sector</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['oil_gas', 'logistics', 'manufacturing'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={`py-1.5 px-2 rounded font-medium text-[11px] transition-all capitalize ${
                    sector === s
                      ? 'bg-[#98cc65] text-[#12160e] font-bold shadow-xs'
                      : 'bg-[#181a1f] text-slate-300 border border-slate-700 hover:bg-[#252a35]'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block font-mono">
              Sector Downtime Baseline: ${hourlyCost.toLocaleString()} / hour
            </span>
          </div>

          {/* Number of Connected Nodes */}
          <div>
            <div className="flex justify-between items-center text-slate-300 mb-1">
              <span className="font-medium">Connected Equipment Fleet</span>
              <span className="font-mono font-bold text-white">{deviceCount} units</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={deviceCount}
              onChange={e => setDeviceCount(Number(e.target.value))}
              className="w-full accent-[#98cc65]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10 units</span>
              <span>250 units</span>
              <span>500 units</span>
            </div>
          </div>

          {/* Downtime Hours */}
          <div>
            <div className="flex justify-between items-center text-slate-300 mb-1">
              <span className="font-medium">Historical Unplanned Downtime</span>
              <span className="font-mono font-bold text-[#aee37d]">{downtimeHoursPerYear} hours / year</span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              step="2"
              value={downtimeHoursPerYear}
              onChange={e => setDowntimeHoursPerYear(Number(e.target.value))}
              className="w-full accent-[#98cc65]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10h (Controlled)</span>
              <span>60h (Average)</span>
              <span>120h (High Incident)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Metrics (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-3">
          <div className="bg-[#181a1f] p-3.5 rounded-lg border border-slate-700/80 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-slate-400">AVOIDED DOWNTIME LOSS</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              ${(downtimeSavedUsd / 1000).toFixed(0)}k / yr
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              ~{avoidedHours} hours stoppage prevented
            </div>
          </div>

          <div className="bg-[#181a1f] p-3.5 rounded-lg border border-slate-700/80 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-slate-400">NET ANNUAL SAVINGS</div>
            <div className="text-2xl font-bold font-mono text-[#aee37d] mt-1">
              ${(netAnnualSavings / 1000).toFixed(0)}k / yr
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              After ${(annualMonitoringCost / 1000).toFixed(0)}k platform cost
            </div>
          </div>

          <div className="bg-[#181a1f] p-3.5 rounded-lg border border-slate-700/80 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-slate-400">BENEFIT-TO-COST RATIO</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {benefitRatio}x
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Avoided losses vs operating cost
            </div>
          </div>

          <div className="bg-[#181a1f] p-3.5 rounded-lg border border-slate-700/80 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-slate-400">ESTIMATED BREAKEVEN</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {breakevenMonths} Months
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Amortized across first operational year
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
