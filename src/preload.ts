import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    sendLogin: (username: string, password: string) => {
        ipcRenderer.send('login-request', { username, password });
    },
});