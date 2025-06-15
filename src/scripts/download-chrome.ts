import { install, Browser } from '@puppeteer/browsers';
import path from 'path';
import fs from 'fs';

const downloadPath = path.resolve(__dirname, '..', 'vendor', 'chrome');
fs.mkdirSync(downloadPath, { recursive: true });

(async () => {
  const browserPath = await install({
    browser: Browser.CHROME,
    buildId: 'stable', // 也可使用特定版本号如 '117.0.5938.92'
    cacheDir: downloadPath,
  });

  console.log('✅ Chrome downloaded to', browserPath.toString());
})();
