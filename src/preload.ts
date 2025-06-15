import { contextBridge, ipcRenderer } from 'electron';
import { CalendarEvent } from './renderer/calendar';

contextBridge.exposeInMainWorld('api', {
    sendLogin: (username: string, password: string) => {
        ipcRenderer.send('login-request', { username, password });
    },
    onCalendarEvents: (callback: (evts: any[]) => void) => {
        ipcRenderer.on('calendar-events', (_, evts) => callback(evts));
    },
});