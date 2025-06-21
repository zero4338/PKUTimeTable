declare global {
    interface Window {
        api: {
            onCalendarEvents(arg0: (evts: any) => void): unknown;
            sendLogin: (username: string, password: string) => void;
            onLoginFailure: (callback: (msg: string) => void) => void;
          };
    }
}

// src/renderer/index.tsx
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Login } from './login';
import { CalendarView } from './calendar';
import type { CalendarEvent } from './calendar';
import { ipcRenderer } from 'electron';

const App: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[] | null>(null);

  useEffect(() => {
    console.log('Registering calendar-events listener...');
    window.api.onCalendarEvents((evts) => {
      setEvents(evts);
    });
  }, []);
  return (
    <div>
      {events ? <CalendarView events={events} /> : <Login />}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);