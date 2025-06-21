import { contextBridge, ipcRenderer } from 'electron';
import { CalendarEvent } from './renderer/calendar';

contextBridge.exposeInMainWorld('api', {
    sendLogin: (username: string, password: string) => {
        console.log('[Preload] sendLogin called');
        ipcRenderer.send('login-request', { username, password });
    },
    onLoginFailure: (callback: (msg: string) => void) => {
        ipcRenderer.once('login-failure', (_, msg) => callback(msg));
    },
    onCalendarEvents: (callback: (evts: any[]) => void) => {
        console.log('[Preload] calendar-events listener registered');
        ipcRenderer.on('calendar-events', (_, evts) => callback(evts));
    },
});

console.log('[Preload] preload script loaded');