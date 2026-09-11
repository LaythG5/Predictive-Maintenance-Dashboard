import React, { useState } from 'react';
import { DeviceInfo, IndustrialSector, Prediction } from '../types';
import { Search, ArrowUpDown, Activity } from 'lucide-react';

interface DeviceTableProps {
  devices: DeviceInfo[];
  predictions: Map<string, Prediction>;
  selectedDeviceId: string | null;
  onSelectDevice: (id: string) => void;
  onInjectFailure: (id: string) => void;
}

export const DeviceTable: React.FC<DeviceTableProps> = ({
  devices,
  predictions,
  selectedDeviceId,
  onSelectDevice,
  onInjectFailure,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState<'all' | IndustrialSector>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'warning' | 'nominal'>('all');
  const [sortBy, setSortBy] = useState<'risk' | 'device' | 'hours'>('risk');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = devices.filter(d => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      d.name.toLowerCase().includes(query) ||
      d.device_id.toLowerCase().includes(query) ||
      d.facility.toLowerCase().includes(query) ||
      d.country.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (sectorFilter !== 'all' && d.sector !== sectorFilter) return false;

    const pred = predictions.get(d.device_id);
    const prob = pred?.failure_probability || 0;
    if (riskFilter === 'critical' && prob <= 0.75) return false;
    if (riskFilter === 'warning' && (prob <= 0.5 || prob > 0.75)) return false;
    if (riskFilter === 'nominal' && prob > 0.5) return false;

    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const predA = predictions.get(a.device_id);
    const predB = predictions.get(b.device_id);

    if (sortBy === 'risk') {
      const diff = (predB?.failure_probability || 0) - (predA?.failure_probability || 0);
      return sortAsc ? -diff : diff;
    }
    if (sortBy === 'hours') {
      const hA = predA?.predicted_failure_hours || 999;
      const hB = predB?.predicted_failure_hours || 999;
      return sortAsc ? hA - hB : hB - hA;
    }
    return sortAsc ? a.device_id.localeCompare(b.device_id) : b.device_id.localeCompare(a.device_id);
  });

  return (
    <div id="device-fleet-inventory" className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
      {/* Table Toolbar */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-orange-400" />
          <h3 className="font-semibold text-sm text-slate-100">
            Industrial Asset Fleet ({devices.length} Monitored Nodes)
          </h3>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search ID, facility, country..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 w-52"
            />
          </div>

          {/* Sector Filter */}
          <select
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Sectors</option>
            <option value="oil_gas">Oil &amp; Gas</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="logistics">Logistics &amp; Ports</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={e => setRiskFilter(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="critical">Critical (&gt;75%)</option>
            <option value="warning">Warning (50-75%)</option>
            <option value="nominal">Nominal (&lt;50%)</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-[11px] font-mono text-slate-600 uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Device &amp; Location</th>
              <th className="py-2.5 px-3">Type &amp; Sector</th>
              <th
                className="py-2.5 px-3 cursor-pointer hover:text-slate-900"
                onClick={() => {
                  setSortBy('risk');
                  setSortAsc(!sortAsc);
                }}
              >
                <div className="flex items-center gap-1">
                  <span>Degradation Risk</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3">Forecast Horizon</th>
              <th className="py-2.5 px-3">Telemetry (Batt / Temp / Vib)</th>
              <th className="py-2.5 px-3">CAMARA Tower</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {sorted.map(device => {
              const pred = predictions.get(device.device_id);
              const prob = pred?.failure_probability || 0;
              const isSelected = selectedDeviceId === device.device_id;
              const isCritical = prob > 0.75;
              const isWarning = prob > 0.5 && prob <= 0.75;

              return (
                <tr
                  key={device.device_id}
                  onClick={() => onSelectDevice(device.device_id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-orange-50/80 text-slate-900 border-l-4 border-orange-500 font-medium'
                      : isCritical
                      ? 'bg-orange-50/30 hover:bg-orange-50/60'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Device & Location */}
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      {device.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {device.device_id} | {device.facility}, {device.country}
                    </div>
                  </td>

                  {/* Type & Sector */}
                  <td className="py-2.5 px-3 font-mono text-[11px]">
                    <span className="capitalize text-slate-800">{device.type}</span>
                    <div className="text-slate-500 text-[10px] uppercase">
                      {device.sector.replace('_', ' ')}
                    </div>
                  </td>

                  {/* Degradation Risk */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`font-mono font-bold text-xs ${
                          isCritical
                            ? 'text-orange-600'
                            : isWarning
                            ? 'text-amber-600'
                            : 'text-slate-800'
                        }`}
                      >
                        {(prob * 100).toFixed(1)}%
                      </span>
                      {isCritical && (
                        <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-orange-100 border border-orange-300 text-orange-800 font-bold">
                          QoS
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Forecast Horizon */}
                  <td className="py-2.5 px-3 font-mono text-xs">
                    {prob > 0.5 ? (
                      <span className="text-orange-700 font-semibold">
                        ~{pred?.predicted_failure_hours}h lead time
                      </span>
                    ) : (
                      <span className="text-slate-500">Nominal (&gt;72h)</span>
                    )}
                  </td>

                  {/* Telemetry (Batt/Temp/Vib) */}
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700">
                    {pred ? (
                      <div className="space-x-1.5">
                        <span className={pred.metrics.battery < 25 ? 'text-orange-600 font-bold' : ''}>
                          {pred.metrics.battery}%
                        </span>
                        <span className="text-slate-400">/</span>
                        <span className={pred.metrics.temp > 62 ? 'text-orange-600 font-bold' : ''}>
                          {pred.metrics.temp}°C
                        </span>
                        <span className="text-slate-400">/</span>
                        <span className={pred.metrics.vibration > 5.5 ? 'text-orange-600 font-bold' : ''}>
                          {pred.metrics.vibration}mm/s
                        </span>
                      </div>
                    ) : (
                      '--'
                    )}
                  </td>

                  {/* CAMARA Tower */}
                  <td className="py-2.5 px-3 font-mono text-[11px]">
                    {pred ? (
                      <div>
                        <span className={pred.metrics.congestion > 80 ? 'text-orange-600 font-bold' : 'text-slate-800'}>
                          {pred.metrics.congestion}% load
                        </span>
                        <span className="text-slate-500 text-[10px] block">
                          Coverage: {pred.metrics.coverage}
                        </span>
                      </div>
                    ) : (
                      '--'
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectDevice(device.device_id)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded text-[10px] font-medium shadow-xs"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => onInjectFailure(device.device_id)}
                        className="px-2 py-1 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-300 rounded text-[10px] font-medium shadow-xs"
                        title="Simulate bearing failure"
                      >
                        Fail
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
