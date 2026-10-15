import L from 'leaflet';
import { IssuePriority } from '../types';

export const createPriorityIcon = (priority: IssuePriority | string) => {
  let color = '#3B82F6';
  let pulse = false;

  switch (priority) {
    case 'Critical':
      color = '#EF4444';
      pulse = true;
      break;
    case 'High':
      color = '#F97316';
      break;
    case 'Medium':
      color = '#F59E0B';
      break;
    case 'Low':
      color = '#10B981';
      break;
  }

  const html = `
    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
      ${
        pulse
          ? `<div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background-color: ${color}; opacity: 0.4; animation: pinPulse 1.8s infinite ease-out;"></div>`
          : ''
      }
      <div style="
        width: 26px;
        height: 26px;
        background: ${color};
        border: 2.5px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-priority-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 28],
    popupAnchor: [0, -28],
  });
};

export const pickerIcon = L.divIcon({
  html: `
    <div style="
      width: 28px;
      height: 28px;
      background: #06B6D4;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 14px rgba(6, 182, 212, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="width: 8px; height: 8px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
    </div>
  `,
  className: 'custom-picker-marker',
  iconSize: [28, 28],
  iconAnchor: [14, 26],
});
