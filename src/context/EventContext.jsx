import React, { createContext, useState, useContext } from 'react';

const EventContext = createContext();

export function useEventContext() {
  return useContext(EventContext);
}

export function EventProvider({ children }) {
  // Dynamic Event Info
  const [eventInfo, setEventInfo] = useState({
    name: 'Global Tech Expo Live',
    logo: null,
    description: 'Official Attendee Guide',
    password: '',
    isConfigured: false
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [schedule, setSchedule] = useState([
    { id: 1, time: '09:00 AM', title: 'Opening Keynote', location: 'Keynote Stage' },
    { id: 2, time: '11:30 AM', title: 'Networking Pitch', location: 'Networking Lounge' },
    { id: 3, time: '01:00 PM', title: 'Tech Showcase', location: 'Exhibit Hall A' },
  ]);

  // Updated spatial data model combining Fire Code limits and spatial coordinates for heatmaps
  const [zones, setZones] = useState([
    { 
      id: 'Entrance Foyer', 
      status: 'high', 
      currentOccupancy: 845, 
      fireCodeLimit: 1000, 
      throughput: '120 scans/min',
      geometry: { top: '80%', left: '40%', width: '20%', height: '20%' }, // Relative bounds
      heatmapCenter: { top: '90%', left: '50%' } // Concentrated at doors
    },
    { 
      id: 'Exhibit Hall A', 
      status: 'normal', 
      currentOccupancy: 3200, 
      fireCodeLimit: 5000, 
      throughput: '45 scans/min',
      geometry: { top: '30%', left: '5%', width: '50%', height: '50%' },
      heatmapCenter: { top: '40%', left: '20%' } // Heavy booth clusters
    },
    { 
      id: 'Keynote Stage', 
      status: 'high', 
      currentOccupancy: 4950, 
      fireCodeLimit: 5000, 
      throughput: '150 scans/min',
      geometry: { top: '5%', left: '5%', width: '90%', height: '25%' },
      heatmapCenter: { top: '15%', left: '50%' } // Crowd at front stage
    },
    { 
      id: 'Networking Lounge', 
      status: 'low', 
      currentOccupancy: 150, 
      fireCodeLimit: 800, 
      throughput: '10 scans/min',
      geometry: { top: '30%', left: '60%', width: '35%', height: '50%' },
      heatmapCenter: { top: '55%', left: '75%' }
    },
  ]);

  const addScheduleItem = (item) => {
    setSchedule([...schedule, { ...item, id: Date.now() }]);
  };

  const removeScheduleItem = (id) => {
    setSchedule(schedule.filter(item => item.id !== id));
  };

  return (
    <EventContext.Provider value={{ eventInfo, setEventInfo, isAuthenticated, setIsAuthenticated, schedule, addScheduleItem, removeScheduleItem, zones, setZones }}>
      {children}
    </EventContext.Provider>
  );
}
