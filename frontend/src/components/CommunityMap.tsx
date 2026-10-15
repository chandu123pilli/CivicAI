import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { PublicMapIssue, IssuePriority } from '../types';
import { createPriorityIcon } from '../utils/mapIcons';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Filter, Layers, ExternalLink, MapPin } from 'lucide-react';

interface Props {
  issues: PublicMapIssue[];
  initialCenter?: [number, number];
  initialZoom?: number;
}

const CATEGORIES = [
  'All',
  'Roads and potholes',
  'Garbage and sanitation',
  'Water supply and leakage',
  'Streetlights and electricity',
  'Drainage and flooding',
  'Public safety',
  'Other',
];

const STATUSES = ['All', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'];

export const CommunityMap: React.FC<Props> = ({
  issues,
  initialCenter = [37.7749, -122.4194],
  initialZoom = 13,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showHotspots, setShowHotspots] = useState<boolean>(true);

  const filteredIssues = issues.filter((i) => {
    const matchCat = selectedCategory === 'All' || i.category === selectedCategory;
    const matchStat = selectedStatus === 'All' || i.status === selectedStatus;
    return matchCat && matchStat;
  });

  // Calculate approximate hotspot centers based on Critical/High clusters
  const criticalAndHigh = filteredIssues.filter(
    (i) => i.priority === 'Critical' || i.priority === 'High'
  );

  return (
    <div className="flex flex-col h-full w-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      {/* Map Control Toolbar */}
      <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Community Incident GIS Map
              <span className="text-[11px] font-normal text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-800/60">
                {filteredIssues.length} active incidents
              </span>
            </h3>
          </div>
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-slate-200 outline-none text-xs cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-slate-900 text-white">
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-slate-200 outline-none text-xs cursor-pointer"
            >
              {STATUSES.map((stat) => (
                <option key={stat} value={stat} className="bg-slate-900 text-white">
                  {stat === 'All' ? 'All Statuses' : stat}
                </option>
              ))}
            </select>
          </div>

          {/* Hotspots Toggle */}
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              showHotspots
                ? 'bg-rose-950 text-rose-300 border-rose-800/80'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Hotspots</span>
          </button>
        </div>
      </div>

      {/* Map Content */}
      <div className="relative flex-1 min-h-[500px]">
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Hotspot Circles */}
          {showHotspots &&
            criticalAndHigh.map((item) => (
              <Circle
                key={`hotspot-${item.id}`}
                center={[item.latitude, item.longitude]}
                radius={item.priority === 'Critical' ? 450 : 250}
                pathOptions={{
                  color: item.priority === 'Critical' ? '#EF4444' : '#F97316',
                  fillColor: item.priority === 'Critical' ? '#EF4444' : '#F97316',
                  fillOpacity: item.priority === 'Critical' ? 0.22 : 0.14,
                  weight: 1.5,
                  dashArray: '4, 4',
                }}
              />
            ))}

          {/* Issue Markers */}
          {filteredIssues.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={createPriorityIcon(issue.priority)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-2 space-y-2 max-w-xs">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">
                      {issue.tracking_id}
                    </span>
                    <PriorityBadge priority={issue.priority} size="sm" />
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {issue.title}
                  </h4>

                  <div className="text-[11px] text-slate-600 flex items-center justify-between">
                    <span>{issue.category}</span>
                    <StatusBadge status={issue.status} size="sm" />
                  </div>

                  {issue.address && (
                    <div className="text-[10px] text-slate-500 truncate">
                      📍 {issue.address}
                    </div>
                  )}

                  <div className="pt-1">
                    <Link
                      to={`/issues/${issue.id}`}
                      className="w-full flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] transition-colors"
                    >
                      <span>Track Report Details</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Priority Legend */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200/80 shadow-lg text-xs space-y-1.5 max-w-[200px]">
          <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
            Priority Indicators
          </span>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span>Critical Emergency</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span>High Disruption</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Low / Routine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
