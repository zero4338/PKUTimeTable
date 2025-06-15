declare global {
    interface Window {
        api: {
            onCalendarEvents(arg0: (evts: any) => void): unknown;
            sendLogin: (username: string, password: string) => void;
        };
    }
}

import React, { useState } from 'react';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        window.api.sendLogin(username, password);
    };


    return (
        <div>
            <h2>登录课程系统</h2>
            <input placeholder="用户名" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={handleLogin}>登录</button>
        </div>
    );
};