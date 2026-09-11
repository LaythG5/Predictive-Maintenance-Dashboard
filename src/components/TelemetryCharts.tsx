import React from 'react';
import { DeviceInfo, DeviceTelemetry, Prediction } from '../types';
import { Activity, Battery, Thermometer, Radio, Clock } from 'lucide-react';

interface TelemetryChartsProps {
  device: DeviceInfo;
  telemetryHistory: DeviceTelemetry[];
  prediction?: Prediction;
  onInjectFailure?: () => void;
  onReduceLoad?: () => void;
}

export const TelemetryCharts: React.FC<TelemetryChartsProps> = ({
  device,
  telemetryHistory,
  prediction,
  onInjectFailure,
  onReduceLoad,
}) => {
  const latestTelemetry = telemetryHistory[telemetryHistory.length - 1];

  // Helper to generate SVG polyline points
  const generateSvgPoints = (
    data: DeviceTelemetry[],
    key: keyof DeviceTelemetry,
    minVal: number,
    maxVal: number,
    width: number = 240,
    height: number = 60
  ) => {
    if (data.length < 2) return '';
    return data
      .map((d, index) => {
        const x = (index / (data.length - 1)) * width;
        const val = Number(d[key]);
        const clamped = Math.max(minVal, Math.min(maxVal, val));
        const y = height - ((clamped - minVal) / (maxVal - minVal)) * height;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const failureProb = prediction?.failure_probability || 0;
  const isHighRisk = failureProb > 0.75;
  const isModerateRisk = failureProb > 0.5 && failureProb <= 0.75;

  return (
    <div id="device-telemetry-detail" className="bg-[#20242c] border border-slate-700/80 rounded-xl p-5 shadow-xs space-y-4">
      {/* Device Header & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-700/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-base">{device.name}</h3>
            <span className="font-mono text-xs text-slate-300 bg-[#181a1f] border border-slate-700 px-2 py-0.5 rounded">
              {device.device_id}
            </span>
            {device.load_reduction_active && (
              <span className="text-[10px] font-mono text-[#12160e] bg-[#98cc65] border border-[#86bb54] px-2 py-0.5 rounded font-bold">
                Load Throttled: {device.load_percent}%
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {device.facility} | {device.country} | {device.sector.toUpperCase()}
          </p>
        </div>

        {/* Prediction Lead Time Pill */}
        <div className="flex items-center gap-2">
          {isHighRisk && (
            <div className="bg-[#181a1f] border border-[#98cc65]/50 px-3 py-1.5 rounded-lg text-right">
              <div className="text-[10px] font-mono text-[#98cc65] uppercase tracking-wide flex items-center gap-1 justify-end font-semibold">
                <Clock className="w-3 h-3 text-[#98cc65]" />
                Forecast Failure Horizon
              </div>
              <div className="text-sm font-bold font-mono text-white">
                ~{prediction?.predicted_failure_hours}h lead time
              </div>
            </div>
          )}

          {/* Action Simulation Controls */}
          {onInjectFailure && (
            <button
              onClick={onInjectFailure}
              className="px-2.5 py-1.5 rounded text-xs bg-[#2a2f3a] hover:bg-[#343b48] text-white border border-slate-600 font-medium transition-colors"
              title="Simulate bearing breakdown and thermal runaway"
            >
              Simulate Failure
            </button>
          )}

          {onReduceLoad && isHighRisk && !device.load_reduction_active && (
            <button
              onClick={onReduceLoad}
              className="px-2.5 py-1.5 rounded text-xs bg-[#98cc65] hover:bg-[#86bb54] text-[#12160e] font-bold transition-colors"
              title="Trigger autonomous load reduction"
            >
              Throttle Load (55%)
            </button>
          )}
        </div>
      </div>

      {/* Probability Gauge & Contributing Factors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 bg-[#181a1f] p-3.5 rounded-xl border border-slate-700/80">
        <div className="sm:col-span-5 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-slate-700/80 pb-2.5 sm:pb-0 sm:pr-3.5">
          <div className="text-xs text-slate-400 font-mono mb-1 font-medium">DEGRADATION PROBABILITY</div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold font-mono ${
                isHighRisk ? 'text-[#aee37d]' : isModerateRisk ? 'text-amber-400' : 'text-white'
              }`}
            >
              {(failureProb * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              (Confidence: {((prediction?.confidence || 0.85) * 100).toFixed(0)}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700/70 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isHighRisk ? 'bg-[#98cc65]' : isModerateRisk ? 'bg-amber-500' : 'bg-slate-500'
              }`}
              style={{ width: `${Math.min(100, failureProb * 100)}%` }}
            />
          </div>
        </div>

        {/* Contributing Factors */}
        <div className="sm:col-span-7 flex flex-col justify-center">
          <div className="text-[11px] font-mono text-slate-400 mb-1.5 uppercase font-medium">
            Top Model Contributing Factors
          </div>
          <div className="flex flex-wrap gap-1.5">
            {prediction?.contributing_factors.map((factor, i) => (
              <span
                key={i}
                className={`text-xs px-2 py-0.5 rounded border font-medium flex items-center gap-1 ${
                  factor.includes('Critical') || factor.includes('runaway') || factor.includes('vibration')
                    ? 'bg-[#98cc65]/20 text-[#aee37d] border-[#98cc65]/40'
                    : 'bg-[#242831] text-slate-200 border-slate-700 shadow-xs'
                }`}
              >
                <Activity className="w-2.5 h-2.5 text-[#98cc65]" />
                {factor}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-Signal Sparklines 2x2 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Card 1: Battery % */}
        <div className="bg-[#181a1f] p-3 rounded-lg border border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-300 flex items-center gap-1 font-medium">
              <Battery className="w-3.5 h-3.5 text-[#98cc65]" />
              Battery Level
            </span>
            <span className="font-mono font-bold text-white">
              {latestTelemetry ? `${latestTelemetry.battery_percent}%` : '--'}
            </span>
          </div>
          <div className="h-14 w-full pt-1">
            <svg viewBox="0 0 240 60" className="w-full h-full overflow-visible">
              <polyline
                fill="none"
                stroke="#98cc65"
                strokeWidth="2"
                points={generateSvgPoints(telemetryHistory, 'battery_percent', 0, 100)}
              />
            </svg>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1 flex justify-between">
            <span>Trend: {prediction?.trends.battery_trend}/h</span>
            <span>Floor: 20%</span>
          </div>
        </div>

        {/* Card 2: CPU Temp */}
        <div className="bg-[#181a1f] p-3 rounded-lg border border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-300 flex items-center gap-1 font-medium">
              <Thermometer className="w-3.5 h-3.5 text-[#98cc65]" />
              Core Temp (°C)
            </span>
            <span className="font-mono font-bold text-white">
              {latestTelemetry ? `${latestTelemetry.cpu_temp_celsius}°C` : '--'}
            </span>
          </div>
          <div className="h-14 w-full pt-1">
            <svg viewBox="0 0 240 60" className="w-full h-full overflow-visible">
              <polyline
                fill="none"
                stroke="#aee37d"
                strokeWidth="2"
                points={generateSvgPoints(telemetryHistory, 'cpu_temp_celsius', 30, 80)}
              />
            </svg>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1 flex justify-between">
            <span>Trend: +{prediction?.trends.temp_trend}°C/h</span>
            <span>Nominal Max: 65°C</span>
          </div>
        </div>

        {/* Card 3: Vibration (mm/s) */}
        <div className="bg-[#181a1f] p-3 rounded-lg border border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-300 flex items-center gap-1 font-medium">
              <Activity className="w-3.5 h-3.5 text-[#98cc65]" />
              Vibration Velocity
            </span>
            <span className="font-mono font-bold text-white">
              {latestTelemetry ? `${latestTelemetry.vibration_mms} mm/s` : '--'}
            </span>
          </div>
          <div className="h-14 w-full pt-1">
            <svg viewBox="0 0 240 60" className="w-full h-full overflow-visible">
              <polyline
                fill="none"
                stroke="#98cc65"
                strokeWidth="2"
                points={generateSvgPoints(telemetryHistory, 'vibration_mms', 0, 10)}
              />
            </svg>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1 flex justify-between">
            <span>ISO 10816 Limit: 4.5 mm/s</span>
            <span>Bearing Status</span>
          </div>
        </div>

        {/* Card 4: Signal & Network Latency */}
        <div className="bg-[#181a1f] p-3 rounded-lg border border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-300 flex items-center gap-1 font-medium">
              <Radio className="w-3.5 h-3.5 text-[#98cc65]" />
              RF Signal and Latency
            </span>
            <span className="font-mono font-bold text-white">
              {latestTelemetry ? `${latestTelemetry.signal_strength_dbm} dBm` : '--'}
            </span>
          </div>
          <div className="h-14 w-full pt-1">
            <svg viewBox="0 0 240 60" className="w-full h-full overflow-visible">
              <polyline
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                points={generateSvgPoints(telemetryHistory, 'signal_strength_dbm', -120, -30)}
              />
            </svg>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1 flex justify-between">
            <span>Latency: {latestTelemetry?.network_latency_ms}ms</span>
            <span>Cell: {prediction?.metrics.coverage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
