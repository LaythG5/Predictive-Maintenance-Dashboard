import React, { useState } from 'react';
import { APICall } from '../types';
import { Network, CheckCircle2, Clock, ArrowRight, Copy, Check, Filter } from 'lucide-react';

interface CamaraInspectorProps {
  apiCalls: APICall[];
  currentCycle: number;
}

export const CamaraInspector: React.FC<CamaraInspectorProps> = ({ apiCalls, currentCycle }) => {
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [filterApi, setFilterApi] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const selectedCall = apiCalls.find(c => c.id === selectedCallId) || apiCalls[0] || null;

  const filteredCalls = apiCalls.filter(c => {
    if (filterApi !== 'all' && c.api_name !== filterApi) return false;
    return true;
  });

  const getApiBadgeColor = (apiName: string) => {
    switch (apiName) {
      case 'DeviceStatus':
        return 'bg-[#242831] text-slate-200 border-slate-700';
      case 'CongestionInsights':
        return 'bg-[#242831] text-slate-200 border-slate-700';
      case 'LocationRetrieval':
        return 'bg-[#242831] text-slate-200 border-slate-700';
      case 'QoSonDemand':
        return 'bg-[#98cc65]/20 text-[#aee37d] border-[#98cc65]/50 font-bold';
      default:
        return 'bg-[#242831] text-slate-300 border-slate-700';
    }
  };

  const handleCopyPayload = () => {
    if (!selectedCall) return;
    navigator.clipboard.writeText(JSON.stringify(selectedCall, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="camara-api-orchestrator" className="bg-[#20242c] border border-slate-700/80 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Component Header */}
      <div className="bg-gradient-to-r from-[#608738] via-[#7aa948] to-[#98cc65] px-4 py-3 border-b border-[#527430] flex flex-wrap items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-white" />
          <h3 className="font-bold text-sm text-white">
            CAMARA API Orchestration Inspector
          </h3>
          <span className="text-[11px] font-mono bg-[#486b29] text-white border border-[#b8e886]/40 px-2 py-0.5 rounded font-bold">
            Nokia Network-as-Code
          </span>
        </div>

        {/* API Filter Buttons */}
        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-white mr-1" />
          {(['all', 'DeviceStatus', 'CongestionInsights', 'LocationRetrieval', 'QoSonDemand'] as const).map(api => (
            <button
              key={api}
              onClick={() => setFilterApi(api)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                filterApi === api
                  ? 'bg-white text-[#12160e] font-bold shadow-xs'
                  : 'bg-[#486b29]/80 text-white hover:bg-[#527430] border border-[#b8e886]/40'
              }`}
            >
              {api === 'all' ? 'All (4 APIs)' : api}
            </button>
          ))}
        </div>
      </div>

      {/* Orchestration Pipeline Sequence Flowchart */}
      <div className="bg-[#181a1f] p-3 border-b border-slate-700/80">
        <div className="text-[11px] font-mono text-slate-300 mb-2 flex items-center justify-between">
          <span className="font-semibold text-slate-200 uppercase">60-Second Autonomous Orchestration Cycle Pipeline</span>
          <span className="text-[#98cc65] font-bold">Current Cycle: #{currentCycle}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
          {/* Step 1 */}
          <div className="bg-[#242831] p-2 rounded border border-slate-700 shadow-xs flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#98cc65] text-[#12160e] flex items-center justify-center font-bold text-[10px]">1</span>
            <div>
              <div className="font-bold text-white text-[11px]">Device Status</div>
              <div className="text-[10px] text-slate-400">Battery, Temp, RF</div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#242831] p-2 rounded border border-slate-700 shadow-xs flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#98cc65] text-[#12160e] flex items-center justify-center font-bold text-[10px]">2</span>
            <div>
              <div className="font-bold text-white text-[11px]">Congestion Insights</div>
              <div className="text-[10px] text-slate-400">Tower load % and 2h trend</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#242831] p-2 rounded border border-slate-700 shadow-xs flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#98cc65] text-[#12160e] flex items-center justify-center font-bold text-[10px]">3</span>
            <div>
              <div className="font-bold text-white text-[11px]">Location Retrieval</div>
              <div className="text-[10px] text-slate-400">GPS and RF Quality</div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-[#242831] p-2 rounded border border-slate-700 shadow-xs flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#98cc65] text-[#12160e] flex items-center justify-center font-bold text-[10px]">4</span>
            <div>
              <div className="font-bold text-white text-[11px]">Degradation Model</div>
              <div className="text-[10px] text-slate-400">Multi-Signal Fusion</div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-[#242831] p-2 rounded border border-[#98cc65]/60 shadow-xs flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#aee37d] text-[#12160e] flex items-center justify-center font-bold text-[10px]">5</span>
            <div>
              <div className="font-bold text-[#aee37d] text-[11px]">QoS on Demand</div>
              <div className="text-[10px] text-slate-300 font-medium">Risk &gt; 75% Trigger</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Body: Calls Stream on Left, JSON Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[300px]">
        {/* Left Side: Live API Calls Stream (5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-700/80 max-h-[340px] overflow-y-auto divide-y divide-slate-800 font-mono text-xs bg-[#181a1f]">
          {filteredCalls.length === 0 ? (
            <div className="p-6 text-center text-slate-400 font-sans">
              No API calls matching current filter. Run a cycle to generate traffic.
            </div>
          ) : (
            filteredCalls.map(call => {
              const isSelected = selectedCall?.id === call.id;
              return (
                <div
                  key={call.id}
                  onClick={() => setSelectedCallId(call.id)}
                  className={`p-2.5 cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#252a35] text-white border-l-4 border-[#98cc65] font-medium'
                      : 'hover:bg-[#20242c] text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${getApiBadgeColor(call.api_name)}`}>
                      {call.api_name}
                    </span>
                    <span className="font-mono text-slate-300 text-[11px] truncate">
                      {call.device_id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#98cc65]" />
                      {call.execution_time_ms}ms
                    </span>
                    <span className="text-[#aee37d] text-[10px] font-bold">
                      {call.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Detailed JSON Payload Inspector (7 cols) */}
        <div className="lg:col-span-7 p-3 bg-[#181a1f]/80 flex flex-col justify-between max-h-[340px] overflow-y-auto">
          {selectedCall ? (
            <div className="space-y-3">
              {/* Endpoint banner */}
              <div className="flex items-center justify-between bg-[#20242c] p-2 rounded border border-slate-700/80 shadow-xs">
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">CAMARA REST Target</div>
                  <div className="font-mono text-xs text-white font-semibold truncate">
                    {selectedCall.endpoint}
                  </div>
                </div>
                <button
                  onClick={handleCopyPayload}
                  className="flex items-center gap-1 text-[11px] bg-[#2a2f3a] hover:bg-[#343b48] text-slate-200 px-2 py-1 rounded transition-colors ml-2 border border-slate-600 font-mono"
                >
                  {copied ? <Check className="w-3 h-3 text-[#aee37d]" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Request and Response Split Tabs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {/* Request Payload */}
                <div className="bg-[#20242c] rounded border border-slate-700/80 p-2 shadow-xs">
                  <div className="text-[10px] font-mono font-semibold text-slate-300 mb-1 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-[#98cc65]" />
                    CAMARA Request Body
                  </div>
                  <pre className="text-[11px] font-mono text-slate-100 bg-[#121417] p-2 rounded overflow-x-auto max-h-40 border border-slate-800">
                    {JSON.stringify(selectedCall.request, null, 2)}
                  </pre>
                </div>

                {/* Response Payload */}
                <div className="bg-[#20242c] rounded border border-slate-700/80 p-2 shadow-xs">
                  <div className="text-[10px] font-mono font-semibold text-[#aee37d] mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#98cc65]" />
                    CAMARA Response (200 OK)
                  </div>
                  <pre className="text-[11px] font-mono text-[#aee37d] bg-[#121417] p-2 rounded overflow-x-auto max-h-40 border border-slate-800">
                    {JSON.stringify(selectedCall.response, null, 2)}
                  </pre>
                </div>
              </div>

              {/* API Details Footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono bg-[#20242c] px-2 py-1 rounded border border-slate-700/80">
                <span>Latency: {selectedCall.execution_time_ms} ms</span>
                <span>Device: {selectedCall.device_id}</span>
                <span>Timestamp: {new Date(selectedCall.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Select an API call to inspect payloads
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
