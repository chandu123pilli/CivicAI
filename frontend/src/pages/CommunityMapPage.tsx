import React, { useState, useEffect } from 'react';
import { issueService } from '../services/issueService';
import { PublicMapIssue } from '../types';
import { CommunityMap } from '../components/CommunityMap';
import { useNotifications } from '../context/NotificationContext';
import { MapPin, Sparkles } from 'lucide-react';

export const CommunityMapPage: React.FC = () => {
  const [issues, setIssues] = useState<PublicMapIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotifications();

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const data = await issueService.getPublicMapIssues();
        setIssues(data);
      } catch (err) {
        showToast('Failed to load map data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchMapData();
  }, []);

  return (
    <div className="space-y-4 h-[calc(100vh-7.5rem)] flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
            <span>Citywide GIS Incident Map</span>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
              Live Feed
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time public incident markers, urgency heat corridors, and resolution tracking.
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-[500px]">
        {loading ? (
          <div className="h-full w-full bg-slate-100 rounded-2xl flex items-center justify-center text-xs text-slate-400 animate-pulse">
            Loading civic GIS map layer...
          </div>
        ) : (
          <CommunityMap issues={issues} />
        )}
      </div>
    </div>
  );
};
