import React from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, Activity, Radio, ChevronRight, Presentation, ShieldAlert, Zap } from 'lucide-react';

interface HeaderProps {
  cycleCount: number;
  totalDevices: number;
  totalApiCalls: number;
  criticalCount: number;
  downtimePreventedUsd: number;
  isRunning: boolean;
  onToggleRunning: () => void;
  onRunSingleCycle: () => void;
  onReset: () => void;
  onOpenPitchModal: () => void;
  onInjectDemoFailure: () => void;
  speedMultiplier: number;
  onChangeSpeed: (speed: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cycleCount,
  totalDevices,
  totalApiCalls,
  criticalCount,
  downtimePreventedUsd,
  isRunning,
  onToggleRunning,
  onRunSingleCycle,
  onReset,
  onOpenPitchModal,
  onInjectDemoFailure,
  speedMultiplier,
  onChangeSpeed,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Context Top Bar */}
      <div className="bg-slate-900 px-4 sm:px-6 py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 font-mono text-slate-300">
            <span className="font-bold text-orange-400 tracking-wide">MENA OPEN GATEWAY HACKATHON</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden sm:inline">Theme 5: Industrial &amp; Enterprise Automation</span>
            <span className="text-slate-600 hidden lg:inline">•</span>
            <span className="text-slate-400 hidden lg:inline">Team Phu Four (Philadelphia University)</span>
          </div>

          <button
            onClick={onOpenPitchModal}
            className="flex items-center gap-1.5 text-xs font-medium text-orange-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 px-3 py-1 rounded-md transition-all shadow-xs"
          >
            <Presentation className="w-3.5 h-3.5 text-orange-400" />
            <span>Evaluation Guide &amp; Demo Scenarios</span>
            <ChevronRight className="w-3 h-3 text-orange-400" />
          </button>
        </div>
      </div>

      {/* 2. Main Branding & Primary Action Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Brand & Platform Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 text-orange-500 shadow-xs shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  CAMARA Predictive Maintenance
                </h1>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                  Nokia Network-as-Code
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Network-aware degradation forecasting for critical MENA industrial infrastructure
              </p>
            </div>
          </div>

          {/* Simulation & Execution Control Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Speed Selector */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs font-mono">
              <span className="text-[10px] text-slate-400 px-1.5 uppercase font-medium">Speed:</span>
              {[1, 2, 5].map(s => (
                <button
                  key={s}
                  onClick={() => onChangeSpeed(s)}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    speedMultiplier === s
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Manual Step Cycle */}
            <button
              onClick={onRunSingleCycle}
              disabled={isRunning}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5 shadow-xs"
              title="Advance autonomous cycle by 1 interval (60 seconds)"
            >
              <Activity className="w-3.5 h-3.5 text-slate-500" />
              <span>Step 1 Cycle</span>
            </button>

            {/* Auto-Run Primary CTA */}
            <button
              onClick={onToggleRunning}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5 ${
                isRunning
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Engine</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Auto-Run Engine</span>
                </>
              )}
            </button>

            {/* Quick Failure Demo Injection */}
            <button
              onClick={onInjectDemoFailure}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
              title="Inject simulated bearing degradation on Device #007"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
              <span>Inject Demo Failure</span>
            </button>

            {/* Reset */}
            <button
              onClick={onReset}
              className="p-1.5 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 border border-slate-300 rounded-lg transition-colors shadow-xs"
              title="Reset Simulation State"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Spacious Executive KPI Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3.5 pt-3 border-t border-slate-100">
          {/* Card 1: Cycles */}
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Simulation Cycle
              </div>
              <div className="font-mono font-bold text-slate-900 text-base sm:text-lg mt-0.5">
                #{cycleCount}
              </div>
              <div className="text-[11px] text-slate-500">60s autonomous cadence</div>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: API Calls */}
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                CAMARA API Calls
              </div>
              <div className="font-mono font-bold text-slate-900 text-base sm:text-lg mt-0.5">
                {totalApiCalls.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500">Nokia Network-as-Code</div>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 shadow-xs">
              <Radio className="w-4 h-4 text-orange-600" />
            </div>
          </div>

          {/* Card 3: High Risk Nodes */}
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                High Risk Nodes
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className={`font-mono font-bold text-base sm:text-lg ${criticalCount > 0 ? 'text-orange-600' : 'text-slate-900'}`}>
                  {criticalCount}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ {totalDevices} nodes</span>
              </div>
              <div className="text-[11px] text-slate-500">
                {criticalCount > 0 ? 'Action required (Risk > 75%)' : 'All equipment nominal'}
              </div>
            </div>
            <div className={`p-2 rounded-lg bg-white border shadow-xs ${criticalCount > 0 ? 'border-orange-200 text-orange-600' : 'border-slate-200 text-slate-600'}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>

          {/* Card 4: Loss Avoided */}
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Avoided Stoppage Loss
              </div>
              <div className="font-mono font-bold text-slate-900 text-base sm:text-lg mt-0.5">
                ${(downtimePreventedUsd / 1000).toFixed(0)}k
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">Cumulative savings</div>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200 text-emerald-600 shadow-xs">
              <Zap className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
