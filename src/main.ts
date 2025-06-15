import os from 'os';

function getChromePath(): string {
  const isDev = !app.isPackaged;
  const base = isDev
    ? path.resolve(__dirname, '..', 'vendor', 'chrome')
    : path.join(process.resourcesPath, 'chrome');

  switch (os.platform()) {
    case 'win32':
      return path.join(base, 'chrome-win', 'chrome.exe');
    case 'darwin':
      return path.join(base, 'chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium');
    case 'linux':
      return path.join(base, 'chrome-linux', 'chrome');
    default:
      throw new Error('Unsupported platform');
  }
}

import puppeteer from 'puppeteer';
async function getTimeTablePageContent(USERNAME: string, PASSWORD: string){
    const browser = await puppeteer.launch({
        executablePath: getChromePath(),
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

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36');

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
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
        if (!page.url().includes('webapps/portal')) {
            throw new Error('登录失败，当前URL: ' + page.url());
        }

        await page.goto('https://course.pku.edu.cn/webapps/calendar/viewPersonal', {waitUntil: 'networkidle2',});
        const content = await page.content();

        await browser.close();
        return content;
    } catch (err) {
        throw new Error('登录失败');
    }
}

interface CalendarEvent {
  date: string;     // e.g. Wednesday, June 04, 2025
  time: string;     // e.g. 12:00p
  title: string;    // e.g. 第十二次作业
}

function parseTimeTablePageContent(content: string): CalendarEvent[] {
    const eventRegex = /<div class="fc-event-inner.*?">[\s\S]*?<span class="hideoff">([^<]*)<\/span>\s*<span class="fc-event-time">([^<]*)<\/span>\s*<span class="fc-event-title">([^<]*)<\/span>/g;

    const events: CalendarEvent[] = [];

    let match: RegExpExecArray | null;
    while ((match = eventRegex.exec(content)) !== null) {
    const [_, date, time, title] = match;
        events.push({ date: date.trim(), time: time.trim(), title: title.trim() });
    }

    return events;
}

import { app, BrowserWindow } from 'electron';
import path from 'path';
import { ipcMain } from 'electron';
import { assert } from 'console';

async function createLoginWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    await mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    mainWindow.webContents.openDevTools();
}

console.log('[Main] main.ts started'); // 一开始就输出
app.disableHardwareAcceleration();
let mainWindow: BrowserWindow;
app.whenReady().then(async () => {
    await createLoginWindow();
    ipcMain.on('login-request', async (event, { username, password }) => {
        console.log(`收到登录请求：${username} / ${password}`);            
        try {
            const content = await getTimeTablePageContent(username, password);
            console.log('[Main] got content');
            const events = parseTimeTablePageContent(content);
            console.log('[Main] parsed events:', events);
            event.sender.send('calendar-events', events);
        } catch (err) {
            console.error('[Main] login failed:', err);
            event.reply('login-failure', '登录时出错');
        }
    });
    console.log('主进程已准备就绪');
});