import puppeteer from 'puppeteer';
async function simulateLogin(USERNAME: string, PASSWORD: string) {
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

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
            page.click('#logon_button'),
        ]);

        const finalUrl = page.url();
        if (!finalUrl.includes('course.pku.edu.cn')) {
        throw new Error('登录失败，未跳转回课程网：' + finalUrl);
        }

        console.log('登录成功，当前页面：', finalUrl);

        const cookies = await page.cookies();
        const html = await page.content();

        console.log('抓取成功，HTML长度:', html.length);

    } catch (err) {
        console.error('登录流程异常:', err);
    }
}



import { app, BrowserWindow } from 'electron';
import path from 'path';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    win.loadFile(path.join(__dirname, 'index.html'));
};

app.disableHardwareAcceleration();

let mainWindow: BrowserWindow;
app.whenReady().then(() => {
    app.whenReady().then(() => {
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            },
        });

        mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    });
});