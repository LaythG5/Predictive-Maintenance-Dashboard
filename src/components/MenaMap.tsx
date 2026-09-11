import React, { useState } from 'react';
import { DeviceInfo, Prediction, IndustrialSector } from '../types';
import { Radio, Factory, Ship, Flame } from 'lucide-react';

interface MenaMapProps {
  devices: DeviceInfo[];
  predictions: Map<string, Prediction>;
  selectedDeviceId: string | null;
  onSelectDevice: (deviceId: string) => void;
  sectorFilter: 'all' | IndustrialSector;
  showCongestionOverlay: boolean;
}

export const MenaMap: React.FC<MenaMapProps> = ({
  devices,
  predictions,
  selectedDeviceId,
  onSelectDevice,
  sectorFilter,
  showCongestionOverlay,
}) => {
  const [hoveredDevice, setHoveredDevice] = useState<DeviceInfo | null>(null);

  // Map coordinate bounds:
  // Lat: 18° N to 34.5° N
  // Lon: 27.5° E to 60.5° E
  const MIN_LAT = 18.0;
  const MAX_LAT = 34.5;
  const MIN_LON = 27.5;
  const MAX_LON = 60.5;

  // Convert GPS (lat, lon) to SVG viewBox percentages (0 to 1000 x 0 to 620)
  const project = (lat: number, lon: number) => {
    const x = ((lon - MIN_LON) / (MAX_LON - MIN_LON)) * 960 + 20;
    const y = ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * 580 + 20;
    return { x, y };
  };

  const filteredDevices = devices.filter(d => {
    if (sectorFilter !== 'all' && d.sector !== sectorFilter) return false;
    return true;
  });

  const getSectorIcon = (sector: IndustrialSector) => {
    switch (sector) {
      case 'oil_gas':
        return <Flame className="w-3.5 h-3.5 text-orange-600" />;
      case 'manufacturing':
        return <Factory className="w-3.5 h-3.5 text-slate-700" />;
      case 'logistics':
        return <Ship className="w-3.5 h-3.5 text-blue-700" />;
    }
  };

  return (
    <div id="mena-interactive-map" className="relative w-full h-[500px] bg-[#20242c] rounded-xl border border-slate-700/80 overflow-hidden shadow-xs flex flex-col">
      {/* Map Header & Legend */}
      <div className="bg-gradient-to-r from-[#608738] via-[#7aa948] to-[#98cc65] px-4 py-2.5 border-b border-[#527430] flex flex-wrap items-center justify-between gap-2 text-xs text-white">
        <div className="flex items-center gap-2 font-mono text-white">
          <Radio className="w-3.5 h-3.5 text-white" />
          <span className="font-bold text-white">
            Regional Telemetry Map: MENA Industrial Nodes
          </span>
          <span className="text-white/60">|</span>
          <span className="text-white/90 text-[11px]">Lat 18°-34°N, Lon 28°-60°E</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-white font-mono font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span>Nominal (&lt;50%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300"></span>
            <span>Warning (50-75%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs"></span>
            <span className="text-white font-bold">Critical (&gt;75% QoS Active)</span>
          </span>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="relative flex-1 w-full h-full">
        <svg
          viewBox="0 0 1000 620"
          className="w-full h-full object-cover select-none"
          style={{ background: '#181a1f' }}
        >
          {/* Geographic Grid Lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2b313c" strokeWidth="0.5" strokeOpacity="0.8" />
            </pattern>
            {/* Radial gradients for cellular tower congestion */}
            <radialGradient id="highCongestion" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#98cc65" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#98cc65" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#98cc65" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="moderateCongestion" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="1000" height="620" fill="url(#grid)" />

          {/* Regional Water Bodies & Coastline Paths */}
          {/* Mediterranean Coast (Egypt/Levant) */}
          <path
            d="M 40,90 Q 140,95 210,120 T 320,110 T 380,60"
            fill="none"
            stroke="#475569"
            strokeWidth="1.8"
            strokeDasharray="4 2"
            strokeOpacity="0.7"
          />
          <text x="140" y="75" fill="#94a3b8" fontSize="10" opacity="0.9" fontFamily="monospace" fontWeight="600">
            MEDITERRANEAN SEA
          </text>

          {/* Nile River & Delta */}
          <path
            d="M 180,120 Q 195,170 190,260 T 175,400 T 160,550"
            fill="none"
            stroke="#475569"
            strokeWidth="1.6"
            strokeOpacity="0.6"
          />
          <text x="100" y="240" fill="#94a3b8" fontSize="10" opacity="0.8" fontFamily="monospace" fontWeight="600">
            EGYPT
          </text>

          {/* Suez Canal & Red Sea */}
          <path
            d="M 230,120 L 235,165 Q 260,250 320,380 T 430,580"
            fill="none"
            stroke="#475569"
            strokeWidth="2.2"
            strokeOpacity="0.75"
          />
          <text x="270" y="320" fill="#94a3b8" fontSize="11" opacity="0.8" fontFamily="monospace" fontWeight="600" transform="rotate(45, 270, 320)">
            RED SEA
          </text>
          <text x="210" y="145" fill="#aee37d" fontSize="9" opacity="0.95" fontFamily="monospace" fontWeight="600">
            Suez Canal
          </text>

          {/* Arabian Peninsula & Persian/Arabian Gulf */}
          <path
            d="M 620,130 Q 690,190 730,260 T 820,310 T 880,340"
            fill="none"
            stroke="#475569"
            strokeWidth="2.2"
            strokeOpacity="0.75"
          />
          <text x="690" y="210" fill="#94a3b8" fontSize="11" opacity="0.8" fontFamily="monospace" fontWeight="600" transform="rotate(25, 690, 210)">
            ARABIAN GULF
          </text>
          <text x="490" y="310" fill="#94a3b8" fontSize="12" opacity="0.8" fontFamily="monospace" letterSpacing="3" fontWeight="600">
            SAUDI ARABIA
          </text>
          <text x="760" y="295" fill="#94a3b8" fontSize="10" opacity="0.8" fontFamily="monospace" fontWeight="600">
            UAE
          </text>
          <text x="310" y="105" fill="#94a3b8" fontSize="10" opacity="0.8" fontFamily="monospace" fontWeight="600">
            JORDAN
          </text>
          <text x="890" y="360" fill="#94a3b8" fontSize="10" opacity="0.8" fontFamily="monospace" fontWeight="600">
            OMAN
          </text>

          {/* Strategic Hub Anchors */}
          {[
            { label: 'Port Said / Suez', lat: 31.26, lon: 32.30 },
            { label: 'Ghawar Field Basin', lat: 25.42, lon: 49.62 },
            { label: 'Ras Tanura Terminal', lat: 26.65, lon: 50.15 },
            { label: 'Jebel Ali Port Hub', lat: 25.01, lon: 55.06 },
            { label: 'Yanbu Petrochem', lat: 24.09, lon: 38.06 },
            { label: 'Amman / Sahab Zone', lat: 31.87, lon: 35.96 },
          ].map((hub, i) => {
            const pt = project(hub.lat, hub.lon);
            return (
              <g key={i} className="pointer-events-none opacity-75">
                <circle cx={pt.x} cy={pt.y} r="5" fill="none" stroke="#98cc65" strokeWidth="1.2" strokeDasharray="2 2" />
                <text x={pt.x + 8} y={pt.y + 3} fill="#e2e8f0" fontSize="9" fontFamily="monospace" fontWeight="600">
                  {hub.label}
                </text>
              </g>
            );
          })}

          {/* CAMARA Tower Congestion Heat Overlays in Pistachio / Amber */}
          {showCongestionOverlay &&
            filteredDevices.map(device => {
              const pred = predictions.get(device.device_id);
              const towerLoad = pred?.metrics.congestion || 40;
              if (towerLoad < 65) return null;
              const pt = project(device.location_lat, device.location_lon);
              const isOverload = towerLoad > 80;
              return (
                <circle
                  key={`congestion-${device.device_id}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={isOverload ? 38 : 24}
                  fill={isOverload ? 'url(#highCongestion)' : 'url(#moderateCongestion)'}
                  className="transition-all duration-500 pointer-events-none"
                />
              );
            })}

          {/* Active Devices Pins */}
          {filteredDevices.map(device => {
            const pred = predictions.get(device.device_id);
            const pt = project(device.location_lat, device.location_lon);
            const isSelected = selectedDeviceId === device.device_id;
            const prob = pred?.failure_probability || 0;
            const isCritical = prob > 0.75;
            const isWarning = prob > 0.5 && prob <= 0.75;

            // Colors: Critical = vibrant pistachio, Warning = amber, Nominal = slate
            let fillColor = '#64748b'; // slate for nominal
            let strokeColor = '#94a3b8';

            if (isCritical) {
              fillColor = '#98cc65'; // pistachio green
              strokeColor = '#ffffff';
            } else if (isWarning) {
              fillColor = '#f59e0b'; // amber
              strokeColor = '#fde68a';
            }

            return (
              <g
                key={device.device_id}
                className="cursor-pointer transition-transform duration-150"
                onClick={() => onSelectDevice(device.device_id)}
                onMouseEnter={() => setHoveredDevice(device)}
                onMouseLeave={() => setHoveredDevice(null)}
                id={`map-pin-${device.device_id}`}
              >
                {/* Critical Pulse Ring */}
                {isCritical && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="15"
                    fill="none"
                    stroke="#98cc65"
                    strokeWidth="2"
                    className="animate-ping opacity-70 origin-center"
                  />
                )}

                {/* Selection Ring */}
                {isSelected && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="13"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeDasharray="3 3"
                    className="animate-spin origin-center"
                  />
                )}

                {/* Pin Shape */}
                {isCritical ? (
                  // Pistachio diamond shape for critical equipment
                  <polygon
                    points={`${pt.x},${pt.y - 7} ${pt.x + 7},${pt.y} ${pt.x},${pt.y + 7} ${pt.x - 7},${pt.y}`}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="1.8"
                  />
                ) : (
                  // Circle for normal/warning
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 6 : (isWarning ? 5.5 : 4.5)}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="1.5"
                  />
                )}

                {/* Tag for Critical Items */}
                {isCritical && (
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    fill="#aee37d"
                    fontSize="9"
                    fontWeight="bold"
                    className="select-none font-mono"
                  >
                    QoS Active
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredDevice && (
          <div
            className="absolute z-20 pointer-events-none bg-[#20242c] p-3 rounded-lg border border-slate-600 shadow-xl text-xs w-64 text-white"
            style={{
              left: Math.min(
                window.innerWidth > 768 ? 400 : 200,
                Math.max(10, project(hoveredDevice.location_lat, hoveredDevice.location_lon).x / 2)
              ),
              top: Math.max(
                40,
                project(hoveredDevice.location_lat, hoveredDevice.location_lon).y / 2 - 20
              ),
            }}
          >
            <div className="flex items-center justify-between font-bold text-white mb-1">
              <span className="truncate">{hoveredDevice.name}</span>
              <span className="font-mono text-[10px] text-[#12160e] bg-[#98cc65] border border-[#86bb54] px-1.5 py-0.5 rounded font-bold">
                {hoveredDevice.device_id}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mb-2 flex items-center gap-1">
              {getSectorIcon(hoveredDevice.sector)}
              <span>{hoveredDevice.facility}, {hoveredDevice.country}</span>
            </p>

            {(() => {
              const pred = predictions.get(hoveredDevice.device_id);
              if (!pred) return null;
              const prob = pred.failure_probability;
              return (
                <div className="space-y-1.5 pt-1.5 border-t border-slate-700 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium">Degradation Probability:</span>
                    <span
                      className={`font-mono font-bold ${
                        prob > 0.75
                          ? 'text-[#aee37d]'
                          : prob > 0.5
                          ? 'text-amber-400'
                          : 'text-slate-200'
                      }`}
                    >
                      {(prob * 100).toFixed(1)}%
                    </span>
                  </div>
                  {prob > 0.5 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 font-medium">Forecast horizon:</span>
                      <span className="font-mono text-[#aee37d] font-semibold">
                        ~{pred.predicted_failure_hours}h lead time
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Cell Tower Load:</span>
                    <span className="font-mono font-medium text-white">{pred.metrics.congestion}% ({pred.metrics.coverage})</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Map Footer Bar */}
      <div className="bg-[#1a1d23] border-t border-slate-700/80 px-3 py-1.5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-white">
            <span className="w-2 h-2 rounded-full bg-[#98cc65]"></span>
            MENA Coverage: Lat 18°-34°N, Lon 28°-60°E
          </span>
          <span className="hidden sm:inline text-slate-400">Active Nodes: {filteredDevices.length} / {devices.length}</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          Nokia Network-as-Code Orchestration Layer
        </div>
      </div>
    </div>
  );
};
