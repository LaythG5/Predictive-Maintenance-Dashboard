import React from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, Activity, Radio, ShieldAlert, Zap } from 'lucide-react';

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
  onInjectDemoFailure,
  speedMultiplier,
  onChangeSpeed,
}) => {
  return (
    <header className="bg-[#20242c] border-b border-slate-700/80 shadow-xs">
      {/* 1. Context Top Bar */}
      <div className="bg-gradient-to-r from-[#6b963e] via-[#82b54f] to-[#9ece68] px-4 sm:px-6 py-2.5 border-b border-[#5a8033] shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 font-mono text-white text-xs">
            <span className="font-bold tracking-wide">MENA OPEN GATEWAY HACKATHON</span>
            <span className="text-white/80 hidden sm:inline">•</span>
            <span className="text-white/95 hidden sm:inline">Theme 5: Industrial &amp; Enterprise Automation</span>
            <span className="text-white/80 hidden lg:inline">•</span>
            <span className="text-white hidden lg:inline">Team Phu Four (Philadelphia University)</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-white/90">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Autonomous Engine Active</span>
          </div>
        </div>
      </div>

      {/* 2. Main Branding & Primary Action Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          {/* Brand & Platform Identity */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#98cc65] flex items-center justify-center border border-[#86bb54] text-[#12160e] shadow-xs shrink-0 font-bold">
              <Radio className="w-6 h-6 text-[#12160e]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  CAMARA Predictive Maintenance
                </h1>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#98cc65]/20 text-[#aee37d] border border-[#98cc65]/40">
                  Nokia Network-as-Code
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Network-aware degradation forecasting for critical MENA industrial infrastructure
              </p>
            </div>
          </div>

          {/* Simulation & Execution Control Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Speed Selector */}
            <div className="flex items-center bg-[#181a1f] rounded-lg p-1 border border-slate-700 text-xs font-mono">
              <span className="text-[10px] text-slate-400 px-2 uppercase font-medium">Speed:</span>
              {[1, 2, 5].map(s => (
                <button
                  key={s}
                  onClick={() => onChangeSpeed(s)}
                  className={`px-2.5 py-1 rounded text-xs transition-all ${
                    speedMultiplier === s
                      ? 'bg-[#98cc65] text-[#12160e] font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white'
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
              className="px-3.5 py-2 bg-[#2a2f3a] hover:bg-[#343b48] disabled:opacity-50 text-white text-xs font-medium rounded-lg border border-slate-600 transition-colors flex items-center gap-2 shadow-xs"
              title="Advance autonomous cycle by 1 interval (60 seconds)"
            >
              <Activity className="w-4 h-4 text-[#98cc65]" />
              <span>Step 1 Cycle</span>
            </button>

            {/* Auto-Run Primary CTA */}
            <button
              onClick={onToggleRunning}
              className={`px-4 py-2 text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-2 ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-[#98cc65] hover:bg-[#88be57] text-[#12160e]'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause Engine</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Auto-Run Engine</span>
                </>
              )}
            </button>

            {/* Quick Failure Demo Injection */}
            <button
              onClick={onInjectDemoFailure}
              className="px-3.5 py-2 bg-[#2a2f3a] hover:bg-[#343b48] text-white border border-slate-600 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 shadow-xs"
              title="Inject simulated bearing degradation on Device #007"
            >
              <AlertTriangle className="w-4 h-4 text-[#98cc65]" />
              <span>Inject Demo Failure</span>
            </button>

            {/* Reset */}
            <button
              onClick={onReset}
              className="p-2 bg-[#2a2f3a] hover:bg-[#343b48] text-slate-300 hover:text-white border border-slate-600 rounded-lg transition-colors shadow-xs"
              title="Reset Simulation State"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. Executive KPI Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-4 pt-4 border-t border-slate-700/60">
          {/* Card 1: Cycles */}
          <div className="bg-[#181a1f] rounded-xl p-3 border border-slate-700/70 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Simulation Cycle
              </div>
              <div className="font-mono font-bold text-white text-base sm:text-lg mt-0.5">
                #{cycleCount}
              </div>
              <div className="text-[11px] text-slate-400">60s autonomous cadence</div>
            </div>
            <div className="p-2 rounded-lg bg-[#242831] border border-slate-700 text-[#98cc65] shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: API Calls */}
          <div className="bg-[#181a1f] rounded-xl p-3 border border-slate-700/70 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                CAMARA API Calls
              </div>
              <div className="font-mono font-bold text-white text-base sm:text-lg mt-0.5">
                {totalApiCalls.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400">Nokia Network-as-Code</div>
            </div>
            <div className="p-2 rounded-lg bg-[#242831] border border-slate-700 text-[#98cc65] shadow-xs">
              <Radio className="w-4 h-4 text-[#98cc65]" />
            </div>
          </div>

          {/* Card 3: High Risk Nodes */}
          <div className="bg-[#181a1f] rounded-xl p-3 border border-slate-700/70 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                High Risk Nodes
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className={`font-mono font-bold text-base sm:text-lg ${criticalCount > 0 ? 'text-[#a3e635]' : 'text-white'}`}>
                  {criticalCount}
                </span>
                <span className="text-xs text-slate-400 font-mono">/ {totalDevices} nodes</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {criticalCount > 0 ? 'Action required (Risk > 75%)' : 'All equipment nominal'}
              </div>
            </div>
            <div className={`p-2 rounded-lg bg-[#242831] border shadow-xs ${criticalCount > 0 ? 'border-[#98cc65]/50 text-[#a3e635]' : 'border-slate-700 text-slate-400'}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>

          {/* Card 4: Loss Avoided */}
          <div className="bg-[#181a1f] rounded-xl p-3 border border-slate-700/70 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Avoided Stoppage Loss
              </div>
              <div className="font-mono font-bold text-white text-base sm:text-lg mt-0.5">
                ${(downtimePreventedUsd / 1000).toFixed(0)}k
              </div>
              <div className="text-[11px] text-[#aee37d] font-medium">Cumulative savings</div>
            </div>
            <div className="p-2 rounded-lg bg-[#242831] border border-slate-700 text-[#98cc65] shadow-xs">
              <Zap className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
