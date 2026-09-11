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
    <div id="automated-actions-feed" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-orange-400" />
          <h3 className="font-semibold text-sm text-slate-100">
            Automated Incident &amp; Dispatch Feed
          </h3>
        </div>
        <span className="text-[11px] font-mono bg-orange-900/60 text-orange-300 border border-orange-700 px-2 py-0.5 rounded">
          {alerts.filter(a => a.status === 'sent').length} Active Triggers
        </span>
      </div>

      <div className="p-4 max-h-[380px] overflow-y-auto space-y-3">
        {alerts.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            <CheckCircle className="w-8 h-8 text-slate-400 mx-auto mb-2.5" />
            All 50 monitored nodes operating within nominal thresholds. No active interventions.
          </div>
        ) : (
          alerts.map(alert => (
            <div
              key={alert.id}
              className={`rounded-xl p-3.5 border transition-all ${
                alert.status === 'sent'
                  ? 'bg-orange-50/50 border-orange-200 shadow-xs'
                  : 'bg-slate-50 border-slate-200 opacity-80'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded border border-orange-300">
                    {(alert.failure_probability * 100).toFixed(0)}% FAILURE RISK
                  </span>
                  <span
                    onClick={() => onSelectDevice(alert.device_id)}
                    className="font-bold text-slate-900 text-xs hover:text-orange-600 cursor-pointer flex items-center gap-1"
                  >
                    {alert.device_name}
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Lead time: ~{alert.hours_until_failure}h</span>
                  <span>•</span>
                  <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Action Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] my-2.5">
                {/* 1. QoS Reserved */}
                <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 text-slate-800 shadow-xs">
                  <Radio className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>CAMARA QoS: 10Mbps</span>
                </div>

                {/* 2. Load Shed */}
                <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 text-slate-800 shadow-xs">
                  <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Load: -45% Throttle</span>
                </div>

                {/* 3. Work Order */}
                <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 text-slate-800 shadow-xs">
                  <Wrench className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                  <span>{alert.work_order_id}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1.5 text-xs border-t border-slate-100">
                <span className="text-[11px] text-slate-600">
                  Facility: <strong className="text-slate-900">{alert.facility}</strong>
                </span>

                {alert.status === 'sent' ? (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
                  >
                    Acknowledge Dispatch
                  </button>
                ) : (
                  <span className="text-emerald-700 text-xs font-medium flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
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
