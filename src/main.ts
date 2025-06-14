import puppeteer from 'puppeteer';
async function doLogin(USERNAME: string, PASSWORD: string): Promise<boolean> {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-software-rasterizer',
        ]
    });
    const page = await browser.newPage();

    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
    );

    try {
        await page.goto('https://course.pku.edu.cn/webapps/bb-sso-BBLEARN/login.html', {
        waitUntil: 'networkidle2',
        timeout: 60000,
        });

        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });

        const url = page.url();
        if (!url.includes('iaaa.pku.edu.cn')) {
            throw new Error('未跳转到 IAAA 登录页，当前URL: ' + url);   
        }

        console.log('跳转到:', url);

        await page.type('#user_name', USERNAME);
        await page.type('#password', PASSWORD);
        await page.click('#logon_button');
        await page.waitForNavigation();


        const success = page.url().includes('webapps/portal');

        await browser.close();
        return success;
    } catch (err) {
        console.error('登录流程异常:', err);
        return false;
    }
}

import { app, BrowserWindow } from 'electron';
import path from 'path';
import { ipcMain } from 'electron';

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, // 使用 IPC 需要 preload
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // Webpack plugin 会替换这里的入口路径
    await mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // 打开 DevTools（开发时可用）
    mainWindow.webContents.openDevTools();
}

app.disableHardwareAcceleration();

let mainWindow: BrowserWindow;
app.whenReady().then(() => {
    app.whenReady().then(async () => {
        createWindow();
        ipcMain.on('login-request', async (event, { username, password }) => {
            console.log(`收到登录请求：${username} / ${password}`);
            try {
                const success = await doLogin(username, password);
                if (success) {
                event.reply('login-success');
                } else {
                event.reply('login-failure', '用户名或密码错误');
                }
            } catch (err) {
                event.reply('login-failure', '登录时出错');
            }
        });
    });
});