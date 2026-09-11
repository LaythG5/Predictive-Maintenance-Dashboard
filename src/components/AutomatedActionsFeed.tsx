import React from 'react';
import { AlertEvent } from '../types';
import { CheckCircle, Clock, Zap, Wrench, Radio, ExternalLink } from 'lucide-react';

interface AutomatedActionsFeedProps {
  alerts: AlertEvent[];
  onAcknowledge: (alertId: string) => void;
  onSelectDevice: (deviceId: string) => void;
}

export const AutomatedActionsFeed: React.FC<AutomatedActionsFeedProps> = ({
  alerts,
  onAcknowledge,
  onSelectDevice,
}) => {
  return (
    <div id="automated-actions-feed" className="bg-[#20242c] border border-slate-700/80 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
      <div className="bg-gradient-to-r from-[#608738] via-[#7aa948] to-[#98cc65] px-4 py-3 border-b border-[#527430] flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-white" />
          <h3 className="font-bold text-sm text-white">
            Automated Incident &amp; Dispatch Feed
          </h3>
        </div>
        <span className="text-[11px] font-mono bg-[#486b29] text-white border border-[#b8e886]/40 px-2 py-0.5 rounded font-bold">
          {alerts.filter(a => a.status === 'sent').length} Active Triggers
        </span>
      </div>

      <div className="p-4 max-h-[380px] overflow-y-auto space-y-3">
        {alerts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            <CheckCircle className="w-8 h-8 text-[#98cc65] mx-auto mb-2.5" />
            All 50 monitored nodes operating within nominal thresholds. No active interventions.
          </div>
        ) : (
          alerts.map(alert => (
            <div
              key={alert.id}
              className={`rounded-xl p-3.5 border transition-all ${
                alert.status === 'sent'
                  ? 'bg-[#181a1f] border-[#98cc65]/50 shadow-xs'
                  : 'bg-[#181a1f] border-slate-700 opacity-85'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#12160e] bg-[#98cc65] px-2 py-0.5 rounded border border-[#86bb54]">
                    {(alert.failure_probability * 100).toFixed(0)}% FAILURE RISK
                  </span>
                  <span
                    onClick={() => onSelectDevice(alert.device_id)}
                    className="font-bold text-white text-xs hover:text-[#aee37d] cursor-pointer flex items-center gap-1"
                  >
                    {alert.device_name}
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3 text-[#98cc65]" />
                  <span>Lead time: ~{alert.hours_until_failure}h</span>
                  <span>•</span>
                  <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Action Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] my-2.5">
                {/* 1. QoS Reserved */}
                <div className="bg-[#242831] px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 text-white shadow-xs">
                  <Radio className="w-3.5 h-3.5 text-[#98cc65] shrink-0" />
                  <span>CAMARA QoS: 10Mbps</span>
                </div>

                {/* 2. Load Shed */}
                <div className="bg-[#242831] px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 text-white shadow-xs">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Load: -45% Throttle</span>
                </div>

                {/* 3. Work Order */}
                <div className="bg-[#242831] px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 text-white shadow-xs">
                  <Wrench className="w-3.5 h-3.5 text-[#98cc65] shrink-0" />
                  <span>{alert.work_order_id}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1.5 text-xs border-t border-slate-700/80">
                <span className="text-[11px] text-slate-400">
                  Facility: <strong className="text-white">{alert.facility}</strong>
                </span>

                {alert.status === 'sent' ? (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="px-3 py-1 bg-[#98cc65] hover:bg-[#86bb54] text-[#12160e] rounded-lg text-xs font-bold transition-colors shadow-xs"
                  >
                    Acknowledge Dispatch
                  </button>
                ) : (
                  <span className="text-[#aee37d] text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-[#98cc65]" />
                    Field Crew Dispatched
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
