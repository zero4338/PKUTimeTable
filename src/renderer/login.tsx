import React, { useState, useEffect } from 'react';
import './login.css';

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = () => {
        console.log('[Renderer] login clicked', username, password);
        setIsLoggingIn(true);
        setError(null);
        window.api?.sendLogin(username, password);
    };

    useEffect(() => {
        window.api?.onCalendarEvents(() => {
            setIsLoggingIn(false);
            setError(null);
        });

        window.api?.onLoginFailure((msg) => {
            setIsLoggingIn(false);
            setError(msg || '登录失败，请检查用户名和密码');
        });
    }, []);

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>PKU TimeTable 登录</h2>
                <input
                    type="text"
                    placeholder="学号 / 用户名"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoggingIn}
                />
                <input
                    type="password"
                    placeholder="密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoggingIn}
                />
                <button onClick={handleLogin} disabled={isLoggingIn}>
                    {isLoggingIn ? '正在登录...' : '登录'}
                </button>
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
}
